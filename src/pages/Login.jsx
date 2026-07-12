import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, GraduationCap } from "lucide-react";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      window.dispatchEvent(new Event("auth-changed"));
      navigate(res.data.role === "STUDENT" ? "/student/dashboard" : "/alumni/dashboard");
    } catch (error) {
      alert("Invalid email or password");
      console.log(error);
    }
  };

  return (
    <div className="auth-page">
      <button className="auth-back" onClick={() => navigate("/")}><ArrowLeft size={18} /> Back to home</button>
      <div className="auth-shell">
        <aside className="auth-story">
          <div className="auth-brand"><span><GraduationCap size={26} /></span> AlumniConnect</div>
          <div className="auth-story-copy"><span className="auth-kicker">Welcome back</span><h1>Keep building your <em>future.</em></h1><p>Your mentors, opportunities and community are waiting right where you left them.</p></div>
          <div className="auth-quote">“The right conversation can change the direction of a career.”</div>
        </aside>
        <section className="auth-panel">
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-heading"><span>Sign in</span><h2>Welcome back</h2><p>Enter your details to continue to your dashboard.</p></div>
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <label htmlFor="login-password">Password</label>
            <div className="password-field"><input id="login-password" type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div>
            <button className="auth-btn" type="submit">Sign in <ArrowRight size={18} /></button>
            <p className="auth-link">New to AlumniConnect? <button type="button" onClick={() => navigate("/signup")}>Create an account</button></p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;
