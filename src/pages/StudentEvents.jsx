import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Monitor,
  CalendarDays,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Building2,
} from "lucide-react";
import api from "../services/api";
import "../styles/StudentEvents.css";

function StudentEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);

  const studentId = 1;

  const loadEvents = async () => {
    try {
      const allRes = await api.get("/events");
      setAllEvents(allRes.data);

      const recommendedRes = await api.get(`/events/recommended/${studentId}`);
      setRecommendedEvents(recommendedRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/register/${studentId}`);
      alert("Event registered successfully");
      loadEvents();
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data) {
        alert(error.response.data.message || "Registration failed");
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <div className="student-events-page">
      <section className="events-filter-card">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Search events..." />
        </div>

        <div className="filter-box">
          <Filter size={18} />
          <select>
            <option>All Categories</option>
            <option>Workshop</option>
            <option>Webinar</option>
            <option>Seminar</option>
            <option>Hackathon</option>
          </select>
        </div>

        <div className="filter-box">
          <Monitor size={18} />
          <select>
            <option>All Modes</option>
            <option>Online</option>
            <option>Offline</option>
            <option>Hybrid</option>
          </select>
        </div>
      </section>

      <section className="events-section recommended-section">
        <div className="section-heading">
          <div>
            <h2>Recommended Events</h2>
            <p>Events matched with your skills and interests.</p>
          </div>
        </div>

        <div className="events-grid">
          {recommendedEvents.length === 0 ? (
            <div className="event-empty">No recommended events listed.</div>
          ) : (
            recommendedEvents.map((event) => (
              <EventCard
                key={event.eventId}
                recommended
                eventId={event.eventId}
                title={event.title}
                category="Recommended"
                mode=""
                date=""
                venue={event.reason}
                seats=""
                match={`${event.matchScore}%`}
                status={event.status}
                imageUrl={event.imageUrl}
                full={event.status === "FULL"}
                canApply={event.canApply}
                onRegister={handleRegister}
              />
            ))
          )}
        </div>
      </section>

      <section className="events-section">
        <div className="section-heading">
          <div>
            <h2>All Events</h2>
            <p>Browse all available alumni events.</p>
          </div>
        </div>

        <div className="events-grid">
          {allEvents.length === 0 ? (
            <div className="event-empty">No events listed.</div>
          ) : (
            allEvents.map((event) => (
              <EventCard
                key={event.id}
                eventId={event.id}
                title={event.title}
                category={event.eventType}
                mode={event.mode}
                date={event.eventDate}
                venue={event.venueOrLink}
                seats={`${event.availableSeats} seats left`}
                match={null}
                status={event.status}
                imageUrl={event.imageUrl}
                full={event.status === "FULL"}
                canApply={event.canApply}
                onRegister={handleRegister}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function EventCard({
  eventId,
  title,
  category,
  mode,
  date,
  venue,
  seats,
  match,
  status,
  imageUrl,
  recommended,
  full,
  canApply,
  onRegister,
}) {
  return (
    <div className={`event-card ${full ? "full" : ""}`}>
      <div className="event-image-box">
        {imageUrl ? (
          <img
            src={`http://localhost:8080${imageUrl}`}
            alt={title}
            className="event-img"
          />
        ) : (
          <CalendarDays size={44} />
        )}

        {recommended && (
          <span className="recommended-badge">
            <Star size={13} />
            Recommended
          </span>
        )}
      </div>

      <div className="event-card-body">
        <div className="event-title-row">
          <h3>{title}</h3>
          <span className={`event-status ${full ? "full" : "open"}`}>
            {status}
          </span>
        </div>

        <p className="event-description">
          Join this alumni-led session and improve your career skills through
          practical guidance and interaction.
        </p>

        <div className="event-meta-grid">
          {date && (
            <span>
              <CalendarDays size={15} />
              {date}
            </span>
          )}

          {mode && (
            <span>
              {mode === "Online" ? (
                <Monitor size={15} />
              ) : (
                <Building2 size={15} />
              )}
              {mode}
            </span>
          )}

          {venue && (
            <span>
              <MapPin size={15} />
              {venue}
            </span>
          )}

          {seats && (
            <span>
              <Users size={15} />
              {seats}
            </span>
          )}
        </div>

        <div className="event-footer">
          {match ? (
            <div className="match-box">
              <p>Skill Match</p>
              <strong>{match}</strong>
            </div>
          ) : (
            <div className="match-box">
              <p>Status</p>
              <strong>{status}</strong>
            </div>
          )}

          {full || !canApply ? (
            <button className="event-btn disabled" disabled>
              Full
            </button>
          ) : (
            <button className="event-btn" onClick={() => onRegister(eventId)}>
              Register
              <ArrowRight size={17} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentEvents;