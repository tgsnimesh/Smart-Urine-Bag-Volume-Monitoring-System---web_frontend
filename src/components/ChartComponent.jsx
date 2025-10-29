// src/components/ChartComponent.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const ChartComponent = ({ labels, dataPoints }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Flow Rate (ml/min)",
        data: dataPoints,
        borderColor: "#007bff",
        fill: false,
        tension: 0.1,
      },
    ],
  };
  return <Line data={data} />;
};

export default ChartComponent;
