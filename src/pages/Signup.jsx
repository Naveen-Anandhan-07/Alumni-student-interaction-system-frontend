import { useState } from "react";
import { toast } from "../utils/toast";
import { ArrowLeft, ArrowRight, Eye, EyeOff, GraduationCap } from "lucide-react";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Signup() {
  const [role, setRole] = useState("STUDENT");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "", year: "", company: "", designation: "", experience: "", skills: "" });
  const navigate = useNavigate();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    const requestData = { ...form, role, year: form.year ? Number(form.year) : null, experience: form.experience ? Number(form.experience) : null };
    try {
      const res = await api.post("/auth/signup", requestData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      window.dispatchEvent(new Event("auth-changed"));
      navigate(res.data.role === "STUDENT" ? "/student/dashboard" : "/alumni/dashboard");
    } catch (error) {
      toast("Signup failed");
      console.log(error);
    }
  };

  return (
    <div className="auth-page signup-page">
      <button className="auth-back" onClick={() => navigate("/")}><ArrowLeft size={18} /> Back to home</button>
      <div className="auth-shell signup-shell">
        <aside className="auth-story">
          <div className="auth-brand"><span><GraduationCap size={26} /></span> AlumniConnect</div>
          <div className="auth-story-copy"><span className="auth-kicker">Join the community</span><h1>Your next opportunity starts with a <em>connection.</em></h1><p>Create your profile and become part of a community that learns, shares and grows together.</p></div>
          <div className="auth-steps"><span className="active">01</span><i /><span>02</span><i /><span>03</span><small>Profile</small><small>Connect</small><small>Grow</small></div>
        </aside>
        <section className="auth-panel signup-panel">
          <form className="auth-form signup-form" onSubmit={handleSignup}>
            <div className="form-heading"><span>Create account</span><h2>Tell us about yourself</h2><p>Choose your role and complete your profile.</p></div>
            <div className="role-switch" aria-label="Choose account role">
              <button type="button" className={role === "STUDENT" ? "active" : ""} onClick={() => setRole("STUDENT")}><span>Student</span><small>I want to learn and grow</small></button>
              <button type="button" className={role === "ALUMNI" ? "active" : ""} onClick={() => setRole("ALUMNI")}><span>Alumni</span><small>I want to guide and give back</small></button>
            </div>
            <div className="form-grid">
              <div className="field full"><label htmlFor="name">Full name</label><input id="name" name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} required /></div>
              <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required /></div>
              <div className="field"><label htmlFor="password">Password</label><div className="password-field"><input id="password" type={showPassword ? "text" : "password"} name="password" placeholder="Create a password" value={form.password} onChange={handleChange} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></div>
              {role === "STUDENT" ? <><div className="field"><label htmlFor="department">Department</label><input id="department" name="department" placeholder="e.g. Information Technology" value={form.department} onChange={handleChange} /></div><div className="field"><label htmlFor="year">Year of study</label><input id="year" type="number" min="1" name="year" placeholder="e.g. 2" value={form.year} onChange={handleChange} /></div></> : <><div className="field"><label htmlFor="company">Company</label><input id="company" name="company" placeholder="Where do you work?" value={form.company} onChange={handleChange} /></div><div className="field"><label htmlFor="designation">Designation</label><input id="designation" name="designation" placeholder="e.g. Software Engineer" value={form.designation} onChange={handleChange} /></div><div className="field"><label htmlFor="experience">Experience (years)</label><input id="experience" type="number" min="0" name="experience" placeholder="e.g. 3" value={form.experience} onChange={handleChange} /></div></>}
              <div className={`field ${role === "STUDENT" ? "full" : ""}`}><label htmlFor="skills">Skills</label><input id="skills" name="skills" placeholder="React, Java, Product Design..." value={form.skills} onChange={handleChange} /></div>
            </div>
            <button className="auth-btn" type="submit">Create my account <ArrowRight size={18} /></button>
            <p className="auth-link">Already have an account? <button type="button" onClick={() => navigate("/login")}>Sign in</button></p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Signup;
