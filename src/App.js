import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PatientDetails from "./pages/PatientDetails";
import Login from "./pages/Login";
import DeviceManagement from "./pages/DeviceManagement";

import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/patient/:id" element={<PatientDetails />} />
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/DeviceManagement/" element={<DeviceManagement />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
