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
  Trash2,
  User,
  Users,
  CheckCircle,
} from "lucide-react";
import api from "../services/api";
import "../styles/Notifications.css";

function Notifications() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    fetchNotifications(storedUser, "ALL");
  }, [navigate]);

  const fetchNotifications = async (currentUser = user, currentFilter = filter) => {
    if (!currentUser) return;

    const url =
      currentFilter === "UNREAD"
        ? `/notifications/${currentUser.role}/${currentUser.profileId}/unread`
        : `/notifications/${currentUser.role}/${currentUser.profileId}`;

    const res = await api.get(url);
    setNotifications(res.data);
  };

  const handleFilter = (value) => {
    setFilter(value);
    fetchNotifications(user, value);
  };

  const markAsRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    await api.delete(`/notifications/${id}`);
    fetchNotifications();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const dashboardPath = user?.role === "STUDENT" ? "/student/dashboard" : "/alumni/dashboard";
  const profilePath = user?.role === "STUDENT" ? "/student/profile" : "/alumni/profile";
  const jobsPath = user?.role === "STUDENT" ? "/student/jobs" : "/alumni/jobs";
  const eventsPath = user?.role === "STUDENT" ? "/student/events" : "/alumni/events";

  return (
    <div className="notifications-layout">
      <aside className="nt-sidebar">
        <div className="nt-logo">
          <BookOpen size={34} />
        </div>

        <nav className="nt-menu">
          <a onClick={() => navigate(dashboardPath)}><LayoutDashboard size={20} />Dashboard</a>
          <a onClick={() => navigate(profilePath)}><User size={20} />Profile</a>
          <a><Users size={20} />Mentorship</a>
          <a onClick={() => navigate(jobsPath)}><Briefcase size={20} />Jobs / Internships</a>
          <a onClick={() => navigate(eventsPath)}><CalendarDays size={20} />Events</a>
          <a onClick={() => navigate("/forum")}><MessageSquare size={20} />Forum</a>
          <a className="active"><Bell size={20} />Notifications</a>
          <a onClick={handleLogout}><LogOut size={20} />Logout</a>
        </nav>
      </aside>

      <main className="nt-main">
        <header className="nt-topbar">
          <div className="nt-search-top">
            <Search size={20} />
            <input placeholder="Search notifications..." />
          </div>

          <div className="nt-top-actions">
            <button className="nt-icon-btn">
              <Bell size={21} />
              <span>{notifications.filter((n) => !n.isRead).length}</span>
            </button>

            <div className="nt-profile">
              <div className="nt-avatar">{initials || "U"}</div>
              <div>
                <h4>{user?.name || "User"}</h4>
                <p>{user?.role}</p>
              </div>
              <ChevronDown size={18} />
            </div>

            <button className="nt-logout" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        <section className="nt-page-head">
          <div>
            <p>Notifications</p>
            <h1>Your Updates</h1>
            <span>Track forum answers, event registrations, mentorship activity and important platform updates.</span>
          </div>
        </section>

        <section className="nt-filter-card">
          <button className={filter === "ALL" ? "active" : ""} onClick={() => handleFilter("ALL")}>All</button>
          <button className={filter === "UNREAD" ? "active" : ""} onClick={() => handleFilter("UNREAD")}>Unread</button>
          <button onClick={() => fetchNotifications()}>Refresh</button>
        </section>

        <section className="nt-list">
          {notifications.length === 0 ? (
            <div className="nt-empty">No notifications found.</div>
          ) : (
            notifications.map((n) => (
              <div className={`nt-card ${!n.isRead ? "unread" : ""}`} key={n.id}>
                <div className="nt-card-icon">
                  <Bell size={24} />
                </div>

                <div className="nt-card-content">
                  <h3>{n.title}</h3>
                  <p>{n.message}</p>
                  <span>{n.createdAt}</span>
                </div>

                <div className="nt-actions">
                  {!n.isRead && (
                    <button onClick={() => markAsRead(n.id)}>
                      <CheckCircle size={16} /> Mark Read
                    </button>
                  )}

                  <button className="delete" onClick={() => deleteNotification(n.id)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Notifications;