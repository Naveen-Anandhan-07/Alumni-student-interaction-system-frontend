import React, { useState } from "react";
import "../styles/Auth.css";

function Signup() {
  const [role, setRole] = useState("STUDENT");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    year: "",
    company: "",
    designation: "",
    experience: "",
    skills: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    const requestData = {
      ...form,
      role,
    };

    console.log(requestData);
  };

  return (
    <div className="auth-page">
      <div className="auth-card signup-card">
        <div className="auth-left">
          <span className="auth-badge">Create Account</span>

          <h1>
            Join as <span>{role === "STUDENT" ? "Student" : "Alumni"}</span>
          </h1>

          <p>
            Register yourself and start exploring mentorships, events, jobs and
            meaningful alumni-student interactions.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          <h2>Sign Up</h2>

          <div className="role-switch">
            <button
              type="button"
              className={role === "STUDENT" ? "active" : ""}
              onClick={() => setRole("STUDENT")}
            >
              Student
            </button>

            <button
              type="button"
              className={role === "ALUMNI" ? "active" : ""}
              onClick={() => setRole("ALUMNI")}
            >
              Alumni
            </button>
          </div>

          <label>Name</label>
          <input
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {role === "STUDENT" ? (
            <>
              <label>Department</label>
              <input
                name="department"
                placeholder="Example: IT"
                value={form.department}
                onChange={handleChange}
              />

              <label>Year</label>
              <input
                name="year"
                placeholder="Example: 2"
                value={form.year}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <label>Company</label>
              <input
                name="company"
                placeholder="Example: Zoho"
                value={form.company}
                onChange={handleChange}
              />

              <label>Designation</label>
              <input
                name="designation"
                placeholder="Example: Software Engineer"
                value={form.designation}
                onChange={handleChange}
              />

              <label>Experience</label>
              <input
                name="experience"
                placeholder="Example: 3"
                value={form.experience}
                onChange={handleChange}
              />
            </>
          )}

          <label>Skills</label>
          <input
            name="skills"
            placeholder="Java, Spring Boot, React"
            value={form.skills}
            onChange={handleChange}
          />

          <button className="auth-btn" type="submit">
            Create Account
          </button>

          <p className="auth-link">
            Already have an account? <span>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;