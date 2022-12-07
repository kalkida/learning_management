import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Button, Select, TimePicker, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import {
  addSingleCourseToClass,
  addSingleCourseToTeacher,
  addSingleClassToTeacher,
} from "../modals/funcs";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore";
import { firestoreDb } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import _default from "antd/lib/time-picker";

const { Option } = Select;
const days = ["Monday", "Tuesday", "Wednsday", "Thursday", "Friday"];
const CreateCrouse = () => {
  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);
  const school = useSelector((state) => state.user.profile.school);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [secclas, setSecClass] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [input, setInput] = useState([0]);
  const [newCourse, setNewCourse] = useState({
    course_name: selectedSubject + " " + selectedLevel,
    teachers: [],
    class: "",
    grade: "",
    section: "",
    subject: "",
    schedule: [{ day: "", time: [] }],
    description: "",
    course_id: "",
    school_id: uid.school,
  });

  const getCourseData = async () => {
    const children = [];
    const teachersArrary = [];
    const q = query(collection(firestoreDb, "schools", `${school}/class`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      children.push({
        ...datas,
        key: doc.id,
      });
    });
    const qTeachers = query(
      collection(firestoreDb, "schools", `${school}/teachers`)
    );
    const queryTeachers = await getDocs(qTeachers);
    queryTeachers.forEach((doc) => {
      var datas = doc.data();
      teachersArrary.push({
        ...datas,
        key: doc.id,
      });
    });

    setClasses(children);
    setTeachers(teachersArrary);
  };

  const createNewCourse = async () => {
    if (newCourse.class == "" && newCourse.grade == "") {
      alert("Please select a class or Give Section and Course Name");
      return;
    }
    newCourse.course_name = selectedSubject + " " + selectedLevel;
    if (newCourse.course_name == "") {
      message.error("please enter a new course name");
      return 0;
    }
    const q = query(
      collection(firestoreDb, "schools", `${school}/courses`),
      where("course_name", "==", newCourse.course_name)
    );

    const checkIsExist = (await getDocs(q)).empty;

    if (checkIsExist) {
      var courseId = uuid();
      setDoc(doc(firestoreDb, "schools", `${school}/courses`, courseId), {
        ...newCourse,
        course_id: courseId,
      })
        .then((_) => {
          addSingleCourseToClass(newCourse.class, courseId, school);

          newCourse.teachers.map((teacher) => {
            addSingleCourseToTeacher(courseId, teacher, school);
            addSingleClassToTeacher(newCourse.class, teacher, school);
          });
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

  const handleCourse = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleClass = (value) => {
    const classData = JSON.parse(value);
    setSelectedLevel(classData.level + classData.section);
    setNewCourse({ ...newCourse, class: classData.key });
  };

  const handleSubject = (e) => {
    setSelectedSubject(e.target.value);
    setNewCourse({ ...newCourse, subject: e.target.value });
  };

  const handleGrade = (e) => {
    setNewCourse({ ...newCourse, grade: e.target.value });
  };
  const handleSection = (e) => {
    setNewCourse({ ...newCourse, section: e.target.value });
  };

  const handleTeacher = (value) => {
    setNewCourse({ ...newCourse, teachers: value });
  };
  const handleScheduler = (value, i) => {
    if (typeof value === "string") {
      newCourse.schedule[i].day = value;
    } else {
      const timeValue = [];
      value.map((item, i) => {
        timeValue.push(JSON.stringify(item._d));
        console.log(JSON.stringify(item._d));
      });
      newCourse.schedule[i].time = timeValue;
    }
  };

  useEffect(() => {
    getCourseData();
  }, []);

  return (
    <div className="bg-[#F9FAFB] h-[auto] pb-20  -mt-14">
      <div className="flex flex-row justify-between -mt-10 mb-8 z-0">
        <h1 className="text-2xl font-bold font-jakarta text-[#344054] ">
          Add Course
        </h1>
        <div className="pr-0  flex flex-row">
          <Button
            style={{
              borderRadius: "8px",
              borderWidth: 1,
            }}
            className="!border-[#DC5FC9] !bg-[#DC5FC9] border-[2px] hover:!text-white !text-[white] rounded-lg shadow-md -z-0 ml-10"
            icon={<FontAwesomeIcon className="mr-2" icon={faArrowRight} />}
            onClick={createNewCourse}
          >
            Confirm
          </Button>
        </div>
      </div>
      <h1 className="text-xl font-jakarta font-[600] mb-3 text-[#344054]">
        Course Information
      </h1>
      <div className="bg-[#FFFFFF] border-[1px] border-[#D0D5DD] p-[24px] rounded-lg">
        <div>
          <h3
            className="pb-2 font-semibold"
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: "500",
              lineHeight: "20px",
            }}
          >
            Description
          </h3>
          <Input.TextArea
            placeholder="Course "
            rows={4}
            name="description"
            className="!border-[2px] !rounded-lg"
            onChange={(e) => handleCourse(e)}
          />
        </div>
        <div className="h-[auto]">
          <div className="w-[100%]">
            <div className="pt-[24px] pb-[6px]">
              <h3
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: "500",
                  lineHeight: "20px",
                  fontSize: 14,
                }}
              >
                Subject
              </h3>
              <Input
                onChange={handleSubject}
                placeholder="Subject"
                className="md:w-[50%] w-[100%]"
                required
                style={{
                  borderRadius: "8px",
                  borderWidth: 2,
                }}
              />
            </div>
            <div className="flex flex-row md:w-[50%]">
              <div className="pb-[6px] pt-[12px] w-[100%]">
                <h3
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: "500",
                    lineHeight: "20px",
                    fontSize: 14,
                  }}
                >
                  Grade
                </h3>
                <Input
                  type="number"
                  style={{
                    width: "98%",
                    borderRadius: "8px",
                    borderWidth: 2,
                  }}
                  onChange={handleGrade}
                  placeholder="Grade"
                />
              </div>
              <div className="pb-[6px] pt-[12px] w-[100%]">
                <h3
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: "500",
                    lineHeight: "20px",
                    fontSize: 14,
                  }}
                >
                  Section
                </h3>
                <Input
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    borderWidth: 2,
                  }}
                  onChange={handleSection}
                  placeholder="Grade"
                />
              </div>
            </div>
            <div className="pb-[6px] pt-[12px]">
              <h3
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: "500",
                  lineHeight: "20px",
                  fontSize: 14,
                }}
              >
                Class
              </h3>
              <Select
                bordered={false}
                style={{
                  // width: "50%",
                  borderRadius: "8px",
                  borderWidth: 2,
                }}
                placeholder="select Classes"
                className="md:w-[50%] w-[100%]"
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
            <div className="flex flex-col pt-[24px] pb-[6px]">
              <h3
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: "500",
                  lineHeight: "20px",
                  fontSize: 14,
                }}
              >
                Teachers
              </h3>
              {[0, 1, 2].map((_) => (
                <Select
                  bordered={false}
                  style={{
                    borderRadius: "8px",
                    marginBottom: 14,
                    borderWidth: 2,
                  }}
                  placeholder="select Teachers"
                  onChange={handleTeacher}
                  optionLabelProp="label"
                  maxTagCount={3}
                  showArrow
                  className="md:w-[50%] w-[100%]"
                  mode="multiple"
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
              ))}
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-xl font-jakarta font-[600] mb-3 text-[#344054] mt-[32px]">
        Schedule
      </h1>
      <div className="w-[100%] border-[1px] border-[#D0D5DD] bg-[#FFFFFF] mt-[0] p-6 rounded-lg">
        <div className="h-[auto] pb-10">
          <div className="flex flex-row justify-between">
            <div className="border-[1px] h-10 border-r-[0px] w-[100%] p-2 text-left   border-[#F2F4F7]">
              <p> Period</p>
            </div>
            <div className="border-t-[1px] h-10 border-r-[0px]  border-b-[1px] w-[100%] p-2 text-left  border-[#F2F4F7]">
              <p> Start time</p>
            </div>

            <div className="border-[1px] h-10 border-l-[0px] w-[100%] p-2 text-left  border-[#F2F4F7]">
              <p> End time</p>
            </div>
          </div>

          {input.map((item, i) => (
            <div className=" my-2 rounded-lg">
              <Select
                bordered={false}
                style={{
                  width: "30%",
                  marginRight: "3%",
                  borderRadius: "8px",
                  borderWidth: 2,
                }}
                className="rounded-lg border-[0px] outline-none"
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
                style={{ width: "67%" }}
                className="!rounded-lg  outline-none !border-[2px] !border-[#F2F4F7]"
                status="warning"
                format={"hh:mm"}
                use12Hours
                onChange={(e) => handleScheduler(e, i)}
              />
            </div>
          ))}
          <Button
            className="border-[2px] border-[#DC5FC9] text-[#DC5FC9] !rounded-lg"
            style={{
              float: "right",
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
    </div>
  );
};

export default CreateCrouse;
