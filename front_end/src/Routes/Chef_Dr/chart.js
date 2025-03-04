import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistrement des composants nécessaires
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ datasets = [] }) => {
  const chartRef = useRef(null); // Ajout du useRef pour s'assurer que le DOM est prêt
  const data = {
    labels: [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Sept",
      "Oct",
      "Nov",
      "Déc",
    ],
    datasets: [
      {
        label: "total couriers",
        data: datasets.map((dataset) => dataset.total_opened),
        backgroundColor: "#0020ff",
      },
      {
        label: "valide avent deadline",
        data: datasets.map((dataset) => dataset.total_closed_before_deadline),
        backgroundColor: "#00ff97",
      },
      {
        label: "valide apreé deadline",
        data: datasets.map((dataset) => dataset.total_closed_after_deadline),
        backgroundColor: "#ffd800",
      },
      {
        label: "non validé",
        data: datasets.map((dataset) => dataset.total_not_validated),
        backgroundColor: "#ff9dbc",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Empêche le canvas de s'étirer
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Statistiques des ventes" },
    },
  };

  return (
    <div style={{ width: "600px", height: "400px" }}>
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default BarChart;
