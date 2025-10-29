import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import ChartComponent from "../components/ChartComponent";
import AlertCard from "../components/AlertCard";
import { formatDate } from "../utils/formatDate";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";

const PatientDetails = () => {
  const { id } = useParams();
  const patientId = id;

  const [patient, setPatient] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState("Unknown");

  useEffect(() => {
    const patientRef = ref(db, `patients/${patientId}`);
    const unsub = onValue(patientRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPatient(data);

        const alertsRef = ref(db, `/alerts/${patientId}`);
        onValue(alertsRef, (snapshot) => {
          if (snapshot.exists()) {
            const alertsData = snapshot.val() || {};
            setAlerts(Object.values(alertsData));
          }
        });
      }
    });

    return () => unsub();
  }, [patientId]);

  useEffect(() => {
    const deviceRef = ref(db, `devices/${patient.deviceId}`);
    onValue(deviceRef, (snapshot) => {
      if (snapshot.exists()) {
        const deviceData = snapshot.val();
        setDeviceStatus(deviceData.status); // create a state for deviceStatus
      }
    });
  }, [patient]);

  const [flowHistory, setFlowHistory] = useState([]);

  useEffect(() => {
    const historyRef = ref(db, `history/${patientId}`);
    onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let flowArray = [];

        Object.values(data).forEach((yearObj) => {
          Object.values(yearObj).forEach((monthObj) => {
            Object.values(monthObj).forEach((dayObj) => {
              Object.values(dayObj).forEach((minuteObj) => {
                flowArray.push({
                  timestamp: minuteObj.ts,
                  flowRate: minuteObj.flowRate,
                });
              });
            });
          });
        });

        // Sort by timestamp
        flowArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setFlowHistory(flowArray);
      }
    });
  }, [patientId]);

  const chartLabels = flowHistory.map((f) =>
    new Date(f.timestamp).toLocaleTimeString()
  );
  const chartData = flowHistory.map((f) => f.flowRate);

  if (!patient) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Patient Details: {patient.name}</h3>

      {/* Basic Info */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Patient Info</h5>
        <p>
          <strong>Bed No:</strong> {patient.bedNo}
        </p>
        <p>
          <strong>Ward:</strong> {patient.ward}
        </p>
        <p>
          <strong>Gender:</strong> {patient.gender === "M" ? "Male" : "Female"}
        </p>
        <p>
          <strong>DOB:</strong> {patient.dob}
        </p>
      </div>

      {/* Catheter Info */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Catheter Info</h5>
        <p>
          <strong>Inserted Date:</strong> {patient.catheterInsertedDate}
        </p>
        <p>
          <strong>Bed No:</strong> {patient.bedNo}
        </p>
      </div>

      {/* Device Info */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Device Info</h5>
        <p>
          <strong>Device ID:</strong> {patient.deviceId}
        </p>
        <p>
          <strong>Status:</strong>
          <span
            className={
              deviceStatus === "online" ? "text-success" : "text-danger"
            }
          >
            {deviceStatus}
          </span>
        </p>
      </div>

      {/* Flow Rate Graph */}
      <ChartComponent labels={chartLabels} dataPoints={chartData} />

      {/* Alert History */}
      <div className="card p-3 mt-4 shadow-sm">
        <h5 className="mb-3">Alert History</h5>
        {alerts.length > 0 ? (
          alerts.map((alert, index) => <AlertCard key={index} alert={alert} />)
        ) : (
          <p className="text-muted">No alerts recorded.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
