import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../services/axios.js";

const Profile = () => {
  const { user, authLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
    github: "",
    linkedin: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        bio: user.bio || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put("/auth/profile", {
        bio: formData.bio,
        github: formData.github,
        linkedin: formData.linkedin,
      });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex justify-center items-center p-6">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl">
        <div className="flex flex-col items-center mb-6">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg object-cover"
            />
          )}
          <h2 className="text-2xl font-semibold mt-4">{formData.fullName}</h2>
          <p className="text-gray-500">{formData.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Bio</label>
            <textarea
              name="bio"
              rows={3}
              className="border p-2 w-full rounded mt-1"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us something about yourself..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">GitHub</label>
            <input
              name="github"
              className="border p-2 w-full rounded mt-1"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
            {formData.github && (
              <a
                href={formData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline mt-1 inline-block"
              >
                View GitHub Profile
              </a>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">LinkedIn</label>
            <input
              name="linkedin"
              className="border p-2 w-full rounded mt-1"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
            {formData.linkedin && (
              <a
                href={formData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline mt-1 inline-block"
              >
                View LinkedIn Profile
              </a>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mt-2"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>

          {message && (
            <p className="text-green-600 text-sm mt-2 font-medium">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
