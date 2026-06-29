import React, { useState, useEffect } from "react";
import {
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronDown,
  Filter,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Monitor,
  Plus,
  Search,
  User,
  Users,
  X,
  MapPin,
  Eye,
} from "lucide-react";
import api from "../services/api";
import "../styles/AlumniEvents.css";

function AlumniEvents() {
  const [showForm, setShowForm] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [image, setImage] = useState(null);

  const [eventForm, setEventForm] = useState({
    alumniId: 1,
    title: "",
    description: "",
    eventType: "Workshop",
    eventDate: "",
    eventTime: "",
    mode: "Online",
    venueOrLink: "",
    requiredSkills: "",
    maxSeats: "",
  });

  const loadEvents = async () => {
    try {
      const allRes = await api.get("/events");
      setAllEvents(allRes.data);

      const myRes = await api.get(`/events/alumni/${eventForm.alumniId}`);
      setMyEvents(myRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePostEvent = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const eventData = {
      ...eventForm,
      maxSeats: Number(eventForm.maxSeats),
    };

    //formData.append("event", JSON.stringify(eventData));
    formData.append(
      "event",
      new Blob([JSON.stringify(eventData)], {
        type: "application/json",
      })
    );

    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("/events", formData);

      alert("Event posted successfully");

      setShowForm(false);
      setImage(null);

      setEventForm({
        alumniId: 1,
        title: "",
        description: "",
        eventType: "Workshop",
        eventDate: "",
        eventTime: "",
        mode: "Online",
        venueOrLink: "",
        requiredSkills: "",
        maxSeats: "",
      });

      loadEvents();
    } catch (error) {
      console.log(error);
      alert("Failed to post event");
    }
  };

  return (
    <div className="alumni-events-layout">
      <aside className="ae-sidebar">
        <div className="ae-logo">
          <BookOpen size={34} />
        </div>

        <nav className="ae-menu">
          <a>
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a>
            <User size={20} />
            Profile
          </a>
          <a>
            <Users size={20} />
            Mentorship
          </a>
          <a>
            <Briefcase size={20} />
            Jobs / Internships
          </a>
          <a className="active">
            <CalendarDays size={20} />
            Events
          </a>
          <a>
            <MessageSquare size={20} />
            Forum
          </a>
          <a onClick={() => navigate("/notifications")}>
            <Bell size={20} />
            Notifications
          </a>
          <a>
            <LogOut size={20} />
            Logout
          </a>
        </nav>
      </aside>

      <main className="ae-main">
        <header className="ae-topbar">
          <div className="ae-search-top">
            <Search size={20} />
            <input placeholder="Search events, students, jobs..." />
          </div>

          <div className="ae-top-actions">
            <button className="ae-icon-btn">
              <Bell size={21} />
              <span>4</span>
            </button>

            <div className="ae-profile">
              <div className="ae-avatar">AK</div>
              <div>
                <h4>Arun Kumar</h4>
                <p>Alumni</p>
              </div>
              <ChevronDown size={18} />
            </div>

            <button className="ae-logout">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="ae-page-head">
          <div>
            <p>Alumni Events</p>
            <h1>Manage and explore events</h1>
            <span>
              Post alumni-led events, view registrations, and browse all events
              in the platform.
            </span>
          </div>

          <button className="ae-post-btn" onClick={() => setShowForm(true)}>
            <Plus size={19} />
            Post Event
          </button>
        </section>

        <section className="ae-filter-card">
          <div className="ae-search-box">
            <Search size={20} />
            <input placeholder="Search event title..." />
          </div>

          <div className="ae-filter-box">
            <Filter size={18} />
            <select>
              <option>All Categories</option>
              <option>Workshop</option>
              <option>Webinar</option>
              <option>Seminar</option>
              <option>Hackathon</option>
            </select>
          </div>

          <div className="ae-filter-box">
            <Monitor size={18} />
            <select>
              <option>All Modes</option>
              <option>Online</option>
              <option>Offline</option>
              <option>Hybrid</option>
            </select>
          </div>
        </section>

        <section className="ae-section">
          <div className="ae-section-head">
            <div>
              <h2>My Posted Events</h2>
              <p>Events created by you for students.</p>
            </div>
          </div>

          <div className="ae-events-grid">
            {myEvents.length === 0 ? (
              <div className="ae-empty">No events posted yet.</div>
            ) : (
              myEvents.map((event) => (
                <EventCard
                  key={event.id}
                  own
                  title={event.title}
                  category={event.eventType}
                  mode={event.mode}
                  date={event.eventDate}
                  venue={event.venueOrLink}
                  registrations={`${event.registeredCount} registrations`}
                  seats={`${event.availableSeats} seats left`}
                  status={event.status}
                  imageUrl={event.imageUrl}
                  full={event.status === "FULL"}
                />
              ))
            )}
          </div>
        </section>

        <section className="ae-section">
          <div className="ae-section-head">
            <div>
              <h2>All Events</h2>
              <p>View events posted by other alumni.</p>
            </div>
          </div>

          <div className="ae-events-grid">
            {allEvents.length === 0 ? (
              <div className="ae-empty">No events available.</div>
            ) : (
              allEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  category={event.eventType}
                  mode={event.mode}
                  date={event.eventDate}
                  venue={event.venueOrLink}
                  registrations={`${event.registeredCount} registrations`}
                  seats={`${event.availableSeats} seats left`}
                  status={event.status}
                  imageUrl={event.imageUrl}
                  full={event.status === "FULL"}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {showForm && (
        <div className="ae-modal-overlay">
          <div className="ae-modal">
            <div className="ae-modal-head">
              <div>
                <h2>Post New Event</h2>
                <p>Fill event details for students to view and register.</p>
              </div>

              <button onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="ae-event-form" onSubmit={handlePostEvent}>
              <div className="ae-form-group full">
                <label>Event Title</label>
                <input
                  name="title"
                  value={eventForm.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="ae-form-group full">
                <label>Description</label>
                <textarea
                  name="description"
                  value={eventForm.description}
                  onChange={handleChange}
                  placeholder="Write short event description"
                  required
                ></textarea>
              </div>

              <div className="ae-form-group">
                <label>Category</label>
                <select
                  name="eventType"
                  value={eventForm.eventType}
                  onChange={handleChange}
                >
                  <option>Workshop</option>
                  <option>Webinar</option>
                  <option>Seminar</option>
                  <option>Hackathon</option>
                </select>
              </div>

              <div className="ae-form-group">
                <label>Mode</label>
                <select
                  name="mode"
                  value={eventForm.mode}
                  onChange={handleChange}
                >
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Hybrid</option>
                </select>
              </div>

              <div className="ae-form-group">
                <label>Event Date</label>
                <input
                  type="date"
                  name="eventDate"
                  value={eventForm.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ae-form-group">
                <label>Event Time</label>
                <input
                  type="time"
                  name="eventTime"
                  value={eventForm.eventTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ae-form-group">
                <label>Venue / Meeting Link</label>
                <input
                  name="venueOrLink"
                  value={eventForm.venueOrLink}
                  onChange={handleChange}
                  placeholder="Enter venue or meeting link"
                  required
                />
              </div>

              <div className="ae-form-group">
                <label>Maximum Seats</label>
                <input
                  type="number"
                  name="maxSeats"
                  value={eventForm.maxSeats}
                  onChange={handleChange}
                  placeholder="Example: 50"
                  required
                />
              </div>

              <div className="ae-form-group full">
                <label>Required Skills</label>
                <input
                  name="requiredSkills"
                  value={eventForm.requiredSkills}
                  onChange={handleChange}
                  placeholder="Java, React, Spring Boot"
                />
              </div>

              <div className="ae-form-group full">
                <label>Event Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              <div className="ae-form-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit">Post Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({
  title,
  category,
  mode,
  date,
  venue,
  registrations,
  seats,
  status,
  imageUrl,
  own,
  full,
}) {
  return (
    <div className={`ae-event-card ${full ? "full" : ""}`}>
      <div className="ae-event-image">
        {imageUrl ? (
          <img
            src={`http://localhost:8080${imageUrl}`}
            alt={title}
            className="ae-event-img"
          />
        ) : (
          <CalendarDays size={44} />
        )}
      </div>

      <div className="ae-event-body">
        <div className="ae-event-title-row">
          <h3>{title}</h3>
          <span className={`ae-event-status ${full ? "full" : "open"}`}>
            {status}
          </span>
        </div>

        <p className="ae-event-desc">
          Alumni-led session designed to support students with practical career
          guidance and industry exposure.
        </p>

        <div className="ae-event-meta">
          <span>
            <CalendarDays size={15} />
            {date}
          </span>

          <span>
            {mode === "Online" ? <Monitor size={15} /> : <Building2 size={15} />}
            {mode}
          </span>

          <span>
            <MapPin size={15} />
            {venue}
          </span>

          <span>
            <Users size={15} />
            {registrations}
          </span>
        </div>

        <div className="ae-event-footer">
          <div>
            <p>Availability</p>
            <strong>{seats}</strong>
          </div>

          <button>
            <Eye size={17} />
            {own ? "View Students" : "View Details"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlumniEvents;