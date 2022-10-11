import React, { useEffect, useState } from "react";
import { Button, Select, Tabs, Table, Tag } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchSubject } from "../funcs";
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
        if (item) {
          return <div>{item?.name}</div>;
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
        if (item) {
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
      <div className="w-[100%] p-10 -mt-20">
        <div className="flex flex-row justify-between border-b-[2px] pb-2 -mt-4">
          <div className="flex flex-row">
            <div className="rounded-full border-[2px] border-[#E7752B] bg-[white]">
              <img
                src={data.avater ? data.avater : "img-5.jpg"}
                alt="profile"
                className="w-[7vw] rounded-full"
              />
            </div>
            <div className="flex flex-col justify-center ml-2">
              <h2 className="text-lg font-bold font-serif">
                {data.first_name + " " + data.last_name}
              </h2>
              <div className="flex flex-row align-bottom">
                <div>
                  <MailFilled className="text-[#E7752B]" />
                </div>
                <div>
                  <h3 className="text-md text-[#E7752B] p-1 font-serif">Contact</h3>
                </div>
              </div>
            </div>
          </div>
          <div className=" flex flex-col justify-center -ml-20 border-l-[2px]">
            <div className="flex flex-row">
              <h3 className="font-bold pr-2 border-r-[1px] font-serif">Class</h3>
              {data?.class ? (
                <h4 className="pl-2">
                  {data?.class?.map(
                    (item, i) => item.level + item.section + ","
                  )}
                </h4>
              ) : (
                <Tag>Teacher is not Assigned</Tag>
              )}
            </div>
            <div>
              <h3 className="font-bold font-serif">Subject</h3>
              {data?.course ? (
                <h4 className="pl-0">
                  {data?.course?.map((item, i) => item.course_name + ",")}
                </h4>
              ) : (
                <Tag>Teacher is not Assigned</Tag>
              )}
            </div>
          </div>
        </div>
        <div className="tab-content">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab={
              <p className="text-xl font-bold text-center ml-5 font-serif">Profile</p>
            } key="1">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="flex flex-row justify-between w-[70%]">
                <div>
                  <h1 
                   className="text-5xl font-bold font-serif leading-none mb-4"
                 style={{ fontFamily:'Plus Jakarta Sans'}}
                  >7,8</h1>
                  <span 
                   className="text-sm font-medium font-serif"
               //   style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'500',lineHeight:'20px',fontSize:14}}
                  >Assigned Grade</span>
                </div>
                <div>
                  <h1 
                   className="text-5xl font-bold font-serif leading-none mb-4"
                //  style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'700',lineHeight:'60px',fontSize:48}}
                  >{data.class.length}</h1>
                  <span
                   className="text-sm font-medium font-serif"
                   //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'500',lineHeight:'20px',fontSize:14}}
                   >Classes</span>
                </div>
                <div>
                  <h1 
                   className="text-5xl font-bold font-serif leading-none mb-4"
                  //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'700',lineHeight:'60px',fontSize:48}}
                  >{data.course.length}</h1>
                  <span
                   className="text-sm font-medium font-serif" 
                  //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'500',lineHeight:'20px',fontSize:14}}
                  >Course</span>
                </div>
                <div>
                  <h1 
                   className="text-5xl font-bold font-serif leading-none mb-4"
                  //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'700',lineHeight:'60px',fontSize:48}}
                  >{weekClass}</h1>
                  <span
                   className="text-sm font-medium font-serif" 
                  //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'500',lineHeight:'20px',fontSize:14}}
                  >Classes/Week</span>
                </div>
              </div>
              <div className="teacher-profile">
                <div className="personal-info">
                  <h1
                   className="text-xl font-bold font-serif" 
                 // style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'600',lineHeight:'28px',fontSize:24}}
                  >Personal Information</h1>
                  <div className="info-content">
                    <div className="col">
                      <div>
                        <h3
                        className="text-sm  font-serif"  
                      //  style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'200',lineHeight:'20px',fontSize:14}}
                        >Age</h3>
                        <span className="font-serif">{age}</span>
                      </div>
                      <div 
                       className="text-sm  font-serif"  >
                        <h3>Sex</h3>
                        <span className="font-serif">{data.sex}</span>
                      </div>
                      <div>
                        <h3 
                         className="text-sm  font-serif"  
                        >Phone number</h3>
                        <span className="font-serif">{data.phone}</span>
                      </div>
                      <div>
                        <h3 
                         className="text-sm  font-serif"  
                        >Email</h3>
                        <span className="font-serif">{data.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="career-profile">
                  <h1 
                   className="text-xl font-bold font-serif"  
                  //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'600',lineHeight:'28px',fontSize:24}}
                  >Career Profile</h1>
                  <div>
                    <h3
                     className="text-sm  font-serif"  
                    >Working Since</h3>
                    <span className="font-serif">{workTime}</span>
                  </div>
                  <div> 
                    <h3 
                    className="text-sm  font-serif"  
                    >Speciality</h3>
                    <span className="font-serif">Teacher</span>
                  </div>
                  <div>
                    <h3 
                    className="text-sm  font-serif"  
                    >Work Expirence</h3>
                    <span className="font-serif">{expriance} year</span>
                  </div>
                </div> 
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
                  <h1 className="text-xl font-bold font-serif">Assigned Courses</h1>
                </div>
                <Table dataSource={data.course} columns={columns} />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={
                 <p className="text-xl font-bold text-center ml-5 font-serif">Class</p>
            } key="3">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="teacher-course-list">
                <div className="tch-cr-list">
                  <h1 className="text-xl font-bold font-serif">Assigned Classes</h1>
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
