import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Enregistrement des composants nécessaires
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const chartRef = useRef(null); // Ajout du useRef pour s'assurer que le DOM est prêt

  const data = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        label: "Ventes",
        data: [50, 80, 45, 90, 120, 60],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
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
