import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Input, Button, Select, TimePicker, Tabs, Table } from "antd";
import moment from "moment";
import "../courses/style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { fetchTeacher, fetchCourse } from "../funcs";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestoreDb } from "../../../firebase";

function ViewCourse() {
  const uid = useSelector((state) => state.user.profile);
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const { data } = state;
  const [teachers, setTeachers] = useState([]);

  const getStudents = async (ids) => {
    var temporary = [];
    console.log("ids   ", ids);
    if (ids.length > 0) {
      const q = query(collection(firestoreDb, "teachers"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        console.log("data: " + data.first_name);
        console.log("data doc: " + doc.id);
        if (ids.includes(doc.id)) {
          temporary.push(data);
        }
        console.log("temporary: " + temporary);
      });
      setTeachers(temporary);
    }
  };

  useEffect(() => {
    getStudents(data.teachers);
  }, []);

  const navigate = useNavigate();

  const columnsA = [
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      render: (text, record) => {
        if (text) {
          return <div className="font-[500] text-sm font-jakarta">{text}</div>;
        } else {
          return (
            <div className=" text-[#515f76]font-jakarta font-light font-jakarta ">
              No Data{" "}
            </div>
          );
        }
      },
    },
    {
      title: "Start time",
      dataIndex: "time",
      key: "time",
      render: (text, record) => {
        if (record?.time?.length) {
          return (
            <div className="font-[500] text-sm font-jakarta">
              {moment(JSON.parse(record?.time[0])).format("hh:mm")}
            </div>
          );
        } else {
          return (
            <div className=" text-[#515f76] font-jakarta font-light">
              No Data{" "}
            </div>
          );
        }
      },
    },
    {
      title: "End time",
      dataIndex: "time",
      key: "time",
      render: (text, record) => {
        if (record?.time?.length) {
          return (
            <div className="font-[500] text-sm font-jakarta">
              {moment(JSON.parse(record?.time[1])).format("hh:mm")}
            </div>
          );
        } else {
          return (
            <div className=" text-[#515f76] font-jakarta font-light">
              No Data{" "}
            </div>
          );
        }
      },
    },
  ];
  const columns = [
    {
      // title: "AsignedTeachers",
      dataIndex: "first_name",
      key: "first_name",
      render: (text, record) => {
        console.log("record    ", record);

        return (
          <div className="font-[500] text-sm font-jakarta">
            {record.first_name} {record.last_name}
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

  const handleUpdate = () => {
    navigate("/update-course", { state: { data } });
  };

  const getStudent = async () => {
    const q = query(
      collection(firestoreDb, "students"),
      where("school_id", "==", uid.school),
      where("course", "array-contains", data.key)
    );
    var temporary = [];

    const snap = await getDocs(q);
    snap.forEach(async (doc) => {
      var data = doc.data();
      data.key = doc.id;
      data.attendance = await getAttendace(doc.id);
      temporary.push(data);
    });

    setTimeout(() => {
      setStudent(temporary);
      setLoading(false);
    }, 2000);
  };

  const getAttendace = async (ID) => {
    const q = query(
      collection(firestoreDb, "attendanceanddaily", `${data.key}/attendace`),
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

  useEffect(() => {
    getStudent();
  }, []);

  return (
    <div className="bg-[#F9FAFB] h-[100vh] py-4">
      <div className="flex flex-row justify-between w-[100%] -mt-20 ">
        <div className="flex flex-row justify-between align-middle h-[78px]">
          <div className="rounded-full  border-[2px] border-[#E7752B] mr-10">
            <img
              className="w-[74px] rounded-full  bg-[white] "
              src="logo512.png"
              alt="profile"
            />
          </div>
          <div className="flex flex-col justify-center align-middle ">
            <h2 className="text-xl font-[600] font-jakarta text-[#1D2939]">
              {data.course_name}
            </h2>
          </div>
        </div>
        <div className="flex flex-col justify-center ">
          <div className="flex flex-row justify-end">
            <h3 className="text-lg font-semibold font-jakarta text-[#344054]">
              Assigned Teachers
            </h3>
            <h4
              className="border-l-[2px] pl-2 text-lg font-semibold font-jakarta text-[#667085] 
            p-[1px] ml-2"
            >
              {data.teachers.length}
            </h4>
          </div>
          <div className="flex flex-row justify-end">
            <h3 className="text-lg font-semibold font-jakarta">
              Class per week
            </h3>
            <h4
              className="border-l-[2px] pl-2 text-lg font-bold font-jakarta
              text-[#667085] p-[1px] ml-2"
            >
              {data.schedule.length}
            </h4>
          </div>
        </div>
      </div>
      <div className="tab-content">
        <Tabs className="bg-[#F9FAFB]" defaultActiveKey="1">
          <Tabs.TabPane
            tab={
              <span className="text-lg font-[500] text-center ml-0 font-jakarta">
                Profile
              </span>
            }
            key="1"
          >
            <Button
              icon={<FontAwesomeIcon className="pr-2 text-sm" icon={faPen} />}
              className="float-right -mt-14 !text-[#E7752B]"
              onClick={handleUpdate}
            >
              Edit Course
            </Button>
            <div className=" rounded-2xl border-[0px]">
              <h4 className="mb-2 font-semibold text-sm font-jakarta text-[#344054]">
                Coures Description
              </h4>
              <Input.TextArea
                className="border-[1px] rounded-sm"
                width="100%"
                rows={4}
                defaultValue={data.description}
              />
            </div>
            <div className="text-xl mt-10">
              <p className="text-lg font-semibold text-left ml-0 font-jakarta">
                Assigned Teachers
              </p>
              <Table
                className=" bg-[white]"
                dataSource={data.teachers}
                columns={columns}
                pagination={false}
              />
            </div>
            <div className="flex flex-col mt-[32px]">
              <h4 className="text-xl font-semibold pt-2 font-jakarta ">
                Schedule
              </h4>
              <Table
                className=" bg-[white]"
                dataSource={data.schedule}
                columns={columnsA}
                pagination={false}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span className="text-lg font-[500] text-center  font-jakarta">
                Attendance
              </span>
            }
            key="2"
          >
            <div className="mt-14"></div>
            <Table
              loading={loading}
              dataSource={student}
              columns={studentColumns}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewCourse;
