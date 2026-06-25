import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Profile.css";

function AlumniProfile() {
  const navigate = useNavigate();

  const [alumni, setAlumni] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "ALUMNI") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const profileRes = await api.get(`/alumni/${user.profileId}`);
        const dashboardRes = await api.get(`/dashboard/alumni/${user.profileId}`);

        setAlumni(profileRes.data);
        setDashboard(dashboardRes.data);
      } catch (error) {
        console.log(error);
        alert("Failed to load alumni profile");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!alumni) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  const skills = alumni.skills ? alumni.skills.split(",") : [];

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <div className="logo">🎓 Alumni Portal</div>

        <nav>
          <span>Dashboard</span>
          <span className="active">Profile</span>
          <span>My Events</span>
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
            <p className="small-title">Alumni Profile</p>
            <h1>{alumni.name}</h1>
            <p>
              Alumni mentor helping students with career guidance, technical
              growth, events and job opportunities.
            </p>
          </div>

          <div className="glass-card user-card">
            <div className="avatar">{alumni.name?.slice(0, 2).toUpperCase()}</div>
            <h2>{alumni.name}</h2>
            <p>{alumni.email}</p>
            <div className="line"></div>
            <p>🏢 {alumni.company}</p>
            <p>💼 {alumni.designation}</p>
            <p>⭐ {alumni.experience} years experience</p>
          </div>

          <div className="glass-card stat-box">
            <h3>Events</h3>
            <h2>{dashboard?.postedEventsCount ?? 0}</h2>
            <p>Posted events</p>
          </div>

          <div className="glass-card stat-box">
            <h3>Students</h3>
            <h2>{dashboard?.totalRegisteredStudents ?? 0}</h2>
            <p>Total registrations</p>
          </div>

          <div className="glass-card stat-box">
            <h3>Answers</h3>
            <h2>{dashboard?.answeredQuestionsCount ?? 0}</h2>
            <p>Forum answers</p>
          </div>

          <div className="glass-card stat-box">
            <h3>Jobs</h3>
            <h2>{dashboard?.postedJobsCount ?? 0}</h2>
            <p>Posted jobs</p>
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
            <h3>Mentorship</h3>
            <div className="list-item">
              <span>Requests Received</span>
              <b>{dashboard?.mentorshipRequestsReceived ?? 0}</b>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AlumniProfile;