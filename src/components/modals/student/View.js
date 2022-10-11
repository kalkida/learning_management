import React, { useEffect, useState } from "react";
import { Button, Tabs, Table, Tag, Calendar, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { firestoreDb } from "../../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  startAt,
  orderBy,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import BarGraphe from "../../graph/BarGraph";
import { fetchSubject, fetchParents } from "../funcs";
import moment from "moment";

import "./style.css";

function ViewStudent() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [courses, setCourses] = useState([]);
  const [guardian, setGuardian] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const { data } = state;
  const [age, setAge] = useState();

  const getClassData = async (id) => {
    const q = query(
      collection(firestoreDb, "courses"),
      where("course_id", "in", id)
    );
    const querySnapshot = await getDocs(q);
    var temporary = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      temporary.push(data);
    });
    var fil = temporary.filter(async function (doc) {
      doc.subject = await fetchSubject(doc.subject);
      return doc;
    });
    console.log("temporary: " + fil);
    setCourses(temporary);
    var guardians = await fetchParents(data.phone);
    setGuardian(guardians);
    setLoadingCourse(false);
  };

  useEffect(() => {
    var today = new Date();
    var birthDate = new Date(JSON.parse(data.DOB));
    var calage = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calage--;
    }
    getClassData(data.class.course);
    setAge(calage);
    getAttendace();
  }, []);

  const getAttendace = async () => {
    var temporary = [];
    data.class.course?.map(async (item, i) => {
      const q = query(
        collection(firestoreDb, "attendanceanddaily", `${item}/attendace`),
        where("studentId", "==", data.key)
      );
      const snap = await getDocs(q);

      snap.forEach((doc) => {
        var data = doc.data();
        data.key = doc.id;
        temporary.push(data);
      });
    });

    setTimeout(() => {
      temporary?.map((item, index) => {
        var month = new Date(item.date).getMonth();
        attendanceData[month].absentDays.push(item.date);
      });
    }, 500);
  };

  const handleUpdate = () => {
    navigate("/update-student", { state: { data } });
  };

  const columns = [
    {
      title: "Course",
      dataIndex: "course_name",
      key: "course_name",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
  ];

  const getListData = (currentDate, value) => {
    let listData;
    // console.log(value)
    value.forEach((element) => {
      const Dates = new Date(element);

      if (
        Dates.getDate() === currentDate.date() &&
        Dates.getMonth() === currentDate.month()
      ) {
        listData = [
          {
            type: "#eb3131",
            content: Dates.getDate(),
          },
        ];
      }
    });
    return listData || [];
  };

  const dateCellRender = (date, value) => {
    const listData = getListData(date, value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Tag color={item.type}>{item.content}</Tag>
          </li>
        ))}
      </ul>
    );
  };

  const [attendanceData, setAttendanceData] = useState([
    {
      month: "January",
      defaultDate: new Date().getFullYear() + "-1-1",
      absentDays: [],
    },
    {
      month: "February",
      defaultDate: new Date().getFullYear() + "-2-1",
      absentDays: [],
    },
    {
      month: "March",
      defaultDate: new Date().getFullYear() + "-3-1",
      absentDays: [],
    },
    {
      month: "April",
      defaultDate: new Date().getFullYear() + "-4-1",
      absentDays: [],
    },
    {
      month: "May",
      defaultDate: new Date().getFullYear() + "-5-1",
      absentDays: [],
    },
    {
      month: "June",
      defaultDate: new Date().getFullYear() + "-6-1",
      absentDays: [],
    },
    {
      month: "July",
      defaultDate: new Date().getFullYear() + "-7-1",
      absentDays: [],
    },
    {
      month: "Augest",
      defaultDate: new Date().getFullYear() + "-8-1",
      absentDays: [],
    },
    {
      month: "September",
      defaultDate: new Date().getFullYear() + "-9-1",
      absentDays: [],
    },
    {
      month: "October",
      defaultDate: new Date().getFullYear() + "-10-1",
      absentDays: [],
    },
    {
      month: "November",
      defaultDate: new Date().getFullYear() + "-11-1",
      absentDays: [],
    },
    {
      month: "December",
      defaultDate: new Date().getFullYear() + "-12-1",
      absentDays: [],
    },
  ]);

  return (
    <div className="-mt-[7%] h-[100vh] overflow-scroll main scroll-smooth">
      <div className="flex flex-row justify-between border-b-[2px] py-10 px-2">
        <div className="flex flex-row w-[30%] justify-between">
          <img
            className="rounded-full w-[8vw] border-[2px]"
            src={data.avater ? data.avater : "img-5.jpg"}
            alt="profile"
          />
          <div className="flex flex-col justify-start align-baseline mt-2 w-[13vw] ">
            <h2 className="text-xl font-bold capitalize text-[#344054] font-serif" 
           >
              {data.first_name + " " + data.last_name}
            </h2>
            <p className="text-[14px] text-[gray] p-1 font-serif" 
             style={{fontFamily:'Plus Jakarta Sans',
             }}
            >ID: {data.studentId}</p>
            <a className="border-[0px] border-[#E7752B]  rounded-lg flex flex-row  text-[#E7752B] hover:text-[#E7752B] ">
              <FontAwesomeIcon
                icon={faMessage}
                className="p-1 text-[#E7752B]"
              />
              Contacts
            </a>
          </div>
        </div>
        <div className="header-extra"></div>
      </div>
      <div className="tab-content">
        <Tabs defaultActiveKey="0">
          <Tabs.TabPane tab={
                 <p className="text-xl font-bold text-center ml-5 font-serif">OverView</p>
            } key="0">
            <div className="flex flex-row flex-wrap justify-between align-middle text-[#344054]">
              <div className="border-[#D0D5DD] border-[1px] w-[30%] h-[40vh] mb-2 rounded-sm bg-[#FCFCFD]">
                <div className="mt-10 flex flex-row justify-around">
                  <h1 className="text-lg font-serif " 
              >Class {data.class?.level}</h1>
                  <h1 className="text-lg font-serif "
                  >Section {data.class?.section}</h1>
                </div>
                <div className="mt-10 flex flex-row justify-around">
                  <h1 className="text-lg font-serif "
                      // style={{fontFamily:'Plus Jakarta Sans',
                      // fontWeight:'600',lineHeight:'28px',fontSize:'18px',color:'#667085'
                      // }}
                  >Class {data.class?.level}</h1>
                  <h1 className="text-lg font-serif "
                     
                  >Section {data.class?.section}</h1>
                </div>
              </div>
              <div className="border-[#D0D5DD] border-[1px] w-[30%] h-[40vh] mb-2 rounded-sm bg-[#FCFCFD]">
                <div className="p-10 text-lg font-bold font-serif">
                  <h1  
                  // style={{fontFamily:'Plus Jakarta Sans',
                  //     fontWeight:'700',lineHeight:'20px',fontSize:'16px'
                  //     }}
                      >Conduct Board</h1>
                </div>
              </div>
              <div className="border-[#D0D5DD] border-[1px] w-[30%] h-[40vh] mb-2 rounded-sm bg-[#FCFCFD]">
                <div className="p-10 text-lg font-bold font-serif">
                  <h1 >Grade Board</h1>
                </div>
              </div>
              <div className="border-[#D0D5DD] border-[1px] w-[30%]  mb-2 mt-10 bg-[#FCFCFD]">
                <div className="p-10 ">
                  <h1 className="mb-4 text-lg font-bold font-serif">Daily Report</h1>
                  <div className="flex flex-col justify-between overflow-scroll">
                    {[0, 1, , 2, 3].map((item, index) => (
                      <div className="w-[100%]  border-[2px] rounded-md mb-2 p-2">
                        <h1 className="text-lg font-bold font-serif">Biology Teacher </h1>
                        <p>
                          Class aptent taciti sociosqu ad litora torquent per
                          conubia nostra, per inceptos himenaeos.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-[#D0D5DD] border-[1px] w-[65%]  mb-2 h-[50vh] mt-10 bg-[#FCFCFD]">
                <BarGraphe />
              </div>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab={
                 <p className="text-xl font-bold text-center ml-5 font-serif">Profile</p>
            } key="1">
            <Button className="btn-confirm" onClick={handleUpdate}>
              Edit Profile
            </Button>
            <div className="flex flex-row justify-around border-[0px] border-[#e5e5e5] p-4 text-[#344054]">
              <div className="flex flex-col justify-center align-middle text-[#344054]">
                <h1 className="text-[48px] text-center text-[#344054] font-bold font-serif" 
                      >
                  {data.class?.level}
                </h1>
                <span className="text-lg text-center text-[#344054] font-serif"
                >
                  Grade
                </span>
              </div>
              <div className="flex flex-col justify-center align-middle text-[#344054] ">
                <h1 className="text-[48px] text-center font-bold font-serif " 
                >2</h1>
                <span className="text-lg font-serif"
                >Sibilings</span>
              </div>
              <div className="flex flex-col justify-center align-middle text-[#344054]">
                <h1 className="text-[48px] text-center font-bold font-serif"
                >4</h1>
                <span className="text-lg font-serif"  
               >Rank</span>
              </div>
              <div className="flex flex-col justify-center align-middle text-[#344054]">
                <h1 className="text-[48px] text-center font-bold font-serif"
                >A</h1>
                <span className="text-lg font-serif"  
               >Conduct</span>
              </div>
            </div>
            <h1
              className="text-[#344054] font-serif"
              style={{
                fontSize: 24,
                fontWeight: "600",
              fontFamily:'Plus Jakarta Sans',
                marginTop: "3%",
                marginBottom: "2%",
              }}
            >
              Student Information
            </h1>
            <div className="flex flex-row justify-between border-b-[2px] border-[#e2e2e2] py-2 px-2">
              <div>
                <span className="text-[16px] text-left text-[#344054] font-serif"
                >
                  Age
                </span>
                <h2 className="text-left text-[16px] font-bold font-serif" 
                >{age}</h2>
              </div>
              <div>
                <span className="text-[16px] text-left text-[#344054] font-serif"
                >
                  Sex
                </span>
                <h2 className="text-left text-[14px] font-bold text-[#344054] font-serif"
                >
                  {data.sex}
                </h2>
              </div>
              <div>
                <span className="text-[16px] text-left text-[#344054] font-serif"
                >
                  Phone Number
                </span>
                {data.phone.map((item, index) => (
                  <h2 className="text-left text-[14px] font-bold text-[#344054] font-serif"
                  >
                    {item}
                  </h2>
                ))}
              </div>
              <div>
                <span className="text-[16px] text-left text-[#344054] font-serif"
                >
                  Email
                </span>
                <h2 className="text-left text-[14px] font-bold font-serif"
                >
                  {data.email}
                </h2>
              </div>
              <div>
                <span className="text-[16px] text-[#344054] font-serif" 
                // style={{fontFamily:'Plus Jakarta Sans',
                // fontWeight:'500', fontSize:16,color:'#667085'
                // }}
                >Location</span>
                <h2 
                 className="text-left text-[14px] font-bold font-serif"
                // style={{fontFamily:'Plus Jakarta Sans',
                //  fontWeight:'600', fontSize:18
                //  }}
                 >Lideta</h2>
              </div>
            </div>
            <div className="mt-10 mb-10">
              <h1 className="text-xl font-bold mb-10 font-serif">
                Guardian Information</h1>
              {guardian.map((item, index) => (
                <div className="border-b-[2px] mt-2 flex flex-row justify-between w-[50vw] py-2">
                  <div>
                    <h1 className="text-lg font-serif mt-3 mb-10"    
              >Guardian {index + 1}</h1>
                  </div>
                  <div>
                    <span className="font-light text-xs font-serif">Phone Number</span>
                    <h1>{item.phoneNumber}</h1>
                  </div>
                  <div>
                    <span className="font-light text-xs font-serif">Email</span>
                    <h1>{item.email}</h1>
                  </div>
                  <div>
                    <span className="font-light text-xs text-left font-serif">
                      Full Name
                    </span>
                    <h1>{item.fullName}</h1>
                  </div>
                  <div>
                    <span className="font-light text-xs font-serif">Type</span>
                    <h1>{item.type}</h1>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={
                 <p className="text-xl font-bold text-center ml-5 font-serif">Course</p>
            } key="2">
            <Button className="btn-confirm" onClick={handleUpdate}>
              Edit Profile
            </Button>
            <div className="teacher-course-list">
              <div className="tch-cr-list">
                <h1 className="text-xl font-bold text-center ml-5 font-serif">Assigned Courses</h1>
              </div>
              <Table
                loading={loadingCourse}
                dataSource={courses}
                columns={columns}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={
                 <p className="text-xl font-bold text-center ml-5 font-serif">Attendance</p>
            } key="3">
            <Button className="btn-confirm" onClick={handleUpdate}>
              Edit Profile
            </Button>
            <div className="st-at">
              <h1 className="text-xl font-bold mb-10 font-serif"> Attendance</h1>
              <div>
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="Monthly" key="1">
                    <div className="st-at-tags">
                      <div>
                        <Tag color="#eb3131">5</Tag>
                        <Tag color="red">Days Absent</Tag>
                      </div>
                      <div>
                        <Tag color="#ebb031">3</Tag>
                        <Tag color="gold">Days Late</Tag>
                      </div>
                      <div>
                        <Tag color="#9beb31">4</Tag>
                        <Tag color="lime">Days Present</Tag>
                      </div>
                      <div>
                        <Tag color="#31b6eb">0</Tag>
                        <Tag color="blue">Days without Records</Tag>
                      </div>
                    </div>

                    <div className="calender-card">
                      {attendanceData?.map((item, index) => (
                        <div key={index} className="site-calendar-card">
                          <Calendar
                            value={moment(item.defaultDate)}
                            headerRender={() => {
                              return (
                                <div
                                  style={{ padding: 8, textAlign: "center" }}
                                >
                                  <Typography.Title level={4}>
                                    {" "}
                                    {item.month}
                                  </Typography.Title>
                                </div>
                              );
                            }}
                            dateCellRender={(date) =>
                              dateCellRender(date, item.absentDays)
                            }
                            fullscreen={false}
                          />
                        </div>
                      ))}
                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Yearly" key="2">
                    <h1>Yearly</h1>
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewStudent;
