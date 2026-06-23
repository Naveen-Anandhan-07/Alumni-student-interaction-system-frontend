import React from "react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-icon">🎓</span>
        <span>Alumni Student <span>Interaction Platform</span></span>
      </div>

      

      <div className="nav-actions">
        <button className="btn ghost">Login</button>
        <button className="btn primary">Sign Up</button>
      </div>
    </nav>
  );
}

export default Navbar;