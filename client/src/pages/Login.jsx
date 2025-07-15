import { useState } from "react";
import { loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await loginUser(formData);
      const { accessToken, user } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      setUser(user);
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8"
      >
        <div className="flex justify-center mb-4">
          <LockKeyhole className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
  Don’t have an account?{" "}
  <Link to="/register" className="text-blue-600 hover:underline font-medium">
    Register here
  </Link>
</p>
      </motion.div>
    </div>
  );
};

export default Login;
