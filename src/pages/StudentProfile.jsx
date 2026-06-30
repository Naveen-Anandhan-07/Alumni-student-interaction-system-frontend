import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
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

function StudentProfile() {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [student, setStudent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    name: "",
    department: "",
    year: "",
    role: "Student",
    skills: [],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loggedUser = JSON.parse(storedUser);
    let profileId = loggedUser.profileId;

    if (loggedUser.role === "ALUMNI") {
      if (!studentId) {
        navigate("/alumni/dashboard");
        return;
      }

      profileId = studentId;
    }

    setUser(loggedUser);
    loadProfile(profileId);
  }, [navigate, studentId]);

  const loadProfile = async (profileId) => {
    try {
      const profileResponse = await api.get(`/students/${profileId}`);
      const profile = profileResponse.data;

      setStudent(profile);
      setForm({
        name: profile.name || "",
        department: profile.department || "",
        year: profile.year || "",
        role: profile.role || "Student",
        skills: splitSkills(profile.skills),
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load student profile");
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
        ...student,
        name: form.name,
        department: form.department,
        year: form.year,
        role: form.role,
        skills: form.skills.join(", "),
      };

      const response = await api.put(`/students/${student.id}`, payload);
      const updatedStudent = response.data;

      setStudent(updatedStudent);
      setForm({
        name: updatedStudent.name || "",
        department: updatedStudent.department || "",
        year: updatedStudent.year || "",
        role: updatedStudent.role || "Student",
        skills: splitSkills(updatedStudent.skills),
      });

      const storedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, name: updatedStudent.name })
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
      const res = await api.post(`/students/${student.id}/profile-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStudent(res.data);
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
      const res = await api.delete(`/students/${student.id}/profile-image`);

      setStudent(res.data);
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
        subtitle="Getting your details and profile photo ready."
      />
    );
  }

  if (!student) {
    return <div className="pf-loading">Student profile not found.</div>;
  }

  const isAlumni = user?.role === "ALUMNI";
  const firstLetter = student.name ? student.name.charAt(0).toUpperCase() : "S";
  const profileImageUrl = previewImage || getProfileImageUrl(student);
  const hasProfileImage = Boolean(getProfileImagePath(student));

  return (
    <div className="student-profile-layout">
      <aside className="pf-sidebar">
        <div className="pf-logo">
          <BookOpen size={34} />
        </div>

        <nav className="pf-menu">
          <a
            onClick={() =>
              navigate(isAlumni ? "/alumni/dashboard" : "/student/dashboard")
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </a>

          {!isAlumni && (
            <a className="active">
              <User size={20} />
              Profile
            </a>
          )}

          <a
            onClick={() =>
              navigate(isAlumni ? "/alumni/mentorships" : "/student/mentorships")
            }
          >
            <Users size={20} />
            Mentorship
          </a>

          <a onClick={() => navigate(isAlumni ? "/alumni/jobs" : "/student/jobs")}>
            <Briefcase size={20} />
            Jobs / Internships
          </a>

          <a
            onClick={() => navigate(isAlumni ? "/alumni/events" : "/student/events")}
          >
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
            <p>{isAlumni ? "Mentee Profile" : "Profile Settings"}</p>
            <h1>{student.name}</h1>
            <span>
              {isAlumni
                ? "Review this student's academic details and skills."
                : "Manage your photo, personal details, academic info and skills."}
            </span>
          </div>

          <div className="pf-head-avatar image-avatar">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt={student.name} />
            ) : (
              firstLetter
            )}
          </div>
        </section>

        {isAlumni && (
          <button
            className="pf-logout"
            onClick={() => navigate("/alumni/mentorships")}
          >
            Back to Mentorships
          </button>
        )}

        <section className="pf-editor-grid">
          <div className="pf-profile-card pf-photo-card">
            <div className="pf-avatar-large image-avatar">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" />
              ) : (
                firstLetter
              )}
            </div>

            <h2>{student.name}</h2>
            <p>{student.email}</p>

            {!isAlumni && (
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
            )}
          </div>

          <form className="pf-section-card pf-edit-card" onSubmit={saveProfile}>
            <div className="pf-section-head">
              <h2>Profile Details</h2>
              <p>Edit the information shown across the portal.</p>
            </div>

            <div className="pf-form-grid">
              <label>
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={isAlumni}
                  required
                />
              </label>

              <label>
                Department
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  disabled={isAlumni}
                  placeholder="Example: Computer Science"
                />
              </label>

              <label>
                Year
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  disabled={isAlumni}
                  placeholder="Example: 3"
                />
              </label>

              <label>
                Role
                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={isAlumni}
                  placeholder="Example: Student"
                />
              </label>
            </div>

            <div className="pf-skills-editor">
              <label>
                Skills
                {!isAlumni && (
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
                )}
              </label>

              <div className="pf-skills">
                {form.skills.length === 0 ? (
                  <span>No skills added</span>
                ) : (
                  form.skills.map((skill) => (
                    <span key={skill}>
                      {skill}
                      {!isAlumni && (
                        <button type="button" onClick={() => removeSkill(skill)}>
                          <X size={13} />
                        </button>
                      )}
                    </span>
                  ))
                )}
              </div>
            </div>

            {!isAlumni && (
              <div className="pf-form-actions">
                <button type="submit">Save Profile</button>
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}

export default StudentProfile;
