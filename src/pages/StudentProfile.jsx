import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Profile.css";

function StudentProfile() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "STUDENT") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const profileRes = await api.get(`/students/${user.profileId}`);
        const dashboardRes = await api.get(`/dashboard/student/${user.profileId}`);

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
    return <div className="profile-loading">Loading profile...</div>;
  }

  const skills = student.skills ? student.skills.split(",") : [];

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <div className="logo">🎓 Alumni Portal</div>

        <nav>
          <span>Dashboard</span>
          <span className="active">Profile</span>
          <span>Events</span>
          <span>Jobs</span>
          <span>Mentorship</span>
          <span>Forum</span>
          <span>Notifications</span>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </aside>

      <main className="profile-main">
        <section className="profile-grid">
          <div className="glass-card intro-card">
            <p className="small-title">Student Profile</p>
            <h1>{student.name}</h1>
            <p>
              A passionate student exploring mentorship, events, jobs and career
              opportunities through alumni connections.
            </p>
          </div>

          <div className="glass-card user-card">
            <div className="avatar">{student.name?.slice(0, 2).toUpperCase()}</div>
            <h2>{student.name}</h2>
            <p>{student.email}</p>
            <div className="line"></div>
            <p>📚 {student.department}</p>
            <p>🎓 Year {student.year}</p>
          </div>

          <div className="glass-card stat-box">
            <h3>Mentorship</h3>
            <h2>{dashboard?.mentorshipRequestCount ?? 0}</h2>
            <p>Mentorship requests</p>
          </div>

          <div className="glass-card stat-box">
            <h3>Events</h3>
            <h2>{dashboard?.registeredEventsCount ?? 0}</h2>
            <p>Registered events</p>
          </div>

          <div className="glass-card stat-box">
            <h3>Forum</h3>
            <h2>{dashboard?.postedQuestionsCount ?? 0}</h2>
            <p>Questions posted</p>
          </div>

          <div className="glass-card stat-box">
            <h3>Jobs</h3>
            <h2>{dashboard?.availableJobsCount ?? 0}</h2>
            <p>Available jobs</p>
          </div>

          <div className="glass-card wide-card">
            <h3>Skills</h3>
            <div className="skill-list">
              {skills.map((skill) => (
                <span key={skill}>{skill.trim()}</span>
              ))}
            </div>
          </div>

          <div className="glass-card wide-card">
            <h3>Status</h3>
            <div className="list-item">
              <span>Accepted Mentor</span>
              <b>{dashboard?.acceptedMentorStatus || "NONE"}</b>
            </div>
            <div className="list-item">
              <span>Recommended Events</span>
              <b>{dashboard?.recommendedEventsCount ?? 0}</b>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentProfile;