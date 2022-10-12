import { useEffect, useState, useRef } from "react";
import { Input, Button, Select, message, TimePicker, Table, Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  getDoc,
} from "firebase/firestore";
import { firestoreDb } from "../../firebase";
import uuid from "react-uuid";
import moment from "moment";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../modals/courses/style.css";

const { Option } = Select;

const CreateClasses = () => {
  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);
  const classes = useRef();
  const [input, setInput] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const days = ["Monday", "Thusday", "Wednsday", "Thursday", "Friday"];
  const [coursesData, setCourseData] = useState([]);
  const [selectedCourseForSchedule, setSelectedCourseForSchedule] = useState(
    {}
  );
  const [teachers, setTeachers] = useState([]);
  const [classSelected, setClassSelected] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [newClass, setNewClass] = useState({
    level: "",
    student: [],
    course: [],
    section: "",
    school_id: uid.school,
  });

  const columns = [
    {
      title: (
        <p className="font-jakarta text-[#344054] font-[600]">First Name</p>
      ),
      dataIndex: "first_name",
      key: "first_name",
      render: (text, data) => {
        return (
          <p className="text-[14px] font-jakarta text-[#344054]">{text}</p>
        );
      },
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      render: (item) => {
        return <div className="text-[#344054]">{item}</div>;
      },
    },
    {
      title: "ID",
      dataIndex: "studentId",
      key: "studentId",
      render: (item) => {
        return <div className="text-[#344054]">{item}</div>;
      },
    },
    {
      title: "AGE",
      dataIndex: "age",
      key: "age",
      render: (item) => {
        return <div className="text-[#344054]">{item}</div>;
      },
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
      render: (item) => {
        return <div className="text-[#344054]">{item}</div>;
      },
    },
  ];

  const getStudents = async (level) => {
    const children = [];
    const q = query(
      collection(firestoreDb, "students"),
      where("school_id", "==", uid.school)
      // where("level", "==", level)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      children.push({
        ...datas,
        key: doc.id,
      });
    });
    setTimeout(() => {
      setStudents(children);
      setLoading(false);
    }, 2000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setNewClass({ ...newClass, student: newSelectedRowKeys });
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }

            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }

            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const createNewClass = async () => {
    const q = query(
      collection(firestoreDb, "class"),
      where("school_id", "==", uid.school),
      where("level", "==", newClass.level),
      where("section", "==", newClass.section)
    );
    const checkIsExist = (await getDocs(q)).empty;
    if (checkIsExist) {
      setDoc(doc(firestoreDb, "class", uuid()), newClass)
        .then((_) => {
          message.success("Class Created");
          navigate("/list-Classes");
        })
        .catch((error) => console.log(error));
    } else {
      message.error("This Class already exist");
    }
  };
  const getCourseData = async (ID) => {
    const docRef = doc(firestoreDb, "courses", ID);
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
    return data;
  };
  const getDatas = async (data, teach) => {
    if (data.class) {
      data.class?.map(async (item, index) => {
        data.class[index] = await getClassData(item, teach);
      });

      data.course?.map(async (item, index) => {
        data.course[index] = await getCourseData(item);
      });
      return data;
    } else {
      return data;
    }
  };

  const getClassData = async (ID) => {
    const docRef = doc(firestoreDb, "class", ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      console.log(response.data());
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

  const getCourse = async (value) => {
    var variables = [];
    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "==", uid.school)
    );
    var querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      console.log("this is me", datas);
      if (datas.course_name.includes(value)) {
        getData(datas).then((response) => {
          var newDAtas = response;
          newDAtas.key = doc.id;
          variables.push(newDAtas);
        });
      }
    });
    setTimeout(() => {
      setCourseData(variables);
    }, 2000);
  };

  const handleClass = (e) => {
    setClassSelected(false);
    if (e.target.name === "section") {
      var data = newClass?.level + e.target.value;
      getCourse(data);
    }
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
    setClassSelected(true);
  };
  const handleCourseSchedule = (e) => {
    var coursees = coursesData.filter((c) => c.course_id === e);
    setSelectedCourseForSchedule(coursees[0]);
  };

  const handleStudent = (value) => {
    console.log(value);
    // value.map((item, i) => {
    //   var newItem = JSON.parse(item);
    //   value[i] = newItem.key;
    // });
    setNewClass({ ...newClass, homeRoomTeacher: value });
  };

  const getTeacher = async () => {
    var value = [];
    const q = query(
      collection(firestoreDb, "teachers"),
      where("school_id", "==", uid.school)
    );

    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();
      data.key = doc.id;
      getDatas(data, doc.id).then((response) => {
        value.push(response);
      });
    });
    setTimeout(() => {
      console.log("Temporary: ", value);
      setTeachers(value);
    }, 2000);
  };

  useEffect(() => {
    getStudents();
    getTeacher();
  }, [classSelected]);

  return (
    <>
      <div className="bg-[#F9FAFB] h-[auto] pb-20  px-6 -mt-14">
        <div className="flex flex-row justify-between -mt-10 mb-8 z-0">
          <h1 className="text-2xl font-bold font-jakarta text-[#344054] ">
            Add Class
          </h1>
          <Button
            className="bg-[#E7752B] text-[white] rounded-lg shadow-md -z-0"
            onClick={() => createNewClass()}
          >
            Submit
            <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
          </Button>
        </div>
        <div className="bg-[white] p-4 border-[1px] rounded-lg">
          <div className="flex flex-row justify-between w-[100%]">
            <div>
              <div className="py-2">
                <h1 className="text-[#344054] pb-[6px] font-jakarta">Grade</h1>

                <Input
                  name="level"
                  type={"number"}
                  className="rounded-lg"
                  onChange={(e) => handleClass(e)}
                />
              </div>
            </div>
            <div className="py-2 ml-10">
              <h1 className="text-[#344054] pb-[6px] font-jakarta">Section</h1>
              <Input
                className="rounded-lg"
                name="section"
                onChange={(e) => handleClass(e)}
              />
            </div>
            <div className="py-2 ml-10 w-[20vw]">
              <h1 className="text-[#344054] pb-[6px] font-jakarta">
                Home room Teacher
              </h1>
              <Select
                style={{
                  width: "100%",
                }}
                placeholder="Select Home room Teacher"
                onChange={handleStudent}
                optionLabelProp="label"
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
          </div>
        </div>
        <h4 className=" pt-2 font-jakarta font-semibold text-xl  text-[#344054] my-5">
          Schedule
        </h4>
        <div className="">
          <div className="pb-20 border-[2px] rounded-lg bg-[white] p-4">
            <Select
              defaultValue="Course"
              className="border-[1px] w-[200px] mb-[24px] rounded-lg outline-none "
              onChange={(e) => handleCourseSchedule(e)}
            >
              {coursesData.map((item, i) => (
                <Option key={i} value={item.course_id} lable={item.course_name}>
                  {item.course_name}
                </Option>
              ))}
            </Select>
            <div className="flex flex-row justify-between ">
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
            {selectedCourseForSchedule?.schedule?.map((item, i) => (
              <div className="border-[#F2F4F7] border-[2px] my-2 rounded-lg">
                <Select
                  style={{ width: "33%" }}
                  className="rounded-lg border-[0px]"
                  placeholder="First Select Days"
                  // onChange={(e) => handleScheduler(e, i)}
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
                  // onChange={(e) => handleSchedulerTime(e, i)}
                />
              </div>
            ))}

            {input.map((item, i) => (
              <div className="border-[#F2F4F7] border-[2px] my-2 rounded-lg">
                <Select
                  style={{ width: "33%" }}
                  placeholder="First Select Days"
                  // onChange={(e) => handleNewScheduler(e, i)}
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
                  // onChange={(e) => handleNewScheduler(e, i)}
                />
              </div>
            ))}
            <Button
              style={{ float: "right", marginBottom: 20, marginTop: 20 }}
              onClick={() => {
                setInput([...input, 0]);
                // setUpdateCourse({
                //   ...updateCourse,
                //   schedule: [...updateCourse.schedule, { day: "", time: [] }],
                // });
              }}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="list-header">
          <h1 className="text-2xl font-semibold" style={{ marginTop: 20 }}>
            Add Student
          </h1>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 8,
            borderWidth: 1,
            top: 95,
            marginTop: 20,
          }}
        >
          <div
            style={{
              padding: 5,
            }}
          >
            <div>
              <Table
                loading={loading}
                rowSelection={rowSelection}
                dataSource={students}
                columns={columns}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateClasses;
