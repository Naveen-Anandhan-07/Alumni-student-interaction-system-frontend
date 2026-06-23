import React from "react";

function StatCard({ icon, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <h2>{value}</h2>
        <p>{label}</p>
      </div>
    </div>
  );
}

export default StatCard;