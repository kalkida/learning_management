import React, { useEffect, useState } from "react";
import { Button, Select, Tabs, Table, Tag } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchSubject } from "../funcs";
import { MailFilled } from "@ant-design/icons";
import moment from "moment";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

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
        <div className=" flex flex-row  pb-2 -mt-4">
          <div className=" flex flex-row justify-start self-start">
            <div className="rounded-full border-[2px] border-[#E7752B] bg-[white]">
              <img
                src={data.avater ? data.avater : "img-5.jpg"}
                alt="profile"
                className="w-[8vw] border-[2px] rounded-full"
              />
            </div>
            <div className="flex flex-col justify-start align-baseline mt-2 ml-5 w-[100%]">
              <div className="flex flex-row">
              <h3 className="text-lg font-bold font-jakarta ">
                {data.first_name + " " + data.last_name}
              </h3>
              </div>
              <div className="flex flex-row align-bottom">
                <div>
                  <MailFilled className="text-[#E7752B]" />
                </div>
                <div>
                  <h3 className="text-md text-[#E7752B] p-1 font-jakarta">Contact</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between" 
          >
          <div className="flex flex-row justify-self-end self-end">
            <h3 className="text-lg font-semibold font-jakarta text-[#344054]">
              Class
            </h3>
            {/* <div className="flex flex-row">
              <h3 className="font-bold pr-2 border-r-[1px] font-serif">Class</h3> */}
              {data?.class ? (
                <h4 className="border-l-[2px] pl-2 text-lg font-semibold font-jakarta text-[#667085] 
                p-[1px] ml-2">
                  {data?.class?.map(
                    (item, i) => item.level + item.section + ","
                  )}
                </h4>
              ) : (
                <Tag>Teacher is not Assigned</Tag>
              )}
            </div>
        
        <div className=" flex justify-self-end ml-[70%]">
            <div className="flex flex-row">
            <h3 className="text-lg font-semibold font-jakarta text-[#344054]">
              Subject
            </h3>
              {data?.course ? (
                <h4 className="border-l-[2px] pl-2 text-lg font-bold font-jakarta
                text-[#667085] p-[1px] ml-2">
                  {data?.course?.map((item, i) => item.course_name + ",")}
                </h4>
              ) : (
                <Tag>Teacher is not Assigned</Tag>
              )}
            </div>
            </div>
          </div>
        </div>
        <div className="tab-content">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab={
              <p className="text-xl font-bold text-center ml-5 ">Profile</p>
            } key="1">
              <Button className="btn-confirm"
               icon={<FontAwesomeIcon className="pr-2 text-sm" icon={faPen} />}
              onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="flex flex-row justify-between w-[50%]">
                <div>
                  <h1 
                   className="text-4xl font-bold  font-jakarta mb-4"
                  >7,8</h1>
                  <span 
                   className="text-sm font-medium font-jakarta mb-8 "
               //   style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'500',lineHeight:'20px',fontSize:14}}
                  >Assigned Grade</span>
                </div>
                <div>
                  <h1 
                   className="text-4xl font-bold font-jakarta mb-4"
                //  style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'700',lineHeight:'60px',fontSize:48}}
                  >{data.course.length}</h1>
                  <span
                   className="text-sm font-medium mb-3 font-jakarta -ml-2 "
                   //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'500',lineHeight:'20px',fontSize:14}}
                   >Courses</span>
                </div>
                <div>
                  <h1 
                   className="text-4xl font-bold font-jakarta  mb-4"
                  //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'700',lineHeight:'60px',fontSize:48}}
                  >{weekClass}</h1>
                  <span
                   className="text-sm font-medium font-jakarta mb-4" 
                  //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'500',lineHeight:'20px',fontSize:14}}
                  >Classes/Week</span>
                </div>
                {/* <div>
                  <h1 
                   className="text-5xl font-bold font-serif leading-none mb-4"
                  //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'700',lineHeight:'60px',fontSize:48}}
                  >{weekClass}</h1>
                  <span
                   className="text-sm font-medium font-serif" 
                  //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'500',lineHeight:'20px',fontSize:14}}
                  >Classes/Week</span>
                </div> */}
              </div>
              <div className="teacher-profile mt-10">
                <div className="personal-info">
                  <h1
                   className="text-xl font-bold font-jakarta text-[#344054] " 
                 // style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'600',lineHeight:'28px',fontSize:24}}
                  >Personal Information</h1>
                  <div className="info-content">
                    <div className="col">
                      <div>
                        <h3
                        className=" font-semibold text-sm font-jakarta text-[#344054]"  
                      //  style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'200',lineHeight:'20px',fontSize:14}}
                        >Age</h3>
                        <span className="font-jakarta font-bold">{age}</span>
                      </div>
                      <div 
                       className=" font-semibold text-sm font-jakarta text-[#344054] "  >
                        <h3>Sex</h3>
                        <span className="font-jakarta font-bold">{data.sex}</span>
                      </div>
                      <div>
                        <h3 
                         className=" font-semibold text-sm font-jakarta text-[#344054] "  
                        >Phone number</h3>
                        <span className="font-jakarta font-bold">{data.phone}</span>
                      </div>
                      <div>
                        <h3 
                         className=" font-semibold text-sm font-jakarta text-[#344054] "  
                        >Email</h3>
                        <span className="font-jakarta font-bold">{data.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="career-profile">
                  <h1 
                   className="text-xl font-bold font-jakarta text-[#344054] "  
                  //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'600',lineHeight:'28px',fontSize:24}}
                  >Career Profile</h1>
                  <div>
                    <h3
                     className=" font-semibold text-sm font-jakarta text-[#344054] "  
                    >Working Since</h3>
                    <span className="font-jakarta font-bold">{workTime}</span>
                  </div>
                  <div> 
                    <h3 
                    className=" font-semibold text-sm font-jakarta text-[#344054]"  
                    >Speciality</h3>
                    <span className="font-jakarta font-bold">Teacher</span>
                  </div>
                  <div>
                    <h3 
                    className=" font-semibold text-sm font-jakarta text-[#344054]"  
                    >Work Expirence</h3>
                    <span className="font-bold font-jakarta ">{expriance} year</span>
                  </div>
                </div> 
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={
                 <p className="text-xl font-bold text-center ml-5 font-jakarta">Course</p>
            } key="2">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="teacher-course-list">
                <div className="tch-cr-list">
                  <h1 className="text-xl font-bold font-jakarta">Assigned Courses</h1>
                </div>
                <Table dataSource={data.course} columns={columns} />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={
                 <p className="text-xl font-bold text-center ml-5 font-jakarta ">Class</p>
            } key="3">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="teacher-course-list">
                <div className="tch-cr-list">
                  <h1 className="text-xl font-bold font-jakarta">Assigned Classes</h1>
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
