import { useEffect, useState } from "react";
import { toast } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  ChevronDown,
  Filter,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  User,
  Users,
} from "lucide-react";
import api from "../services/api";
import LoadingState from "../components/LoadingState";
import "../styles/AlumniMentorship.css";
import { getProfileImageUrl, getProfileInitial } from "../utils/profileImage";
import useUnreadNotifications from "../hooks/useUnreadNotifications";

function AlumniMentorship() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [alumni, setAlumni] = useState(null);
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const unreadCount = useUnreadNotifications(user);

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
    loadMentorships(loggedUser.profileId);
  }, [navigate]);

  const loadMentorships = async (alumniId) => {
    try {
      const alumniResponse = await api.get(`/alumni/${alumniId}`);
      setAlumni(alumniResponse.data);

      const response = await api.get(
        `/mentorships/alumni/${alumniId}`
      );

      setMentorships(response.data || []);
    } catch (error) {
      console.log(error);
      toast("Failed to load mentorships");
    }

    setLoading(false);
  };

  const acceptRequest = async (mentorshipId) => {
    try {
      await api.put(
        `/mentorships/${mentorshipId}/accept`
      );

      toast("Mentorship request accepted");
      loadMentorships(user.profileId);
    } catch (error) {
      console.log(error);
      toast(
        error.response?.data?.message ||
          "Failed to accept request"
      );
    }
  };

  const rejectRequest = async (mentorshipId) => {
    try {
      await api.put(
        `/mentorships/${mentorshipId}/reject`
      );

      toast("Mentorship request rejected");
      loadMentorships(user.profileId);
    } catch (error) {
      console.log(error);
      toast(
        error.response?.data?.message ||
          "Failed to reject request"
      );
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  const filteredMentorships = mentorships.filter((mentorship) => {
    const searchText = [
      mentorship.studentName,
      mentorship.studentDepartment,
      mentorship.studentYear,
      mentorship.studentEmail,
      mentorship.studentSkills,
      mentorship.message,
      mentorship.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.trim().toLowerCase());
    const matchesStatus =
      statusFilter === "All Statuses" || mentorship.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingRequests = filteredMentorships.filter(
    (mentorship) => mentorship.status === "PENDING"
  );

  const acceptedMentees = filteredMentorships.filter(
    (mentorship) => mentorship.status === "ACCEPTED"
  );

  if (loading) {
    return (
      <LoadingState
        title="Loading mentorships"
        subtitle="Gathering pending requests and accepted mentees."
      />
    );
  }

  const alumniName = alumni?.name || user?.name || "Alumni";
  const alumniInitials = getProfileInitial(alumniName, "A");
  const profileImageUrl = getProfileImageUrl(alumni);

  return (
    <div className="am-layout">
      <aside className="am-sidebar">
        <div className="am-logo">
          <BookOpen size={34} />
        </div>

        <nav className="am-menu">
          <a
            onClick={() =>
              navigate("/alumni/dashboard")
            }
          >
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

          <a className="active">
            <Users size={20} />
            Mentorship
          </a>

          <a
            onClick={() => navigate("/alumni/jobs")}
          >
            <Briefcase size={20} />
            Jobs / Internships
          </a>

          <a
            onClick={() => navigate("/alumni/events")}
          >
            <CalendarDays size={20} />
            Events
          </a>

          <a onClick={() => navigate("/forum")}>
            <MessageSquare size={20} />
            Forum
          </a>

          <a onClick={() => navigate("/chat")}>
            <MessageSquare size={20} />
            Chat
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

      <main className="am-main">
        <header className="am-topbar">
          <h2>Mentorship</h2>

          <div className="am-top-actions">
            <button
              className="am-icon-btn"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={21} />
              {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>

            <div className="am-profile">
              <div className="am-profile-avatar">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={alumniName} />
                ) : (
                  alumniInitials
                )}
              </div>

              <div>
                <h4>{alumniName}</h4>
                <p>Alumni</p>
              </div>

              <ChevronDown size={18} />
            </div>

            <button className="am-logout" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="am-header">
          <div>
            <p>Alumni Mentorship</p>
            <h1>Mentorship Management</h1>
            <span>
              Review student requests and view your
              accepted mentees.
            </span>
          </div>
        </section>

        <section className="am-filter-card">
          <div className="am-search-box">
            <Search size={20} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students, departments, skills..."
            />
          </div>

          <div className="am-filter-box">
            <Filter size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>PENDING</option>
              <option>ACCEPTED</option>
            </select>
          </div>
        </section>

        <section className="am-summary">
          <div className="am-summary-card">
            <h3>Pending Requests</h3>
            <strong>{pendingRequests.length}</strong>
          </div>

          <div className="am-summary-card">
            <h3>Accepted Mentees</h3>
            <strong>{acceptedMentees.length}</strong>
          </div>
        </section>

        <section className="am-section">
          <div className="am-section-title">
            <h2>Pending Requests</h2>
            <p>
              Students waiting for your response.
            </p>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="am-empty">
              No pending mentorship requests.
            </div>
          ) : (
            <div className="am-grid">
              {pendingRequests.map((mentorship) => (
                <div
                  className="am-card"
                  key={mentorship.id}
                >
                  <div className="am-student">
                    <div className="am-avatar">
                      {getProfileInitial(mentorship.studentName, "S")}
                    </div>

                    <div>
                      <h3>
                        {mentorship.studentName}
                      </h3>

                      <p>
                        {mentorship.studentDepartment} -
                        Year {mentorship.studentYear}
                      </p>
                    </div>
                  </div>

                  <div className="am-details">
                    <p>
                      <strong>Email:</strong>{" "}
                      {mentorship.studentEmail}
                    </p>

                    <p>
                      <strong>Skills:</strong>{" "}
                      {mentorship.studentSkills ||
                        "Not added"}
                    </p>

                    <p>
                      <strong>Message:</strong>{" "}
                      {mentorship.message ||
                        "No message"}
                    </p>
                  </div>

                  <div className="am-actions">
                    <button
                      className="am-view"
                      onClick={() =>
                        navigate(
                          `/alumni/student/${mentorship.studentId}`
                        )
                      }
                    >
                      View Profile
                    </button>

                    <button
                      className="am-accept"
                      onClick={() =>
                        acceptRequest(mentorship.id)
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="am-reject"
                      onClick={() =>
                        rejectRequest(mentorship.id)
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="am-section">
          <div className="am-section-title">
            <h2>My Mentees</h2>
            <p>
              Students whose mentorship requests you
              accepted.
            </p>
          </div>

          {acceptedMentees.length === 0 ? (
            <div className="am-empty">
              You do not have any accepted mentees.
            </div>
          ) : (
            <div className="am-grid">
              {acceptedMentees.map((mentorship) => (
                <div
                  className="am-card"
                  key={mentorship.id}
                >
                  <div className="am-student">
                    <div className="am-avatar accepted">
                      {getProfileInitial(mentorship.studentName, "S")}
                    </div>

                    <div>
                      <h3>
                        {mentorship.studentName}
                      </h3>

                      <p>
                        {mentorship.studentDepartment} -
                        Year {mentorship.studentYear}
                      </p>
                    </div>
                  </div>

                  <div className="am-details">
                    <p>
                      <strong>Email:</strong>{" "}
                      {mentorship.studentEmail}
                    </p>

                    <p>
                      <strong>Skills:</strong>{" "}
                      {mentorship.studentSkills ||
                        "Not added"}
                    </p>

                    <span className="am-status">
                      ACCEPTED
                    </span>
                  </div>

                  <div className="am-actions">
                    <button
                      className="am-view"
                      onClick={() =>
                        navigate(
                          `/alumni/student/${mentorship.studentId}`
                        )
                      }
                    >
                      View Profile
                    </button>
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

export default AlumniMentorship;
