import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Briefcase,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  User,
  Users,
  Search,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Bookmark,
} from "lucide-react";
import "../styles/StudentDashboard.css";


function StudentDashboard() {
  const navigate = new useNavigate();
  const analytics = [
    {
      title: "Mentorship Requests",
      value: "3",
      subtitle: "Pending",
      icon: Users,
    },
    {
      title: "Applied Jobs",
      value: "6",
      subtitle: "Applications",
      icon: Briefcase,
    },
    {
      title: "Registered Events",
      value: "2",
      subtitle: "Upcoming",
      icon: CalendarDays,
    },
    {
      title: "Forum Questions",
      value: "9",
      subtitle: "Asked",
      icon: MessageSquare,
    },
  ];

  const appliedJobs = [
    {
      company: "Zoho Corporation",
      logo: "ZO",
      role: "Software Engineer Intern",
      appliedOn: "15 June 2024",
      status: "Under Review",
      statusClass: "review",
      canCancel: true,
    },
    {
      company: "Infosys",
      logo: "IN",
      role: "Backend Developer Intern",
      appliedOn: "10 June 2024",
      status: "Applied",
      statusClass: "applied",
      canCancel: true,
    },
    {
      company: "TCS",
      logo: "TC",
      role: "Frontend Developer Intern",
      appliedOn: "05 June 2024",
      status: "Shortlisted",
      statusClass: "shortlisted",
      canCancel: false,
    },
  ];

  const recommendedEvents = [
    {
      title: "Full Stack Development Workshop",
      date: "25 June 2024",
      time: "11:00 AM",
      match: "95%",
      status: "OPEN",
    },
    {
      title: "AI in Software Engineering Webinar",
      date: "30 June 2024",
      time: "04:00 PM",
      match: "88%",
      status: "OPEN",
    },
    {
      title: "Resume Building Masterclass",
      date: "02 July 2024",
      time: "10:00 AM",
      match: "72%",
      status: "FULL",
    },
  ];

  return (
    <div className="student-dashboard">
      <aside className="sd-sidebar">
        <div className="sd-logo">
          <BookOpen size={34} />
        </div>

        <nav className="sd-menu">
          <a className="active">
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a>
            <User size={20} />
            Profile
          </a>
          <a>
            <Users size={20} />
            Mentorship
          </a>
          <a onClick={()=>navigate("/student/jobs")}>
            <Briefcase size={20} />
            Jobs / Internships
          </a>
          <a onClick={() => navigate("/student/events")}>
            <CalendarDays size={20} />
            Events
          </a>
          <a>
            <MessageSquare size={20} />
            Forum
          </a>
          <a>
            <Bell size={20} />
            Notifications
          </a>
          <a>
            <LogOut size={20} />
            Logout
          </a>
        </nav>
      </aside>

      <main className="sd-main">
        <header className="sd-topbar">
          <div className="sd-search">
            <Search size={20} />
            <input placeholder="Search for jobs, events, mentors..." />
          </div>

          <div className="sd-top-actions">
            <button className="sd-icon-btn">
              <Bell size={21} />
              <span>3</span>
            </button>

            <div className="sd-profile">
              <div className="sd-avatar">VK</div>
              <div>
                <h4>Vijay Kumar</h4>
                <p>Student</p>
              </div>
              <ChevronDown size={18} />
            </div>

            <button className="sd-logout">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="sd-hero-row">
          <div className="sd-welcome-card">
            <div>
              <p className="sd-small-title">Welcome back,</p>
              <h1>Vijay Kumar</h1>
              <p className="sd-hero-text">
                Continue your learning journey, explore opportunities, connect
                with alumni, and grow professionally.
              </p>

              <div className="sd-hero-actions">
                <button>Browse Jobs</button>
                <button className="outline">Find Mentor</button>
                <button className="outline">Explore Events</button>
              </div>
            </div>

            <div className="sd-hero-illustration">
              <BookOpen size={130} strokeWidth={1.4} />
            </div>
          </div>

          <div className="sd-mentor-card">
            <div className="sd-card-head">
              <h3>Mentorship Status</h3>
              <Bookmark size={20} />
            </div>

            <div className="sd-mentor-body">
              <div className="sd-mentor-img">RS</div>

              <div>
                <h4>Rahul Sharma</h4>
                <p>Senior Software Engineer</p>
                <p>Zoho Corporation</p>
              </div>
            </div>

            <div className="sd-mentor-status">
              <p>Status</p>
              <span className="pending">Pending</span>
            </div>

            <div className="sd-requested">
              <p>Requested on</p>
              <strong>20 June 2024</strong>
            </div>

            <button className="sd-link-btn">
              View Details
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <section className="sd-analytics-grid">
          {analytics.map((item, index) => {
            const Icon = item.icon;
            return (
              <div className="sd-stat-card" key={index}>
                <div className="sd-stat-icon">
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
        </section>

        <section className="sd-section-card">
          <div className="sd-section-head">
            <h2>Applied Jobs / Internships</h2>
            <button>View all</button>
          </div>

          <div className="sd-table">
            <div className="sd-table-head">
              <span>Company</span>
              <span>Job Title</span>
              <span>Applied On</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {appliedJobs.map((job, index) => (
              <div className="sd-table-row" key={index}>
                <div className="company-cell">
                  <div className="company-logo">{job.logo}</div>
                  <span>{job.company}</span>
                </div>

                <span>{job.role}</span>
                <span>{job.appliedOn}</span>

                <span className={`status-pill ${job.statusClass}`}>
                  {job.status}
                </span>

                {job.canCancel ? (
                  <button className="cancel-btn">Cancel Application</button>
                ) : (
                  <span className="dash-symbol">—</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="sd-section-card">
          <div className="sd-section-head">
            <h2>Recommended Events</h2>
            <button>View all</button>
          </div>

          <div className="sd-events-grid">
            {recommendedEvents.map((event, index) => (
              <div
                className={`sd-event-card ${event.status === "FULL" ? "full" : ""
                  }`}
                key={index}
              >
                <div className="event-image">
                  <CalendarDays size={42} />
                </div>

                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p>{event.date}</p>
                  <p>{event.time}</p>
                </div>

                <div className="event-action">
                  <span>
                    Skill Match
                    <strong>{event.match}</strong>
                  </span>

                  {event.status === "FULL" ? (
                    <button className="full-btn">Full</button>
                  ) : (
                    <button className="register-btn">Register</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;