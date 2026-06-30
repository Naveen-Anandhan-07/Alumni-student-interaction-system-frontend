import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Trash2,
  User,
  Users,
} from "lucide-react";
import api from "../services/api";
import LoadingState from "../components/LoadingState";
import "../styles/Notifications.css";
import { getProfileImageUrl } from "../utils/profileImage";

function Notifications() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loggedUser = JSON.parse(storedUser);

    setUser(loggedUser);
    loadProfile(loggedUser);
    loadNotifications(loggedUser, "ALL");
  }, [navigate]);

  const loadProfile = async (loggedUser) => {
    try {
      const endpoint =
        loggedUser.role === "STUDENT"
          ? `/students/${loggedUser.profileId}`
          : `/alumni/${loggedUser.profileId}`;

      const response = await api.get(endpoint);
      setProfile(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadNotifications = async (
    loggedUser,
    selectedFilter
  ) => {
    try {
      let url =
        `/notifications/${loggedUser.role}/` +
        loggedUser.profileId;

      if (selectedFilter === "UNREAD") {
        url = url + "/unread";
      }

      const response = await api.get(url);

      setNotifications(response.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load notifications");
    }

    setLoading(false);
  };

  const changeFilter = (selectedFilter) => {
    setFilter(selectedFilter);
    loadNotifications(user, selectedFilter);
  };

  const refreshNotifications = () => {
    loadNotifications(user, filter);
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(
        `/notifications/${notificationId}/read`
      );

      refreshNotifications();
    } catch (error) {
      console.log(error);
      alert("Failed to mark notification as read");
    }
  };

  const deleteNotification = async (
    notificationId
  ) => {
    try {
      await api.delete(
        `/notifications/${notificationId}`
      );

      refreshNotifications();
    } catch (error) {
      console.log(error);
      alert("Failed to delete notification");
    }
  };

  const getMentorshipDetails = (message) => {
    const details = {
      mentorshipId: "",
      studentId: "",
      studentName: "A student",
    };

    if (!message) {
      return details;
    }

    const parts = message.split("|");

    for (let index = 0; index < parts.length; index++) {
      const currentPart = parts[index];

      if (
        currentPart.startsWith(
          "MENTORSHIP_REQUEST_ID:"
        )
      ) {
        details.mentorshipId =
          currentPart.split(":")[1];
      }

      if (currentPart.startsWith("STUDENT_ID:")) {
        details.studentId =
          currentPart.split(":")[1];
      }

      if (
        currentPart.startsWith("STUDENT_NAME:")
      ) {
        details.studentName =
          currentPart.substring(
            "STUDENT_NAME:".length
          );
      }
    }

    return details;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <LoadingState
        title="Loading notifications"
        subtitle="Checking your latest updates and unread messages."
      />
    );
  }

  let dashboardPath = "/student/dashboard";
  let profilePath = "/student/profile";
  let mentorshipPath = "/student/mentorships";
  let jobsPath = "/student/jobs";
  let eventsPath = "/student/events";

  if (user?.role === "ALUMNI") {
    dashboardPath = "/alumni/dashboard";
    profilePath = "/alumni/profile";
    mentorshipPath = "/alumni/mentorships";
    jobsPath = "/alumni/jobs";
    eventsPath = "/alumni/events";
  }

  let unreadCount = 0;

  for (
    let index = 0;
    index < notifications.length;
    index++
  ) {
    if (!notifications[index].isRead) {
      unreadCount++;
    }
  }

  const profileName = profile?.name || user?.name || "User";
  const profileImageUrl = getProfileImageUrl(profile);

  return (
    <div className="notifications-layout">
      <aside className="nt-sidebar">
        <div className="nt-logo">
          <BookOpen size={34} />
        </div>

        <nav className="nt-menu">
          <a
            onClick={() =>
              navigate(dashboardPath)
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </a>

          <a
            onClick={() => navigate(profilePath)}
          >
            <User size={20} />
            Profile
          </a>

          <a
            onClick={() =>
              navigate(mentorshipPath)
            }
          >
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
            <Bell size={20} />
            Notifications
          </a>

          <a onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </a>
        </nav>
      </aside>

      <main className="nt-main">
        <header className="nt-topbar">
          <div>
            <h2>Notifications</h2>
          </div>

          <div className="nt-top-actions">
            <button
              className="nt-icon-btn"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={21} />
              {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>

            <div className="nt-profile">
              <div className="nt-avatar">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={profileName} />
                ) : (
                  profileName.charAt(0).toUpperCase()
                )}
              </div>

              <div>
                <h4>{profileName}</h4>
                <p>{user?.role}</p>
              </div>
            </div>

            <button
              className="nt-logout"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="nt-filter-card">
          <button
            className={
              filter === "ALL" ? "active" : ""
            }
            onClick={() => changeFilter("ALL")}
          >
            All
          </button>

          <button
            className={
              filter === "UNREAD" ? "active" : ""
            }
            onClick={() => changeFilter("UNREAD")}
          >
            Unread
          </button>

          <button
            onClick={refreshNotifications}
          >
            Refresh
          </button>
        </section>

        <section className="nt-list">
          {notifications.length === 0 ? (
            <div className="nt-empty">
              No notifications found.
            </div>
          ) : (
            notifications.map((notification) => {
              const isMentorshipRequest =
                user?.role === "ALUMNI" &&
                notification.title ===
                  "New Mentorship Request";

              const mentorshipDetails =
                getMentorshipDetails(
                  notification.message
                );

              return (
                <div
                  className={
                    notification.isRead
                      ? "nt-card"
                      : "nt-card unread"
                  }
                  key={notification.id}
                >
                  <div className="nt-card-icon">
                    {isMentorshipRequest ? (
                      <Users size={24} />
                    ) : (
                      <Bell size={24} />
                    )}
                  </div>

                  <div className="nt-card-content">
                    <h3>{notification.title}</h3>

                    {isMentorshipRequest ? (
                      <p>
                        {
                          mentorshipDetails.studentName
                        }{" "}
                        sent you a mentorship request.
                      </p>
                    ) : (
                      <p>{notification.message}</p>
                    )}

                    <span>
                      {notification.createdAt}
                    </span>
                  </div>

                  <div className="nt-actions">
                    {isMentorshipRequest ? (
                      <>
                        <button
                          onClick={() =>
                            navigate("/alumni/mentorships")
                          }
                        >
                          View
                        </button>

                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                          >
                            <CheckCircle size={16} />
                            Mark Read
                          </button>
                        )}

                        <button
                          className="delete"
                          onClick={() =>
                            deleteNotification(
                              notification.id
                            )
                          }
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                          >
                            <CheckCircle size={16} />
                            Mark Read
                          </button>
                        )}

                        <button
                          className="delete"
                          onClick={() =>
                            deleteNotification(
                              notification.id
                            )
                          }
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}

export default Notifications;
