import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Select, Table, Input, DatePicker } from "antd";
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
import { SearchOutlined } from "@ant-design/icons";

//const { Search } = Input;
const { Option } = Select;

function AttendanceList() {
  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);

  const [courseData, setData] = useState();
  const [classes, setClasses] = useState([]);
  const [subject, setSubject] = useState([]);
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
        <a className="text-[black]" onClick={() => onView(record)}>
          {record.course_name}
        </a>
      ),
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "course",
      render: (_, record) => (
        <a className="text-[black]" onClick={() => onView(record)}>
          {record.class.level}
        </a>
      ),
    },
    {
      title: "Section",
      dataIndex: "class",
      key: "age",
      render: (_, record) => (
        <a className="text-[black]" onClick={() => onView(record)}>
          {record.class.section}
        </a>
      ),
    },
    {
      title: "Absent",
      dataIndex: "attendance",
      key: "sex",
      render: (_, record) => (
        <a className="text-[black]" onClick={() => onView(record)}>
          {record.attendace?.length}
        </a>
      ),
    },
    {
      title: "Present",
      dataIndex: "attendance",
      key: "sex",
      render: (_, record) => (
        <a className="text-[black]" onClick={() => onView(record)}>
          {record.class.student?.length - record.attendace?.length}
        </a>
      ),
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

  const getfilterData = async (data, date) => {
    if (data.class) {
      data.class = await getClassData(data.class);
    }
    data.attendace = await getFilterAttendace(data.key, date);

    data.class.student?.map(async (item, index) => {
      data.class.student[index] = await getStudentData(item);
    });

    return data;
  };

  const getsubject = async () => {
    const q = query(
      collection(firestoreDb, "subject"),
      where("school_id", "==", uid.school)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach(async (doc) => {
      var data = doc.data();
      data.key = doc.id;
      temporary.push(data);
    });
    setSubject(temporary);
  };

  const getClass = async () => {
    const q = query(
      collection(firestoreDb, "class"),
      where("school_id", "==", uid.school)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach(async (doc) => {
      var data = doc.data();
      data.key = doc.id;
      temporary.push(data);
    });
    setClasses(temporary);
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
  };

  const getFilterAttendace = async (courseID, date) => {
    const q = query(
      collection(firestoreDb, "attendanceanddaily", `${courseID}/attendace`),
      where("date", "==", date)
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

  const currentURL = window.location.pathname;

  const getCourses = async () => {
    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "==", uid.school)
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
  };

  useEffect(() => {
    getCourses();
    getsubject();
    getClass();
  }, []);

  const handleFilterSubject = async (value) => {
    if (value) {
      const q = query(
        collection(firestoreDb, "courses"),
        where("school_id", "==", uid.school),
        where("subject", "==", value)
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
      }, 2000);
    }
  };

  const handleFilterClass = async (value) => {
    if (value) {
      const q = query(
        collection(firestoreDb, "courses"),
        where("school_id", "==", uid.school),
        where("class", "==", value)
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
      }, 2000);
    }
  };

  const handlefilterAttenance = async (value) => {
    const date = value.date() < 10 ? "0" + value.date() : value.date();
    const month =
      value.month() + 1 < 10 ? "0" + (value.month() + 1) : value.month() + 1;
    const year = value.year();

    const filterDate = year + "-" + month + "-" + date;

    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "==", uid.school)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach(async (doc) => {
      var data = doc.data();
      data.key = doc.id;
      getfilterData(data, filterDate).then((response) =>
        temporary.push(response)
      );
    });

    setTimeout(() => {
      setData(temporary);
      setTableTextLoading(false);
    }, 2000);
  };

  return (
    <>
      <div className="bg-[#F9FAFB] h-[100vh] -mt-14">
        <div className="list-header mb-10">
          {currentURL == "/attendance" ? (
            <h1 className="text-2xl font-[600] font-jakarta">Attendance</h1>
          ) : null}
        </div>
        <div className="at-filters">
          <div>
            <Select
              bordered={false}
              placeholder={"Select class"}
              onChange={handleFilterClass}
              className="!mr-4 !rounded-lg border-[2px] hover:border-[#E7752B]"
            >
              {classes?.map((item, i) => (
                <Option
                  key={item.key}
                  value={item.key}
                  lable={item.level + item.section}
                >
                  {item.level + item.section}
                </Option>
              ))}
            </Select>
            <Select
              bordered={false}
              className="!mr-4 !rounded-lg border-[2px] hover:border-[#E7752B]"
              placeholder={"Select subject"}
              onChange={handleFilterSubject}
            >
              {subject?.map((item, i) => (
                <Option key={item.key} value={item.key} lable={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
            <DatePicker
              className="!mr-4 !rounded-lg border-[2px] hover:border-[#E7752B]"
              onChange={handlefilterAttenance}
              placeholder="Select date"
            />
          </div>
          <div>
            <Input
              style={{ width: 200 }}
              className="mr-3 !rounded-lg"
              placeholder="Search"
              prefix={<SearchOutlined className="site-form-item-icon" />}
            />
          </div>
        </div>
        <div>
          <Table
            loading={tableLoading}
            dataSource={courseData}
            columns={columns}
            pagination={{ position: ["bottomCenter"] }}
          />
        </div>
      </div>
    </>
  );
}

export default AttendanceList;
