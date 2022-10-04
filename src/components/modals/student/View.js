import React, { useEffect, useState } from "react";
import { Button, Tabs, Table, Tag, Calendar, Col, Radio, Row, Select, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { firestoreDb } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import BarGraphe from "../../graph/BarGraph";
import moment from 'moment';


import "./style.css";

function ViewStudent() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [courses, setCourses] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const value = moment('2017-01-25');
  const { data } = state;
  const [age, setAge] = useState();

  const getClassData = async (id) => {
    console.log("ids", id);
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
    console.log(id);
    setCourses(temporary);
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

    setAge(calage);
    if (data.courses) {
      getClassData(data.courses);
    } else {
      setLoadingCourse(false);
    }
  }, []);

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

  const getListData = (value) => {
    let listData;
    const Dates = new Date(value);
    console.log(typeof Dates.getDate())
    switch (Dates.getDate()) {
      case 31:
        listData = [
          {
            type: "#eb3131",
            content: 'A',
          },

        ];
        break;

      case 10:
        listData = [
          {
            type: "#eb3131",
            content: '10',
          },
        ];
        break;

      case 15:
        listData = [
          {
            type: "#eb3131",
            content: '15',
          },
        ];
        break;
      case 4:
        listData = [
          {
            type: "#9beb31",
            content: '04',
          },
        ];
        break;
      default:
    }

    return listData || [];
  };


  const dateCellRender = (value) => {
    console.log(value)
    value.forEach(element => {
      const listData = getListData(element);
      console.log(listData)
      return (
        <ul className="events">
          {listData.map((item) => (
            <li key={item.content}>
              <Tag color={item.type} >{item.content}</Tag>
            </li>
          ))}
        </ul>
      );
    });

  };

  const attendanceData = [
    {
      month: "January",
      absentDays: ["2022-1-15", "2022--11", "2022-1-19", "2022-1-5", "2022-1-25", "2022-1-31"]
    },
    {
      month: "February",
      absentDays: ["2022-2-15", "2022-2-11", "2022-2-19", "2022-2-5", "2022-2-25", "2022-2-31"]
    },
    {
      month: "March",
      absentDays: ["2022-3-15", "2022-3-11", "2022-3-19", "2022-3-5", "2022-3-25", "2022-3-31"]
    },
    {
      month: "April",
      absentDays: ["2022-4-15", "2022-4-11", "2022-4-19", "2022-4-5", "2022-4-25", "2022-4-31"]
    },
    {
      month: "May",
      absentDays: ["2022-5-15", "2022-5-11", "2022-5-19", "2022-5-5", "2022-5-25", "2022-5-31"]
    },
    {
      month: "June",
      absentDays: ["2022-6-15", "2022-6-11", "2022-6-19", "2022-6-5", "2022-6-25", "2022-6-31"]
    },
    {
      month: "July",
      absentDays: ["2022-7-15", "2022-7-11", "2022-7-19", "2022-7-5", "2022-7-25", "2022-7-31"]
    },
    {
      month: "Augest",
      absentDays: ["2022-8-15", "2022-8-11", "2022-8-19", "2022-8-5", "2022-8-25", "2022-8-31"]
    },
    {
      month: "September",
      absentDays: ["2022-9-15", "2022-9-11", "2022-9-19", "2022-9-5", "2022-9-25", "2022-9-31"]
    },
    {
      month: "October",
      absentDays: ["2022-10-15", "2022-10-11", "2022-10-19", "2022-10-5", "2022-10-25", "2022-10-31"]
    },
    {
      month: "November",
      absentDays: ["2022-11-15", "2022-11-11", "2022-11-19", "2022-11-5", "2022-11-25", "2022-11-31"]
    },
    {
      month: "December",
      absentDays: ["2022-12-15", "2022-12-11", "2022-12-19", "2022-12-5", "2022-12-25", "2022-12-31"]
    },
  ]

  return (
    <div className="-mt-[7%]">
      <div className="flex flex-row justify-between border-[2px] py-10 px-2">
        <div className="flex flex-row w-[30%] justify-between">
          <img
            className="rounded-full w-[8vw] h-[15vh]"
            src={data.avater ? data.avater : "img-5.jpg"}
            alt="profile"
          />
          <div className="flex flex-col mt-2 ">
            <h2 className="text-2xl font-bold capitalize text-[#344054]">
              {data.first_name + " " + data.last_name}
            </h2>
            <p className="text-[14px] text-[gray] p-1">ID 000000</p>
            <a className="border-[2px] border-[#E7752B] p-2 rounded-lg flex flex-row justify-around hover:text-[#E7752B] w-[8vw]">
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
          <Tabs.TabPane tab="Overview" key="0">
            <div className="flex flex-row flex-wrap justify-between align-middle text-[#344054]">
              <div className="border-[#D0D5DD] border-[2px] w-[30%] h-[40vh] mb-2">
                <div className="mt-10 flex flex-row justify-around">
                  <h1 className="text-lg">Class {data.class?.level}</h1>
                  <h1 className="text-lg">Section {data.class?.section}</h1>
                </div>
                <div className="mt-10 flex flex-row justify-around">
                  <h1 className="text-lg">Class {data.class?.level}</h1>
                  <h1 className="text-lg">Section {data.class?.section}</h1>
                </div>
              </div>
              <div className="border-[#D0D5DD] border-[2px] w-[30%] h-[40vh] mb-2">
                <div className="p-10 text-lg font-bold">
                  <h1>Conduct Board</h1>
                </div>
              </div>
              <div className="border-[#D0D5DD] border-[2px] w-[30%] h-[40vh] mb-2">
                <div className="p-10 text-lg font-bold">
                  <h1>Grade Board</h1>
                </div>
              </div>
              <div className="border-[#D0D5DD] border-[2px] w-[30%]  mb-2">
                <div className="p-10 ">
                  <h1 className="mb-4 text-lg font-bold">Daily Report</h1>
                  <div className="flex flex-col justify-between overflow-scroll">
                    {[0, 1, , 2, 3].map((item, index) => (
                      <div className="w-[100%]  border-[2px] rounded-md mb-2 p-2">
                        <h1 className="text-lg font-bold">Biology Teacher </h1>
                        <p>
                          Class aptent taciti sociosqu ad litora torquent per
                          conubia nostra, per inceptos himenaeos.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-[#D0D5DD] border-[2px] w-[65%]  mb-2 h-[50vh]">
                <BarGraphe />
              </div>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Profile" key="1">
            <Button className="btn-confirm" onClick={handleUpdate}>
              Edit Profile
            </Button>
            <div className="flex flex-row justify-around border-[0px] border-[#e5e5e5] p-4 text-[#344054]">
              <div className="flex flex-col justify-center align-middle text-[#344054]">
                <h1 className="text-5xl text-center text-[#344054]">
                  {data.class?.level}
                </h1>
                <span className="text-lg text-center text-[#344054]">
                  Grade
                </span>
              </div>
              <div className="flex flex-col justify-center align-middle text-[#344054] ">
                <h1 className="text-5xl text-center ">2</h1>
                <span className="text-lg">Sibilings</span>
              </div>
              <div className="flex flex-col justify-center align-middle text-[#344054]">
                <h1 className="text-5xl text-center">4</h1>
                <span className="text-lg">Rank</span>
              </div>
              <div className="flex flex-col justify-center align-middle text-[#344054]">
                <h1 className="text-5xl text-center">A</h1>
                <span className="text-lg">Conduct</span>
              </div>
            </div>
            <h1
              className="text-[#344054]"
              style={{
                fontSize: 22,
                fontWeight: "bold",
                marginTop: "3%",
                marginBottom: "2%",
              }}
            >
              Student Information
            </h1>
            <div className="flex flex-row justify-around border-[1px] border-[#e2e2e2] py-2">
              <div>
                <span className="text-[16px] text-center text-[#344054]">
                  Age
                </span>
                <h2 className="text-center text-[14px] font-bold">{age}</h2>
              </div>
              <div>
                <span className="text-[16px] text-center text-[#344054]">
                  Sex
                </span>
                <h2 className="text-center text-[14px] font-bold text-[#344054]">
                  {data.sex}
                </h2>
              </div>
              <div>
                <span className="text-[16px] text-center text-[#344054]">
                  Phone Number
                </span>
                {data.phone.map((item, index) => (
                  <h2 className="text-center text-[14px] font-bold text-[#344054]">
                    {item}
                  </h2>
                ))}
              </div>
              <div>
                <span className="text-[16px] text-center text-[#344054]">
                  Email
                </span>
                <h2 className="text-center text-[14px] font-bold">
                  {data.email}
                </h2>
              </div>
              <div>
                <span className="text-[16px] text-[#344054]">Location</span>
                <h2 style={{ fontSize: 14, fontWeight: "bold" }}>Lideta</h2>
              </div>
            </div>
            <div className="mt-8">
              <h1 className="text-xl font-bold">Guardian Information</h1>
              {data.phone.map((item, index) => (
                <div className="border-b-[1px] mt-2 flex flex-row justify-between w-[40vw] p-2">
                  <div>
                    <h1 className="font-bold">Guardian {index + 1}</h1>
                  </div>
                  <div>
                    <span className="font-light text-xs">Phone Number</span>
                    <h1>{item}</h1>
                  </div>
                  <div>
                    <span className="font-light text-xs">Email</span>
                    <h1>john@gmail.com</h1>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Course" key="2">
            <Button className="btn-confirm" onClick={handleUpdate}>
              Edit Profile
            </Button>
            <div className="teacher-course-list">
              <div className="tch-cr-list">
                <h1>Assigned Courses</h1>
              </div>
              <Table
                loading={loadingCourse}
                dataSource={courses}
                columns={columns}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Attendance" key="3">
            <Button className="btn-confirm" onClick={handleUpdate}>
              Edit Profile
            </Button>
            <div className="st-at">
              <h1> Attendance</h1>
              <div>
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="Monthly" key='1'>
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
                        <div className="site-calendar-card">
                          <Calendar
                            // value={value}
                            headerRender={() => {
                              return (
                                <div style={{ padding: 8, textAlign: "center" }}>
                                  <Typography.Title level={4}> {item.month}</Typography.Title>
                                </div>
                              );
                            }}
                            dateCellRender={() => dateCellRender(item.absentDays)} fullscreen={false} />
                        </div>

                      ))}

                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Yearly" key='2'>
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
