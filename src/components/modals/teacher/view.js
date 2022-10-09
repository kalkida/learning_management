import React, { useEffect, useState } from "react";
import { Button, Select, Tabs, Table, Tag } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { MailFilled } from "@ant-design/icons";
import moment from "moment";
import "./style.css";

const { Option } = Select;

function TeacherView() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { data } = state;
  const [teacherData, setTeacherData] = useState([data]);

  const [weekClass, setWeekClass] = useState();
  const [age, setAge] = useState();
  const [expriance, setExpriance] = useState();

  var getworkTime = new Date(JSON.parse(data.working_since));
  const workTime =
    getworkTime.getFullYear() +
    "-" +
    getworkTime.getMonth() +
    "-" +
    getworkTime.getDay();

  useEffect(() => {
    var weekClassSum = 0;
    data?.course.map((item, i) => {
      weekClassSum += item.schedule?.length;
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
  const teacherColumn = [
    {
      title: "Age",
      dataIndex: "DOB",
      key: "DOB",
      render: (item) => {
        return <span>{moment(JSON.parse(item)).format("DD-MMMM-YYYY")}</span>;
      },
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Working Since",
      dataIndex: "working_since",
      key: "working_since",
      render: (item) => {
        return <span>{moment(JSON.parse(item)).format("DD-MMMM-YYYY")}</span>;
      },
    },
  ];

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
        if (item?.name) {
          return <div>{item.name}</div>;
        } else {
          return <Tag>Teacher Not Assigned To class</Tag>;
        }
      },
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      render: (item) => {
        if (item?.level) {
          return (
            <div>
              {item.level}
              {"   "}
              {item.section}
            </div>
          );
        } else {
          return <Tag>Teacher is Not Assigned</Tag>;
        }
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
      <div className="w-[100%]">
        <div className="flex flex-row justify-between border-b-[2px] pb-2 -mt-4">
          <div className="flex flex-row">
            <div className="rounded-full border-[2px]">
              <img
                src={data.avater ? data.avater : "img-5.jpg"}
                alt="profile"
                className="w-[7vw] rounded-full"
              />
            </div>
            <div className="flex flex-col justify-center ml-2">
              <h2 className="text-lg font-bold">
                {data.first_name + " " + data.last_name}
              </h2>
              <div className="flex flex-row align-bottom">
                <div>
                  <MailFilled className="text-[#E7752B]" />
                </div>
                <div>
                  <h3 className="text-md text-[#E7752B] p-1">Contact</h3>
                </div>
              </div>
            </div>
          </div>
          <div className=" flex flex-col justify-center -ml-20">
            <div className="flex flex-row">
              <h3 className="font-bold pr-2 border-r-[1px]">Class</h3>
              {data?.class ? (
                <h4 className="pl-2">
                  {data?.class?.map(
                    (item, i) => item.level + item.section + ","
                  )}
                </h4>
              ) : (
                <h3>Teacher is not Assigned</h3>
              )}
            </div>
            <div>
              <h3 className="font-bold">Subject</h3>
            </div>
          </div>
        </div>
        <div className="tab-content">
          <Tabs tabBarStyle={{ backgroundColor: "red" }} defaultActiveKey="1">
            <Tabs.TabPane tab="Profile" key="1">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="flex flex-row justify-between w-[70%]">
                <div>
                  <h1 className="text-4xl font-bold py-2 text-center">7,8</h1>
                  <span>Assigned Grade</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold py-2 text-center">
                    {data.class.length}
                  </h1>
                  <span>Classes</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold py-2 text-center">
                    {data.course.length}
                  </h1>
                  <span>Course</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold py-2 text-center">
                    {weekClass ? weekClass : "0"}
                  </h1>
                  <span>Classes/Week</span>
                </div>
              </div>
              <div className="">
                <div className="">
                  <h1 className="text-lg py-5 font-bold">
                    Personal Information
                  </h1>
                  <div className="">
                    <Table
                      columns={teacherColumn}
                      dataSource={teacherData}
                      pagination={false}
                    />
                    {/* <div className="col">
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
                    </div> */}
                  </div>
                </div>
                {/* <div className="career-profile">
                  <h1>Career Profile</h1>
                  <div>
                    <h3>Working Since</h3>
                    <span>{workTime}</span>
                  </div>
                  <div>
                    <h3>Speciality</h3>
                    <span>Teacher</span>
                  </div>
                  <div>
                    <h3>Work Expirence</h3>
                    <span>{expriance} year</span>
                  </div>
                </div> */}
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
