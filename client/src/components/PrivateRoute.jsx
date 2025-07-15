// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Checking auth...</div>;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
