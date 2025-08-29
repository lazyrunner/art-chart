"use client";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  scales,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Papa from "papaparse";
import useInterval from "./interval";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Personality classification",
    },
  },
  // animation: {
  //   duration: 1000, // Animation duration in milliseconds
  //   easing: "easeInOutQuad", // Easing function for smoother transitions
  //   // You can also target specific properties for animation:
  //   tension: {
  //     duration: 5000,
  //     easing: "linear",
  //     from: 0, // Starting tension
  //     to: 0.4, // Ending tension
  //     loop: true, // Loop the animation
  //   },
  // },
  scales: {
    y: {
      min: -2,
      max: 2,
      ticks: {
        stepSize: 1, // ensures it hits -2, -1, 0, 1, 2
        callback: function (value) {
          switch (value) {
            case -2:
              return "Less Likely";
            case 0:
              return "Neutral";
            case 2:
              return "More Likely";
            default:
              return ""; // hide other ticks
          }
        },
      },
    },
  },
};

export const initialData = {
  labels: [],
  datasets: [],
};

export default function Home() {
  const [data, setData] = useState(initialData);
  const [allRows, setAllRows] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    Papa.parse("/data.csv", {
      download: true,
      header: true,
      complete: (result) => {
        setAllRows(result.data.slice(0, -1)); // slice(-1) removes empty row if present
        setData({
          ...data,
          labels: Object.keys(result.data[0]),
          datasets: [
            {
              data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              borderColor: `hsl(0, 100%, 0%)`,
            },
          ],
        });
      },
    });
  }, []);

  useInterval(() => {
    // Your custom logic here
    setCount(count + 1);
    setData({
      ...data,
      labels: Object.keys(allRows[count]),
      datasets: [
        ...data.datasets,
        {
          data: Object.values(allRows[count]),
          borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
        },
      ],
    });
  }, 3000);

  const handleClick = () => {
    const newDatasets = {
      label: "Looping tension2",
      data: [64, 40, 10, 11, 23, 45, 30],
      fill: false,
      borderColor: "rgb(7, 1, 192)",
    };
    setData((currData) => ({
      ...currData,
      datasets: [...currData.datasets, newDatasets],
    }));
  };
  return (
    <div className="grid">
      <div>
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
