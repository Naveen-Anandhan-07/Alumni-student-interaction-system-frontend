import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Briefcase,
  Camera,
  CalendarDays,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Link2,
  LogOut,
  MessageSquare,
  Plus,
  Save,
  Tag,
  Trash2,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import api from "../services/api";
import { backendAssetUrl } from "../config/environment";
import LoadingState from "../components/LoadingState";
import "../styles/Profile.css";
import {
  getProfileImagePath,
  getProfileImageUrl,
  getProfileInitial,
} from "../utils/profileImage";

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
  const [selectedResume, setSelectedResume] = useState(null);
  const [form, setForm] = useState({
    name: "",
    department: "",
    year: "",
    role: "Student",
    githubLink: "",
    linkedinLink: "",
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

  const handleResumeChange = (e) => {
  setSelectedResume(e.target.files[0]);
};

const uploadResume = async () => {
  if (!selectedResume) {
    alert("Please select a resume PDF");
    return;
  }

  const formData = new FormData();
  formData.append("resume", selectedResume);

  try {
    const res = await api.post(`/students/${student.id}/resume`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setStudent(res.data);
    setSelectedResume(null);
    alert("Resume uploaded successfully");
  } catch (error) {
    console.log(error);
    alert("Resume upload failed");
  }
};

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
        githubLink: profile.githubLink || "",
        linkedinLink: profile.linkedinLink || "",
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
    window.dispatchEvent(new Event("auth-changed"));
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
        githubLink: form.githubLink,
        linkedinLink: form.linkedinLink,
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
        githubLink: updatedStudent.githubLink || "",
        linkedinLink: updatedStudent.linkedinLink || "",
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
  const firstLetter = getProfileInitial(student.name, "S");
  const profileImageUrl = previewImage || getProfileImageUrl(student);
  const hasProfileImage = Boolean(getProfileImagePath(student));

  return (
  <div className={isAlumni ? "student-profile-layout" : "student-profile-layout student-own-profile"}>
    {/* SIDEBAR */}
    <aside className="pf-sidebar">
      <div className="pf-logo">
        <BookOpen size={34} />
      </div>

      <nav className="pf-menu">
        <a
          onClick={() =>
            navigate(
              isAlumni ? "/alumni/dashboard" : "/student/dashboard"
            )
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
            navigate(
              isAlumni
                ? "/alumni/mentorships"
                : "/student/mentorships"
            )
          }
        >
          <Users size={20} />
          Mentorship
        </a>

        <a
          onClick={() =>
            navigate(
              isAlumni ? "/alumni/jobs" : "/student/jobs"
            )
          }
        >
          <Briefcase size={20} />
          Jobs / Internships
        </a>

        <a
          onClick={() =>
            navigate(
              isAlumni ? "/alumni/events" : "/student/events"
            )
          }
        >
          <CalendarDays size={20} />
          Events
        </a>

        <a onClick={() => navigate("/forum")}>
          <MessageSquare size={20} />
          Forum
        </a>

        <a onClick={() => navigate("/chat")}>
          <MessageSquare size={20} />
          Chat
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

    {/* MAIN CONTENT */}
    <main className="pf-main">
      {/* PAGE HEADER */}
      <section className="pf-page-head compact">
        <div>
          <p>
            {isAlumni ? "Mentorship / Student Profile" : "My Profile"}
          </p>

          <h1>
            {isAlumni
              ? `${student.name}'s Profile`
              : "Profile & Career Portfolio"}
          </h1>

          <span>
            {isAlumni
              ? "Review the student's academic background, skills, resume and professional links."
              : "Keep your academic profile and career portfolio updated for alumni mentors."}
          </span>
        </div>

        {isAlumni && (
          <button
            type="button"
            className="pf-back-btn"
            onClick={() => navigate("/alumni/mentorships")}
          >
            Back to Mentorships
          </button>
        )}
      </section>

      {/* PROFILE CONTENT */}
      <section className="pf-editor-grid refined">
        {/* LEFT PROFILE SUMMARY */}
        <div className="pf-profile-card pf-photo-card">
          <div className="pf-avatar-large image-avatar">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt={student.name} />
            ) : (
              firstLetter
            )}
          </div>

          <h2>{student.name}</h2>
          <p>{student.email}</p>

          {!isAlumni && (
            <div className="pf-upload-box">
              <input
                id="student-profile-image"
                className="pf-file-input"
                name="studentProfileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <label htmlFor="student-profile-image" className="pf-file-trigger">
                <Camera size={17} />
                {hasProfileImage ? "Change photo" : "Choose photo"}
              </label>

              {selectedImage ? (
                <button
                  type="button"
                  onClick={uploadProfileImage}
                >
                  <Upload size={16} />
                  Save New Photo
                </button>
              ) : hasProfileImage ? (
                <button
                  type="button"
                  className="danger"
                  onClick={removeProfileImage}
                >
                  <Trash2 size={16} />
                  Remove Photo
                </button>
              ) : null}
            </div>
          )}

          <div className="pf-divider"></div>

          <div className="pf-mini-info">
            <div>
              <BookOpen size={18} />
              <span>Department</span>
              <strong>
                {student.department || "Not provided"}
              </strong>
            </div>

            <div>
              <GraduationCap size={18} />
              <span>Year</span>
              <strong>
                {student.year
                  ? `Year ${student.year}`
                  : "Not provided"}
              </strong>
            </div>

            <div>
              <Tag size={18} />
              <span>Profile Type</span>
              <strong>Student</strong>
            </div>
          </div>
        </div>

        {/* EDITABLE PROFILE DETAILS */}
        <form
          className="pf-section-card pf-edit-card"
          onSubmit={saveProfile}
        >
          <div className="pf-section-head">
            <div>
              <h2>Academic Details</h2>
              <p>
                {isAlumni
                  ? "Student academic information."
                  : "Update the details shown across the portal."}
              </p>
            </div>
          </div>

          <div className="pf-form-grid">
            <label>
              Full Name
              <input
                id="student-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={isAlumni}
                required
              />
            </label>

            <label>
              Email Address
              <input
                id="student-email"
                name="email"
                value={student.email || ""}
                disabled
              />
            </label>

            <label>
              Department
              <input
                id="student-department"
                name="department"
                value={form.department}
                onChange={handleChange}
                disabled={isAlumni}
                placeholder="Example: Computer Science"
              />
            </label>

            <label>
              Current Year
              <input
                id="student-year"
                name="year"
                type="number"
                min="1"
                max="6"
                value={form.year}
                onChange={handleChange}
                disabled={isAlumni}
                placeholder="Example: 3"
              />
            </label>

            <label>
              GitHub Profile
              <input
                id="student-github"
                name="githubLink"
                type="url"
                value={form.githubLink}
                onChange={handleChange}
                disabled={isAlumni}
                placeholder="https://github.com/username"
              />
            </label>

            <label>
              LinkedIn Profile
              <input
                id="student-linkedin"
                name="linkedinLink"
                type="url"
                value={form.linkedinLink}
                onChange={handleChange}
                disabled={isAlumni}
                placeholder="https://linkedin.com/in/username"
              />
            </label>
          </div>

          {!isAlumni && (
            <div className="pf-form-actions">
              <button type="submit">
                <Save size={17} />
                Save Academic Details
              </button>
            </div>
          )}
        </form>

        {/* CAREER PORTFOLIO */}
        <div className="pf-section-card pf-career-card">
          <div className="pf-section-head">
            <div>
              <h2>Career Portfolio</h2>
              <p>
                Resume and professional profiles for mentorship
                review.
              </p>
            </div>
          </div>

          {/* RESUME */}
          <div className="pf-career-item">
            <div className="pf-career-item-info">
              <strong>Resume</strong>

              <span>
                {student.resumePdf
                  ? "Resume PDF available"
                  : "No resume uploaded yet"}
              </span>
            </div>

            <div className="pf-career-actions">
              {student.resumePdf && (
                <a
                  href={backendAssetUrl(student.resumePdf)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Resume
                </a>
              )}
            </div>
          </div>

          {!isAlumni && (
            <div className="pf-resume-upload">
              <input
                id="student-resume"
                className="pf-file-input"
                name="studentResume"
                type="file"
                accept="application/pdf"
                onChange={handleResumeChange}
              />

              <label htmlFor="student-resume" className="pf-resume-picker">
                <FileText size={18} />
                <span>
                  <strong>{selectedResume ? selectedResume.name : "Choose a PDF resume"}</strong>
                  <small>PDF file only</small>
                </span>
              </label>

              <button
                type="button"
                onClick={uploadResume}
                disabled={!selectedResume}
              >
                <Upload size={16} />
                {student.resumePdf
                  ? "Replace Resume"
                  : "Upload Resume"}
              </button>
            </div>
          )}

          {/* GITHUB */}
          <div className="pf-career-item">
            <div className="pf-career-item-info">
              <strong>
                <Link2 size={17} />
                GitHub
              </strong>

              <span>
                {student.githubLink
                  ? "Developer profile connected"
                  : "GitHub profile not added"}
              </span>
            </div>

            {student.githubLink && (
              <a
                href={student.githubLink}
                target="_blank"
                rel="noreferrer"
              >
                Open Profile
              </a>
            )}
          </div>

          {/* LINKEDIN */}
          <div className="pf-career-item">
            <div className="pf-career-item-info">
              <strong>
                <Link2 size={17} />
                LinkedIn
              </strong>

              <span>
                {student.linkedinLink
                  ? "Professional profile connected"
                  : "LinkedIn profile not added"}
              </span>
            </div>

            {student.linkedinLink && (
              <a
                href={student.linkedinLink}
                target="_blank"
                rel="noreferrer"
              >
                Open Profile
              </a>
            )}
          </div>
        </div>

        {/* SKILLS */}
        <div className="pf-section-card pf-skills-card">
          <div className="pf-section-head">
            <div>
              <h2>Skills & Interests</h2>
              <p>
                Technologies, tools and professional interests.
              </p>
            </div>
          </div>

          {!isAlumni && (
            <div className="pf-skill-input">
              <input
                id="student-skill"
                name="skillInput"
                value={skillInput}
                onChange={(e) =>
                  setSkillInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Example: React"
              />

              <button
                type="button"
                onClick={addSkill}
              >
                <Plus size={16} />
                Add Skill
              </button>
            </div>
          )}

          <div className="pf-skills">
            {form.skills.length === 0 ? (
              <span>No skills added yet</span>
            ) : (
              form.skills.map((skill) => (
                <span key={skill}>
                  {skill}

                  {!isAlumni && (
                    <button
                      type="button"
                      aria-label={`Remove ${skill}`}
                      onClick={() => removeSkill(skill)}
                    >
                      <X size={13} />
                    </button>
                  )}
                </span>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  </div>
);
}

export default StudentProfile;
