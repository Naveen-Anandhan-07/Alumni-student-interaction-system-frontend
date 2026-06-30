import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
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
import LoadingState from "../components/LoadingState";
import "../styles/Forum.css";
import { getProfileImageUrl } from "../utils/profileImage";

function ForumQuestion() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loggedUser = JSON.parse(storedUser);

    setUser(loggedUser);
    fetchProfile(loggedUser);
    fetchUnreadCount(loggedUser);
    loadQuestion();
    loadAnswers();
  }, [id, navigate]);

  const fetchProfile = async (loggedUser) => {
    try {
      const endpoint =
        loggedUser.role === "STUDENT"
          ? `/students/${loggedUser.profileId}`
          : `/alumni/${loggedUser.profileId}`;

      const res = await api.get(endpoint);
      setProfile(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUnreadCount = async (loggedUser) => {
    try {
      const res = await api.get(
        `/notifications/${loggedUser.role}/${loggedUser.profileId}/unread`
      );

      setUnreadCount(res.data?.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const loadQuestion = async () => {
    const res = await api.get(`/forum/questions/${id}`);
    setQuestion(res.data);
  };

  const loadAnswers = async () => {
    const res = await api.get(`/forum/questions/${id}/answers`);
    setAnswers(res.data);
  };

  const handleAnswer = async (e) => {
    e.preventDefault();

    if (user.role !== "ALUMNI") {
      alert("Only alumni can answer questions");
      return;
    }

    await api.post(`/forum/questions/${id}/answers/${user.profileId}`, {
      answer: answerText,
    });

    setAnswerText("");
    loadQuestion();
    loadAnswers();
  };

  const handleHelpful = async (answerId) => {
    try {
      if (user.role === "STUDENT") {
        await api.post(
          `/forum/answers/${answerId}/helpful/student/${user.profileId}`
        );
      } else {
        await api.post(
          `/forum/answers/${answerId}/helpful/alumni/${user.profileId}`
        );
      }

      loadAnswers();
    } catch (error) {
      console.log(error);
      alert(error.response?.data || "Already marked helpful or action failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const displayName = profile?.name || user?.name || "User";
  const displayInitials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const profileImageUrl = getProfileImageUrl(profile);

  const mentorshipPath =
    user?.role === "STUDENT" ? "/student/mentorships" : "/alumni/mentorships";

  if (!question) {
    return (
      <LoadingState
        title="Loading discussion"
        subtitle="Opening the question and its answers."
      />
    );
  }

  return (
    <div className="forum-layout-page">
      <aside className="fm-sidebar">
        <div className="fm-logo">
          <BookOpen size={34} />
        </div>

        <nav className="fm-menu">
          <a onClick={() => navigate(user?.role === "STUDENT" ? "/student/dashboard" : "/alumni/dashboard")}>
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a onClick={() => navigate(user?.role === "STUDENT" ? "/student/profile" : "/alumni/profile")}>
            <User size={20} /> Profile
          </a>
          <a onClick={() => navigate(mentorshipPath)}><Users size={20} /> Mentorship</a>
          <a onClick={() => navigate(user?.role === "STUDENT" ? "/student/jobs" : "/alumni/jobs")}>
            <Briefcase size={20} /> Jobs / Internships
          </a>
          <a onClick={() => navigate(user?.role === "STUDENT" ? "/student/events" : "/alumni/events")}>
            <CalendarDays size={20} /> Events
          </a>
          <a className="active" onClick={() => navigate("/forum")}>
            <MessageSquare size={20} /> Forum
          </a>
          <a onClick={() => navigate("/notifications")}>
            <Bell size={20} /> Notifications
          </a>
          <a onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </a>
        </nav>
      </aside>

      <main className="fm-main">
        <header className="fm-topbar">
          <div className="fm-search-top">
            <Search size={20} />
            <input placeholder="Search discussions..." />
          </div>

          <div className="fm-top-actions">
            <button className="fm-icon-btn" onClick={() => navigate("/notifications")}>
              <Bell size={21} />
              {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>

            <div className="fm-profile">
              <div className="fm-avatar">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={displayName} />
                ) : (
                  displayInitials || initials || "U"
                )}
              </div>
              <div>
                <h4>{displayName}</h4>
                <p>{user?.role}</p>
              </div>
              <ChevronDown size={18} />
            </div>

            <button className="fm-logout" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        <button className="fm-back-btn" onClick={() => navigate("/forum")}>
          <ArrowLeft size={18} />
          Back to Forum
        </button>

        <section className="fm-discussion-head">
          <div>
            <span className={`fm-status ${question.status === "ANSWERED" ? "answered" : "open"}`}>
              {question.status}
            </span>
            <h1>{question.title}</h1>
            <p>{question.description}</p>

            <div className="fm-question-meta">
              <span>Asked by: {question.studentName || `Student ${question.studentId}`}</span>
              <span>Likes: {question.likeCount}</span>
              <span>{answers.length} answers</span>
            </div>
          </div>
        </section>

        <section className="fm-discussion-layout">
          <div className="fm-answer-feed">
            <div className="fm-section-head">
              <h2>Answers</h2>
              <p>Responses shared by alumni.</p>
            </div>

            {answers.length === 0 ? (
              <div className="fm-empty">
                {user?.role === "ALUMNI"
                ? "No answers yet. Be the first alumni to answer."
                : "No answers yet. Please wait for an alumni to answer this question."}
            </div>
            ) : (
              answers.map((ans) => (
                <div className="fm-discussion-answer" key={ans.id}>
                  <div className="fm-answer-user">
                    <div className="fm-answer-avatar">
                      {ans.alumniName?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                      <h3>{ans.alumniName || `Alumni ${ans.alumniId}`}</h3>
                      <p>Alumni response</p>
                    </div>
                  </div>

                  <p>{ans.answer}</p>

                  <button
                    className="fm-helpful-btn"
                    onClick={() => handleHelpful(ans.id)}
                  >
                    <ThumbsUp size={16} />
                    Helpful
                    {ans.helpfulCount ? ` (${ans.helpfulCount})` : ""}
                  </button>
                </div>
              ))
            )}
          </div>

          {user?.role === "ALUMNI" && (
            <aside className="fm-write-answer-card">
              <div className="fm-write-answer-head">
                <div>
                  <h2>Write Your Answer</h2>
                  <p>Share practical guidance from your experience.</p>
                </div>
              </div>

              <form onSubmit={handleAnswer}>
                <div className="fm-whatsapp-reply">
                  <textarea
                    id="alumni-answer"
                    placeholder="Type your answer..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    required
                    rows={1}
                  />

                  <button type="submit" disabled={!answerText.trim()}>
                    <Send size={17} />
                  </button>
                </div>
              </form>
            </aside>
          )}
        </section>
      </main>
    </div>
  );
}

export default ForumQuestion;

