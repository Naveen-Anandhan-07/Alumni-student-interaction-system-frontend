import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import "../styles/Profile.css";

function StudentProfile() {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [student, setStudent] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loggedUser = JSON.parse(storedUser);
    let profileId = loggedUser.profileId;

    if (loggedUser.role === "ALUMNI") {
      if (!studentId) {
        navigate("/alumni/dashboard");
        return;
      }

      profileId = studentId;
    }

    setUser(loggedUser);
    loadProfile(profileId);
  }, [navigate, studentId]);

  const loadProfile = async (profileId) => {
    try {
      const profileResponse = await api.get(`/students/${profileId}`);
      const dashboardResponse = await api.get(
        `/dashboard/student/${profileId}`
      );

      setStudent(profileResponse.data);
      setDashboard(dashboardResponse.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load student profile");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return <div className="pf-loading">Loading profile...</div>;
  }

  if (!student) {
    return <div className="pf-loading">Student profile not found.</div>;
  }

  const skills = student.skills ? student.skills.split(",") : [];
  const isAlumni = user?.role === "ALUMNI";
  const firstLetter = student.name
    ? student.name.charAt(0).toUpperCase()
    : "S";

  return (
    <div className="student-profile-layout">
      <aside className="pf-sidebar">
        <div className="pf-logo">
          <BookOpen size={34} />
        </div>

        <nav className="pf-menu">
          <a
            onClick={() =>
              navigate(
                isAlumni ? "/alumni/dashboard" : "/student/dashboard"
              )
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </a>

          {!isAlumni && (
            <a className="active">
              <User size={20} />
              Profile
            </a>
          )}

          <a
            onClick={() =>
              navigate(
                isAlumni
                  ? "/alumni/mentorships"
                  : "/student/mentorships"
              )
            }
          >
            <Users size={20} />
            Mentorship
          </a>

          <a
            onClick={() =>
              navigate(isAlumni ? "/alumni/jobs" : "/student/jobs")
            }
          >
            <Briefcase size={20} />
            Jobs / Internships
          </a>

          <a
            onClick={() =>
              navigate(isAlumni ? "/alumni/events" : "/student/events")
            }
          >
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

      <main className="pf-main">
        <section className="pf-page-head">
          <div>
            <p>{isAlumni ? "Mentee Profile" : "Student Profile"}</p>
            <h1>{student.name}</h1>
            <span>
              {isAlumni
                ? "View the student's academic details and skills."
                : "Your academic profile, skills and activity summary."}
            </span>
          </div>

          <div className="pf-head-avatar">{firstLetter}</div>
        </section>

        {isAlumni && (
          <button
            className="pf-logout"
            onClick={() => navigate("/alumni/mentorships")}
          >
            Back to Mentorships
          </button>
        )}

        <section className="pf-profile-grid">
          <div className="pf-profile-card">
            <div className="pf-avatar-large">{firstLetter}</div>

            <h2>{student.name}</h2>
            <p>{student.email}</p>

            <div className="pf-divider"></div>

            <div className="pf-info-list">
              <div>
                <span>Department</span>
                <strong>{student.department || "Not provided"}</strong>
              </div>

              <div>
                <span>Year</span>
                <strong>{student.year || "Not provided"}</strong>
              </div>

              <div>
                <span>Role</span>
                <strong>Student</strong>
              </div>
            </div>
          </div>

          <div className="pf-stats-grid">
            <div className="pf-stat-card">
              <h3>Mentorship Requests</h3>
              <h2>{dashboard?.totalMentorshipRequests || 0}</h2>
            </div>

            <div className="pf-stat-card">
              <h3>Registered Events</h3>
              <h2>{dashboard?.registeredEventsCount || 0}</h2>
            </div>

            <div className="pf-stat-card">
              <h3>Forum Questions</h3>
              <h2>{dashboard?.postedQuestionsCount || 0}</h2>
            </div>

            <div className="pf-stat-card">
              <h3>Available Jobs</h3>
              <h2>{dashboard?.availableJobsCount || 0}</h2>
            </div>
          </div>

          <div className="pf-section-card">
            <div className="pf-section-head">
              <h2>Skills</h2>
              <p>Technologies and career interests.</p>
            </div>

            <div className="pf-skills">
              {skills.length === 0 ? (
                <span>No skills added</span>
              ) : (
                skills.map((skill, index) => (
                  <span key={index}>{skill.trim()}</span>
                ))
              )}
            </div>
          </div>

          <div className="pf-section-card">
            <div className="pf-section-head">
              <h2>Mentorship Status</h2>
            </div>

            <div className="pf-status-list">
              <div>
                <span>Accepted Mentor</span>
                <strong>
                  {dashboard?.hasAcceptedMentor ? "YES" : "NO"}
                </strong>
              </div>

              <div>
                <span>Recommended Events</span>
                <strong>{dashboard?.recommendedEventsCount || 0}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentProfile;
