import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getQuestions,
  markSolved,
  unmarkSolved,
  getProfile,
  addQuestion,
} from "../services/auth.js";
import { PlusCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Questions = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [questions, setQuestions] = useState([]);
  const [solvedMap, setSolvedMap] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    platform: "",
    tags: "",
  });

  const [activeTag, setActiveTag] = useState(null);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getQuestions();
      const questionsData = res.data.data;
      setQuestions(questionsData);

      const tagSet = new Set();
      questionsData.forEach((q) => q.tags?.forEach((tag) => tagSet.add(tag)));
      setAllTags([...tagSet]);

      const profile = await getProfile();
      const solved = profile.data.data.solvedQuestions || [];
      const map = {};
      solved.forEach((id) => (map[id] = true));
      setSolvedMap(map);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const handleToggle = async (id) => {
    try {
      if (solvedMap[id]) {
        await unmarkSolved(id);
        setSolvedMap((prev) => ({ ...prev, [id]: false }));
      } else {
        await markSolved(id);
        setSolvedMap((prev) => ({ ...prev, [id]: true }));
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const newQuestion = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };
      await addQuestion(newQuestion);
      setFormData({ title: "", link: "", platform: "", tags: "" });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error("Failed to add question:", err);
    }
  };

  const filteredQuestions = activeTag
    ? questions.filter((q) => q.tags?.includes(activeTag))
    : questions;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Practice Questions</h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            {showForm ? <X size={18} /> : <PlusCircle size={18} />}
            {showForm ? "Cancel" : "Add Question"}
          </button>
        )}
      </div>

      {/* Add Question Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleAddQuestion}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow space-y-4"
          >
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="url"
              placeholder="Link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Platform (e.g. LeetCode)"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
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
              className="bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-green-700 transition"
            >
              Submit
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              !activeTag ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          {allTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                activeTag === tag
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Question List */}
      <ul className="space-y-4">
        {filteredQuestions.map((q) => (
          <li
            key={q._id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex justify-between items-start"
          >
            <div className="flex-1">
              <a
                href={q.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-semibold text-lg hover:underline"
              >
                {q.title}
              </a>
              <p className="text-sm text-gray-500 mt-1">Platform: {q.platform}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {q.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="ml-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!solvedMap[q._id]}
                  onChange={() => handleToggle(q._id)}
                  className="w-4 h-4"
                />
                <span className={solvedMap[q._id] ? "text-green-600 font-semibold" : "text-gray-600"}>
                  {solvedMap[q._id] ? "Solved" : "Unsolved"}
                </span>
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Questions;
