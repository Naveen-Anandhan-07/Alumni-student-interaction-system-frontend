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
import MessageInbox from "../components/MessageInbox";
import useUnreadNotifications from "../hooks/useUnreadNotifications";
import api from "../services/api";
import { getProfileImageUrl, getProfileInitial } from "../utils/profileImage";
import "../styles/Chat.css";

function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const unreadCount = useUnreadNotifications(user);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loggedUser = JSON.parse(storedUser);
    setUser(loggedUser);

    const endpoint =
      loggedUser.role === "ALUMNI"
        ? `/alumni/${loggedUser.profileId}`
        : `/students/${loggedUser.profileId}`;

    api
      .get(endpoint)
      .then((response) => setProfile(response.data))
      .catch(console.error);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  const isAlumni = user?.role === "ALUMNI";
  const dashboardPath = isAlumni ? "/alumni/dashboard" : "/student/dashboard";
  const profilePath = isAlumni ? "/alumni/profile" : "/student/profile";
  const mentorshipPath = isAlumni
    ? "/alumni/mentorships"
    : "/student/mentorships";
  const jobsPath = isAlumni ? "/alumni/jobs" : "/student/jobs";
  const eventsPath = isAlumni ? "/alumni/events" : "/student/events";
  const displayName =
    profile?.name || user?.name || (isAlumni ? "Alumni" : "Student");
  const profileImageUrl = getProfileImageUrl(profile);
  const firstLetter = getProfileInitial(displayName, "U");

  return (
    <div className="chat-page-layout">
      <aside className="chat-sidebar">
        <div className="chat-logo">
          <BookOpen size={34} />
        </div>

        <nav className="chat-menu">
          <a onClick={() => navigate(dashboardPath)}>
            <LayoutDashboard size={20} />
            Dashboard
          </a>

          <a onClick={() => navigate(profilePath)}>
            <User size={20} />
            Profile
          </a>

          <a onClick={() => navigate(mentorshipPath)}>
            <Users size={20} />
            Mentorship
          </a>

          <a onClick={() => navigate(jobsPath)}>
            <Briefcase size={20} />
            Jobs / Internships
          </a>

          <a onClick={() => navigate(eventsPath)}>
            <CalendarDays size={20} />
            Events
          </a>

          <a onClick={() => navigate("/forum")}>
            <MessageSquare size={20} />
            Forum
          </a>

          <a className="active">
            <MessageSquare size={20} />
            Chat
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

      <main className="chat-main">
        <header className="chat-topbar">
          <div>
            <h2>Private Chat</h2>
            <p>Message your accepted mentorship connections.</p>
          </div>

          <div className="chat-top-actions">
            <button
              className="chat-icon-btn"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={21} />
              {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>

            <div className="chat-profile">
              <div className="chat-avatar">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={displayName} />
                ) : (
                  firstLetter
                )}
              </div>

              <div>
                <h4>{displayName}</h4>
                <p>{isAlumni ? "Alumni" : "Student"}</p>
              </div>
            </div>

            <button className="chat-logout" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="chat-page-head">
          <div>
            <p>Messages</p>
            <h1>Private conversations</h1>
            <span>
              Continue mentorship conversations without crowding the dashboard.
            </span>
          </div>
        </section>

        <MessageInbox page />
      </main>
    </div>
  );
}

export default Chat;
