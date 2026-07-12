import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <button className="brand" onClick={() => navigate("/")} aria-label="Go to homepage">
        <span className="brand-icon"><GraduationCap size={25} /></span>
        <span>Alumni<span>Connect</span></span>
      </button>
      <div className="nav-message">A community built around your future.</div>
      <div className="nav-actions">
        <button className="btn nav-login" onClick={() => navigate("/login")}>Log in</button>
        <button className="btn primary" onClick={() => navigate("/signup")}>Create account</button>
      </div>
    </nav>
  );
}

export default Navbar;
