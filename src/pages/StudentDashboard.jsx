import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  User,
  Users,
} from "lucide-react";
import api from "../services/api";
import "../styles/StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [applications, setApplications] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

      setStudent(studentResponse.data);
      setDashboard(dashboardResponse.data);
      setApplications(applicationResponse.data);
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
      <div className="student-dashboard">
        Loading dashboard...
      </div>
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
            </button>

            <div className="sd-profile">
              <div className="sd-avatar">
                {firstLetter}
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
                <span>{application.company}</span>
                <span>{application.jobTitle}</span>
                <span>{application.status}</span>

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
            <div className="sd-events-grid">
              {events.slice(0, 3).map((event) => (
                <div
                  className="sd-event-card"
                  key={event.eventId}
                >
                  <div className="event-info">
                    <h3>{event.title}</h3>

                    <p>
                      Required skills:{" "}
                      {event.requiredSkills}
                    </p>

                    <p>{event.reason}</p>

                    <p>
                      Skill match: {event.matchScore}%
                    </p>
                  </div>

                  <div className="event-action">
                    {event.canApply ? (
                      <button
                        className="register-btn"
                        onClick={() =>
                          registerEvent(event.eventId)
                        }
                      >
                        Register
                      </button>
                    ) : (
                      <button disabled>
                        {event.status}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;