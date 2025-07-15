import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, LogOut, UserCircle } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-600 tracking-wide">
        InterviewPrep
      </Link>

      <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
        {user && (
          <>
            <Link to="/questions" className="hover:text-blue-600">Questions</Link>
            <Link to="/resources" className="hover:text-blue-600">Resources</Link>
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/profile" className="hover:text-blue-600 flex items-center gap-1">
              <UserCircle size={20} /> Profile
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
