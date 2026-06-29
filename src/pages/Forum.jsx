import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  Send,
  ThumbsUp,
  User,
  Users,
} from "lucide-react";
import api from "../services/api";
import "../styles/Forum.css";

function Forum() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [questionForm, setQuestionForm] = useState({ title: "", description: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    fetchQuestions();
  }, [navigate]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get("/forum/questions");
      setQuestions(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load forum questions");
    }
  };

  const handleSearch = async () => {
    try {
      if (search.trim() === "") {
        fetchQuestions();
        return;
      }

      const res = await api.get(`/forum/questions/search?keyword=${search}`);
      setQuestions(res.data);
    } catch (error) {
      console.log(error);
      alert("Search failed");
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();

    if (user.role !== "STUDENT") {
      alert("Only students can ask questions");
      return;
    }

    try {
      await api.post("/forum/questions", {
        studentId: user.profileId,
        title: questionForm.title,
        description: questionForm.description,
      });

      setQuestionForm({ title: "", description: "" });
      fetchQuestions();
      alert("Question posted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to post question");
    }
  };

  const handleLike = async (questionId) => {
    try {
      if (user.role === "STUDENT") {
        await api.post(`/forum/questions/${questionId}/like/student/${user.profileId}`);
      } else {
        await api.post(`/forum/questions/${questionId}/like/alumni/${user.profileId}`);
      }

      fetchQuestions();
    } catch (error) {
      console.log(error);
      alert(error.response?.data || "Already liked or like failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const profilePath = user?.role === "STUDENT" ? "/student/profile" : "/alumni/profile";
  const dashboardPath = user?.role === "STUDENT" ? "/student/dashboard" : "/alumni/dashboard";
  const eventsPath = user?.role === "STUDENT" ? "/student/events" : "/alumni/events";
  const jobsPath = user?.role === "STUDENT" ? "/student/jobs" : "/alumni/jobs";

  return (
    <div className="forum-layout-page">
      <aside className="fm-sidebar">
        <div className="fm-logo">
          <BookOpen size={34} />
        </div>

        <nav className="fm-menu">
          <a onClick={() => navigate(dashboardPath)}>
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a onClick={() => navigate(profilePath)}>
            <User size={20} />
            Profile
          </a>
          <a>
            <Users size={20} />
            Mentorship
          </a>
          <a onClick={() => navigate(jobsPath)}>
            <Briefcase size={20} />
            Jobs / Internships
          </a>
          <a onClick={() => navigate(eventsPath)}>
            <CalendarDays size={20} />
            Events
          </a>
          <a className="active">
            <MessageSquare size={20} />
            Forum
          </a>
          <a onClick={() => navigate("/notifications")}>
            <Bell size={20} />
            Notifications
          </a>
          <a onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </a>
        </nav>
      </aside>

      <main className="fm-main">
        <header className="fm-topbar">
          <div className="fm-search-top">
            <Search size={20} />
            <input
              placeholder="Search questions, answers, topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div className="fm-top-actions">
            <button className="fm-icon-btn" onClick={() => navigate("/notifications")}>
              <Bell size={21} />
              <span>0</span>
            </button>

            <div className="fm-profile">
              <div className="fm-avatar">{initials || "U"}</div>
              <div>
                <h4>{user?.name || "User"}</h4>
                <p>{user?.role}</p>
              </div>
              <ChevronDown size={18} />
            </div>

            <button className="fm-logout" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="fm-page-head">
          <div>
            <p>Forum / Q&A</p>
            <h1>Ask, Answer & Grow</h1>
            <span>
              Students can ask doubts, and alumni can share practical answers,
              placement guidance, and career advice.
            </span>
          </div>

          <button className="fm-refresh-btn" onClick={fetchQuestions}>
            Refresh
          </button>
        </section>

        <section className="fm-filter-card">
          <div className="fm-search-box">
            <Search size={20} />
            <input
              placeholder="Search by question title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button onClick={handleSearch}>Search</button>
          <button onClick={fetchQuestions}>Show All</button>
        </section>

        {user?.role === "STUDENT" && (
          <section className="fm-question-form-card">
            <div className="fm-section-head">
              <h2>Ask a Question</h2>
              <p>Post your doubt so alumni can help you.</p>
            </div>

            <form className="fm-question-form" onSubmit={handleCreateQuestion}>
              <input
                placeholder="Question title"
                value={questionForm.title}
                onChange={(e) =>
                  setQuestionForm({ ...questionForm, title: e.target.value })
                }
                required
              />

              <textarea
                placeholder="Explain your question..."
                value={questionForm.description}
                onChange={(e) =>
                  setQuestionForm({ ...questionForm, description: e.target.value })
                }
                required
              />

              <button type="submit">
                <Send size={17} />
                Post Question
              </button>
            </form>
          </section>
        )}

        <section className="fm-content-grid single">
          <div className="fm-section">
            <div className="fm-section-head">
              <h2>Forum Questions</h2>
              <p>Browse questions posted by students.</p>
            </div>

            <div className="fm-questions-list">
              {questions.length === 0 ? (
                <div className="fm-empty">No questions found.</div>
              ) : (
                questions.map((q) => (
                  <div className="fm-question-card"
                    key={q.id}
                  >
                    <div className="fm-question-top">
                      <h3>{q.title}</h3>
                      <span
                        className={`fm-status ${
                          q.status === "ANSWERED" ? "answered" : "open"
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>

                    <p>{q.description}</p>

                    <div className="fm-question-meta">
                      <span>Student ID: {q.studentId}</span>
                      <span>❤️ {q.likeCount}</span>
                    </div>

                    <div className="fm-question-actions">
                      <button onClick={() => handleLike(q.id)}>
                        <ThumbsUp size={16} />
                        Like
                      </button>
                      <button  onClick={() => navigate(`/forum/question/${q.id}`)}>
                        View Discussion
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Forum;