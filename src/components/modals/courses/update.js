import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPen } from "@fortawesome/free-solid-svg-icons";

import {
  Input,
  Button,
  Select,
  message,
  TimePicker,
  Tabs,
  Table,
  Spin,
} from "antd";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckOutlined } from "@ant-design/icons";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestoreDb, storage } from "../../../firebase";
import AttendanceList from "../../subComponents/AttendanceList";
import moment from "moment";
import {
  removeSingleCourseFromClass,
  addSingleCourseToTeacher,
  addSingleClassToTeacher,
  removeSingleCourseToTeacher,
  fetchSubject,
} from "../funcs";

const { Option } = Select;

function UpdateCourse() {
  const { state } = useLocation();
  const { data } = state;
  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);
  const [input, setInput] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjectData, setSubjectData] = useState();
  const [teachers, setTeachers] = useState([]);
  const [singleClass, setSingleClass] = useState("");
  const [subject, setSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(data.subject?.name);
  const [selectedLevel, setSelectedLevel] = useState(
    data.class ? data.class.level + data.class.section : ""
  );
  const [loading, setLoading] = useState(false);
  const [teacherView, setTeacherView] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState(data.teachers);

  const [updateCourse, setUpdateCourse] = useState({
    course_name: data.course_name,
    subject: data.subject?.key,
    teachers: data.teachers,
    class: data.class.key,
    schedule: data.schedule,
    description: data.description,
    school_id: data.school_id,
  });
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    console.log(newSelectedRowKeys);
    updateCourse.teachers= newSelectedRowKeys
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const days = ["Monday", "Thusday", "Wednsday", "Thursday", "Friday"];

  useEffect(() => {
    getCourseData();
    setTimeout(() => {
      setLoading(true);
    }, 2000);
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    updateCourse.course_name = selectedSubject + " " + selectedLevel;
    console.log("teacher update    ", updateCourse.teachers)
    updateCourse.teachers?.map((item, i) => {
      if (typeof item === "object") {
        updateCourse.teachers[i] = item.key;
      }
    });
    console.log(updateCourse.teachers)
    setDoc(doc(firestoreDb, "courses", data.key), updateCourse, { merge: true })
      .then((_) => {
        setLoading(false);
        //add Course To Teacher when updating
        updateCourse.teachers.map((items) => {
          if (!data.teachers.includes(items)) {
            addSingleCourseToTeacher(data.key, items);
            addSingleClassToTeacher(updateCourse.class, items);
          }
        });
        // if teacher is in data but not in updateCourse then remove it from the teacher
        data.teachers.map((items) => {
          if (!updateCourse.teachers.includes(items)) {
            console.log("removed", data.key, items.key);
            removeSingleCourseToTeacher(data.key, items.key);
          }
        });

        removeSingleCourseFromClass(data.class.key, data.key);
        message.success("Data is updated successfuly");
        navigate("/list-course");
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

  const getSubjectID = async (ID) => {
    const docRef = doc(firestoreDb, "subject", ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };

  const getClasstID = async (ID) => {
    const docRef = doc(firestoreDb, "class", ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };
  const setClassesData = async (ID) => {
    const classData = await getClasstID(ID);
    const subject = await fetchSubject(updateCourse.subject);
    setSubjectData(subject);
    setSingleClass(classData);
  };

  useEffect(() => {
    setClassesData(updateCourse.class);
  }, []);
  const handleCourse = (e) => {
    setUpdateCourse({ ...updateCourse, [e.target.name]: e.target.value });
  };

  const handleClass = async (value) => {
    const classData = await getClasstID(value);
    setSelectedLevel(classData.level + classData.section);
    setUpdateCourse({ ...updateCourse, class: value });
  };

  const handleSubject = async (value) => {
    const response = await getSubjectID(value);
    setSelectedSubject(response.name);
    setUpdateCourse({ ...updateCourse, subject: value });
  };

  const getTeacherID = async (ID) => {
    const docRef = doc(firestoreDb, "teachers", ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };

  const handleScheduler = (value, i) => {
    updateCourse.schedule[i].day = value;
    console.log(updateCourse);
  };
  const handleSchedulerTime = (value, i) => {
    console.log(value, i);
    const timeValue = [];
    value.map((item, i) => {
      timeValue.push(JSON.stringify(item._d));
    });
    updateCourse.schedule[i].time = timeValue;
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
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      width: "50%",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      width: "50%",
    },
  ];

  return (
    <>
      {loading ? (
        <div className="bg-[#F9FAFB] h-[100vh] py-4">
          <div className="flex flex-row justify-between w-[100%] -mt-20 border-b-[1px] p-3">
            <div className="flex flex-row justify-between align-middle h-[78px]">
              <div className="rounded-full  border-[2px] border-[#E7752B] mr-10">
                <img
                  className="w-[74px] rounded-full  bg-[white] "
                  src="logo512.png"
                  alt="profile"
                />
              </div>
              <div className="flex flex-col justify-center align-middle">
                <h2 className="text-xl font-[600] font-jakarta text-[#1D2939]">
                  {data.course_name}
                </h2>
              </div>
            </div>
            <div className="flex flex-col justify-center align-end">
              <div className="flex flex-row justify-end">
                <h3 className="text-lg font-semibold font-jakarta text-[#344054]">
                  Class
                </h3>
                <h4 className="border-l-[2px] pl-2 text-lg font-semibold font-jakarta text-[#667085] p-[1px] ml-2">
                  {singleClass?.level}
                  {singleClass?.section}
                </h4>
              </div>
              <div className="flex flex-row">
                <h3 className="text-lg font-semibold font-jakarta">Subject</h3>
                <h4 className="border-l-[2px] pl-2 text-lg font-bold font-jakarta  text-[#667085] p-[1px] ml-2">
                  {subjectData?.name}
                </h4>
              </div>
              <div className="flex flex-row mt-4 justify-end ">
                <Button
                  icon={<FontAwesomeIcon className="pr-2" icon={faPen} />}
                  className=" !text-[#E7752B] !border-[#E7752B] items-center rounded-lg "
                  onClick={handleUpdate}
                >
                  Finalize Review
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-[32px]">
            <p className="text-xl font-semibold text-[#344054] text-left font-jakarta mb-[12px]">
              Edit Course
            </p>

            <div className="bg-[#FFFFFF] rounded-sm border-[2px] p-[24px]">
              <div className="py-2 flex flex-col justify-around">
                <div className="w-[100%]">
                  <h4 className="text-base font-jakarta text-[#344054] mb-[6px] font-semibold mt-2">
                    Description
                  </h4>
                  <Input.TextArea
                    name="description"
                    className="border-[1px] rounded-sm"
                    rows={6}
                    defaultValue={updateCourse.description}
                    onChange={(e) => handleCourse(e)}
                  />
                </div>
                <div className="flex flex-col mt-[24px]">
                  <span
                    className="text-sm font-jakarta font-[500"
                  //style={{ fontFamily:'Plus Jakarta Sans', fontWeight:'500',lineHeight:'24px',fontSize:14}}
                  >
                    Subject
                  </span>
                  <Select
                    className="rounded-xl mt-2"
                    style={{
                      width: "40%",
                    }}
                    placeholder="select Subjects"
                    onChange={handleSubject}
                    optionLabelProp="label"
                    defaultValue={updateCourse.subject}
                  >
                    {subject.map((item, index) => (
                      <Option key={index} value={item.key} label={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="w-[40%] mt-[12px]">
                  <div>
                    <span className="text-sm font-jakarta font-[500]">
                      Class
                    </span>
                    <Select
                      className="mt-2"
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
                          value={item.key}
                          label={item.level + " " + item.section}
                        >
                          {item.level + " " + item.section}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <div className="assign-header">
                <h4 className="font-[600] font-jakarta text-[#344054] text-lg">
                  Edit Teachers
                </h4>
              </div>
              {teacherView ? (
                <Table
                  // className="p-2 bg-[white] font-jakarta text-[#344054] rounded-lg border-[1px] border-[#D0D5DD]"
                  dataSource={teachers}
                  rowSelection={rowSelection}
                  columns={columns}
                />
              ) : (
                <Spin />
              )}
            </div>
            <div className="mb-20 rounded-lg">
              <h4
                // className="text-xl pt-2"
                className="textbase pt-2 font-jakarta font-semibold text-lg text-[#344054] mb-[24px]"
              >
                Edit Schedule
              </h4>
              <div className="up-card-schedule pb-10 border-[2px] rounded-sm bg-[white]">
                <h2 className="text-lg py-2">
                  Class{"  "}
                  {singleClass?.level}
                  {singleClass?.section}
                </h2>
                <div className="flex flex-row justify-between">
                  <div className="border-[2px] w-[100%] p-2 text-left rounded-l-lg border-r-[0px] border-[#F2F4F7]">
                    <p> Period</p>
                  </div>
                  <div className="border-t-[2px] border-b-[2px] w-[100%] p-2 text-left border-r-[0px] rounded-none border-[#F2F4F7]">
                    <p> Start time</p>
                  </div>

                  <div className="border-[2px] w-[100%] p-2 text-left rounded-l-none border-l-[0px] rounded-lg border-[#F2F4F7]">
                    <p> End time</p>
                  </div>
                </div>

                {data.schedule?.map((item, i) => (
                  <div className="border-[#F2F4F7] border-[2px] my-2 rounded-lg">
                    <Select
                      style={{ width: "33%" }}
                      className="rounded-lg border-[0px]"
                      placeholder="First Select Days"
                      onChange={(e) => handleScheduler(e, i)}
                      defaultValue={item.day}
                    >
                      {days.map((item, index) => (
                        <Option key={index} value={item} label={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                    <TimePicker.RangePicker
                      style={{ width: "67%" }}
                      className="rounded-lg border-[0px]"
                      format={"hh:mm a"}
                      showTime={{ use12Hours: true }}
                      defaultValue={
                        item.time.length
                          ? [
                            moment(JSON.parse(item.time[0])),
                            moment(JSON.parse(item.time[1])),
                          ]
                          : []
                      }
                      onChange={(e) => handleSchedulerTime(e, i)}
                    />
                  </div>
                ))}
                {input.map((item, i) => (
                  <div className="border-[#F2F4F7] border-[2px] my-2 rounded-lg">
                    <Select
                      style={{ width: "33%" }}
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
                      status="warning"
                      style={{ width: "67%" }}
                      className="rounded-lg border-[0px] active:border-[0px] outline-none selection:border-[#E7752B]"
                      format={"hh:mm"}
                      use12Hours
                      onChange={(e) => handleNewScheduler(e, i)}
                    />
                  </div>
                ))}
                <Button
                  style={{ float: "right", marginBottom: 10 }}
                  onClick={() => {
                    setInput([...input, 0]);
                    setUpdateCourse({
                      ...updateCourse,
                      schedule: [
                        ...updateCourse.schedule,
                        { day: "", time: [] },
                      ],
                    });
                  }}
                >
                  Add New
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex  flex-col justify-center align-middle mt-[20vh]">
          <Spin
            tip={<p className="text-lg">Loading course...</p>}
            className="text-[#E7752B] "
            wrapperClassName="text-[#E7752B]"
          />
        </div>
      )}
    </>
  );
}

export default UpdateCourse;
