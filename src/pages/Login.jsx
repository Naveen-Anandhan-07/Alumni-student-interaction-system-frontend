import React, { useState } from "react";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", form);

    localStorage.setItem("user", JSON.stringify(res.data));

    if (res.data.role === "STUDENT") {
      navigate("/student/dashboard");
    } else {
      navigate("/alumni/dashboard");
    }
  } catch (error) {
    alert("Invalid email or password");
    console.log(error);
  }
};

const signUp = () =>{
  navigate("/signup");
}
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <span className="auth-badge">Welcome Back</span>

          <h1>
            Login to your <span>Account</span>
          </h1>

          <p>
            Continue your journey with alumni mentorship, events, jobs and forum
            discussions.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Login</h2>

          <label>Email Address</label>
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
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="auth-btn" type="submit">
            Login
          </button>

          <p className="auth-link">
            Don't have an account? <span onClick={signUp}>Sign Up</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;