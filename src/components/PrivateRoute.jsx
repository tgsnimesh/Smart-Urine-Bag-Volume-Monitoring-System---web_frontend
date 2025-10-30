// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function PrivateRoute({ children }) {
  const { user, role, login, logout, loading } = useAuth();

  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

export function AdminRoute({ children }) {
  const { user, role, login, logout, loading } = useContext(AuthContext);

  console.log(user);

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/not-authorized" replace />;

  return children;
}

export function DoctorRoute({ children }) {
  const { user, role, login, logout, loading } = useContext(AuthContext);

  console.log(user);

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;
  if (role !== "admin" && role !== "doctor")
    return <Navigate to="/not-authorized" replace />;

  return children;
}
