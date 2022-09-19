import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Modal, message, TimePicker, Tabs, Table } from "antd";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestoreDb, storage } from "../../../firebase";
import TextArea from "antd/lib/input/TextArea";
import uuid from "react-uuid";
import moment from "moment";

const { Option } = Select;

function UpdateCourse() {
  const { state } = useLocation()
  const { data } = state;
  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);
  const [courses, setCourses] = useState({});
  const [input, setInput] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subject, setSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [teacherView, setTeacherView] = useState(true);
  const [updateCourse, setUpdateCourse] = useState({
    course_name: data.course_name,
    teachers: data.teachers,
    class: data.class,
    schedule: data.schedule,
    description: data.description,
    school_id: data.school_id,
  });
  const days = ["Monday", "Thusday", "Wednsday", "Thursday", "Friday"];

  useEffect(() => {
    getCourseData();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    updateCourse.course_name = selectedSubject + " " + selectedLevel;
    setDoc(doc(firestoreDb, "courses", data.key), updateCourse, { merge: true })
      .then((response) => {
        setLoading(false);
        message.success("Data is updated successfuly");
        navigate('/list-course')

      })
      .catch((error) => {
        message.error("Data is not updated");
        console.log(error);
      });
  };

  const getCourseData = async () => {
    const children = [];
    const teachersArrary = [];
    const subjectArrary = [];
    const q = query(
      collection(firestoreDb, "class"),
      where("school_id", "==", uid.school)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      children.push({
        ...datas,
        key: doc.id,
      });
    });
    const qTeachers = query(
      collection(firestoreDb, "teachers"),
      where("school_id", "==", uid.school)
    );
    const queryTeachers = await getDocs(qTeachers);
    queryTeachers.forEach((doc) => {
      var datas = doc.data();
      teachersArrary.push({
        ...datas,
        key: doc.id,
      });
    });
    const qSubject = query(
      collection(firestoreDb, "subject"),
      where("school_id", "==", uid.school)
    );
    const querySubject = await getDocs(qSubject);
    querySubject.forEach((doc) => {
      var datas = doc.data();
      subjectArrary.push({
        ...datas,
        key: doc.id,
      });
    });
    setClasses(children);
    setTeachers(teachersArrary);
    setSubject(subjectArrary);
  };

  const handleCourse = (e) => {
    setUpdateCourse({ ...updateCourse, [e.target.name]: e.target.value });
  };

  const handleClass = (value) => {
    const classData = JSON.parse(value);
    setSelectedLevel(classData.level + classData.section);
    setUpdateCourse({ ...updateCourse, class: classData });
  };

  const handleSubject = (value) => {
    setSelectedSubject(value);
  };

  const getTeacherID = async (ID) => {
    const docRef = doc(firestoreDb, "teachers", ID)
    var data = "";
    await getDoc(docRef).then(response => {
      data = response.data();
      data.key = response.id;
    })
    return data;
  }

  const handleTeacher = (value) => {

    setTeacherView(false)
    const teacherdata = [];
    value.map(async (item, i) => {
      const respose = await getTeacherID(item);
      teacherdata.push(respose);
    });
    setUpdateCourse({ ...updateCourse, teachers: teacherdata });
    setTimeout(() => {
      setTeacherView(true)
    }, 2000);


  };
  const handleScheduler = (value, i) => {
    if (typeof value === "string") {
      updateCourse.schedule[i].day = value;
    } else {
      const timeValue = [];
      value.map((item, i) => {
        timeValue.push(JSON.stringify(item._d));
      });
      updateCourse.schedule[i].day = value;
    }
  };

  const handleNewScheduler = (value, i) => {
    if (typeof value === "string") {
      updateCourse.schedule[data.schedule.length + i].day = value;
    } else {
      const timeValue = [];
      value.map((item, i) => {
        timeValue.push(JSON.stringify(item._d));
      });
      updateCourse.schedule[data.schedule.length + i].time = timeValue;
    }
  };

  const columns = [
    {
      title: 'Teacher',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: '',
      dataIndex: 'last_name',
      key: 'last_name',
    },

  ];

  const handleDelete = () => {
    deleteDoc(doc(firestoreDb, "courses", data.key), updateCourse)
      .then((response) => {
        setLoading(false);
        message.success("Data is Deleted successfuly");
        navigate('/list-course')

      })
      .catch((error) => {
        message.error("Data is not Deleted, Try Again");
        console.log(error);
      });
  }

  return (
    <div>
      <div className="profile-header" >
        <div className="course-avater" >
          <img src="logo512.png" alt="profile" />
          <div className="profile-info">
            <h2>{updateCourse.course_name}</h2>
            <h3>Grade {updateCourse.class ? updateCourse.class.level + updateCourse.class.section : ""}</h3>
          </div>
        </div>
        <div className="header-extra">
          <div>
            <h3>Assigned Teachers</h3>
            <h4>{updateCourse.teachers.length}</h4>
          </div>
          <div>
            <h3>Class/week</h3>
            <h4>{updateCourse.schedule.length}</h4>
          </div>
        </div>
      </div>
      <div className="tab-content">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Profile" key="1">
            <Button className="btn-confirm" onClick={handleUpdate}>Confirm</Button>
            <div className="course-information">
              <h1>Course Information</h1>
              <div className="course-content">
                <div className="course-category">
                  <div>
                    <span>Subject</span>
                    <Select
                      style={{
                        width: "100%",
                      }}

                      placeholder="select Subjects"
                      onChange={handleSubject}
                      optionLabelProp="label"
                      defaultValue={updateCourse.course_name}
                    >
                      {subject.map((item, index) => (
                        <Option value={item.name} label={item.name}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <div>
                      <span>Class</span>
                      <Select
                        style={{
                          width: "100%",
                        }}
                        placeholder="select Classes"
                        onChange={handleClass}
                        optionLabelProp="label"
                        defaultValue={updateCourse.class}
                      >
                        {classes.map((item, index) => (
                          <Option
                            key={item.key}
                            value={JSON.stringify(item)}
                            label={item.level + " " + item.section}
                          >
                            {item.level + " " + item.section}
                          </Option>
                        ))}
                      </Select>
                    </div>

                  </div>
                </div>
                <div className="up-course-description">
                  <h4>Coures Description</h4>
                  <Input.TextArea
                    name="description"
                    width="100%"
                    rows={6}
                    defaultValue={updateCourse.description}
                    onChange={(e) => handleCourse(e)}
                  />
                </div>
              </div>
            </div>
            <div className="asssign-teacher">
              <div className="assign-header">
                <h4>Assigned Teachers</h4>
                <Select
                  style={{ width: '30%' }}
                  showArrow={true}
                  placeholder="select Teachers"
                  onChange={handleTeacher}
                  optionLabelProp="label"
                  mode="multiple"
                  defaultValue={updateCourse.teachers}
                  maxTagCount={2}
                >
                  {teachers.map((item, index) => (
                    <Option
                      key={item.key}
                      value={item.key}
                      label={
                        item.first_name +
                        " " +
                        (item.last_name ? item.last_name : "")
                      }
                    >
                      {item.first_name +
                        " " +
                        (item.last_name ? item.last_name : "")}
                    </Option>
                  ))}
                </Select>
              </div>
              {teacherView ? <Table dataSource={updateCourse.teachers} columns={columns} /> : null}
            </div>
            <div className="schedule">
              <h4>Weekly Schedule</h4>
              <div className="up-card-schedule">
                <h2 >Class {updateCourse.class ? updateCourse.class.level + updateCourse.class.section : null}</h2>
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
                        <Option value={item} label={item}>
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
                        <Option value={item} label={item}>
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
                    setUpdateCourse({
                      ...updateCourse,
                      schedule: [...updateCourse.schedule, { day: "", time: [] }],
                    });
                  }}
                >
                  Add New
                </Button>

              </div>
            </div>
            <Button className="btn-dlt" type="primary" danger onClick={handleDelete}>Delete</Button>

          </Tabs.TabPane>
          <Tabs.TabPane tab="Attendance" key="2">
            Content of Tab Pane 2
          </Tabs.TabPane>
          <Tabs.TabPane tab="Assignment" key="3">
            Content of Tab Pane 3
          </Tabs.TabPane>
        </Tabs>
      </div>

    </div>
  );
}

export default UpdateCourse;
