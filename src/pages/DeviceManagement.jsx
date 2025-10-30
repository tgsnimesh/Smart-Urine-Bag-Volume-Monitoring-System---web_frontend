import { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DeviceManagement() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const devicesRef = ref(db, "devices");
    const unsubscribe = onValue(
      devicesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const deviceList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setDevices(deviceList);
        } else {
          setDevices([]);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleDeactivate = async (deviceId) => {
    if (window.confirm("Are you sure you want to deactivate this device?")) {
      await update(ref(db, `devices/${deviceId}`), {
        patientId: -1,
      });
      const item = devices.filter((item) => {
        if (item.deviceId === deviceId) {
          return item;
        }
      });
      await update(ref(db, `/patients/${item[0].patientId}`), {
        deviceId: -1,
      });
      await update(ref(db, `devices/${deviceId}`), {
        status: "offline",
      });
      alert("Device deactivated successfully.");
    }
  };

  const handleReassign = async (deviceId) => {
    const newPatientId = prompt("Enter new patient ID to reassign:");
    if (newPatientId) {
      await update(ref(db, `devices/${deviceId}`), {
        patientId: newPatientId,
      });
      await update(ref(db, `/patients/${newPatientId}`), {
        deviceId: deviceId,
      });
      await update(ref(db, `devices/${deviceId}`), {
        status: "online",
      });
      alert(`Device reassigned to ${newPatientId}`);
    }
  };

  if (loading)
    return <div className="text-center mt-5">Loading devices...</div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center fw-bold">Device Management</h2>

      {devices.length === 0 ? (
        <div className="alert alert-info text-center">
          No devices found in the system.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Device ID</th>
                <th>Patient ID</th>
                <th>Firmware</th>
                <th>Battery %</th>
                <th>Status</th>
                <th>Last Seen</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td className="fw-semibold">{device.id}</td>
                  <td>{device.patientId || "Unassigned"}</td>
                  <td>{device.firmwareVersion || "N/A"}</td>
                  <td>{device.batteryPercent || "—"}</td>
                  <td>
                    <span
                      className={`badge ${
                        device.status === "active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {device.status || "unknown"}
                    </span>
                  </td>
                  <td>{device.lastSeen || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleReassign(device.id)}
                    >
                      Reassign
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeactivate(device.id)}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
