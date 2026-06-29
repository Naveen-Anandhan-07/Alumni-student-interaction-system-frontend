import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  User,
  Users,
} from "lucide-react";
import api from "../services/api";
import "../styles/Profile.css";

function StudentProfile() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.role !== "STUDENT") {
      navigate("/login");
      return;
    }

    setUser(storedUser);

    const fetchData = async () => {
      try {
        const profileRes = await api.get(`/students/${storedUser.profileId}`);
        const dashboardRes = await api.get(
          `/dashboard/student/${storedUser.profileId}`
        );

        setStudent(profileRes.data);
        setDashboard(dashboardRes.data);
      } catch (error) {
        console.log(error);
        alert("Failed to load student profile");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!student) {
    return <div className="pf-loading">Loading profile...</div>;
  }

  const skills = student.skills ? student.skills.split(",") : [];

  const initials = student.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="student-profile-layout">
      <aside className="pf-sidebar">
        <div className="pf-logo">
          <BookOpen size={34} />
        </div>

        <nav className="pf-menu">
          <a onClick={() => navigate("/student/dashboard")}>
            <LayoutDashboard size={20} />
            Dashboard
          </a>

          <a className="active">
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

      <main className="pf-main">
        <header className="pf-topbar">
          <div className="pf-search-top">
            <Search size={20} />
            <input placeholder="Search profile, jobs, events..." />
          </div>

          <div className="pf-top-actions">
            <button
              className="pf-icon-btn"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={21} />
              <span>0</span>
            </button>

            <div className="pf-user-mini">
              <div className="pf-mini-avatar">{initials || "S"}</div>
              <div>
                <h4>{student.name}</h4>
                <p>{user?.role}</p>
              </div>
              <ChevronDown size={18} />
            </div>

            <button className="pf-logout" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="pf-page-head">
          <div>
            <p>Student Profile</p>
            <h1>{student.name}</h1>
            <span>
              Manage your academic profile, skills, mentorship status, events,
              jobs and forum activity.
            </span>
          </div>

          <div className="pf-head-avatar">{initials || "S"}</div>
        </section>

        <section className="pf-profile-grid">
          <div className="pf-profile-card">
            <div className="pf-avatar-large">{initials || "S"}</div>

            <h2>{student.name}</h2>
            <p>{student.email}</p>

            <div className="pf-divider"></div>

            <div className="pf-info-list">
              <div>
                <span>Department</span>
                <strong>{student.department}</strong>
              </div>

              <div>
                <span>Year</span>
                <strong>{student.year}</strong>
              </div>

              <div>
                <span>Role</span>
                <strong>Student</strong>
              </div>
            </div>
          </div>

          <div className="pf-stats-grid">
            <div className="pf-stat-card">
              <h3>Mentorship</h3>
              <h2>{dashboard?.mentorshipRequestCount ?? 0}</h2>
              <p>Mentorship requests</p>
            </div>

            <div className="pf-stat-card">
              <h3>Events</h3>
              <h2>{dashboard?.registeredEventsCount ?? 0}</h2>
              <p>Registered events</p>
            </div>

            <div className="pf-stat-card">
              <h3>Forum</h3>
              <h2>{dashboard?.postedQuestionsCount ?? 0}</h2>
              <p>Questions posted</p>
            </div>

            <div className="pf-stat-card">
              <h3>Jobs</h3>
              <h2>{dashboard?.availableJobsCount ?? 0}</h2>
              <p>Available jobs</p>
            </div>
          </div>

          <div className="pf-section-card">
            <div className="pf-section-head">
              <h2>Skills</h2>
              <p>Technologies and areas you are interested in.</p>
            </div>

            <div className="pf-skills">
              {skills.length === 0 ? (
                <span>No skills added</span>
              ) : (
                skills.map((skill) => <span key={skill}>{skill.trim()}</span>)
              )}
            </div>
          </div>

          <div className="pf-section-card">
            <div className="pf-section-head">
              <h2>Status</h2>
              <p>Your current mentorship and recommendation summary.</p>
            </div>

            <div className="pf-status-list">
              <div>
                <span>Accepted Mentor</span>
                <strong>{dashboard?.acceptedMentorStatus || "NONE"}</strong>
              </div>

              <div>
                <span>Recommended Events</span>
                <strong>{dashboard?.recommendedEventsCount ?? 0}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentProfile;