import React from "react";

function FeatureCard({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="arrow">→</span>
    </div>
  );
}

export default FeatureCard;