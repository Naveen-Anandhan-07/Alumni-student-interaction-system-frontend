import React from "react";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import StatCard from "../components/StatCard";
import heroImage from "../assets/hero-graduation.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handlesignUp= ()=>{
    navigate("/signup");
  }
  return (
    <div className="home-page">
      <Navbar />

      <section className="hero-section">
        <div className="hero-content">
          <p className="badge">AI Powered Alumni Student Platform</p>

          <h1>
            Connect <span>Students</span> with
            <br />
            Successful <span>Alumni</span>
          </h1>

          <p className="hero-text">
            A smart platform where students discover mentors, events, jobs,
            forum discussions and career opportunities from verified alumni.
          </p>

          <div className="hero-buttons">
            <button className="btn primary large" onClick={handlesignUp}>Get Started →</button>
            {/*<button className="btn ghost large">Explore Features</button>*/}
          </div>

          <div className="mini-info">
            
            <p>Trusted by students and alumni for career growth</p>
          </div>
        </div>

        <div className="hero-visual">
          <div className="image-glow"></div>
          <img src={heroImage} alt="Graduation illustration" />

          
        </div>
      </section>

      <section className="features-grid">
        <FeatureCard
          icon="🤝"
          title="Mentorship"
          text="Students can request mentorship and alumni can guide them."
        />
        <FeatureCard
          icon="💼"
          title="Jobs"
          text="Alumni can post job opportunities for students."
        />
        <FeatureCard
          icon="📅"
          title="Events"
          text="Skill-based event recommendation and registration."
        />
        <FeatureCard
          icon="💬"
          title="Forum"
          text="Students ask questions and alumni answer them."
        />
      </section>

      <section className="how-section">
        <h2>
          How It <span>Works</span>
        </h2>
        <p>Start your journey in a few simple steps</p>

        <div className="steps">
          <div className="step-card">
            <span>01</span>
            <h3>Create Account</h3>
            <p>Register as a student or alumni.</p>
          </div>

          <div className="step-card">
            <span>02</span>
            <h3>Explore Dashboard</h3>
            <p>Access mentorship, events, jobs and forum.</p>
          </div>

          <div className="step-card">
            <span>03</span>
            <h3>Connect & Grow</h3>
            <p>Build career connections and opportunities.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;