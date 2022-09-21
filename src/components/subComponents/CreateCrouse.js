import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Form, Input, Button, Select, TimePicker, message } from "antd";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore";
import { firestoreDb, storage } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/lib/input/TextArea";
import { setLogLevel } from "firebase/app";
import _default from "antd/lib/time-picker";
import { NodeExpandOutlined } from "@ant-design/icons";
import { borderColor } from "@mui/system";
import moment from 'moment';

const { Option } = Select;
const days = ["Monday", "Thusday", "Wednsday", "Thursday", "Friday"];
const CreateCrouse = () => {
  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subject, setSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [input, setInput] = useState([0]);
  const [newCourse, setNewCourse] = useState({
    course_name: selectedSubject + " " + selectedLevel,
    teachers: [],
    class: "",
    subject: "",
    schedule: [{ day: "", time: [] }],
    description: "",
    school_id: uid.school,
  });

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

  const createNewCourse = async () => {
    newCourse.course_name = selectedSubject + " " + selectedLevel;

    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "==", uid.school),
      where("course_name", "==", newCourse.course_name)
    );

    const checkIsExist = (await getDocs(q)).empty;

    if (checkIsExist) {
      setDoc(doc(firestoreDb, "courses", uuid()), newCourse)
        .then((reponse) => {
          message.success("Course Created");
          navigate("/list-Course");
        })
        .catch((error) => {
          message.error("Coures is not created, Try again");
          console.log(error);
        });
    } else {
      message.warning("Course Already exist");
    }
  };

  const onCancle = () => {
    navigate("/list-Course");
  };

  const handleCourse = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleClass = (value) => {
    const classData = JSON.parse(value);
    setSelectedLevel(classData.level + classData.section);
    setNewCourse({ ...newCourse, class: classData.key });
  };

  const handleSubject = (value) => {
    const subValue = JSON.parse(value)
    setSelectedSubject(subValue.name);
    setNewCourse({ ...newCourse, subject: subValue.key })

  };

  const handleTeacher = (value) => {
    // const teacherdata = [];
    // value.map((item, i) => {
    //   teacherdata.push(JSON.parse(item));
    // });
    setNewCourse({ ...newCourse, teachers: value });
  };
  const handleScheduler = (value, i) => {
    if (typeof value === "string") {
      newCourse.schedule[i].day = value;
    } else {
      const timeValue = [];
      value.map((item, i) => {
        timeValue.push(JSON.stringify(item._d))
        console.log(JSON.stringify(item._d))
      })
      newCourse.schedule[i].time = timeValue;
    }
  };
  useEffect(() => {
    getCourseData();
  }, []);

  return (
    <>
      <div>
        <div className="create-header">
          <h1>Add Course</h1>
          <Button onClick={createNewCourse}>Submit</Button>
        </div>
        <div className="create-info">
          <div className="create-description">
            <h1>Coures Information</h1>
            <h3>Description</h3>
            <Input.TextArea
              placeholder="Course "
              rows={4}
              name="description"
              onChange={(e) => handleCourse(e)}
            />
          </div>
          <div className="info-selection">
            <div className="col">
              <div className="subject">
                <h3>Subject</h3>
                <Select
                  style={{
                    width: "50%"
                  }}
                  placeholder="select Subjects"
                  onChange={handleSubject}
                  optionLabelProp="label"
                >
                  {subject.map((item, index) => (
                    <Option key={item.key} value={JSON.stringify(item)} label={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="class">
                <h3>Class</h3>
                <Select
                  style={{
                    width: "100%",
                  }}
                  placeholder="select Classes"
                  onChange={handleClass}
                  optionLabelProp="label"
                >
                  {classes.map((item, index) => (
                    <Option
                      value={JSON.stringify(item)}
                      label={item.level + " " + item.section}
                    >
                      {item.level + " " + item.section}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="col">
              <div className="teacher">
                <h3>Teachers</h3>
                <Select
                  style={{
                    width: "100%",
                  }}
                  placeholder="select Teachers"
                  onChange={handleTeacher}
                  optionLabelProp="label"
                  maxTagCount={3}
                  showArrow
                  mode="multiple"
                >
                  {teachers.map((item, index) => (
                    <Option
                      key={item.key}
                      value={item.key}
                      label={
                        item.first_name + " " + (item.last_name ? item.last_name : "")
                      }
                    >
                      {item.first_name + " " + (item.last_name ? item.last_name : "")}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="create-schedule">

          <div className="up-card-schedule">
            <h1>Weekly Schedule</h1>
            <h2 >Class {selectedLevel ? selectedLevel : ""}</h2>
            <div className="schedule-header">
              <div>
                <p> Period</p>
              </div>
              <div>
                <p> Start time</p>
                <p> End time</p>
              </div>
            </div>

            {input.map((item, i) => (
              <>
                <Select
                  style={{
                    width: "40%",

                  }}
                  placeholder="First Select Days"
                  onChange={(e) => handleScheduler(e, i)}
                >
                  {days.map((item, index) => (
                    <Option key={index} value={item} label={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
                <TimePicker.RangePicker
                  style={{
                    width: "60%",
                  }}
                  format={"hh:mm"}
                  use12Hours
                  onChange={(e) => handleScheduler(e, i)}
                />
              </>
            ))}
            <Button
              style={{
                float: "right"
              }}
              onClick={() => {
                setInput([...input, 7]);
                setNewCourse({
                  ...newCourse,
                  schedule: [...newCourse.schedule, { day: "", time: [] }],
                });
              }}
            >
              Add New
            </Button>

          </div>
        </div>
        <Button className="btn-cancle" type="danger" onClick={onCancle}>Cancle</Button>
      </div>

    </>
  );
};

export default CreateCrouse;
