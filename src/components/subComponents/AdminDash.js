import React, { useEffect, useState } from "react";
import Liner from "../graph/Liner";
import BarGraph from "../graph/BarGraph";
import { useSelector } from "react-redux";
import { Card, Progress, Select } from "antd";
import Grid from "@mui/material/Grid";
import { firestoreDb } from "../../firebase";
import {
  getDocs,
  query,
  collection,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { async } from "@firebase/util";

const { Option } = Select;
export default function AdminDash() {
  const [students, setStudents] = useState([]);
  const [male, setMale] = useState([]);
  const [female, setfemale] = useState([]);
  const [teachermale, setmaleteacher] = useState([]);
  const [teacherfemale, setfemailteacher] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [studentAttendance, setstudentAttendance] = useState([]);
  const [attendStudents, setAttendStudents] = useState();
  const school = useSelector((state) => state.user.profile.school);
  const [classes, setClasses] = useState([]);

  const schools = useSelector((state) => state.user.profile);

  var Student = [];
  const value = new Date();
  const date = value.getDate() < 10 ? "0" + value.getDate() : value.getDate();
  const month =
    value.getMonth() + 1 < 10
      ? "0" + (value.getMonth() + 1)
      : value.getMonth() + 1;
  const year = value.getFullYear();

  const filterDate = year + "-" + month + "-" + date;

  const getStudents = async () => {
    const q = query(collection(firestoreDb, "schools", `${school}/students`));
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();
      data.key = doc.id;
      temporary.push(data);
    });
    var male = temporary.filter((doc) => doc.sex === "Male");
    var femail = temporary.filter((doc) => doc.sex === "Female");
    Student = temporary;
    setStudents(temporary);
    setMale(male);
    setfemale(femail);
  };

  useEffect(() => {
    getStudents();
    getAbsentStudent();
    getTeacher();
  }, []);

  const getTeacher = async () => {
    const q = query(collection(firestoreDb, "schools", `${school}/teachers`));
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

  const getAbsentClass = async () => {
    var temporary = [];

    const queryCourse = query(
      collection(firestoreDb, "schools", `${school}/class`)
    );

    const snapCourse = await getDocs(queryCourse);
    snapCourse.forEach(async (doc) => {
      var data = doc.data();
      data.student.map(
        async (doc, i) => (data.student[i] = await getStudentsSex(doc))
      );
      temporary.push(data);
    });
    setClasses(temporary);
  };

  const getStudentsSex = async (ID) => {
    const docRef = doc(firestoreDb, "schools", `${school}/students`, ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };

  const getAbsentStudent = async () => {
    getAbsentClass();
    var temporary = [];
    const queryCourse = query(
      collection(firestoreDb, "schools", `${school}/courses`)
    );
    const snapCourse = await getDocs(queryCourse);

    snapCourse.forEach(async (docs) => {
      const queryAttendace = query(
        collection(firestoreDb, "attendanceanddaily", `${docs.id}/attendace`),
        where("date", "==", filterDate)
      );

      const snap = await getDocs(queryAttendace);
      snap.forEach((doc) => {
        var data = doc.data();
        data.key = data.id;
        var hasData = false;
        temporary.forEach((item) => {
          if (item.studentId == data.studentId) {
            hasData = true;
          }
        });
        if (!hasData) {
          temporary.push(data);
        }
      });
    });
    setTimeout(() => {
      const calc = ((Student.length - temporary.length) / Student.length) * 100;
      setAttendStudents(calc);
      setstudentAttendance(temporary);
    }, 1000);
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
      <p className="text-center text-[#344054] text-[24px] font-bold align-middle -mt-16 mb-8 border-b-[#EAECF0] border-b-[2px]">
        Hello Admin
      </p>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid item xs={12} sm={12} md={4}>
          <Card
            bordered={true}
            className="w-[100%] min-h-[419px] h-[100%]"
            title={
              <h1 className="text-[#475467] font-[600] mb-[10px]">
                Todays Attendance
              </h1>
            }
          >
            <div className="flex flex-row w-[100%] flex-wrap justify-around">
              <div className=" flex flex-col justify-center">
                <Progress
                  type="circle"
                  strokeColor={"#EA8848"}
                  percent={parseFloat(attendStudents).toFixed(1)}
                  width={"9rem"}
                />
              </div>
              <div className="flex flex-col justify-center ">
                <h1 className="text-[16px] flex flex-row">
                  {" "}
                  <a className="w-5 mr-2 h-2 mt-2 bg-[#475467] rounded-lg"></a>
                  {studentAttendance.length} Absent Students
                </h1>
                <h1 className="text-[16px] flex flex-row">
                  {" "}
                  <a className="w-5 mr-2 h-2 mt-2 bg-[#98A2B3] rounded-lg"></a>
                  {students.length - studentAttendance.length} Present Students
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
                    {true ? (
                      <h1 className="w-60%  text-gray-400 h-10 p-4">No Data</h1>
                    ) : (
                      <Progress
                        type="circle"
                        strokeColor={"#EA8848"}
                        percent={75}
                        width={"6rem"}
                      />
                    )}
                  </div>
                  <h1 className="text-center">Weekly</h1>
                </div>
                <div>
                  <div className="relative flex flex-col justify-center">
                    {true ? (
                      <h1 className="w-60%  text-gray-400 h-10 p-4">No Data</h1>
                    ) : (
                      <Progress
                        type="circle"
                        strokeColor={"#EA8848"}
                        percent={75}
                        width={"6rem"}
                      />
                    )}
                  </div>
                  <h1 className="text-center">Monthly</h1>
                </div>
                <div>
                  <div className="relative flex flex-col justify-center">
                    {true ? (
                      <h1 className="w-60%  text-gray-400 h-10 p-4">No Data</h1>
                    ) : (
                      <Progress
                        type="circle"
                        strokeColor={"#EA8848"}
                        percent={75}
                        width={"6rem"}
                      />
                    )}
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
                  percent={100}
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
                  percent={100}
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
            <Liner datas={students} />
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
                  percent={100}
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
                    percent:
                      (teacherfemale.length * 100) /
                      (teachermale.length + teacherfemale.length),
                  }}
                />
                <div className="flex flex-row justify-between">
                  <h1 className="text-[14px] ">Femail</h1>
                  <h1 className="text-[14px]">Male</h1>
                </div>
              </div>
            </div>

            <Liner datas={teacherData} />
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Card bordered={true} className="w-[100%]  mb-10">
            <div className="flex flex-row justify-between align-bottom">
              <div>
                <h1 className="text-4xl text-[#0B1354]">{students.length}</h1>
                <h1 className="text-[16px] text-[#98A2B3]">Student Number</h1>
              </div>
              <div className="w-[100px]">
                <Select defaultValue={1} style={{ width: "100%" }}>
                  <Option value={1}>2022</Option>
                </Select>
              </div>
            </div>
            {classes.length ? <BarGraph datas2={classes} /> : null}
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
