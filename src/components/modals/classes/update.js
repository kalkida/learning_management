import React, { useState, useEffect } from "react";
//import { Form, Input, Button, Select, Modal, message } from "antd";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import moment from "moment";
import { firestoreDb, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Select, TimePicker, Tabs, Table, message, Spin } from "antd";
import "./style.css";
import AttendanceList from "../../subComponents/AttendanceList";
import { async } from "@firebase/util";

const { Option } = Select;

function UpdateClass() {
  const uid = useSelector((state) => state.user.profile);
  const [input, setInput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courses, setcourse] = useState([]);
  const [item, setItem] = useState([]);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [sectionMainData, setSectionMainData] = useState([]);
  const [studentLoading, setStudentLoading] = useState(true);
  const { state } = useLocation();
  const { data } = state;

  const [updateClass, setUpdateClass] = useState({
    level: data.level,
    student: data.student,
    section: data.section,
    school_id: data.school_id,
    course: data.course,
    schedule: [],
  });

  const [updateComplete, setUpdateComplete] = useState([]);

  const navigate = useNavigate();

  const days = ["Monday", "Thusday", "Wednsday", "Thursday", "Friday"];

  const handleScheduler = (value, i) => {};

  const handleNewScheduler = (value, i) => {};

  const handleDelete = () => {
    deleteDoc(doc(firestoreDb, "class", data.key), updateClass)
      .then((response) => {
        setLoading(false);
        message.success("Data is Deleted successfuly");
        navigate("/list-class");
      })
      .catch((error) => {
        message.error("Data is not Deleted, Try Again");
        console.log(error);
      });
  };

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
      title: "class",
      dataIndex: "level",
      key: "level",
    },
  ];

  const courseColumns = [
    {
      title: "Course",
      dataIndex: "course_name",
      key: "course_name",
      render: (item) => {
        return <div>{item}</div>;
      },
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (item) => {
        // return <div>{item.level}</div>;
      },
    },
  ];

  const handleUpdate = async () => {
    console.log(updateClass);
    setLoading(true);
    setDoc(doc(firestoreDb, "class", data.key), updateClass, { merge: true })
      .then((response) => {
        setLoading(false);
        message.success("Data is updated successfuly");
        setUpdateComplete(!updateComplete);
        navigate("/list-classes");
      })
      .catch((error) => {
        message.error("Data is not updated");
        console.log(error);
      });
    // }
  };
  const getCousreSubject = async (index) => {
    var data = doc(firestoreDb, "subjects", index);
    var response = await getDoc(data);
    if (response.exists()) {
      var dats = await response.data();
      return dats;
    } else {
      return "";
    }
  };

  const getCourse = async (course) => {
    const q = query(
      collection(firestoreDb, "courses"),
      where("course_id", "in", course)
    );

    const querySnapshot = await getDocs(q);
    let temporary = [];
    await querySnapshot.forEach(async (doc) => {
      var datause = doc.data();
      datause.key = doc.id;
      var subject = await getCousreSubject(datause.subject);
      console.log("data", subject);

      // datause.subject = subject;
      temporary.push(datause);
    });
    await setItem(temporary);
  };
  const getStudent = async () => {
    const children = [];
    const q = query(
      collection(firestoreDb, "students"),
      where("school_id", "==", uid.school)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      datas.key = doc.id;
      children.push(datas);
    });
    setStudents(children);
  };
  const getStudents = async () => {
    const children = [];
    const q = query(
      collection(firestoreDb, "students"),
      where("school_id", "==", uid.school)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      if (data.student.includes(datas.student_id)) {
        datas.key = doc.id;
        children.push(datas);
      }
    });
    setStudents(children);
  };

  const getClass = async () => {
    const children = [];
    const sectionArray = [];

    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "==", uid.school),
      where("class", "==", data.key)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      children.push({
        ...datas,
        key: doc.id,
      });
    });

    const sectionQuary = query(
      collection(firestoreDb, "sections"),
      where("school_id", "==", uid.school)
    );
    const sectionQuerySnapshot = await getDocs(sectionQuary);
    sectionQuerySnapshot.forEach((doc) => {
      var datas = doc.data();
      sectionArray.push({
        ...datas,
        key: doc.id,
      });
    });
    setcourse(children);
    setSectionMainData(sectionArray);
  };
  const getStudenters = async () => {
    var temp = [];
    var students = data.student;
    students.map((id) => {
      getStudentID(id).then((stud) => {
        console.log("students", stud);
        temp.push(stud);
      });
    });
    console.log("temporary", temp);
    await setSelected(temp);
  };

  const getStudentID = async (ID) => {
    console.log("dat", ID);

    const docRef = doc(firestoreDb, "students", ID);
    var data = "";
    var response = await getDoc(docRef);
    if (response.exists()) {
      data = response.data();
    }

    setStudentLoading(false);

    return data;
  };
  useEffect(() => {
    getStudenters();
    getClass();
    getStudents();
    getCourse(data.course);
    setTimeout(() => {
      setLoading(true);

      getStudent();
    }, 2000);
  }, []);

  const handleStudent = (value) => {
    setUpdateClass({ ...updateClass, student: value });
  };
  const handleCourse = (value) => {
    setUpdateClass({ ...updateClass, course: value });
  };

  return (
    <div className="bg-[#E8E8E8] p-10 h-[100vh]">
      {loading ? (
        <>
          {" "}
          <div>
            <h1 className="text-2xl font-bold -mt-4 font-serif"  
            >
              Edit Class {data.level} - {data.section}
            </h1>
            <div className="tab-content">
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane
                  tab={
                    <p className="text-xl font-serif font-bold text-center ml-0">
                      Profile
                    </p>
                  }
                  key="1"
                >
                  <Button className="btn-confirm" onClick={handleUpdate}>
                    Edit Class
                  </Button>
                  <div className="">
                    <div className="flex flex-row justify-between">
                      <div>
                        <h1
                       className="text-lg font-bold font-serif" 
                         // style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'600',lineHeight:'28px',fontSize:20}}
                        >
                          Assigned Students
                        </h1>
                      </div>
                      <Select
                        style={{ width: "20%" }}
                        placeholder="select Students"
                        onChange={handleStudent}
                        defaultValue={data.student}
                        optionLabelProp="label"
                        mode="multiple"
                        maxTagCount={2}
                      >
                        {students.map((item, index) => (
                          <Option value={item.key} label={item.first_name}>
                            {item.first_name +
                              " " +
                              (item.last_name ? item.last_name : "")}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    {/* {data.student.length <= 0 ? ( */}
                    <Table
                      loading={studentLoading}
                      dataSource={selected}
                      columns={columns}
                    />
                  </div>
                  <div className="-mb-10">
                    <div className="flex flex-row justify-between">
                      <h1
                    className="text-lg font-bold font-serif mb-10" 
                    //   style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'600',lineHeight:'30px',fontSize:20 , paddingBottom:10 }}
                      >
                        Assigned Courses
                      </h1>
                      <Select
                        style={{ width: "20%" }}
                        placeholder="Asign Courses"
                        onChange={handleCourse}
                        defaultValue={data.course}
                        optionLabelProp="label"
                        mode="multiple"
                        maxTagCount={4}
                      >
                        {courses.map((item, index) => (
                          <Option
                            value={item.course_id}
                            label={item.course_name}
                          >
                            {item.course_name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <Table dataSource={item} columns={courseColumns} />
                  </div>
                  <div className="schedule">
                    <h1
                     style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'600',lineHeight:'30px',fontSize:20}}
                    >
                      Weekly Schedule
                    </h1>
                    <div className="up-card-schedule">
                      <h2>
                        Class{" "}
                        {updateClass.class
                          ? updateClass.class.level + updateClass.class.section
                          : null}
                      </h2>
                      <div className="schedule-header">
                        <div>
                          <p> Period</p>
                        </div>
                        <div>
                          <p> Start time</p>
                          <p> End time</p>
                        </div>
                      </div>

                      {data.schedule?.map((item, i) => (
                        <>
                          <Select
                            style={{ width: "40%" }}
                            placeholder="First Select Days"
                            onChange={(e) => handleScheduler(e, i)}
                            defaultValue={item.day}
                            in
                          >
                            {days.map((item, index) => (
                              <Option key={index} value={item} label={item}>
                                {item}
                              </Option>
                            ))}
                          </Select>
                          <TimePicker.RangePicker
                            style={{ width: "60%" }}
                            format={"hh:mm"}
                            use12Hours
                            defaultValue={
                              item.time.length
                                ? [
                                    moment(JSON.parse(item.time[0])),
                                    moment(JSON.parse(item.time[1])),
                                  ]
                                : []
                            }
                            onChange={(e) => handleScheduler(e, i)}
                          />
                        </>
                      ))}
                      {input.map((item, i) => (
                        <>
                          <Select
                            style={{ width: "40%" }}
                            placeholder="First Select Days"
                            onChange={(e) => handleNewScheduler(e, i)}
                          >
                            {days.map((item, index) => (
                              <Option key={index} value={item} label={item}>
                                {item}
                              </Option>
                            ))}
                          </Select>
                          <TimePicker.RangePicker
                            style={{ width: "60%" }}
                            format={"hh:mm"}
                            use12Hours
                            onChange={(e) => handleNewScheduler(e, i)}
                          />
                        </>
                      ))}
                      <Button
                        style={{ float: "right" }}
                        onClick={() => {
                          setInput([...input, 0]);
                          setUpdateClass({
                            ...updateClass,
                            schedule: [
                              ...updateClass.schedule,
                              { day: "", time: [] },
                            ],
                          });
                        }}
                      >
                        Add New
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="btn-dlt"
                    type="primary"
                    danger
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={
                    <p className="text-xl font-bold text-center ml-0 font-serif">
                      Attendance
                    </p>
                  }
                  key="2"
                >
                  <div  className="mt-14"/>
                  <AttendanceList />
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-row justify-center">
          <Spin
            tip={<p className="text-lg">Loading class...</p>}
            className="text-[#E7752B] "
            wrapperClassName="text-[#E7752B]"
          />
        </div>
      )}
    </div>

    // <div>
    //     {data && openUpdate ? (
    //         <Modal
    //             visible={openUpdate}
    //             title="Update Class"
    //             onCancel={handleCancel}
    //             footer={[
    //                 <Button key="back" onClick={handleCancel}>
    //                     Return
    //                 </Button>,
    //                 <Button key="submit" type='primary' loading={loading} onClick={handleUpdate}>
    //                     Update
    //                 </Button>,

    //             ]}
    //         >
    //             <Form
    //                 labelCol={{ span: 4 }}
    //                 wrapperCol={{ span: 14 }}
    //                 layout="horizontal"
    //             >
    //                 <Form.Item label="Level">
    //                     <Input disabled name="level" defaultValue={data.level} onChange={(e) => handleClass(e)} />
    //                 </Form.Item>

    //                 <Form.Item label="Section">
    //                     <Input disabled name="section" defaultValue={data.section} onChange={(e) => handleClass(e)} />
    //                 </Form.Item>
    //                 <Form.Item label="Students">
    //                     <Select

    //                         style={{
    //                             width: "100%",
    //                         }}
    //                         placeholder="select Students"
    //                         onChange={handleStudent}
    //                         defaultValue={data.student}
    //                         optionLabelProp="label"
    //                         mode="multiple"
    //                         maxTagCount={2}
    //                     >
    //                         {students.map((item, index) => (
    //                             <Option value={item.key} label={item.first_name + " " + (item.last_name ? item.last_name : "")}>
    //                                 {item.first_name + " " + (item.last_name ? item.last_name : "")}
    //                             </Option>
    //                         ))}
    //                     </Select>
    //                 </Form.Item>

    //             </Form>
    //         </Modal>)
    //         : null}
    // </div>
  );
}

export default UpdateClass;
