import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Briefcase,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  User,
  Users,
  Search,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Bookmark,
} from "lucide-react";
import api from "../services/api";
import "../styles/StudentDashboard.css";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [user] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async (studentId) => {
    setError("");

    try {
      const [studentRes, dashboardRes, applicationsRes, eventsRes] =
        await Promise.all([
          api.get(`/students/${studentId}`),
          api.get(`/dashboard/student/${studentId}`),
          api.get(`/jobs/student/${studentId}/applications`),
          api.get(`/events/recommended/${studentId}`),
        ]);

      setStudent(studentRes.data);
      setDashboard(dashboardRes.data);
      setApplications(applicationsRes.data || []);
      setRecommendedEvents(eventsRes.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load student dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "STUDENT") {
      navigate("/login");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboardData(user.profileId);
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const getStatusClass = (status = "") => {
    const normalizedStatus = status.toLowerCase().replaceAll("_", " ");

    if (normalizedStatus.includes("shortlist")) return "shortlisted";
    if (normalizedStatus.includes("review")) return "review";
    return "applied";
  };

  const cancelApplication = async (applicationId) => {
    try {
      await api.put(`/jobs/applications/${applicationId}/cancel`);
      await loadDashboardData(user.profileId);
    } catch (err) {
      console.log(err);
      alert("Cancel failed");
    }
  };

  const registerEvent = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/register/${user.profileId}`);
      await loadDashboardData(user.profileId);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const analytics = [
    {
      title: "Mentorship Requests",
      value: dashboard?.mentorshipRequestCount ?? 0,
      subtitle: "Pending",
      icon: Users,
    },
    {
      title: "Applied Jobs",
      value: applications.length,
      subtitle: "Applications",
      icon: Briefcase,
    },
    {
      title: "Registered Events",
      value: dashboard?.registeredEventsCount ?? 0,
      subtitle: "Upcoming",
      icon: CalendarDays,
    },
    {
      title: "Forum Questions",
      value: dashboard?.postedQuestionsCount ?? 0,
      subtitle: "Asked",
      icon: MessageSquare,
    },
  ];

  const visibleApplications = applications.slice(0, 3);
  const visibleEvents = recommendedEvents.slice(0, 3);
  const studentName = student?.name || user?.name || "Student";
  const initials = getInitials(studentName) || "S";
  const mentorStatus =
    dashboard?.acceptedMentorStatus ||
    dashboard?.latestMentorshipStatus ||
    dashboard?.mentorshipStatus ||
    "NONE";

  if (loading) {
    return <div className="student-dashboard">Loading dashboard...</div>;
  }

  return (
    <div className="student-dashboard">
      <aside className="sd-sidebar">
        <div className="sd-logo">
          <BookOpen size={34} />
        </div>

        <nav className="sd-menu">
          <a className="active">
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a onClick={() => navigate("/student/profile")}>
            <User size={20} />
            Profile
          </a>
          <a>
            <Users size={20} />
            Mentorship
          </a>
          <a onClick={() => navigate("/student/jobs")}>
            <Briefcase size={20} />
            Jobs / Internships
          </a>
          <a onClick={() => navigate("/student/events")}>
            <CalendarDays size={20} />
            Events
          </a>
          <a onClick={() => navigate("/forum")}>
            <MessageSquare size={20} />
            Forum
          </a>
          <a onClick={() => navigate("/notifications")}>
            <Bell size={20} />
            Notifications
          </a>
          <a onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </a>
        </nav>
      </aside>

      <main className="sd-main">
        <header className="sd-topbar">
          <div className="sd-search">
            <Search size={20} />
            <input placeholder="Search for jobs, events, mentors..." />
          </div>

          <div className="sd-top-actions">
            <button
              className="sd-icon-btn"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={21} />
              <span>{dashboard?.unreadNotificationsCount ?? 0}</span>
            </button>

            <div className="sd-profile">
              <div className="sd-avatar">{initials}</div>
              <div>
                <h4>{studentName}</h4>
                <p>Student</p>
              </div>
              <ChevronDown size={18} />
            </div>

            <button className="sd-logout" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        {error && <section className="sd-section-card">{error}</section>}

        <section className="sd-hero-row">
          <div className="sd-welcome-card">
            <div>
              <p className="sd-small-title">Welcome back,</p>
              <h1>{studentName}</h1>
              <p className="sd-hero-text">
                Continue your learning journey, explore opportunities, connect
                with alumni, and grow professionally.
              </p>

              <div className="sd-hero-actions">
                <button onClick={() => navigate("/student/jobs")}>
                  Browse Jobs
                </button>
                <button className="outline">Find Mentor</button>
                <button
                  className="outline"
                  onClick={() => navigate("/student/events")}
                >
                  Explore Events
                </button>
              </div>
            </div>

            <div className="sd-hero-illustration">
              <BookOpen size={130} strokeWidth={1.4} />
            </div>
          </div>

          <div className="sd-mentor-card">
            <div className="sd-card-head">
              <h3>Mentorship Status</h3>
              <Bookmark size={20} />
            </div>

            <div className="sd-mentor-body">
              <div className="sd-mentor-img">
                {getInitials(dashboard?.mentorName) || "M"}
              </div>

              <div>
                <h4>{dashboard?.mentorName || "No mentor assigned"}</h4>
                <p>{dashboard?.mentorDesignation || "Mentorship request"}</p>
                <p>{dashboard?.mentorCompany || "Connect with alumni mentors"}</p>
              </div>
            </div>

            <div className="sd-mentor-status">
              <p>Status</p>
              <span className="pending">{mentorStatus}</span>
            </div>

            <div className="sd-requested">
              <p>Requests</p>
              <strong>{dashboard?.mentorshipRequestCount ?? 0}</strong>
            </div>

            <button className="sd-link-btn">
              View Details
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <section className="sd-analytics-grid">
          {analytics.map((item) => {
            const Icon = item.icon;
            return (
              <div className="sd-stat-card" key={item.title}>
                <div className="sd-stat-icon">
                  <Icon size={25} />
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <h2>{item.value}</h2>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="sd-section-card">
          <div className="sd-section-head">
            <h2>Applied Jobs / Internships</h2>
            <button onClick={() => navigate("/student/jobs")}>View all</button>
          </div>

          <div className="sd-table">
            <div className="sd-table-head">
              <span>Company</span>
              <span>Job Title</span>
              <span>Applied On</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {visibleApplications.length === 0 ? (
              <div className="sd-table-row">
                <span>No applications yet.</span>
              </div>
            ) : (
              visibleApplications.map((app) => {
                const status = app.status || "APPLIED";
                const company = app.company || "Company";

                return (
                  <div className="sd-table-row" key={app.applicationId}>
                    <div className="company-cell">
                      <div className="company-logo">
                        {getInitials(company) || "CO"}
                      </div>
                      <span>{company}</span>
                    </div>

                    <span>{app.jobTitle || app.title || "Job / Internship"}</span>
                    <span>
                      {formatDate(
                        app.appliedOn || app.appliedDate || app.createdAt
                      )}
                    </span>

                    <span className={`status-pill ${getStatusClass(status)}`}>
                      {status}
                    </span>

                    {status !== "CANCELLED" ? (
                      <button
                        className="cancel-btn"
                        onClick={() => cancelApplication(app.applicationId)}
                      >
                        Cancel Application
                      </button>
                    ) : (
                      <span className="dash-symbol">-</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="sd-section-card">
          <div className="sd-section-head">
            <h2>Recommended Events</h2>
            <button onClick={() => navigate("/student/events")}>View all</button>
          </div>

          <div className="sd-events-grid">
            {visibleEvents.length === 0 ? (
              <div className="sd-event-card">
                <div className="event-image">
                  <CalendarDays size={42} />
                </div>
                <div className="event-info">
                  <h3>No recommended events</h3>
                  <p>Check back later for matched events.</p>
                </div>
              </div>
            ) : (
              visibleEvents.map((event) => {
                const eventId = event.eventId || event.id;
                const isFull = event.status === "FULL" || !event.canApply;

                return (
                  <div
                    className={`sd-event-card ${isFull ? "full" : ""}`}
                    key={eventId}
                  >
                    <div className="event-image">
                      <CalendarDays size={42} />
                    </div>

                    <div className="event-info">
                      <h3>{event.title}</h3>
                      <p>{formatDate(event.eventDate || event.date)}</p>
                      <p>{event.eventTime || event.mode || event.reason}</p>
                    </div>

                    <div className="event-action">
                      <span>
                        Skill Match
                        <strong>{event.matchScore ?? 0}%</strong>
                      </span>

                      {isFull ? (
                        <button className="full-btn" disabled>
                          Full
                        </button>
                      ) : (
                        <button
                          className="register-btn"
                          onClick={() => registerEvent(eventId)}
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
