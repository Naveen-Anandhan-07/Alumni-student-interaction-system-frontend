import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Briefcase,
  Building,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Star,
  User,
  Users,
} from "lucide-react";
import api from "../services/api";
import "../styles/Profile.css";

function AlumniProfile() {
  const navigate = useNavigate();

  const [alumni, setAlumni] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "ALUMNI") {
      navigate("/login");
      return;
    }

    loadProfile(user.profileId);
  }, [navigate]);

  const loadProfile = async (alumniId) => {
    try {
      const profileResponse = await api.get(
        `/alumni/${alumniId}`
      );

      const dashboardResponse = await api.get(
        `/dashboard/alumni/${alumniId}`
      );

      setAlumni(profileResponse.data);
      setDashboard(dashboardResponse.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load alumni profile");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="profile-loading">
        Alumni profile is not available.
      </div>
    );
  }

  const skills = alumni.skills
    ? alumni.skills.split(",")
    : [];

  const firstLetter = alumni.name
    ? alumni.name.charAt(0).toUpperCase()
    : "A";

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <div className="logo">
          <BookOpen size={28} />
          Alumni Portal
        </div>

        <nav>
          <span
            onClick={() => navigate("/alumni/dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </span>

          <span className="active">
            <User size={18} />
            Profile
          </span>

          <span
            onClick={() => navigate("/alumni/mentorships")}
          >
            <Users size={18} />
            Mentorship
          </span>

          <span
            onClick={() => navigate("/alumni/jobs")}
          >
            <Briefcase size={18} />
            Jobs
          </span>

          <span
            onClick={() => navigate("/alumni/events")}
          >
            <CalendarDays size={18} />
            Events
          </span>

          <span onClick={() => navigate("/forum")}>
            <MessageSquare size={18} />
            Forum
          </span>

          <span
            onClick={() => navigate("/notifications")}
          >
            <Bell size={18} />
            Notifications
          </span>
        </nav>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Log Out
        </button>
      </aside>

      <main className="profile-main">
        <section className="profile-grid">
          <div className="glass-card intro-card">
            <p className="small-title">
              Alumni Profile
            </p>

            <h1>{alumni.name}</h1>

            <p>
              Alumni mentor helping students with career
              guidance, technical growth, events and job
              opportunities.
            </p>
          </div>

          <div className="glass-card user-card">
            <div className="avatar">
              {firstLetter}
            </div>

            <h2>{alumni.name}</h2>
            <p>{alumni.email}</p>

            <div className="line"></div>

            <p>
              <Building size={17} />
              {alumni.company || "Company not provided"}
            </p>

            <p>
              <Briefcase size={17} />
              {alumni.designation ||
                "Designation not provided"}
            </p>

            <p>
              <Star size={17} />
              {alumni.experience || 0} years experience
            </p>
          </div>

          <div className="glass-card stat-box">
            <h3>Events</h3>
            <h2>
              {dashboard?.postedEventsCount || 0}
            </h2>
            <p>Posted events</p>
          </div>

          <div className="glass-card stat-box">
            <h3>Registrations</h3>
            <h2>
              {dashboard
                ?.totalRegisteredStudentsForEvents || 0}
            </h2>
            <p>Student registrations</p>
          </div>

          <div className="glass-card stat-box">
            <h3>Answers</h3>
            <h2>
              {dashboard?.answeredQuestionsCount || 0}
            </h2>
            <p>Forum answers</p>
          </div>

          <div className="glass-card stat-box">
            <h3>Jobs</h3>
            <h2>
              {dashboard?.postedJobsCount || 0}
            </h2>
            <p>Posted jobs</p>
          </div>

          <div className="glass-card wide-card">
            <h3>Skills</h3>

            <div className="skill-list">
              {skills.length === 0 ? (
                <span>No skills added</span>
              ) : (
                skills.map((skill, index) => (
                  <span key={index}>
                    {skill.trim()}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="glass-card wide-card">
            <h3>Mentorship</h3>

            <div className="list-item">
              <span>Requests Received</span>

              <b>
                {dashboard
                  ?.mentorshipRequestsReceivedCount || 0}
              </b>
            </div>

            <button
              className="logout-btn"
              onClick={() =>
                navigate("/alumni/mentorships")
              }
            >
              View Mentorships
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AlumniProfile;