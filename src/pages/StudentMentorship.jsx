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
import "../styles/StudentMentorship.css";

function StudentMentorship() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [alumniList, setAlumniList] = useState([]);
  const [mentorships, setMentorships] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    loadData(storedUser.profileId);
  }, [navigate]);

  const loadData = async (studentId) => {
    try {
      const alumniRes = await api.get("/alumni");
      setAlumniList(alumniRes.data);

      const requestRes = await api.get(`/mentorships/student/${studentId}`);
      setMentorships(requestRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const hasAcceptedMentor = mentorships.some(
    (m) => m.status === "ACCEPTED"
  );

  const hasAnyPendingRequest = mentorships.some(
    (m) => m.status === "PENDING"
  );

  const acceptedMentorship = mentorships.find(
    (m) => m.status === "ACCEPTED"
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

    try {
      await api.post("/mentorships", {
        studentId: user.profileId,
        alumniId: alumniId,
        message: "I would like to request you as my mentor.",
      });

      alert("Mentorship request sent successfully");
      loadData(user.profileId);
    } catch (error) {
      console.log(error);
      alert("Failed to send mentorship request");
    }
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
          <a onClick={() => navigate("/notifications")}>
            <Bell size={20} />
            Notifications
          </a>
          <a
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <LogOut size={20} />
            Logout
          </a>
        </nav>
      </aside>

      <main className="sm-main">
        <header className="sm-topbar">
          <div className="sm-search-top">
            <Search size={20} />
            <input placeholder="Search alumni, skills, company..." />
          </div>

          <div className="sm-top-actions">
            <button className="sm-icon-btn">
              <Bell size={21} />
              <span>3</span>
            </button>

            <div className="sm-profile">
              <div className="sm-avatar">
                {user?.name?.substring(0, 2).toUpperCase() || "ST"}
              </div>
              <div>
                <h4>{user?.name || "Student"}</h4>
                <p>Student</p>
              </div>
              <ChevronDown size={18} />
            </div>

            <button
              className="sm-logout"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
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
            <input placeholder="Search alumni by name..." />
          </div>

          <div className="sm-filter-box">
            <Building2 size={18} />
            <select>
              <option>All Companies</option>
              <option>Zoho</option>
              <option>TCS</option>
              <option>Infosys</option>
              <option>Freshworks</option>
            </select>
          </div>

          <div className="sm-filter-box">
            <Users size={18} />
            <select>
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
            {alumniList.length === 0 ? (
              <div className="sm-empty">No alumni listed.</div>
            ) : (
              alumniList.map((alumni) => (
                <AlumniCard
                  key={alumni.id}
                  alumni={alumni}
                  hasAcceptedMentor={hasAcceptedMentor}
                  hasAnyPendingRequest={hasAnyPendingRequest}
                  pendingForThisAlumni={isPendingForThisAlumni(alumni.id)}
                  acceptedForThisAlumni={isAcceptedForThisAlumni(alumni.id)}
                  onRequest={sendMentorshipRequest}
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
  onRequest,
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
            {alumni.name ? alumni.name.substring(0, 2).toUpperCase() : "AL"}
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
          Experienced alumni mentor who can guide students in career growth,
          projects and interview preparation.
        </p>

        <div className="sm-skills">
          {(alumni.skills ? alumni.skills.split(",") : ["Mentorship"]).map(
            (skill, index) => (
              <span key={index}>{skill.trim()}</span>
            )
          )}
        </div>

        <button
          className={
            pendingForThisAlumni || acceptedForThisAlumni
              ? "sm-requested-btn"
              : "sm-request-btn"
          }
          disabled={disabled}
          onClick={() => onRequest(alumni.id)}
        >
          {pendingForThisAlumni || acceptedForThisAlumni ? (
            <CheckCircle size={17} />
          ) : (
            <Send size={17} />
          )}
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default StudentMentorship;