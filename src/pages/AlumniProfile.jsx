import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Briefcase,
  Building,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  Star,
  User,
  Users,
  X,
} from "lucide-react";
import api from "../services/api";
import LoadingState from "../components/LoadingState";
import "../styles/Profile.css";
import { getProfileImagePath, getProfileImageUrl } from "../utils/profileImage";

const splitSkills = (skills) =>
  skills
    ? skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

function AlumniProfile() {
  const navigate = useNavigate();

  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    designation: "",
    experience: "",
    role: "Alumni",
    skills: [],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "ALUMNI") {
      navigate("/login");
      return;
    }

    loadProfile(user.profileId);
  }, [navigate]);

  const loadProfile = async (alumniId) => {
    try {
      const profileResponse = await api.get(`/alumni/${alumniId}`);
      const profile = profileResponse.data;

      setAlumni(profile);
      setForm({
        name: profile.name || "",
        company: profile.company || "",
        designation: profile.designation || "",
        experience: profile.experience || "",
        role: profile.role || "Alumni",
        skills: splitSkills(profile.skills),
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load alumni profile");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill || form.skills.includes(skill)) {
      setSkillInput("");
      return;
    }

    setForm({ ...form, skills: [...form.skills, skill] });
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setForm({
      ...form,
      skills: form.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...alumni,
        name: form.name,
        company: form.company,
        designation: form.designation,
        experience: form.experience,
        role: form.role,
        skills: form.skills.join(", "),
      };

      const response = await api.put(`/alumni/${alumni.id}`, payload);
      const updatedAlumni = response.data;

      setAlumni(updatedAlumni);
      setForm({
        name: updatedAlumni.name || "",
        company: updatedAlumni.company || "",
        designation: updatedAlumni.designation || "",
        experience: updatedAlumni.experience || "",
        role: updatedAlumni.role || "Alumni",
        skills: splitSkills(updatedAlumni.skills),
      });

      const storedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, name: updatedAlumni.name })
      );

      alert("Profile updated");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const uploadProfileImage = async () => {
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await api.post(`/alumni/${alumni.id}/profile-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlumni(res.data);
      setSelectedImage(null);
      setPreviewImage(null);
      alert("Profile picture updated");
    } catch (error) {
      console.log(error);
      alert("Image upload failed");
    }
  };

  const removeProfileImage = async () => {
    try {
      const res = await api.delete(`/alumni/${alumni.id}/profile-image`);

      setAlumni(res.data);
      setSelectedImage(null);
      setPreviewImage(null);
      alert("Profile picture removed");
    } catch (error) {
      console.log(error);
      alert("Image remove failed");
    }
  };

  if (loading) {
    return (
      <LoadingState
        title="Loading profile"
        subtitle="Getting your alumni profile ready."
      />
    );
  }

  if (!alumni) {
    return <div className="profile-loading">Alumni profile is not available.</div>;
  }

  const firstLetter = alumni.name ? alumni.name.charAt(0).toUpperCase() : "A";
  const profileImageUrl = previewImage || getProfileImageUrl(alumni);
  const hasProfileImage = Boolean(getProfileImagePath(alumni));

  return (
    <div className="profile-page">
      <aside className="pf-sidebar">
        <div className="pf-logo">
          <BookOpen size={34} />
        </div>

        <nav className="pf-menu">
          <a onClick={() => navigate("/alumni/dashboard")}>
            <LayoutDashboard size={20} />
            Dashboard
          </a>

          <a className="active">
            <User size={20} />
            Profile
          </a>

          <a onClick={() => navigate("/alumni/mentorships")}>
            <Users size={20} />
            Mentorship
          </a>

          <a onClick={() => navigate("/alumni/jobs")}>
            <Briefcase size={20} />
            Jobs / Internships
          </a>

          <a onClick={() => navigate("/alumni/events")}>
            <CalendarDays size={20} />
            Events
          </a>

          <a onClick={() => navigate("/forum")}>
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

      <main className="pf-main">
        <section className="pf-page-head compact">
          <div>
            <p>Profile Settings</p>
            <h1>{alumni.name}</h1>
            <span>
              Manage your public alumni profile, professional details, profile
              photo and skills.
            </span>
          </div>

          <div className="pf-head-avatar image-avatar">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt={alumni.name} />
            ) : (
              firstLetter
            )}
          </div>
        </section>

        <section className="pf-editor-grid">
          <div className="pf-profile-card pf-photo-card">
            <div className="pf-avatar-large image-avatar">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" />
              ) : (
                firstLetter
              )}
            </div>

            <h2>{alumni.name}</h2>
            <p>{alumni.email}</p>

            <div className="pf-upload-box">
              <input type="file" accept="image/*" onChange={handleImageChange} />

              {selectedImage ? (
                <button onClick={uploadProfileImage}>Save Photo</button>
              ) : hasProfileImage ? (
                <button className="danger" onClick={removeProfileImage}>
                  Remove Photo
                </button>
              ) : (
                <button onClick={uploadProfileImage}>Upload Photo</button>
              )}
            </div>

            <div className="pf-info-list">
              <div>
                <span>Company</span>
                <strong>{alumni.company || "Not provided"}</strong>
              </div>
              <div>
                <span>Role</span>
                <strong>{alumni.designation || alumni.role || "Alumni"}</strong>
              </div>
            </div>
          </div>

          <form className="pf-section-card pf-edit-card" onSubmit={saveProfile}>
            <div className="pf-section-head">
              <h2>Profile Details</h2>
              <p>Edit the information shown to students.</p>
            </div>

            <div className="pf-form-grid">
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>

              <label>
                Company
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Example: Zoho"
                />
              </label>

              <label>
                Role / Designation
                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Example: Software Engineer"
                />
              </label>

              <label>
                Experience
                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Example: 5"
                />
              </label>
            </div>

            <div className="pf-skills-editor">
              <label>
                Skills
                <div className="pf-skill-input">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill"
                  />
                  <button type="button" onClick={addSkill}>
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              </label>

              <div className="pf-skills">
                {form.skills.length === 0 ? (
                  <span>No skills added</span>
                ) : (
                  form.skills.map((skill) => (
                    <span key={skill}>
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <X size={13} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="pf-form-actions">
              <button type="submit">Save Profile</button>
            </div>
          </form>

          <div className="pf-section-card pf-summary-card">
            <div>
              <Building size={18} />
              <span>Company</span>
              <strong>{alumni.company || "Not provided"}</strong>
            </div>
            <div>
              <Briefcase size={18} />
              <span>Role</span>
              <strong>{alumni.designation || "Not provided"}</strong>
            </div>
            <div>
              <Star size={18} />
              <span>Experience</span>
              <strong>{alumni.experience || 0} years</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AlumniProfile;
