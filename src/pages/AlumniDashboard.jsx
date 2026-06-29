import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Briefcase,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  User,
  Users,
  ChevronDown,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react";
import "../styles/AlumniDashboard.css";

function AlumniDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  console.log("AlumniDashboard rendered");
  
  const analytics = [
    {
      title: "Jobs Posted",
      value: "12",
      subtitle: "Active posts",
      icon: Briefcase,
    },
    {
      title: "Events Posted",
      value: "5",
      subtitle: "This month",
      icon: CalendarDays,
    },
    {
      title: "Mentees",
      value: "8",
      subtitle: "Students guided",
      icon: Users,
    },
    {
      title: "Forum Answers",
      value: "34",
      subtitle: "Answered",
      icon: MessageSquare,
    },
  ];

  const mentees = [
    {
      name: "Vijay Kumar",
      dept: "IT",
      year: "2nd Year",
      status: "Active",
      initials: "VK",
    },
    {
      name: "Sanjay Raj",
      dept: "CSE",
      year: "3rd Year",
      status: "Pending",
      initials: "SR",
    },
    {
      name: "Priya S",
      dept: "ECE",
      year: "4th Year",
      status: "Active",
      initials: "PS",
    },
  ];

  const postedJobs = [
    {
      role: "Software Engineer Intern",
      company: "Zoho Corporation",
      applicants: 24,
      status: "Active",
    },
    {
      role: "Backend Developer Intern",
      company: "Freshworks",
      applicants: 18,
      status: "Active",
    },
    {
      role: "React Developer Intern",
      company: "TCS",
      applicants: 31,
      status: "Closed",
    },
  ];

  const postedEvents = [
    {
      title: "Full Stack Development Workshop",
      registrations: 42,
      seatsLeft: 8,
      status: "OPEN",
    },
    {
      title: "Resume Building Masterclass",
      registrations: 50,
      seatsLeft: 0,
      status: "FULL",
    },
    {
      title: "Java Backend Webinar",
      registrations: 36,
      seatsLeft: 14,
      status: "OPEN",
    },
  ];

  return (
    <div className="alumni-dashboard">
      <aside className="ad-sidebar">
        <div className="ad-logo">
          <BookOpen size={34} />
        </div>

        <nav className="ad-menu">
          <a className="active">
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a onClick={() => navigate("/alumni/profile")}>
            <User size={20} />
            Profile
          </a>
          <a>
            <Users size={20} />
            Mentorship
          </a>
          <a onClick={()=>navigate("/alumni/jobs")}>
            <Briefcase size={20} />
            Jobs / Internships
          </a>
          <a onClick={()=>navigate("/alumni/events")}>
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
          <a onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </a>
        </nav>
      </aside>

      <main className="ad-main">
        <header className="ad-topbar">
          <div className="ad-search">
            <Search size={20} />
            <input placeholder="Search students, jobs, events..." />
          </div>

          <div className="ad-top-actions">
            <button className="ad-icon-btn">
              <Bell size={21} />
              <span>4</span>
            </button>

            <div className="ad-profile">
              <div className="ad-avatar">AK</div>
              <div>
                <h4>Arun Kumar</h4>
                <p>Alumni</p>
              </div>
              <ChevronDown size={18} />
            </div>

            <button className="ad-logout" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

       {/* <section className="ad-hero-row">
          <div className="ad-welcome-card">
            <div>
              <p className="ad-small-title">Welcome back,</p>
              <h1>Arun Kumar</h1>
              <p className="ad-hero-text">
                Manage mentorships, post career opportunities, organize events,
                and support students through meaningful alumni guidance.
              </p>

              <div className="ad-hero-actions">
                <button onClick={() => navigate("/alumni/jobs")}>Post Job</button>
                <button className="outline"  onClick={() => navigate("/alumni/events")}>Create Event</button>
                <button className="outline" onClick={() => navigate("/forum")}>Answer Forum</button>
              </div>
            </div>

            <div className="ad-hero-illustration">
              <Users size={130} strokeWidth={1.4} />
            </div>
          </div>

          <div className="ad-mentees-card">
            <div className="ad-card-head">
              <h3>My Mentees</h3>
              <Users size={20} />
            </div>

            <div className="ad-mentees-list">
              {mentees.map((student, index) => (
                <div className="ad-mentee-item" key={index}>
                  <div className="ad-mentee-avatar">{student.initials}</div>

                  <div className="ad-mentee-info">
                    <h4>{student.name}</h4>
                    <p>
                      {student.dept} • {student.year}
                    </p>
                  </div>

                  <span
                    className={`ad-mentee-status ${
                      student.status === "Active" ? "active" : "pending"
                    }`}
                  >
                    {student.status}
                  </span>
                </div>
              ))}
            </div>

            <button className="ad-link-btn">
              View All Mentees
              <ArrowRight size={17} />
            </button>
          </div>
        </section>*/}

        {/*<section className="ad-analytics-grid">
          {analytics.map((item, index) => {
            const Icon = item.icon;

            return (
              <div className="ad-stat-card" key={index}>
                <div className="ad-stat-icon">
                  <Icon size={25} />
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <h2>{item.value}</h2>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </section>*/}

        {/*<section className="ad-section-card">
          <div className="ad-section-head">
            <h2>Posted Jobs / Internships</h2>
            <button>View all</button>
          </div>

          <div className="ad-table">
            <div className="ad-table-head">
              <span>Job Title</span>
              <span>Company</span>
              <span>Applicants</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {postedJobs.map((job, index) => (
              <div className="ad-table-row" key={index}>
                <span>{job.role}</span>
                <span>{job.company}</span>
                <span>{job.applicants} applicants</span>

                <span
                  className={`ad-status-pill ${
                    job.status === "Active" ? "active" : "closed"
                  }`}
                >
                  {job.status}
                </span>

                <div className="ad-action-icons">
                  <button>
                    <Eye size={17} />
                  </button>
                  <button>
                    <Edit size={17} />
                  </button>
                  <button className="delete">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>*/}

        {/*<section className="ad-section-card">
          <div className="ad-section-head">
            <h2>Posted Events</h2>
            <button>View all</button>
          </div>

          <div className="ad-events-grid">
            {postedEvents.map((event, index) => (
              <div
                className={`ad-event-card ${
                  event.status === "FULL" ? "full" : ""
                }`}
                key={index}
              >
                <div className="ad-event-icon">
                  <CalendarDays size={38} />
                </div>

                <div className="ad-event-info">
                  <h3>{event.title}</h3>
                  <p>{event.registrations} registrations</p>
                  <p>{event.seatsLeft} seats left</p>
                </div>

                <div className="ad-event-action">
                  <span>{event.status}</span>
                  <button>View Students</button>
                </div>
              </div>
            ))}
          </div>
        </section>*/}
      </main>
    </div>
  );
}

export default AlumniDashboard;