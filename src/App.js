import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PatientDetails from "./pages/PatientDetails";
import Login from "./pages/Login";
import DeviceManagement from "./pages/DeviceManagement";
import UserManagement from "./pages/UserManagement";
import NotAuthorized from "./pages/NotAuthorized";

import { PrivateRoute, AdminRoute } from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/patient/:id" element={<PatientDetails />} />
          <Route
            path="/dashboard/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/device-management/" element={<DeviceManagement />} />
          <Route
            path="/user-management/"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
