import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Select, Table, Input } from "antd";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { firebaseAuth, firestoreDb } from "../../firebase";

import "../modals/attendance/style.css";

const { Search } = Input;

function AttendanceList() {

  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);

  const [courseData, setData] = useState();
  const [tableLoading, setTableTextLoading] = useState(true);

  const onView = (data) => {
    navigate("/view-attendance", { state: { data: data } });
  };

  const columns = [
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "name",
      render: (_, record) => (
        <a onClick={() => onView(record)}>{record.course_name}</a>
      ),
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "course",
      render: (_, record) => (
        <a onClick={() => onView(record)}>{record.class.level}</a>
      ),
    },
    {
      title: "Section",
      dataIndex: "class",
      key: "age",
      render: (_, record) => <a onClick={() => onView(record)}>{record.class.section}</a>,
    },
    {
      title: "Absent",
      dataIndex: "attendance",
      key: "sex",
      render: (_, record) => <a onClick={() => onView(record)}>{record.attendace.length}</a>,
    },
    {
      title: "Present",
      dataIndex: "attendance",
      key: "sex",
      render: (_, record) => <a onClick={() => onView(record)}>{record.class.student.length - record.attendace.length}</a>,
    },
  ];

  const getData = async (data) => {
    if (data.class) {
      data.class = await getClassData(data.class);
    }
    data.attendace = await getAttendace(data.key);

    data.class.student?.map(async (item, index) => {
      data.class.student[index] = await getStudentData(item);
    });

    return data;
  };

  const getStudentData = async (ID) => {
    const docRef = doc(firestoreDb, "students", ID);
    var data = {};
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
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

  const getAttendace = async (courseID) => {
    const q = query(
      collection(firestoreDb, "attendanceanddaily", `${courseID}/attendace`)
    );
    var temporary = [];

    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();
      data.key = doc.id;
      temporary.push(data);
    });
    return temporary;
  }

  const getSchool = async () => {
    const docRef = doc(firestoreDb, "schools", uid.school);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      var dataset = docSnap.data();
      return dataset;
    } else {
    }
  };

  const getCourses = async () => {
    var branches = await getSchool();
    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "in", branches.branches)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach(async (doc) => {
      var data = doc.data();
      data.key = doc.id;
      getData(data).then((response) => temporary.push(response));
    });

    setTimeout(() => {
      setData(temporary);
      setTableTextLoading(false);
    }, 2000);
  }


  useEffect(() => {
    getCourses();
  }, [])

  return (
    <>
      <div className="at-filters">
        <div>
          <Select defaultValue={"Today"} />
          <Select defaultValue={"Period"} />
          <Select defaultValue={"Course"} />
        </div>
        <div>
          <Search
            placeholder="Search "
            allowClear
            // onSearch={onSearch}
            style={{
              width: 200,
            }}
          />
        </div>
      </div>
      <div>
        <Table loading={tableLoading} dataSource={courseData} columns={columns} />
      </div>
    </>
  );
}

export default AttendanceList;
