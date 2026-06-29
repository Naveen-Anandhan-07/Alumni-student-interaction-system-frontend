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
  MapPin,
  Search,
  User,
  Users,
  MessageSquare,
  XCircle,
} from "lucide-react";
import api from "../services/api";
import "../styles/StudentJobs.css";
import { useNavigate } from "react-router-dom";

function StudentJobs() {
  const studentId = 1;
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const loadJobs = async () => {
    try {
      const jobsRes = await api.get("/jobs");
      setJobs(jobsRes.data);

      const appRes = await api.get(`/jobs/student/${studentId}/applications`);
      setApplications(appRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const applyJob = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply/${studentId}`);
      alert("Applied successfully");
      loadJobs();
    } catch (error) {
      alert("Application failed");
      console.log(error);
    }
  };

  const cancelApplication = async (applicationId) => {
    try {
      await api.put(`/jobs/applications/${applicationId}/cancel`);
      alert("Application cancelled");
      loadJobs();
    } catch (error) {
      alert("Cancel failed");
      console.log(error);
    }
  };

  return (
    <div className="student-jobs-layout">
      <aside className="sj-sidebar">
        <div className="sj-logo">
          <BookOpen size={34} />
        </div>

        <nav className="sj-menu">
          <a onClick={() => navigate("/student/dashboard")}>
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a onClick={() => navigate("/student/profile")}>
            <User size={20} />
            Profile
          </a>
          <a>
            <Users size={20} />
            Mentorship
          </a>
          <a className="active">
            <Briefcase size={20} />
            Jobs / Internships
          </a>
          <a onClick={() => navigate("/student/events")}>
            <CalendarDays size={20} />
            Events
          </a>
          <a  onClick={() => navigate("/forum")}>
            <MessageSquare size={20} />
            Forum
          </a>
          <a onClick={() => navigate("/notifications")}>
            <Bell size={20} />
            Notifications
          </a>
          <a onClick={() => { localStorage.clear(); navigate("/login");}}>
            <LogOut size={20} />
            Logout
          </a>
        </nav>
      </aside>

      <main className="sj-main">
        <header className="sj-topbar">
          <div className="sj-search-top">
            <Search size={20} />
            <input placeholder="Search jobs, internships, companies..." />
          </div>

          <div className="sj-top-actions">
            <button className="sj-icon-btn">
              <Bell size={21} />
              <span>3</span>
            </button>

            <div className="sj-profile">
              <div className="sj-avatar">VK</div>
              <div>
                <h4>Vijay Kumar</h4>
                <p>Student</p>
              </div>
              <ChevronDown size={18} />
            </div>

            <button className="sj-logout">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="sj-filter-card">
          <div className="sj-search-box">
            <Search size={20} />
            <input placeholder="Search job title..." />
          </div>

          <div className="sj-filter-box">
            <Briefcase size={18} />
            <select>
              <option>All Types</option>
              <option>Internship</option>
              <option>Full Time</option>
              <option>Part Time</option>
            </select>
          </div>

          <div className="sj-filter-box">
            <MapPin size={18} />
            <select>
              <option>All Locations</option>
              <option>Chennai</option>
              <option>Bangalore</option>
              <option>Remote</option>
            </select>
          </div>
        </section>

        <section className="sj-section">
          <div className="sj-section-head">
            <div>
              <h2>Applied Jobs / Internships</h2>
              <p>Track your applications and cancel if needed.</p>
            </div>
          </div>

          <div className="sj-applications-list">
            {applications.length === 0 ? (
              <div className="sj-empty">No applications yet.</div>
            ) : (
              applications.map((app) => (
                <div className="sj-application-row" key={app.applicationId}>
                  <div>
                    <h3>{app.jobTitle}</h3>
                    <p>
                      {app.company} • {app.location} • {app.jobType}
                    </p>
                  </div>

                  <span className={`sj-status ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>

                  {app.status !== "CANCELLED" ? (
                    <button
                      className="sj-cancel-btn"
                      onClick={() => cancelApplication(app.applicationId)}
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  ) : (
                    <span className="sj-muted">—</span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="sj-section">
          <div className="sj-section-head">
            <div>
              <h2>All Jobs / Internships</h2>
              <p>Browse opportunities posted by alumni.</p>
            </div>
          </div>

          <div className="sj-jobs-grid">
            {jobs.length === 0 ? (
              <div className="sj-empty">No jobs listed.</div>
            ) : (
              jobs.map((job) => (
                <JobCard key={job.id} job={job} onApply={applyJob} />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function JobCard({ job, onApply }) {
  return (
    <div className="sj-job-card">
      <div className="sj-job-icon">
        <Building2 size={42} />
      </div>

      <div className="sj-job-body">
        <h3>{job.title}</h3>
        <p className="sj-company">{job.company}</p>

        <p className="sj-desc">{job.description}</p>

        <div className="sj-job-meta">
          <span>
            <MapPin size={15} />
            {job.location}
          </span>

          <span>
            <Briefcase size={15} />
            {job.jobType}
          </span>
        </div>

        <div className="sj-skills">{job.skillsRequired}</div>

        <button onClick={() => onApply(job.id)}>Apply Now</button>
      </div>
    </div>
  );
}

export default StudentJobs;