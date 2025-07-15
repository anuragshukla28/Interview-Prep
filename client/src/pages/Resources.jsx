import { useEffect, useState } from "react";
import { getResources, addResource } from "../services/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import { PlusCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Resources = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    url: "",
    description: "",
    tags: "",
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await getResources();
      setResources(res.data.data);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };

      await addResource(payload);
      setFormData({
        title: "",
        type: "",
        url: "",
        description: "",
        tags: "",
      });
      setShowForm(false);
      fetchResources();
    } catch (err) {
      console.error("Failed to add resource:", err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📚 Useful Resources</h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {showForm ? <X size={18} /> : <PlusCircle size={18} />}
            {showForm ? "Cancel" : "Add Resource"}
          </button>
        )}
      </div>

      {/* Add Resource Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleAddResource}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow space-y-4"
          >
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            >
              <option value="">Select Type</option>
              <option value="sheet">📄 Sheet</option>
              <option value="video">🎥 Video</option>
              <option value="blog">📝 Blog</option>
              <option value="playlist">📺 Playlist</option>
              <option value="site">🌐 Site</option>
            </select>
            <input
              type="url"
              placeholder="URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-md"
              rows={3}
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full p-3 border rounded-md"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
            >
              Submit
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Vertical Scroll Resource List */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-blue-300">
        {resources.map((r) => (
          <div
            key={r._id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition duration-200"
          >
            <h3 className="text-lg font-bold text-blue-700">
              <a href={r.url} target="_blank" rel="noreferrer" className="hover:underline">
                {r.title}
              </a>
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              Type: <span className="font-medium">{r.type}</span>
            </p>
            {r.description && (
              <p className="text-sm text-gray-700 mt-1">{r.description}</p>
            )}
            {r.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {r.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
