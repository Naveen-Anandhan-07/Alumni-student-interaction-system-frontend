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
import LoadingState from "../components/LoadingState";
import "../styles/AlumniDashboard.css";
import { getProfileImageUrl } from "../utils/profileImage";
import useUnreadNotifications from "../hooks/useUnreadNotifications";

const normalizeObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const getAlumniId = (user) =>
  user?.profileId || user?.alumniId || user?.id || user?.userId || "";

const readAlumniSession = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = normalizeObject(JSON.parse(storedUser));
    const role = String(parsedUser.role || "").toUpperCase();

    if (role !== "ALUMNI") {
      return null;
    }

    return {
      ...parsedUser,
      role,
      profileId: getAlumniId(parsedUser),
    };
  } catch (error) {
    console.log(error);
    localStorage.removeItem("user");
    return null;
  }
};

const toDisplayText = (value, fallback = "Not provided") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : fallback;
  }

  if (typeof value === "object") {
    return Object.values(value).filter(Boolean).join(", ") || fallback;
  }

  return String(value);
};

const getFirstLetter = (value, fallback = "A") =>
  toDisplayText(value, fallback).charAt(0).toUpperCase();

function AlumniDashboard() {
  const navigate = useNavigate();

  const [user] = useState(readAlumniSession);
  const [alumni, setAlumni] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const unreadCount = useUnreadNotifications(user);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!user.profileId) {
      setAlumni(user);
      setDashboard({});
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        const [dashboardResult, alumniResult, mentorshipResult] =
          await Promise.allSettled([
            api.get(`/dashboard/alumni/${user.profileId}`),
            api.get(`/alumni/${user.profileId}`),
            api.get(`/mentorships/alumni/${user.profileId}`),
          ]);

        if (alumniResult.status === "fulfilled") {
          setAlumni(normalizeObject(alumniResult.value.data));
        } else {
          console.log(alumniResult.reason);
        }

        if (dashboardResult.status === "fulfilled") {
          setDashboard(normalizeObject(dashboardResult.value.data));
        } else {
          console.log(dashboardResult.reason);
          setDashboard({});
        }

        const mentorships =
          mentorshipResult.status === "fulfilled" &&
          Array.isArray(mentorshipResult.value.data)
            ? mentorshipResult.value.data
            : [];

        const acceptedMentees = mentorships.filter(
          (mentorship) => mentorship?.status === "ACCEPTED"
        );

        if (mentorshipResult.status === "rejected") {
          console.log(mentorshipResult.reason);
        }

        setMentees(acceptedMentees);
      } catch (error) {
        console.log(error);
        setDashboard({});
      }

      setLoading(false);
    };

    loadDashboard();
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <LoadingState
        title="Loading dashboard"
        subtitle="Preparing mentorship, job and event activity."
      />
    );
  }

  if (!user) {
    return (
      <div className="loading-state">
        <div className="loading-card">
          <div className="loading-mark error-mark">!</div>
          <div>
            <h2>Alumni session required</h2>
            <p>Please login again to open the alumni dashboard.</p>
          </div>
          <button className="error-action" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const safeDashboard = normalizeObject(dashboard);
  const safeAlumni = normalizeObject(alumni);

  const alumniName =
    toDisplayText(
      safeAlumni.name || safeDashboard.name || user?.name,
      "Alumni"
    );

  const firstLetter = getFirstLetter(alumniName);
  const profileImageUrl =
    getProfileImageUrl(safeAlumni) || getProfileImageUrl(safeDashboard);

  return (
    <div className="alumni-dashboard-v2">
      <aside className="alumni-sidebar-v2">
        <div className="alumni-logo-v2">
          <BookOpen size={34} />
        </div>

        <nav className="alumni-menu-v2">
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

      <main className="alumni-main-v2">
        <header className="alumni-topbar-v2">
          <h2>Alumni Dashboard</h2>

          <div className="alumni-top-actions-v2">
            <button
              className="alumni-icon-btn-v2"
              onClick={() =>
                navigate("/notifications")
              }
            >
              <Bell size={21} />
              {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>

            <div className="alumni-profile-v2">
              <div className="alumni-avatar-v2">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={alumniName} />
                ) : (
                  firstLetter
                )}
              </div>

              <div>
                <h4>{alumniName}</h4>
                <p>Alumni</p>
              </div>
            </div>

            <button
              className="alumni-logout-v2"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="alumni-hero-grid-v2">
          <div className="alumni-welcome-v2">
            <div>
              <p className="alumni-eyebrow-v2">
                Welcome back,
              </p>

              <h1>{alumniName}</h1>

              <p className="ad-hero-text">
                {toDisplayText(
                  safeAlumni.designation || safeDashboard.designation,
                  "Alumni Mentor"
                )}
                {safeAlumni.company || safeDashboard.company
                  ? ` at ${toDisplayText(
                      safeAlumni.company || safeDashboard.company
                    )}`
                  : ""}
              </p>

              <p className="ad-hero-text">
                Manage mentorships, jobs, events and
                support students in their careers.
              </p>

              <div className="alumni-actions-v2">
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

            <div className="alumni-illustration-v2">
              <Users size={120} />
            </div>
          </div>

          <div className="alumni-panel-v2">
            <div className="alumni-panel-head-v2">
              <h3>My Mentees</h3>
              <Users size={20} />
            </div>

            <div className="alumni-mentees-list-v2">
              {mentees.length === 0 ? (
                <p>No accepted mentees.</p>
              ) : (
                mentees
                  .slice(0, 3)
                  .map((mentorship, index) => (
                    <div
                      className="alumni-mentee-v2"
                      key={mentorship.id || mentorship.studentId || index}
                    >
                      <div className="alumni-mentee-avatar-v2">
                        {getFirstLetter(mentorship.studentName, "S")}
                      </div>

                      <div>
                        <h4>
                          {toDisplayText(mentorship.studentName, "Student")}
                        </h4>

                        <p>
                          {toDisplayText(mentorship.studentDepartment, "Department")}
                          {" - Year "}
                          {toDisplayText(mentorship.studentYear, "-")}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/alumni/student/${toDisplayText(
                              mentorship.studentId,
                              ""
                            )}`
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
              className="alumni-link-btn-v2"
              onClick={() =>
                navigate("/alumni/mentorships")
              }
            >
              View All Mentees
            </button>
          </div>
        </section>

        <section className="alumni-stats-v2">
          <div className="alumni-stat-v2">
            <div className="alumni-stat-icon-v2">
              <Briefcase size={25} />
            </div>

            <div>
              <h3>Jobs Posted</h3>
              <h2>
                {toDisplayText(safeDashboard.postedJobsCount, "0")}
              </h2>
              <p>Total jobs</p>
            </div>
          </div>

          <div className="alumni-stat-v2">
            <div className="alumni-stat-icon-v2">
              <CalendarDays size={25} />
            </div>

            <div>
              <h3>Events Posted</h3>
              <h2>
                {toDisplayText(safeDashboard.postedEventsCount, "0")}
              </h2>
              <p>Total events</p>
            </div>
          </div>

          <div className="alumni-stat-v2">
            <div className="alumni-stat-icon-v2">
              <Users size={25} />
            </div>

            <div>
              <h3>My Mentees</h3>
              <h2>{mentees.length}</h2>
              <p>Accepted students</p>
            </div>
          </div>

          <div className="alumni-stat-v2">
            <div className="alumni-stat-icon-v2">
              <MessageSquare size={25} />
            </div>

            <div>
              <h3>Forum Answers</h3>
              <h2>
                {toDisplayText(safeDashboard.answeredQuestionsCount, "0")}
              </h2>
              <p>Questions answered</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default AlumniDashboard;
