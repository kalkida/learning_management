import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Select, Tabs, Table, Tag } from "antd";
import { fetchTeacher } from "../funcs";
import Icon from "react-eva-icons";
import moment from "moment";
import { useSelector } from "react-redux";
import "./style.css";
import AttendanceList from "../../subComponents/AttendanceList";
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
  const [classData, setClassData] = useState([]);
  const [studentLoading, setStudentLoading] = useState(true);
  const uid = useSelector((state) => state.user.profile);
  const { state } = useLocation();
  var { data } = state;
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
            <>
              {value?.map((item, i) => (
                <Tag color="#EA8848">
                  {moment(JSON.parse(item?.time[0])).format("hh:mm")}{" "}
                </Tag>
              ))}
            </>
          );
        } else {
          return <Tag color="red">No Data</Tag>;
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
            <>
              {value?.map((item, i) => (
                <Tag color="#EA8848">
                  {moment(JSON.parse(item?.time[1])).format("hh:mm")}
                </Tag>
              ))}
            </>
          );
        } else {
          return <Tag color="red">No Data</Tag>;
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
          <h1 className="text-[14px] font-[600] text-[#344054]">
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
          return (
            <h1 className="text-[14px] font-[600] text-[#344054]">{value}</h1>
          );
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
            <h1 className="text-[14px] font-[600] text-[#344054]">
              {/* {moment(JSON.parse(value)).format("mm-yy-dd")} */}
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
          return (
            <h1 className="text-[14px] font-[600] text-[#344054]">{value}</h1>
          );
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
      render: (value) => {
        if (value.schedule?.length) {
          return (
            <h1 className="text-[14px] font-[600] text-[#344054]">
              {value.schedule.length}
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
      render: (item, other) => {
        return (
          <div className="text-[14px] font-[600] text-[#344054]">
            {item.section}
          </div>
        );
      },
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
    await getDoc(docRef).then((response) => {
      data = response.data();
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
    console.log(data.course);
    const snap = await getDocs(q);
    for (var i = 0; i < data.course.length; i++) {
      snap.forEach(async (doc) => {
        var datause = doc.data();
        console.log(datause);
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
      setStudentLoading(false);
    }
  };

  const handleUpdate = () => {
    navigate("/update-class", { state: { data } });
  };

  useEffect(() => {
    getStudents(data.student);
    getCourses();
  }, []);
  return (
    <div className="bg-[#F9FAFB] p-4">
      <div className="flex flex-row justify-between w-[100%] -mt-20 ">
        <div className="flex flex-row justify-center align-middle ">
          <div className="flex flex-row">
            <h1 className="text-lg font-bold font-jakarta mr-2">Class</h1>
            <h2 className="text-lg font-bold font-jakarta">{data?.level}</h2>
            <h3 className="text-lg font-bold font-jakarta">{data?.section}</h3>
          </div>
        </div>
        <div className="flex flex-row">
          <h3 className="text-lg font-semibold font-jakarta border-r-[2px] pr-2 text-[#344054]">
            Assigned Students
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
              <p className="text-sm font-[600] text-center ml-0 font-jakarta text-[#344054]">
                Profile
              </p>
            }
            key="1"
          >
            <Button
              className="btn-confirm text-center bg-[white] border-[1px] border-[#EA8848] rounded-lg"
              onClick={handleUpdate}
            >
              <div className="flex flex-row justify-around">
                <Icon
                  name="edit-outline"
                  fill="#EA8848"
                  size="medium" // small, medium, large, xlarge
                  animation={{
                    type: "pulse", // zoom, pulse, shake, flip
                    hover: true,
                    infinite: false,
                  }}
                />
                <p className="font-[16px] text-[#EA8848]"> Edit</p>
              </div>
            </Button>
            <div className="">
              <h4 className="text-lg mb-[16px] mt-[32px] font-jakarta font-[600] text-[#344054]">
                Assigned Students
              </h4>
              <Table dataSource={students} columns={columns} />
            </div>
            <div className="">
              <h4 className="text-lg mb-[16px] mt-[32px] font-jakarta font-[600] text-[#344054">
                Assigned Courses
              </h4>
              <Table
                loading={courseLoading}
                dataSource={datas}
                columns={courseColumns}
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
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <p className="text-sm font-[600] text-center ml-0 font-jakarta text-[#344054]">
                Attendance
              </p>
            }
            key="2"
          >
            <AttendanceList />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewClass;
