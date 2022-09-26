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
import "./style.css";

const { Option } = Select;

function TeacherView() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { data } = state;
  const [weekClass, setWeekClass] = useState();
  const [age, setAge] = useState();
  const [expriance, setExpriance] = useState();

  // var getworkTime = new Date(JSON.parse(data.working_since));
  // const workTime = getworkTime.getFullYear() + "-" + getworkTime.getMonth() + "-" + getworkTime.getDay()

  useEffect(() => {
    var weekClassSum = 0;
    data.course?.map((item, i) => {
      weekClassSum += item.schedule.length;
    });

    var today = new Date();

    var birthDate = new Date(JSON.parse(data.DOB));
    var calage = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calage--;
    }

    var workDate = new Date(JSON.parse(data.working_since));
    var calwork = today.getFullYear() - workDate.getFullYear();
    var m = today.getMonth() - workDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < workDate.getDate())) {
      calwork--;
    }

    setWeekClass(weekClassSum);
    setAge(calage);
    setExpriance(calwork);
  }, []);

  const handleUpdate = () => {
    navigate("/update-teacher", { state: { data } });
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
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return (
          <div>
            {item.level}
            {"   "}
            {item.section}
          </div>
        );
      },
    },
  ];

  const classColumns = [
    {
      title: "Grade",
      dataIndex: "level",
      key: "course_name",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "secticon",
    },
  ];

  return (
    <>
      <div>
        <div className="profile-header">
          <div className="teacher-avater">
            <img src={data.avater ? data.avater : "img-5.jpg"} alt="profile" />
            <div className="profile-info">
              <h2>{data.first_name + " " + data.last_name}</h2>
              <h3>Contact</h3>
            </div>
          </div>
          <div className="header-extra-th">
            <div>
              <h3>Class</h3>
              <h4>
                {data.class?.map((item, i) => item.level + item.section + ",")}
              </h4>
            </div>
            <div>
              <h3>Subject</h3>
              <h4>{data.course?.map((item, i) => item.course_name + ",")}</h4>
            </div>
          </div>
        </div>
        <div className="tab-content">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Profile" key="1">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="teacher-static">
                <div>
                  <h1>7,8</h1>
                  <span>Assigned Grade</span>
                </div>
                <div>
                  <h1>{data.class.length}</h1>
                  <span>Classes</span>
                </div>
                <div>
                  <h1>{data.course.length}</h1>
                  <span>Course</span>
                </div>
                <div>
                  <h1>{weekClass}</h1>
                  <span>Classes/Week</span>
                </div>
              </div>
              <div className="teacher-profile">
                <div className="personal-info">
                  <h1>Personal Information</h1>
                  <div className="info-content">
                    <div className="col">
                      <div>
                        <h3>Age</h3>
                        <span>{age}</span>
                      </div>
                      <div>
                        <h3>Sex</h3>
                        <span>{data.sex}</span>
                      </div>
                      <div>
                        <h3>Phone number</h3>
                        <span>{data.phone}</span>
                      </div>
                      <div>
                        <h3>Email</h3>
                        <span>{data.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="career-profile">
                  <h1>Career Profile</h1>
                  <div>
                    <h3>Working Since</h3>
                    {/* <span>{workTime}</span> */}
                  </div>
                  <div>
                    <h3>Speciality</h3>
                    <span>Teacher</span>
                  </div>
                  <div>
                    <h3>Work Expirence</h3>
                    <span>{expriance} year</span>
                  </div>
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
                <Table dataSource={data.course} columns={columns} />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Class" key="3">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="teacher-course-list">
                <div className="tch-cr-list">
                  <h1>Assigned Classes</h1>
                </div>
                <Table dataSource={data.class} columns={classColumns} />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default TeacherView;
