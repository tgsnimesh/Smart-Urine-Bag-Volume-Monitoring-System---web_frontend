// src/components/AlertCard.jsx
import React from "react";
import { getAlertColor } from "../utils/alertColors";

const AlertCard = ({ alert }) => {
  const color = getAlertColor(alert.type);

  return (
    <div className={`alert alert-${color} mb-2`} role="alert">
      <strong>{alert.type}</strong> — {alert.message}
      <div className="small text-muted">{alert.time}</div>
    </div>
  );
};

export default AlertCard;
