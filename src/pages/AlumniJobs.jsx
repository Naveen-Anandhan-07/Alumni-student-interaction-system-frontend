import React, { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronDown,
  Eye,
  Filter,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import api from "../services/api";
import "../styles/AlumniJobs.css";

function AlumniJobs() {
  const alumniId = 1;

  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [showApplicants, setShowApplicants] = useState(false);

  const [jobForm, setJobForm] = useState({
    alumniId: alumniId,
    title: "",
    company: "",
    description: "",
    location: "",
    jobType: "Internship",
    skillsRequired: "",
  });

  const loadJobs = async () => {
    try {
      const allRes = await api.get("/jobs");
      setJobs(allRes.data);

      const myRes = await api.get(`/jobs/alumni/${alumniId}`);
      setMyJobs(myRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleChange = (e) => {
    setJobForm({
      ...jobForm,
      [e.target.name]: e.target.value,
    });
  };

  const postJob = async (e) => {
    e.preventDefault();

    try {
      await api.post("/jobs", jobForm);

      alert("Job posted successfully");

      setShowForm(false);

      setJobForm({
        alumniId: alumniId,
        title: "",
        company: "",
        description: "",
        location: "",
        jobType: "Internship",
        skillsRequired: "",
      });

      loadJobs();
    } catch (error) {
      console.log(error);
      alert("Failed to post job");
    }
  };

  const viewApplicants = async (jobId) => {
    try {
      const res = await api.get(`/jobs/${jobId}/applications`);
      setApplicants(res.data);
      setShowApplicants(true);
    } catch (error) {
      console.log(error);
      alert("Failed to load applicants");
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await api.put(`/jobs/applications/${applicationId}/status?status=${status}`);
      alert("Status updated");

      const updated = applicants.map((app) =>
        app.applicationId === applicationId ? { ...app, status } : app
      );

      setApplicants(updated);
    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="alumni-jobs-layout">
      <aside className="aj-sidebar">
        <div className="aj-logo">
          <BookOpen size={34} />
        </div>

        <nav className="aj-menu">
          <a>
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
          <a className="active">
            <Briefcase size={20} />
            Jobs / Internships
          </a>
          <a>
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

      <main className="aj-main">
        <header className="aj-topbar">
          <div className="aj-search-top">
            <Search size={20} />
            <input placeholder="Search jobs, applicants, companies..." />
          </div>

          <div className="aj-top-actions">
            <button className="aj-icon-btn">
              <Bell size={21} />
              <span>4</span>
            </button>

            <div className="aj-profile">
              <div className="aj-avatar">AK</div>
              <div>
                <h4>Arun Kumar</h4>
                <p>Alumni</p>
              </div>
              <ChevronDown size={18} />
            </div>

            <button className="aj-logout">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="aj-page-head">
          <div>
            <p>Alumni Jobs</p>
            <h1>Manage job and internship posts</h1>
            <span>
              Post opportunities, view student applications, and update
              application status.
            </span>
          </div>

          <button className="aj-post-btn" onClick={() => setShowForm(true)}>
            <Plus size={19} />
            Post Job
          </button>
        </section>

        <section className="aj-filter-card">
          <div className="aj-search-box">
            <Search size={20} />
            <input placeholder="Search job title..." />
          </div>

          <div className="aj-filter-box">
            <Filter size={18} />
            <select>
              <option>All Types</option>
              <option>Internship</option>
              <option>Full Time</option>
              <option>Part Time</option>
            </select>
          </div>

          <div className="aj-filter-box">
            <MapPin size={18} />
            <select>
              <option>All Locations</option>
              <option>Chennai</option>
              <option>Bangalore</option>
              <option>Remote</option>
            </select>
          </div>
        </section>

        <section className="aj-section">
          <div className="aj-section-head">
            <div>
              <h2>My Posted Jobs / Internships</h2>
              <p>Opportunities posted by you for students.</p>
            </div>
          </div>

          <div className="aj-jobs-grid">
            {myJobs.length === 0 ? (
              <div className="aj-empty">No jobs posted yet.</div>
            ) : (
              myJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  own
                  onViewApplicants={viewApplicants}
                />
              ))
            )}
          </div>
        </section>

        <section className="aj-section">
          <div className="aj-section-head">
            <div>
              <h2>All Jobs / Internships</h2>
              <p>View opportunities posted by all alumni.</p>
            </div>
          </div>

          <div className="aj-jobs-grid">
            {jobs.length === 0 ? (
              <div className="aj-empty">No jobs listed.</div>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewApplicants={viewApplicants}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {showForm && (
        <div className="aj-modal-overlay">
          <div className="aj-modal">
            <div className="aj-modal-head">
              <div>
                <h2>Post New Job</h2>
                <p>Fill job or internship details for students to apply.</p>
              </div>

              <button onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="aj-job-form" onSubmit={postJob}>
              <div className="aj-form-group full">
                <label>Job Title</label>
                <input
                  name="title"
                  value={jobForm.title}
                  onChange={handleChange}
                  placeholder="Example: Java Backend Intern"
                  required
                />
              </div>

              <div className="aj-form-group">
                <label>Company</label>
                <input
                  name="company"
                  value={jobForm.company}
                  onChange={handleChange}
                  placeholder="Example: Zoho"
                  required
                />
              </div>

              <div className="aj-form-group">
                <label>Location</label>
                <input
                  name="location"
                  value={jobForm.location}
                  onChange={handleChange}
                  placeholder="Example: Chennai"
                  required
                />
              </div>

              <div className="aj-form-group">
                <label>Job Type</label>
                <select
                  name="jobType"
                  value={jobForm.jobType}
                  onChange={handleChange}
                >
                  <option>Internship</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                </select>
              </div>

              <div className="aj-form-group">
                <label>Required Skills</label>
                <input
                  name="skillsRequired"
                  value={jobForm.skillsRequired}
                  onChange={handleChange}
                  placeholder="Java, Spring Boot, PostgreSQL"
                />
              </div>

              <div className="aj-form-group full">
                <label>Description</label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleChange}
                  placeholder="Write job description"
                  required
                ></textarea>
              </div>

              <div className="aj-form-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit">Post Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showApplicants && (
        <div className="aj-modal-overlay">
          <div className="aj-modal applicants-modal">
            <div className="aj-modal-head">
              <div>
                <h2>Applicants</h2>
                <p>View and update student application status.</p>
              </div>

              <button onClick={() => setShowApplicants(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="aj-applicants-list">
              {applicants.length === 0 ? (
                <div className="aj-empty">No applicants yet.</div>
              ) : (
                applicants.map((app) => (
                  <div className="aj-applicant-row" key={app.applicationId}>
                    <div>
                      <h3>{app.studentName}</h3>
                      <p>
                        {app.jobTitle} • {app.company}
                      </p>
                    </div>

                    <span className={`aj-status ${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>

                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateStatus(app.applicationId, e.target.value)
                      }
                    >
                      <option>APPLIED</option>
                      <option>UNDER_REVIEW</option>
                      <option>SHORTLISTED</option>
                      <option>REJECTED</option>
                      <option>CANCELLED</option>
                    </select>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, own, onViewApplicants }) {
  return (
    <div className="aj-job-card">
      <div className="aj-job-icon">
        <Building2 size={42} />
      </div>

      <div className="aj-job-body">
        <h3>{job.title}</h3>
        <p className="aj-company">{job.company}</p>

        <p className="aj-desc">{job.description}</p>

        <div className="aj-job-meta">
          <span>
            <MapPin size={15} />
            {job.location}
          </span>

          <span>
            <Briefcase size={15} />
            {job.jobType}
          </span>
        </div>

        <div className="aj-skills">{job.skillsRequired}</div>

        <div className="aj-job-footer">
          <span>{job.appliedCount} applicants</span>

          <button onClick={() => onViewApplicants(job.id)}>
            <Eye size={16} />
            {own ? "View Applicants" : "View Details"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlumniJobs;