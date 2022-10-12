import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Select, Tabs, Table, Tag } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import "./style.css";
import AttendanceList from "../../subComponents/AttendanceList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
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
      title: "Course",
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
                <Tag color="green">
                  {moment(JSON.parse(item?.time[0])).format("hh:mm") +
                    " to " +
                    moment(JSON.parse(item?.time[1])).format("hh:mm")}
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
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
  ];

  const courseColumns = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: "Level",
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return <div>{item.level}</div>;
      },
    },
    {
      title: "Section",
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return <div>{item.section}</div>;
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
    <div className="bg-[#F9FAFB] h-[100vh] p-4">
      <div className="flex flex-row justify-between w-[100%] -mt-20 ">
        <div className="flex flex-row justify-center align-middle ">
          <div className="flex flex-row">
            <h1 className="text-lg font-bold font-jakarta mr-2">Class</h1>
            <h2 className="text-lg font-bold font-jakarta">{data?.level}</h2>
            <h3 className="text-lg font-bold font-jakarta">{data?.section}</h3>
          </div>
        </div>
        <div className="flex flex-row">
          <h3 className="text-lg font-semibold font-jakarta border-r-[2px] pr-2">
            Assigned Students
          </h3>
          <h4 className="text-lg font-semibold font-jakarta pl-2">
            {data?.student.length}
          </h4>
        </div>
      </div>
      <div className="w-[100%] mt-10">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane
           tab={
            <p className="text-lg font-semibold text-center ml-5 font-jakarta">
              Profile
            </p>
          }
            key="1"
          >
            <Button
              icon={<FontAwesomeIcon className="pr-2 text-sm" icon={faPen} />}
              className="btn-confirm"
              onClick={handleUpdate}
            >
              Edit 
            </Button>
            <div className="asssign-teacher">
              <h4
                className="text-[24px] mb-10 font-serif font-bold"
                //style={{ fontFamily:'Plus Jakarta Sans' , fontWeight:'600'}}
              >
                Assigned Students
              </h4>
              <Table dataSource={students} columns={columns} />
            </div>
            <div className="asssign-teacher -mt-10">
              <h4
                className="text-[24px] mb-10 font-serif font-bold"
                //style={{ fontFamily:'Plus Jakarta Sans' , fontWeight:'600'}}
              >
                Assigned Courses
              </h4>
              <Table dataSource={datas} columns={courseColumns} />
            </div>
            <div className="asssign-teacher">
              <h4 className="text-[24px] mb-10 font-serif font-bold">
                Weekly Schedule
              </h4>
              <Table dataSource={datas} columns={scheduleColumn} />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
           tab={
            <p className="text-lg font-semibold text-center ml-5 font-jakarta">
              Attendance
            </p>
          }
            key="2"
          >
              <div className="mt-14"></div>
            <AttendanceList />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewClass;
