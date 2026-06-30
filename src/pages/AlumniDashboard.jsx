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
import "../styles/AlumniDashboard.css";

function AlumniDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loggedUser = JSON.parse(storedUser);

    if (loggedUser.role !== "ALUMNI") {
      navigate("/login");
      return;
    }

    setUser(loggedUser);
    loadDashboard(loggedUser.profileId);
  }, [navigate]);

  const loadDashboard = async (alumniId) => {
    try {
      const dashboardResponse = await api.get(
        `/dashboard/alumni/${alumniId}`
      );

      const mentorshipResponse = await api.get(
        `/mentorships/alumni/${alumniId}`
      );

      setDashboard(dashboardResponse.data);

      const acceptedMentees =
        mentorshipResponse.data.filter(
          (mentorship) =>
            mentorship.status === "ACCEPTED"
        );

      setMentees(acceptedMentees);
    } catch (error) {
      console.log(error);
      alert("Failed to load alumni dashboard");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="alumni-dashboard">
        Loading dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="alumni-dashboard">
        Dashboard data is not available.
      </div>
    );
  }

  const alumniName =
    dashboard.name || user?.name || "Alumni";

  const firstLetter = alumniName
    .charAt(0)
    .toUpperCase();

  return (
    <div className="alumni-dashboard">
      <aside className="ad-sidebar">
        <div className="ad-logo">
          <BookOpen size={34} />
        </div>

        <nav className="ad-menu">
          <a className="active">
            <LayoutDashboard size={20} />
            Dashboard
          </a>

          <a
            onClick={() =>
              navigate("/alumni/profile")
            }
          >
            <User size={20} />
            Profile
          </a>

          <a
            onClick={() =>
              navigate("/alumni/mentorships")
            }
          >
            <Users size={20} />
            Mentorship
          </a>

          <a
            onClick={() =>
              navigate("/alumni/jobs")
            }
          >
            <Briefcase size={20} />
            Jobs / Internships
          </a>

          <a
            onClick={() =>
              navigate("/alumni/events")
            }
          >
            <CalendarDays size={20} />
            Events
          </a>

          <a onClick={() => navigate("/forum")}>
            <MessageSquare size={20} />
            Forum
          </a>

          <a
            onClick={() =>
              navigate("/notifications")
            }
          >
            <Bell size={20} />
            Notifications
          </a>

          <a onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </a>
        </nav>
      </aside>

      <main className="ad-main">
        <header className="ad-topbar">
          <h2>Alumni Dashboard</h2>

          <div className="ad-top-actions">
            <button
              className="ad-icon-btn"
              onClick={() =>
                navigate("/notifications")
              }
            >
              <Bell size={21} />
            </button>

            <div className="ad-profile">
              <div className="ad-avatar">
                {firstLetter}
              </div>

              <div>
                <h4>{alumniName}</h4>
                <p>Alumni</p>
              </div>
            </div>

            <button
              className="ad-logout"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="ad-hero-row">
          <div className="ad-welcome-card">
            <div>
              <p className="ad-small-title">
                Welcome back,
              </p>

              <h1>{alumniName}</h1>

              <p className="ad-hero-text">
                {dashboard.designation ||
                  "Alumni Mentor"}
                {dashboard.company
                  ? ` at ${dashboard.company}`
                  : ""}
              </p>

              <p className="ad-hero-text">
                Manage mentorships, jobs, events and
                support students in their careers.
              </p>

              <div className="ad-hero-actions">
                <button
                  onClick={() =>
                    navigate("/alumni/jobs")
                  }
                >
                  Post Job
                </button>

                <button
                  className="outline"
                  onClick={() =>
                    navigate("/alumni/events")
                  }
                >
                  Create Event
                </button>

                <button
                  className="outline"
                  onClick={() =>
                    navigate("/forum")
                  }
                >
                  Answer Forum
                </button>
              </div>
            </div>

            <div className="ad-hero-illustration">
              <Users size={120} />
            </div>
          </div>

          <div className="ad-mentees-card">
            <div className="ad-card-head">
              <h3>My Mentees</h3>
              <Users size={20} />
            </div>

            <div className="ad-mentees-list">
              {mentees.length === 0 ? (
                <p>No accepted mentees.</p>
              ) : (
                mentees
                  .slice(0, 3)
                  .map((mentorship) => (
                    <div
                      className="ad-mentee-item"
                      key={mentorship.id}
                    >
                      <div className="ad-mentee-avatar">
                        {mentorship.studentName
                          ?.charAt(0)
                          .toUpperCase() || "S"}
                      </div>

                      <div className="ad-mentee-info">
                        <h4>
                          {mentorship.studentName}
                        </h4>

                        <p>
                          {mentorship.studentDepartment}
                          {" - Year "}
                          {mentorship.studentYear}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/alumni/student/${mentorship.studentId}`
                          )
                        }
                      >
                        View
                      </button>
                    </div>
                  ))
              )}
            </div>

            <button
              className="ad-link-btn"
              onClick={() =>
                navigate("/alumni/mentorships")
              }
            >
              View All Mentees
            </button>
          </div>
        </section>

        <section className="ad-analytics-grid">
          <div className="ad-stat-card">
            <div className="ad-stat-icon">
              <Briefcase size={25} />
            </div>

            <div>
              <h3>Jobs Posted</h3>
              <h2>
                {dashboard.postedJobsCount || 0}
              </h2>
              <p>Total jobs</p>
            </div>
          </div>

          <div className="ad-stat-card">
            <div className="ad-stat-icon">
              <CalendarDays size={25} />
            </div>

            <div>
              <h3>Events Posted</h3>
              <h2>
                {dashboard.postedEventsCount || 0}
              </h2>
              <p>Total events</p>
            </div>
          </div>

          <div className="ad-stat-card">
            <div className="ad-stat-icon">
              <Users size={25} />
            </div>

            <div>
              <h3>My Mentees</h3>
              <h2>{mentees.length}</h2>
              <p>Accepted students</p>
            </div>
          </div>

          <div className="ad-stat-card">
            <div className="ad-stat-icon">
              <MessageSquare size={25} />
            </div>

            <div>
              <h3>Forum Answers</h3>
              <h2>
                {dashboard.answeredQuestionsCount ||
                  0}
              </h2>
              <p>Questions answered</p>
            </div>
          </div>
        </section>

        <section className="ad-section-card">
          <div className="ad-section-head">
            <div>
              <h2>Alumni Details</h2>

              <p>
                Email:{" "}
                {dashboard.email || user?.email}
              </p>

              <p>
                Company:{" "}
                {dashboard.company || "Not provided"}
              </p>

              <p>
                Designation:{" "}
                {dashboard.designation ||
                  "Not provided"}
              </p>

              <p>
                Experience:{" "}
                {dashboard.experience || 0} years
              </p>

              <p>
                Skills:{" "}
                {dashboard.skills || "Not provided"}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AlumniDashboard;