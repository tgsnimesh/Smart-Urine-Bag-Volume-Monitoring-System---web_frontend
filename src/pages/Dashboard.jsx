// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import SummaryCard from "../components/SummaryCard";
import PatientTable from "../components/PatientTable";

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const patientsRef = ref(db, "patients");
    onValue(patientsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPatients(Object.values(data));
    });

    const alertsRef = ref(db, "alerts");
    onValue(alertsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setAlerts(Object.values(data));
    });

    const devicesRef = ref(db, "devices");
    onValue(devicesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setDevices(Object.values(data));
    });
  }, []);

  const totalPatients = patients.length;
  const activeAlerts = alerts.filter((a) => a.status === "unread").length;
  const onlineDevices = devices.filter((p) => p.status === "online").length;
  const patientsAtRisk = patients.filter(
    (p) => p.urineData?.fillPercentage >= 75
  ).length;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Dashboard</h3>
      <div className="row">
        <div className="col-md-3">
          <SummaryCard title="Total Patients" value={totalPatients} />
        </div>
        <div className="col-md-3">
          <SummaryCard title="Active Alerts" value={activeAlerts} />
        </div>
        <div className="col-md-3">
          <SummaryCard title="Devices Online" value={onlineDevices} />
        </div>
        <div className="col-md-3">
          <SummaryCard title="Patients at Risk" value={patientsAtRisk} />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <PatientTable patients={patients} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
