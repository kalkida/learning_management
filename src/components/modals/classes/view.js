import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Select, Tabs, Table } from "antd";
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
  const uid = useSelector((state) => state.user.profile);
  const { state } = useLocation();
  var { data } = state;
  const navigate = useNavigate();

  const scheduleColumn = [
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "Monday",
      dataIndex: "monday",
      key: "monday",
    },
    {
      title: "Tuesday",
      dataIndex: "tuesday",
      key: "tuesday",
    },
    {
      title: "Wednesday",
      dataIndex: "wednesday",
      key: "wednesday",
    },
    {
      title: "Thursday",
      dataIndex: "thursday",
      key: "thursday",
    },
    {
      title: "Friday",
      dataIndex: "friday",
      key: "friday",
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
    const snap = await getDocs(q);
    console.log("dataaa     ", data.course.length);
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
    }, 2000);
  };

  const getStudents = async (ids) => {
    console.log(ids);
    const q = query(
      collection(firestoreDb, "students"),
      where("student_id", "in", ids)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });

    // const q = query(
    //   collection(firestoreDb, "students"),
    //   where("students.key", "in", ids)
    // );
    // var temporary = [];
    // var snap = await getDocs(q);
    // console.log(snap.data());
    // snap.forEach((doc) => {
    //   var datause = doc.data();
    //   console.log(datause);
    //   temporary.push(datause);
    // });
    // setStudents(temporary);
    // console.log(students);
  };

  const handleUpdate = () => {
    navigate("/update-class", { state: { data } });
  };

  useEffect(() => {
    getStudents(data.student);
    getCourses();
  }, []);
  return (
    <div>
      <div className="flex flex-row justify-between align-bottom border-[2px] p-10 -mt-20 rounded-md">
        <div className="flex flex-row justify-center align-middle">
          <img
            className="w-20 border-[black] border-[2px]"
            src="logo512.png"
            alt="profile"
          />
          <div className="flex flex-row mt-8 ml-2">
            <h2>{data?.level}</h2>
            <h3>{data?.section}</h3>
          </div>
        </div>
        <div className="header-extra">
          <div>
            <h3>Assigned Students</h3>
            <h4>{data?.student.length}</h4>
          </div>
          {/* <div>
            <h3>Assigned Course</h3>
            <h4>{data?.course.length}</h4>
          </div> */}
        </div>
      </div>
      <div className="tab-content">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Profile" key="1">
            <Button className="btn-confirm" onClick={handleUpdate}>
              Edit Class
            </Button>
            <div className="asssign-teacher">
              <h4 className="text-[24px] mb-10">Assigned Students</h4>
              <Table dataSource={data.student} columns={columns} />
            </div>
            <div className="asssign-teacher -mt-10">
              <h4 className="text-[24px]">Assigned Courses</h4>
              <Table dataSource={datas} columns={courseColumns} />
            </div>
            <div className="asssign-teacher">
              <h4>Weekly Schedule</h4>
              <Table dataSource={datas} columns={scheduleColumn} />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Attendance" key="2">
            <AttendanceList />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewClass;
