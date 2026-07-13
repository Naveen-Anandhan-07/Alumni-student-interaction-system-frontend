import { ArrowRight, BriefcaseBusiness, CalendarDays, Check, MessageCircle, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import heroImage from "../assets/hero-graduation.png";
import { PROJECT_VERSION } from "../version";

const features = [
  { icon: UsersRound, title: "Meaningful mentorship", text: "Find alumni whose experience matches your goals and learn directly from them." },
  { icon: BriefcaseBusiness, title: "Career opportunities", text: "Discover internships and jobs shared by people who know your institution." },
  { icon: CalendarDays, title: "Events that matter", text: "Join workshops, meetups and sessions built around real career outcomes." },
  { icon: MessageCircle, title: "A trusted community", text: "Ask questions, exchange ideas and build relationships that last beyond campus." },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="eyebrow"><span /> Your network starts here</div>
            <h1>Where ambition meets <em>experience.</em></h1>
            <p className="hero-text">A focused community where students find guidance and alumni create real impact—through mentorship, opportunity and shared knowledge.</p>
            <div className="hero-buttons">
              <button className="btn primary large" onClick={() => navigate("/signup")}>Join the community <ArrowRight size={18} /></button>
              <button className="btn ghost large" onClick={() => navigate("/login")}>I already have an account</button>
            </div>
            <div className="hero-proof">
              <span><Check size={15} /> Free to join</span>
              <span><Check size={15} /> Built for students & alumni</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-frame">
              <img src={heroImage} alt="Graduates celebrating their achievement" />
            </div>
            <div className="floating-note note-top"><strong>One community</strong><span>Endless possibilities</span></div>
            <div className="floating-note note-bottom"><div className="note-icon"><UsersRound size={22} /></div><div><strong>Connect & grow</strong><span>With people who understand</span></div></div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-intro">
            <div><span className="section-kicker">Everything in one place</span><h2>Built for the next step in your journey.</h2></div>
            <p>From the first question to the first job, the platform brings the right people and opportunities closer.</p>
          </div>
          <div className="features-grid">
            {features.map(({ icon: Icon, title, text }, index) => (
              <article className="feature-card" key={title}>
                <div className="feature-number">0{index + 1}</div>
                <div className="feature-icon"><Icon size={23} /></div>
                <h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-cta">
          <div><span className="section-kicker light">Your next chapter</span><h2>Build the connection that changes everything.</h2></div>
          <button className="btn cta-button" onClick={() => navigate("/signup")}>Create your account <ArrowRight size={18} /></button>
        </section>
      </main>
      <footer className="home-footer">
        <span>Alumni Student Interaction Platform · v{PROJECT_VERSION}</span>
        <span>Connect. Learn. Grow.</span>
      </footer>
    </div>
  );
}

export default Home;
