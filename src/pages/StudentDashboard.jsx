import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  Monitor,
  Star,
  User,
  Users,
} from "lucide-react";
import api from "../services/api";
import LoadingState from "../components/LoadingState";
import "../styles/StudentDashboard.css";
import "../styles/StudentJobs.css";
import "../styles/StudentEvents.css";
import { getProfileImageUrl } from "../utils/profileImage";
import useUnreadNotifications from "../hooks/useUnreadNotifications";

function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const unreadCount = useUnreadNotifications(user);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "STUDENT") {
      navigate("/login");
      return;
    }

    setUser(user);
    loadDashboard(user.profileId);
  }, [navigate]);

  const loadDashboard = async (studentId) => {
    try {
      const studentResponse = await api.get(
        `/students/${studentId}`
      );

      const dashboardResponse = await api.get(
        `/dashboard/student/${studentId}`
      );

      const applicationResponse = await api.get(
        `/jobs/student/${studentId}/applications`
      );

      const eventResponse = await api.get(
        `/events/recommended/${studentId}`
      );

      let recommendedJobData = [];

      try {
        const recommendedJobResponse = await api.get(
          `/jobs/recommended/${studentId}`
        );

        recommendedJobData = recommendedJobResponse.data || [];
      } catch (recommendedJobError) {
        console.log(recommendedJobError);
      }

      setStudent(studentResponse.data);
      setDashboard(dashboardResponse.data);
      setApplications(applicationResponse.data);
      setRecommendedJobs(recommendedJobData);
      setEvents(eventResponse.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load dashboard");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const cancelApplication = async (applicationId) => {
    try {
      await api.put(
        `/jobs/applications/${applicationId}/cancel`
      );

      alert("Application cancelled");

      const user = JSON.parse(localStorage.getItem("user"));
      loadDashboard(user.profileId);
    } catch (error) {
      console.log(error);
      alert("Failed to cancel application");
    }
  };

  const applyJob = async (jobId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await api.post(`/jobs/${jobId}/apply/${user.profileId}`);

      alert("Applied successfully");
      loadDashboard(user.profileId);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Application failed");
    }
  };

  const registerEvent = async (eventId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await api.post(
        `/events/${eventId}/register/${user.profileId}`
      );

      alert("Event registered successfully");

      loadDashboard(user.profileId);
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Event registration failed"
      );
    }
  };

  if (loading) {
    return (
      <LoadingState
        title="Loading dashboard"
        subtitle="Collecting your profile, applications and recommendations."
      />
    );
  }

  if (!student || !dashboard) {
    return (
      <div className="student-dashboard">
        Dashboard data is not available.
      </div>
    );
  }

  const firstLetter = student.name
    ? student.name.charAt(0).toUpperCase()
    : "S";
  const profileImageUrl = getProfileImageUrl(student);

  let mentorStatus = "NONE";

  if (dashboard.hasAcceptedMentor) {
    mentorStatus = "ACCEPTED";
  } else if (dashboard.totalMentorshipRequests > 0) {
    mentorStatus = "PENDING";
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

          <a onClick={() => navigate("/student/mentorships")}>
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
          <h2>Student Dashboard</h2>

          <div className="sd-top-actions">
            <button
              className="sd-icon-btn"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={21} />
              {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>

            <div className="sd-profile">
              <div className="sd-avatar">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={student.name} />
                ) : (
                  firstLetter
                )}
              </div>

              <div>
                <h4>{student.name}</h4>
                <p>Student</p>
              </div>
            </div>

            <button
              className="sd-logout"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="sd-hero-row">
          <div className="sd-welcome-card">
            <div>
              <p className="sd-small-title">
                Welcome back,
              </p>

              <h1>{student.name}</h1>

              <p className="sd-hero-text">
                Department: {student.department}
              </p>

              <p className="sd-hero-text">
                Year: {student.year}
              </p>

              <p className="sd-hero-text">
                Skills: {student.skills || "Not added"}
              </p>

              <div className="sd-hero-actions">
                <button
                  onClick={() => navigate("/student/jobs")}
                >
                  Browse Jobs
                </button>

                <button
                  className="outline"
                  onClick={() =>
                    navigate("/student/mentorships")
                  }
                >
                  Find Mentor
                </button>

                <button
                  className="outline"
                  onClick={() =>
                    navigate("/student/events")
                  }
                >
                  Explore Events
                </button>
              </div>
            </div>

            <div className="sd-hero-illustration">
              <BookOpen size={130} />
            </div>
          </div>

          <div className="sd-mentor-card">
            <h3>Mentorship Status</h3>

            <div className="sd-mentor-body">
              <div className="sd-mentor-img">
                <Users size={25} />
              </div>

              <div>
                <h4>{mentorStatus}</h4>

                <p>
                  {dashboard.hasAcceptedMentor
                    ? "A mentor has accepted your request."
                    : "Visit mentorship to find an alumni mentor."}
                </p>
              </div>
            </div>

            <div className="sd-requested">
              <p>Total Requests</p>
              <strong>
                {dashboard.totalMentorshipRequests}
              </strong>
            </div>

            <button
              className="sd-link-btn"
              onClick={() =>
                navigate("/student/mentorships")
              }
            >
              View Mentorship
            </button>
          </div>
        </section>

        <section className="sd-analytics-grid">
          <div className="sd-stat-card">
            <Users size={25} />

            <div>
              <h3>Mentorship Requests</h3>
              <h2>{dashboard.totalMentorshipRequests}</h2>
            </div>
          </div>

          <div className="sd-stat-card">
            <Briefcase size={25} />

            <div>
              <h3>Applied Jobs</h3>
              <h2>{applications.length}</h2>
            </div>
          </div>

          <div className="sd-stat-card">
            <CalendarDays size={25} />

            <div>
              <h3>Registered Events</h3>
              <h2>{dashboard.registeredEventsCount}</h2>
            </div>
          </div>

          <div className="sd-stat-card">
            <MessageSquare size={25} />

            <div>
              <h3>Forum Questions</h3>
              <h2>{dashboard.postedQuestionsCount}</h2>
            </div>
          </div>
        </section>

        <section className="sd-section-card">
          <div className="sd-section-head">
            <h2>Applied Jobs</h2>

            <button
              onClick={() => navigate("/student/jobs")}
            >
              View All
            </button>
          </div>

          {applications.length === 0 ? (
            <p>No job applications found.</p>
          ) : (
            applications.slice(0, 3).map((application) => (
              <div
                className="sd-table-row"
                key={application.applicationId}
              >
                <div className="company-cell">
                  <div className="company-logo">
                    {application.company
                      ?.charAt(0)
                      .toUpperCase() || "J"}
                  </div>

                  <div>
                    <strong>{application.company}</strong>
                    <p>{application.jobTitle}</p>
                  </div>
                </div>

                <span
                  className={`status-pill ${application.status
                    ?.toLowerCase()
                    .replace("_", "-")}`}
                >
                  {application.status}
                </span>

                {application.status !== "CANCELLED" && (
                  <button
                    className="cancel-btn"
                    onClick={() =>
                      cancelApplication(
                        application.applicationId
                      )
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))
          )}
        </section>

        <section className="sd-section-card">
          <div className="sd-section-head">
            <h2>Recommended Jobs</h2>

            <button
              onClick={() => navigate("/student/jobs")}
            >
              View All
            </button>
          </div>

          {recommendedJobs.length === 0 ? (
            <p>No recommended jobs found.</p>
          ) : (
            <div className="sj-jobs-grid sd-recommended-jobs-grid">
              {recommendedJobs.slice(0, 3).map((job) => (
                <DashboardJobCard
                  key={job.id || job.jobId}
                  job={job}
                  onApply={applyJob}
                />
              ))}
            </div>
          )}
        </section>

        <section className="sd-section-card">
          <div className="sd-section-head">
            <h2>Recommended Events</h2>

            <button
              onClick={() => navigate("/student/events")}
            >
              View All
            </button>
          </div>

          {events.length === 0 ? (
            <p>No recommended events found.</p>
          ) : (
            <div className="events-grid sd-recommended-events-grid">
              {events.slice(0, 3).map((event) => (
                <DashboardEventCard
                  key={event.eventId}
                  event={event}
                  onRegister={registerEvent}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function DashboardJobCard({ job, onApply }) {
  const jobId = job.id || job.jobId;

  return (
    <div className="sj-job-card">
      <div className="sj-job-icon">
        <Building2 size={42} />
      </div>

      <div className="sj-job-body">
        <h3>{job.title || job.jobTitle}</h3>
        <p className="sj-company">{job.company}</p>

        <p className="sj-desc">
          {job.description || job.reason || "No description provided."}
        </p>

        <div className="sj-job-meta">
          <span>
            <MapPin size={15} />
            {job.location || "Location not provided"}
          </span>

          <span>
            <Briefcase size={15} />
            {job.jobType || "Job"}
          </span>
        </div>

        <div className="sj-skills">
          {job.skillsRequired || job.requiredSkills || "Skills not provided"}
        </div>

        {job.canApply === false ? (
          <button disabled>{job.status || "Applied"}</button>
        ) : (
          <button onClick={() => onApply(jobId)}>Apply Now</button>
        )}
      </div>
    </div>
  );
}

function DashboardEventCard({ event, onRegister }) {
  const full = event.status === "FULL";
  const canRegister = event.canApply !== false && !full;

  return (
    <div className={`event-card ${full ? "full" : ""}`}>
      <div className="event-image-box">
        {event.imageUrl ? (
          <img
            src={`http://localhost:8080${event.imageUrl}`}
            alt={event.title}
            className="event-img"
          />
        ) : (
          <CalendarDays size={44} />
        )}

        <span className="recommended-badge">
          <Star size={13} />
          Recommended
        </span>
      </div>

      <div className="event-card-body">
        <div className="event-title-row">
          <h3>{event.title}</h3>
          <span className={`event-status ${full ? "full" : "open"}`}>
            {event.status}
          </span>
        </div>

        <p className="event-description">
          {event.description ||
            event.reason ||
            "Join this alumni-led session and improve your career skills."}
        </p>

        <div className="event-meta-grid">
          {event.eventDate && (
            <span>
              <CalendarDays size={15} />
              {event.eventDate}
            </span>
          )}

          {event.mode && (
            <span>
              {event.mode === "Online" ? (
                <Monitor size={15} />
              ) : (
                <Building2 size={15} />
              )}
              {event.mode}
            </span>
          )}

          <span>
            <MapPin size={15} />
            {event.venueOrLink || event.reason || "Recommended for you"}
          </span>

          {event.requiredSkills && (
            <span>
              <Users size={15} />
              {event.requiredSkills}
            </span>
          )}
        </div>

        <div className="event-footer">
          <div className="match-box">
            <p>Skill Match</p>
            <strong>{event.matchScore}%</strong>
          </div>

          {canRegister ? (
            <button
              className="event-btn"
              onClick={() => onRegister(event.eventId)}
            >
              Register
              <ArrowRight size={17} />
            </button>
          ) : (
            <button className="event-btn disabled" disabled>
              {event.status || "Unavailable"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
