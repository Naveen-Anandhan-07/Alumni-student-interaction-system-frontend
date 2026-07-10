import React, { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  User,
  Users,
  Send,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LoadingState from "../components/LoadingState";
import "../styles/StudentMentorship.css";
import { getProfileImageUrl, getProfileInitial } from "../utils/profileImage";
import useUnreadNotifications from "../hooks/useUnreadNotifications";

function StudentMentorship() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [alumniList, setAlumniList] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRequestAlumniId, setActiveRequestAlumniId] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All Companies");
  const [skillFilter, setSkillFilter] = useState("All Skills");
  const unreadCount = useUnreadNotifications(user);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loggedUser = JSON.parse(storedUser);

    if (loggedUser.role !== "STUDENT") {
      navigate("/login");
      return;
    }

    setUser(loggedUser);
    loadData(loggedUser.profileId);
  }, [navigate]);

  const loadData = async (studentId) => {
    try {
      const studentRes = await api.get(`/students/${studentId}`);
      setStudent(studentRes.data);

      const alumniRes = await api.get("/alumni");
      setAlumniList(alumniRes.data);

      const requestRes = await api.get(`/mentorships/student/${studentId}`);
      setMentorships(requestRes.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load mentorship data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  const hasAcceptedMentor = mentorships.some(
    (m) => m.status === "ACCEPTED"
  );

  const hasAnyPendingRequest = mentorships.some(
    (m) => m.status === "PENDING"
  );

  const sendMentorshipRequest = async (alumniId) => {
    if (hasAcceptedMentor) {
      alert("You already have a mentor. You cannot request another alumni.");
      return;
    }

    if (hasAnyPendingRequest) {
      alert("You already have a pending mentorship request.");
      return;
    }

    const message = requestMessage.trim();

    if (!message) {
      alert("Please write a short message for your mentorship request.");
      return;
    }

    try {
      await api.post("/mentorships", {
        studentId: user.profileId,
        alumniId: alumniId,
        message,
      });

      alert("Mentorship request sent successfully");
      setActiveRequestAlumniId(null);
      setRequestMessage("");
      loadData(user.profileId);
    } catch (error) {
      console.log(error);
      alert("Failed to send mentorship request");
    }
  };

  const startMentorshipRequest = (alumniId) => {
    setActiveRequestAlumniId(alumniId);
    setRequestMessage("");
  };

  const cancelMentorshipRequest = () => {
    setActiveRequestAlumniId(null);
    setRequestMessage("");
  };

  const isPendingForThisAlumni = (alumniId) => {
    return mentorships.some(
      (m) => m.alumniId === alumniId && m.status === "PENDING"
    );
  };

  const isAcceptedForThisAlumni = (alumniId) => {
    return mentorships.some(
      (m) => m.alumniId === alumniId && m.status === "ACCEPTED"
    );
  };

  if (loading) {
    return (
      <LoadingState
        title="Loading mentorships"
        subtitle="Checking your mentor requests and alumni matches."
      />
    );
  }

  const displayName = student?.name || user?.name || "Student";
  const initials = getProfileInitial(displayName, "S");
  const profileImageUrl = getProfileImageUrl(student);
  const filteredAlumniList = alumniList.filter((alumni) => {
    const searchText = [
      alumni.name,
      alumni.designation,
      alumni.company,
      alumni.bio,
      alumni.about,
      alumni.skills,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const skills = alumni.skills || "";
    const matchesSearch = searchText.includes(searchTerm.trim().toLowerCase());
    const matchesCompany =
      companyFilter === "All Companies" || alumni.company === companyFilter;
    const matchesSkill =
      skillFilter === "All Skills" ||
      skills.toLowerCase().includes(skillFilter.toLowerCase());

    return matchesSearch && matchesCompany && matchesSkill;
  });

  return (
    <div className="student-mentorship-layout">
      <aside className="sm-sidebar">
        <div className="sm-logo">
          <BookOpen size={34} />
        </div>

        <nav className="sm-menu">
          <a onClick={() => navigate("/student/dashboard")}>
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a onClick={() => navigate("/student/profile")}>
            <User size={20} />
            Profile
          </a>
          <a className="active">
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
          <a onClick={() => navigate("/chat")}>
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

      <main className="sm-main">
        <header className="sm-topbar">
          <h2>Mentorship</h2>

          <div className="sm-top-actions">
            <button
              className="sm-icon-btn"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={21} />
              {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>

            <div className="sm-profile">
              <div className="sm-avatar">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={displayName} />
                ) : (
                  initials
                )}
              </div>
              <div>
                <h4>{displayName}</h4>
                <p>Student</p>
              </div>
              <ChevronDown size={18} />
            </div>

            <button className="sm-logout" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="sm-page-head">
          <div>
            <p>Mentorship</p>
            <h1>Find the right alumni mentor</h1>
            <span>
              View alumni profiles, skills and company details. You can send
              mentorship request to only one alumni at a time.
            </span>
          </div>

          <div className="sm-request-box">
            <p>Current Status</p>

            <strong>
              {hasAcceptedMentor
                ? "Mentor Assigned"
                : hasAnyPendingRequest
                  ? "Request Pending"
                  : "No Request"}
            </strong>

          </div>
        </section>

        <section className="sm-filter-card">
          <div className="sm-search-box">
            <Search size={20} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search alumni, skills, company..."
            />
          </div>

          <div className="sm-filter-box">
            <Building2 size={18} />
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option>All Companies</option>
              <option>Zoho</option>
              <option>TCS</option>
              <option>Infosys</option>
              <option>Freshworks</option>
            </select>
          </div>

          <div className="sm-filter-box">
            <Users size={18} />
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              <option>All Skills</option>
              <option>Java</option>
              <option>React</option>
              <option>Spring Boot</option>
              <option>Cloud</option>
            </select>
          </div>
        </section>

        <section className="sm-section">
          <div className="sm-section-head">
            <div>
              <h2>Available Alumni</h2>
              <p>Choose one alumni and send a mentorship request.</p>
            </div>
          </div>

          <div className="sm-alumni-grid">
            {filteredAlumniList.length === 0 ? (
              <div className="sm-empty">No alumni match your filters.</div>
            ) : (
              filteredAlumniList.map((alumni) => (
                <AlumniCard
                  key={alumni.id}
                  alumni={alumni}
                  hasAcceptedMentor={hasAcceptedMentor}
                  hasAnyPendingRequest={hasAnyPendingRequest}
                  pendingForThisAlumni={isPendingForThisAlumni(alumni.id)}
                  acceptedForThisAlumni={isAcceptedForThisAlumni(alumni.id)}
                  isWritingRequest={activeRequestAlumniId === alumni.id}
                  requestMessage={requestMessage}
                  onMessageChange={setRequestMessage}
                  onStartRequest={startMentorshipRequest}
                  onSendRequest={sendMentorshipRequest}
                  onCancelRequest={cancelMentorshipRequest}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function AlumniCard({
  alumni,
  hasAcceptedMentor,
  hasAnyPendingRequest,
  pendingForThisAlumni,
  acceptedForThisAlumni,
  isWritingRequest,
  requestMessage,
  onMessageChange,
  onStartRequest,
  onSendRequest,
  onCancelRequest,
}) {
  const disabled =
    hasAcceptedMentor || hasAnyPendingRequest;

  let buttonText = "Request Mentor";

  if (acceptedForThisAlumni) {
    buttonText = "Your Mentor";
  } else if (hasAcceptedMentor) {
    buttonText = "Mentor Assigned";
  } else if (pendingForThisAlumni) {
    buttonText = "Requested";
  } else if (hasAnyPendingRequest) {
    buttonText = "Request Pending";
  }

  return (
    <div className={`sm-alumni-card ${disabled ? "disabled" : ""}`}>
      <div className="sm-alumni-image">
        {alumni.imageUrl ? (
          <img
            src={`http://localhost:8080${alumni.imageUrl}`}
            alt={alumni.name}
          />
        ) : (
          <div className="sm-alumni-initial">
            {getProfileInitial(alumni.name, "A")}
          </div>
        )}
      </div>

      <div className="sm-alumni-body">
        <h3>{alumni.name}</h3>
        <p className="sm-role">{alumni.designation || "Alumni Mentor"}</p>

        <div className="sm-company">
          <Building2 size={15} />
          <span>{alumni.company || "Company not added"}</span>
        </div>

        <p className="sm-bio">
          {alumni.bio || alumni.about || "Bio not provided."}
        </p>

        <div className="sm-skills">
          {(alumni.skills ? alumni.skills.split(",") : ["Mentorship"]).map(
            (skill, index) => (
              <span key={index}>{skill.trim()}</span>
            )
          )}
        </div>

        {isWritingRequest ? (
          <div className="sm-message-composer">
            <label>
              Message to alumni
              <textarea
                value={requestMessage}
                onChange={(e) => onMessageChange(e.target.value)}
                placeholder="Write why you would like guidance from this alumni."
                rows={4}
              />
            </label>

            <div className="sm-message-actions">
              <button
                type="button"
                className="sm-cancel-btn"
                onClick={onCancelRequest}
              >
                Cancel
              </button>

              <button
                type="button"
                className="sm-request-btn"
                disabled={!requestMessage.trim()}
                onClick={() => onSendRequest(alumni.id)}
              >
                <Send size={17} />
                Send Request
              </button>
            </div>
          </div>
        ) : (
          <button
            className={
              pendingForThisAlumni || acceptedForThisAlumni
                ? "sm-requested-btn"
                : "sm-request-btn"
            }
            disabled={disabled}
            onClick={() => onStartRequest(alumni.id)}
          >
            {pendingForThisAlumni || acceptedForThisAlumni ? (
              <CheckCircle size={17} />
            ) : (
              <Send size={17} />
            )}
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

export default StudentMentorship;
