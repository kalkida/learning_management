import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Select, Tabs, Table, Tag } from "antd";
import { fetchTeacher } from "../funcs";
import Icon from "react-eva-icons";
import moment from "moment";
import { useSelector } from "react-redux";
import "./style.css";
import AttendanceList from "../../subComponents/AttendanceList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPen } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestoreDb } from "../../../firebase";

const { Option } = Select;

function ViewClass() {
  const [datas, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [studentClass, setStudentClass] = useState([]);
  const [studentLoading, setStudentLoading] = useState(true);

  const uid = useSelector((state) => state.user.profile);
  const { state } = useLocation();
  var { data } = state;
  const [selectedRowKeys, setSelectedRowKeys] = useState(data.course);

  console.log(data);

  const navigate = useNavigate();

  const scheduleColumn = [
    {
      title: <h1 className="text-[16px] font-[600] text-[#344054]">Subject</h1>,
      dataIndex: "subject",
      key: "subject",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },

    {
      title: "Day",
      dataIndex: "schedule",
      key: "schedule",
      render: (value) => {
        return (
          <>
            {value?.map((item, i) => (
              <h1>{item.day}</h1>
            ))}
          </>
        );
      },
    },
    {
      title: "Period",
      dataIndex: "schedule",
      key: "schedule",
      render: (value) => {
        moment.locale("en");
        if (value?.time == undefined) {
          return (
            <div className="flex flex-col w-[3.7rem] ">
              {value?.map((item, i) => (
                <a className="!mb-2" color="#EA8848">
                  {moment(JSON.parse(item?.time[0])).format("hh:mm")}{" "}
                </a>
              ))}
            </div>
          );
        } else {
          return <a color="red">No Data</a>;
        }
      },
    },
    {
      title: "End Time",
      dataIndex: "schedule",
      key: "schedule",
      render: (value) => {
        moment.locale("en");
        if (value?.time == undefined) {
          return (
            <div className="flex flex-col w-[3.7rem] ">
              {value?.map((item, i) => (
                <a className="!mb-2" color="#EA8848">
                  {moment(JSON.parse(item?.time[1])).format("hh:mm")}
                </a>
              ))}
            </div>
          );
        } else {
          return <a>No Data</a>;
        }
      },
    },
  ];

  const columns = [
    {
      title: <h1 className="text-[16px] font-[600] text-[#344054]">Name</h1>,
      dataIndex: "first_name",
      key: "first_name",
      render: (_, value) => {
        return (
          <h1 className=" text-[#344054]">
            {value.first_name}
            {"  "}
            {value.last_name}
          </h1>
        );
      },
    },

    {
      title: "ID",
      dataIndex: "studentId",
      key: "studentId",
      render: (value) => {
        if (value) {
          return <h1 className=" text-[#344054]">{value}</h1>;
        } else {
          return (
            <h1 className="text-[14px] font-light text-[#515f76]">No Data</h1>
          );
        }
      },
    },
    {
      title: "Age",
      dataIndex: "DOB",
      key: "DOB",
      render: (value) => {
        if (value) {
          const todays = Date.now();

          return (
            <h1 className=" text-[#344054]">
              {moment(todays).year() - moment(JSON.parse(value)).year()}
            </h1>
          );
        } else {
          return (
            <h1 className="text-[14px] font-light text-[#515f76]">No Data</h1>
          );
        }
      },
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
      render: (value) => {
        if (value) {
          return <h1 className=" text-[#344054]">{value}</h1>;
        } else {
          return (
            <h1 className="text-[14px] font-light text-[#515f76]">No Data</h1>
          );
        }
      },
    },
  ];

  const courseColumns = [
    {
      title: <h1 className="text-[16px] font-[600] text-[#344054]">Subject</h1>,
      dataIndex: "subject",
      key: "subject",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: "Class / Week",
      dataIndex: "class",
      key: "class",
      render: (value, data) => {
        if (data?.schedule) {
          return (
            <h1 className="text-[14px] font-[600] text-[#344054]">
              {data.schedule.length}
            </h1>
          );
        } else {
          return <h1 className="text-[14px] font-light text-[#515f76]">0</h1>;
        }
      },
    },
    {
      title: "Teacher",
      dataIndex: "teachers",
      key: "teachers",
      width: "30%",
      render: (item, other) => {
        return (
          <div className=" text-[#344054]">
            {other.teachers.map((teacher) => (
              <h1>
                {teacher.first_name}
                {"   "} {teacher.last_name}
              </h1>
            ))}
          </div>
        );
      },
    },
  ];

  const studentColumns = [
    {
      title: "Student Name",
      dataIndex: "class",
      key: "name",
      render: (_, record) => (
        <p>{record.first_name + " " + record.last_name}</p>
      ),
    },
    {
      title: "Id",
      dataIndex: "studentId",
      key: "studentId",
      render: (item, record) => {
        return <p>{item}</p>;
      },
    },

    {
      title: "Sex",
      dataIndex: "class",
      key: "name",
      render: (_, record) => <p>{record.sex}</p>,
    },

    {
      title: "Days Absent",
      dataIndex: "attendance",
      key: "attendance",
      render: (_, record) => (
        <a
          className={
            record.attendace
              ? record.attendace.length <= 0
                ? "bg-lime-600 p-1 text-white rounded-sm"
                : "bg-[red] p-2 text-[white] rounded-sm"
              : null
          }
        >
          {record.attendace ? record.attendace.length : 0}
        </a>
      ),
    },
  ];

  const getSchool = async () => {
    const docRef = doc(firestoreDb, "schools", uid.school);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      var dataset = docSnap.data();
      return dataset;
    } else {
    }
  };

  const getClassData = async (ID) => {
    const docRef = doc(firestoreDb, "class", ID);

    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };

  const getSubjectData = async (ID) => {
    const docRef = doc(firestoreDb, "subject", ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };

  const getTeacherData = async (ID) => {
    const docRef = doc(firestoreDb, "teachers", ID);
    var data = "";
    getDoc(docRef).then((response) => {
      data = response.data();
      console.log(data);
      data.key = response.id;
    });
    return data;
  };
  const getData = async (data) => {
    data.class = await getClassData(data.class);
    data.subject = await getSubjectData(data.subject);
    data.teachers?.map(async (item, index) => {
      data.teachers[index] = await getTeacherData(item);
    });
    return data;
  };

  const getCourses = async () => {
    var branches = await getSchool();
    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "in", branches.branches)
    );
    var temporary = [];
    const snap = await getDocs(q);
    for (var i = 0; i < data.course.length; i++) {
      snap.forEach(async (doc) => {
        var datause = doc.data();
        datause.key = doc.id;
        if (datause.key == data.course[i]) {
          getData(datause).then((response) => temporary.push(response));
        }
      });
    }
    setTimeout(() => {
      setData(temporary);
      setCourseLoading(false);
    }, 2000);
  };

  const getStudentByClass = async () => {
    const q = query(
      collection(firestoreDb, "students"),
      where("school_id", "==", uid.school),
      where("class", "==", data.key)
    );
    var temporary = [];

    const snap = await getDocs(q);
    snap.forEach(async (doc) => {
      var datas = doc.data();
      datas.key = doc.id;
      data.course?.forEach(async (key) => {
        datas.attendance = await getAttendace(doc.id, key);
      });
      temporary.push(datas);
    });

    setTimeout(() => {
      setStudentClass(temporary);
      setStudentLoading(false);
    }, 2000);
  };

  const getAttendace = async (ID, key) => {
    const q = query(
      collection(firestoreDb, "attendanceanddaily", `${key}/attendace`),
      where("studentId", "==", ID)
    );
    var temporary = [];

    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();
      data.key = doc.id;
      temporary.push(data);
    });
    return temporary;
  };

  const getStudents = async (ids) => {
    var temporary = [];
    if (ids.length > 0) {
      const q = query(collection(firestoreDb, "students"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        if (ids.includes(doc.id)) {
          temporary.push(data);
        }
      });
      setStudents(temporary);
    }
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleUpdate = () => {
    navigate("/update-class", { state: { data } });
  };

  useEffect(() => {
    getStudents(data.student);
    getCourses();
    getStudentByClass();
  }, []);
  return (
    <div className="bg-[#F9FAFB] py-4">
      <div className="flex flex-row justify-between w-[100%] -mt-20 ">
        <div className="flex flex-row justify-center align-middle ">
          <div className="flex flex-row">
            <h1 className="text-lg font-bold font-jakarta mr-2 text-[#1D2939]">
              Class
            </h1>
            <h2 className="text-lg font-bold font-jakarta">{data?.level}</h2>
            <h3 className="text-lg font-bold font-jakarta">{data?.section}</h3>
          </div>
        </div>
        <div className="flex flex-row">
          <h3 className="text-lg font-[600]  font-jakarta border-r-[2px] pr-2 text-[#344054]">
            Number of Student{" "}
          </h3>
          <h4 className="text-lg font-semibold font-jakarta pl-2">
            {data?.student.length}
          </h4>
        </div>
      </div>
      <div className="w-[100%] mt-7">
        <Tabs defaultActiveKey="1" className="pb-30">
          <Tabs.TabPane
            tab={
              <span className="text-lg font-[500] text-center ml-0 font-jakarta ">
                Profile
              </span>
            }
            key="1"
          >
            <Button
              icon={
                <FontAwesomeIcon className="pr-2 text-[#EA8848]" icon={faPen} />
              }
              className=" text-center  border-[2px] !border-[#E7752B] !text-[#E7752B] !rounded-[8px] float-right -mt-14"
              onClick={handleUpdate}
            >
              Edit
            </Button>
            <div className="">
              <h4 className="text-lg mb-[16px] mt-[32px] font-jakarta font-[600] text-[#344054]">
                Assigned Students
              </h4>
              <Table
                dataSource={students}
                columns={columns}
                pagination={false}
              />
            </div>
            <div className="">
              <h4 className="text-lg mb-[16px] mt-[32px] font-jakarta font-[600] text-[#344054">
                Assigned Courses
              </h4>
              <Table
                loading={courseLoading}
                dataSource={datas}
                columns={courseColumns}
                pagination={false}
              />
            </div>
            <div className="pb-0">
              <h4 className="text-lg mb-[16px] mt-[32px] font-jakarta font-[600] text-[#344054]">
                Weekly Schedule
              </h4>
              <Table
                loading={courseLoading}
                dataSource={datas}
                columns={scheduleColumn}
                pagination={{ position: ["bottomCenter"] }}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span className="text-lg font-[500] text-center ml-0 font-jakarta">
                Attendance
              </span>
            }
            key="2"
          >
            <div className="mt-10 ">
              <Table
                loading={studentLoading}
                dataSource={studentClass}
                columns={studentColumns}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewClass;
