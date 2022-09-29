import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Tabs,
  Table,
  Tag,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { firestoreDb } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

import "./style.css";

function ViewStudent() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [courses, setCourses] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const { data } = state;
  const [age, setAge] = useState();

  const getClassData = async (id) => {
    console.log(id);
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
    getClassData(data.courses);
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

  return (
    <>
      <div>
        <div className="profile-header -mt-10">
          <div className="teacher-avater -ml-5">
            <img src={data.avater ? data.avater : "img-5.jpg"} alt="profile" />
            <div className="profile-info">
              <h2 className="text-2xl capitalize">
                {data.first_name + " " + data.last_name}
              </h2>
            </div>
          </div>
          <div className="header-extra">
            <div>
              <h3 className="text-xl">Class</h3>
              <h4 className="text-lg text-[#E7752B]">
                {data.class.level + data.class.section}
              </h4>
            </div>
            <div>
              <h3 className="text-xl">Assigned Course</h3>
              <h4 className="text-[#E7752B] text-lg">{data?.courses.length}</h4>
            </div>
          </div>
        </div>
        <div className="tab-content">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Profile" key="1">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="flex flex-row justify-between border-[1px] border-[#e5e5e5] p-2">
                <div className="flex flex-col justify-center align-middle">
                  <h1 className="text-3xl text-center">{data.class.level}</h1>
                  <span className="text-3xl">Grade</span>
                </div>
                <div className="flex flex-col justify-center align-middle">
                  <h1 className="text-3xl text-center">2</h1>
                  <span className="text-3xl">Sibilings</span>
                </div>
                <div className="flex flex-col justify-center align-middle">
                  <h1 className="text-3xl text-center">4</h1>
                  <span className="text-3xl">Rank</span>
                </div>
                <div className="flex flex-col justify-center align-middle">
                  <h1 className="text-3xl text-center">A</h1>
                  <span className="text-3xl">Conduct</span>
                </div>
              </div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginTop: "3%",
                  marginBottom: "2%",
                }}
              >
                Student Information
              </h1>
              <div className="teacher-static border-[1px] border-[#e2e2e2] py-2">
                <div>
                  <span>Age</span>
                  <h2 style={{ fontSize: 14, fontWeight: "bold" }}>{age}</h2>
                </div>
                <div>
                  <span>Sex</span>
                  <h2 style={{ fontSize: 14, fontWeight: "bold" }}>
                    {data.sex}
                  </h2>
                </div>
                <div>
                  <span>Phone Number</span>
                  <h2 style={{ fontSize: 14, fontWeight: "bold" }}>
                    {data.phone[0]}
                  </h2>
                </div>
                <div>
                  <span>Email</span>
                  <h2 style={{ fontSize: 14, fontWeight: "bold" }}>
                    {data.email}
                  </h2>
                </div>
                <div>
                  <span>Location</span>
                  <h2 style={{ fontSize: 14, fontWeight: "bold" }}>Lideta</h2>
                </div>
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
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default ViewStudent;
