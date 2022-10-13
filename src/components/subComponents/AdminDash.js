import React, { useEffect, useState } from "react";
import Liner from "../graph/Liner";
import BarGraph from "../graph/BarGraph";
import { useSelector } from "react-redux";
import { Card, Progress } from "antd";
import Grid from "@mui/material/Grid";
import { firestoreDb } from "../../firebase";
import { getDocs, query, collection, where } from "firebase/firestore";

export default function AdminDash() {
  const [students, setStudents] = useState([]);
  const [male, setMale] = useState([]);
  const [female, setfemale] = useState([]);
  const [teachermale, setmaleteacher] = useState([]);
  const [teacherfemale, setfemailteacher] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const schools = useSelector((state) => state.user.profile);
  const getStudents = async () => {
    const q = query(
      collection(firestoreDb, "students"),
      where("school_id", "==", schools.school)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();
      data.key = doc.id;

      temporary.push(data);
    });
    var male = temporary.filter((doc) => doc.sex === "Male");
    var femail = temporary.filter((doc) => doc.sex === "Female");
    setMale(male);
    setfemale(femail);
    setStudents(temporary);
  };
  useEffect(() => {
    getStudents();
    getTeacher();
  }, []);

  const getTeacher = async () => {
    const q = query(
      collection(firestoreDb, "teachers"),
      where("school_id", "==", schools.school)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();
      temporary.push(data);
    });
    var male = temporary.filter((doc) => doc.sex === "Male");
    var femail = temporary.filter((doc) => doc.sex === "Female");
    setfemailteacher(femail);
    setmaleteacher(male);
    setTeacherData(temporary);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
        width: "100%",
      }}
    >
      <p className="text-center text-[#344054] text-[24px] font-bold align-middle -mt-16 mb-8">
        Hello Admin
      </p>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} md={4}>
          <Card
            bordered={true}
            className="w-[100%] min-h-[419px]"
            title={
              <h1 className="text-[#475467] font-[600] mb-[10px]">
                Todays Attendance
              </h1>
            }
          >
            <div className="flex flex-row w-[100%] flex-wrap justify-between">
              <div className=" flex flex-col justify-center">
                <Progress type="circle" strokeColor={"#EA8848"} percent={75} />
              </div>
              <div className="flex flex-col justify-center  ">
                <h1 className="text-md flex flex-row">
                  {" "}
                  <a className="w-5 mr-2 h-2 mt-2 bg-[#475467] rounded-lg"></a>7
                  Absent Students
                </h1>
                <h1 className="text-md flex flex-row">
                  {" "}
                  <a className="w-5 mr-2 h-2 mt-2 bg-[#98A2B3] rounded-lg"></a>2
                  Absent Teachers
                </h1>
              </div>
            </div>
            <h1
              style={{
                fontWeight: "bold",
                marginBottom: 40,
                marginTop: 30,
                fontSize: 18,
              }}
            ></h1>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <div>
                  <div className="relative flex flex-col justify-center">
                    <Progress
                      type="circle"
                      strokeColor={"#EA8848"}
                      percent={75}
                      width={"10vh"}
                    />
                  </div>
                  <h1 className="text-center">Weekly</h1>
                </div>
                <div>
                  <div className="relative flex flex-col justify-center">
                    <Progress
                      type="circle"
                      strokeColor={"#EA8848"}
                      percent={75}
                      width={"10vh"}
                    />
                  </div>
                  <h1 className="text-center">Monthly</h1>
                </div>
                <div>
                  <div className="relative flex flex-col justify-center">
                    <Progress
                      type="circle"
                      strokeColor={"#EA8848"}
                      percent={75}
                      width={"10vh"}
                    />
                  </div>
                  <h1 className="text-center">Yearly</h1>
                </div>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            bordered={true}
            className="w-[100%] min-h-[419px]"
            title={
              <h1 className="text-[#475467] font-[600] mb-[10px]">
                Student Number
              </h1>
            }
          >
            <div>
              <div>
                <h1 className="text-[18px] font-semibold">{students.length}</h1>
                <Progress
                  strokeColor={"#EA8848"}
                  percent={(100 * students.length) / 20}
                  showInfo={false}
                />
                <h1 className="text-[14px] ">Total</h1>
              </div>
              <div>
                <div className="flex flex-row justify-between">
                  <h1 className="text-[18px] font-semibold">{male.length}</h1>
                  <h1 className="text-[18px] font-semibold">{female.length}</h1>
                </div>
                <Progress
                  strokeColor={"#EA8848"}
                  percent={(100 * female.length) / students.length}
                  showInfo={false}
                  success={{
                    percent: (100 * male.length) / students.length,
                  }}
                />
                <div className="flex flex-row justify-between">
                  <h1 className="text-[14px] ">Femail</h1>
                  <h1 className="text-[14px]">Male</h1>
                </div>
              </div>
            </div>
            <Liner />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            bordered={true}
            className="w-[100%] min-h-[419px]"
            title={
              <h1 className="text-[#475467] font-[600] mb-[10px]">
                Teacher Number
              </h1>
            }
          >
            <div>
              <div>
                <h1 className="text-[18px] font-semibold">
                  {teacherData.length}
                </h1>
                <Progress
                  strokeColor={"#EA8848"}
                  percent={(100 * teacherData.length) / 20}
                  showInfo={false}
                />
                <h1 className="text-[14px] ">Total</h1>
              </div>
              <div>
                <div className="flex flex-row justify-between">
                  <h1 className="text-[18px] font-semibold">
                    {teacherfemale.length}
                  </h1>
                  <h1 className="text-[18px] font-semibold">
                    {teachermale.length}
                  </h1>
                </div>
                <Progress
                  strokeColor={"#EA8848"}
                  percent={100}
                  showInfo={false}
                  success={{
                    percent: 60,
                  }}
                />
                <div className="flex flex-row justify-between">
                  <h1 className="text-[14px] ">Femail</h1>
                  <h1 className="text-[14px]">Male</h1>
                </div>
              </div>
            </div>
            <Liner />
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Card bordered={true} className="w-[100%]  mb-10">
            <BarGraph />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
