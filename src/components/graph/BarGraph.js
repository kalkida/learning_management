import React, { useEffect, useState } from "react";
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

export default function BarGraph({ datas2 }) {

  const [labels, setLable] = useState([]);
  const [student, setStudent] = useState([]);

  useEffect(() => {
    const temporary = [];
    const temporary2 = [];
    datas2.map((item, index) => {
      var male = item.student.filter((doc) => doc.sex === "Male");
      var female = item.student.filter((doc) => doc.sex === "Female");
      temporary2.push({ male: male.length, female: female.length });
      temporary.push("Grade " + item.level + item.section)
    });

    setLable(temporary);
    setStudent(temporary2);
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "Male",
        data: labels.map((item, index) => student[index].male),
        backgroundColor: "#EA8848",
        innerHeight: "20vh",
      },
      {
        label: "Female",
        data: labels.map((item, index) => student[index].female),
        backgroundColor: "#F6C9AC",
      },
    ],
  };
  return <Bar options={options} data={data} />;
}
