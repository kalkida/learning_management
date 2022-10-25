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
  const [lable, setLable] = useState([]);
  const [student, setStudent] = useState([]);
  useEffect(() => {
    const temporary = [];
    const temporary2 = [];
    datas2.map((item, index) => {
      temporary2.push(item.student?.length);
    });
    setStudent(temporary2);
    console.log(temporary);
    setLable(temporary);
  }, []);
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

  const data = {
    lable,
    datasets: [
      {
        label: "Male",
        data: labels.map(() => student),
        backgroundColor: "#EA8848",
        innerHeight: "20vh",
      },
      // {
      //   label: "Female",
      //   data: lable.map(() => student),
      //   backgroundColor: "#F6C9AC",
      // },
    ],
  };
  return <Bar options={options} data={data} />;
}
