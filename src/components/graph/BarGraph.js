import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import faker from "faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: false,
    title: false,
  },
};

const labels = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Male",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 60 })),
      backgroundColor: "#EA8848",
      innerHeight: "20vh",
    },
    {
      label: "Female",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 60 })),
      backgroundColor: "#F6C9AC",
    },
  ],
};

export default function BarGraph() {
  return <Bar options={options} data={data} />;
}
