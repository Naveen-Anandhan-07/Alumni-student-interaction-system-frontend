import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate= useNavigate();

    const handlesignUp= ()=>{
    navigate("/signup");
  }

  const handleLogin= ()=>{
    navigate("/login");
  }
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-icon">🎓</span>
        <span>Alumni Student <span>Interaction Platform</span></span>
      </div>

      

      <div className="nav-actions">
        <button className="btn ghost" onClick={handleLogin}>Login</button>
        <button className="btn primary" onClick={handlesignUp}>Sign Up</button>
      </div>
    </nav>
  );
}

export default Navbar;