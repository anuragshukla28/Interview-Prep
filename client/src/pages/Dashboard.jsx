import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile, getQuestions, getResources } from "../services/auth.js";
import {
  BookOpen,
  CheckCircle,
  User2,
  ActivitySquare,
} from "lucide-react";

const Dashboard = () => {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  const [solved, setSolved] = useState(0);
  const [totalQ, setTotalQ] = useState(0);
  const [totalR, setTotalR] = useState(0);
  const [totalUsers, setTotalUsers] = useState(42); // Dummy count

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qRes = await getQuestions();
        const rRes = await getResources();
        const pRes = await getProfile();

        setTotalQ(qRes.data.data.length);
        setSolved(pRes.data.data?.solvedQuestions?.length || 0);
        setTotalR(rRes.data.data.length);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      }
    };

    if (user) fetchData();
  }, [user]);

  const percentage = totalQ > 0 ? Math.round((solved / totalQ) * 100) : 0;

  if (authLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Profile Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-center gap-6">
        <img
          src={user.avatar}
          alt="avatar"
          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-200 shadow-lg"
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Welcome, {user?.fullName} 👋
          </h1>
          <p className="text-gray-600 mb-4">{user?.email}</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/questions")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold shadow"
            >
              🚀 Start Practicing
            </button>
            <button
              onClick={() => navigate("/resources")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-semibold shadow"
            >
              📚 View Resources
            </button>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          📈 Your Progress
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Solved {solved} out of {totalQ} questions
        </p>
        <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-5 bg-green-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{percentage}% completed</p>
      </div>

      {/* Admin Stats */}
      {user?.role === "admin" && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🔐 Admin Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Users" value={totalUsers} icon={<User2 size={28} />} />
            <StatCard title="Questions" value={totalQ} icon={<CheckCircle size={28} />} />
            <StatCard title="Resources" value={totalR} icon={<BookOpen size={28} />} />
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ title, value, icon }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col items-center shadow-sm">
    <div className="text-blue-700 mb-2">{icon}</div>
    <h3 className="text-2xl font-bold">{value}</h3>
    <p className="text-sm text-gray-600">{title}</p>
  </div>
);

export default Dashboard;
