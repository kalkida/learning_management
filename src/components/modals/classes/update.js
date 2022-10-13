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
import {
  Button,
  Select,
  TimePicker,
  Tabs,
  Table,
  message,
  Spin,
  Input,
} from "antd";
import "./style.css";
import AttendanceList from "../../subComponents/AttendanceList";
import {
  fetchSubject,
  addSingleCourseToClass,
  addClassIDToCourse,
  fetchClass,
} from "../funcs";
import Icon from "react-eva-icons";

const { Option } = Select;

function UpdateClass() {
  const uid = useSelector((state) => state.user.profile);
  const [loading, setLoading] = useState(false);
  const [courses, setcourse] = useState([]);
  const [item, setItem] = useState([]);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [sectionMainData, setSectionMainData] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [studentLoading, setStudentLoading] = useState(true);
  const { state } = useLocation();
  const { data } = state;
  const [selectedRowKeys, setSelectedRowKeys] = useState(data.student);
  const [selectedRowKeysCourses, setSelectedRowKeyCourse] = useState(
    data.course
  );
  const [updateClass, setUpdateClass] = useState({
    level: data.level,
    student: data.student,
    section: data.section,
    homeRoomTeacher: data?.homeRoomTeacher,
    school_id: data.school_id,
    course: data.course,
    schedule: data.schedule,
  });
  const [updateComplete, setUpdateComplete] = useState([]);

  const navigate = useNavigate();
  const columns = [
    {
      title: <h1 className="text-[16px] font-[600] text-[#344054]">Name</h1>,
      dataIndex: "first_name",
      key: "first_name",
      render: (item, data) => {
        if (item) {
          return (
            <div>
              {item}
              {"  "}
              {data.last_name}
            </div>
          );
        } else {
          return <div className=" text-[#515f76]">No Data</div>;
        }
      },
    },
    {
      title: <h1 className="text-[16px] font-[600] text-[#344054]">ID</h1>,
      dataIndex: "studentId",
      key: "studentId",
      render: (item, data) => {
        if (item) {
          return <div>{item}</div>;
        } else {
          return <div className=" text-[#515f76]">No Data</div>;
        }
      },
    },
    {
      title: <h1 className="text-[16px] font-[600] text-[#344054]">Grade</h1>,
      dataIndex: "studentId",
      key: "studentId",
      render: (item, data) => {
        if (item) {
          return <div>{item}</div>;
        } else {
          return <div className=" text-[#515f76]">No Data</div>;
        }
      },
    },

    {
      title: <h1 className="text-[16px] font-[600] text-[#344054]">Sex</h1>,
      dataIndex: "sex",
      key: "sex",
      render: (item) => {
        if (item) {
          return <div>{item}</div>;
        } else {
          return <div className=" text-[#515f76]">No Data</div>;
        }
      },
    },
    {
      title: (
        <h1 className="text-[16px] font-[600] text-[#344054]">
          Assigned Class
        </h1>
      ),
      dataIndex: "className",
      key: "className",
      render: (item) => {
        if (item) {
          return <div>{item}</div>;
        } else {
          return <div className="text-[#515f76]">No Data</div>;
        }
      },
    },
  ];

  const courseColumns = [
    {
      title: <h1 className="text-[16px] font-[600] text-[#344054]">Course</h1>,
      dataIndex: "course_name",
      key: "course_name",
      render: (item) => {
        return <div>{item}</div>;
      },
    },
    {
      title: <h1 className="text-[16px] font-[600] text-[#344054]">Subject</h1>,
      dataIndex: "subject",
      key: "subject",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: <h1 className="text-[16px] font-[600] text-[#344054]">Grade</h1>,
      dataIndex: "class",
      key: "class",
      render: (item) => {
        if (item) {
          return <div>{item.level}</div>;
        } else {
          return <div className="text-[#515f76]">No Data</div>;
        }
      },
    },
    {
      title: <h1 className="text-[16px] font-[600] text-[#344054]">Section</h1>,
      dataIndex: "class",
      key: "class",
      render: (item) => {
        if (item) {
          return <div>{item.section}</div>;
        } else {
          return <div className="text-[#515f76]">No Data</div>;
        }
      },
    },
  ];

  const handleUpdate = async () => {
    setLoading(true);
    console.log(data);
    setDoc(
      doc(firestoreDb, "class", data.key),
      {
        ...updateClass,
        student: selectedRowKeys,
        course: selectedRowKeysCourses,
      },
      { merge: true }
    )
      .then((_) => {
        setLoading(false);
        updateClass.course.map((course) => {
          if (!data.course.includes(course)) {
            addClassIDToCourse(data.key, course);
          }
        });
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
  const onSelectChanges = (newSelectedRowKeys) => {
    console.log("slect", newSelectedRowKeys);
    setSelectedRowKeyCourse(newSelectedRowKeys);
  };

  const rowSelectionCourse = {
    selectedRowKeysCourses,
    onChange: onSelectChanges,
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
          setSelectedRowKeyCourse(newSelectedRowKeys);
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
          setSelectedRowKeyCourse(newSelectedRowKeys);
        },
      },
    ],
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
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

  const getClass = async () => {
    const children = [];
    const sectionArray = [];

    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "==", uid.school)
      // where("class", "==", data.key)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      if (datas.class == data.key || datas.class == "") {
        children.push({
          ...datas,
          key: doc.id,
        });
      }
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
    setItem(children);

    setcourse(children);
    setSectionMainData(sectionArray);
  };
  const getStudenters = async () => {
    var temp = [];
    var students = data.student;
    students.map((id) => {
      getStudentID(id).then((stud) => {
        temp.push(stud);
      });
    });
    setSelected(temp);
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

  const getClassData = async (ID) => {
    const docRef = doc(firestoreDb, "class", ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
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
      setTeachers(value);
    }, 2000);
  };

  const getStudentID = async (ID) => {
    const docRef = doc(firestoreDb, "students", ID);
    var data = "";
    var response = await getDoc(docRef);
    if (response.exists()) {
      data = response.data();
    }

    return data;
  };
  useEffect(() => {
    getStudenters();
    getClass();
    getTeacher();

    setTimeout(() => {
      setLoading(true);
      setStudentLoading(false);

      getStudent();
    }, 2000);
  }, []);

  const handleStudent = (value) => {
    setUpdateClass({ ...updateClass, homeRoomTeacher: value });
  };

  const handleClass = (e) => {
    setUpdateClass({ ...updateClass, [e.target.name]: e.target.value });
  };
  return (
    <div className="bg-[#F9FAFB]  h-[auto]">
      {loading ? (
        <>
          <div className="flex flex-row justify-between w-[100%] -mt-14 pb-4 ">
            <div className="flex flex-row justify-center align-middle ">
              <div className="flex flex-row">
                <h1 className="text-lg font-bold font-jakarta mr-2">Class</h1>
                <h2 className="text-lg font-bold font-jakarta">
                  {data?.level}
                </h2>
                <h3 className="text-lg font-bold font-jakarta">
                  {data?.section}
                </h3>
              </div>
            </div>
            <div className="flex flex-row">
              <h3 className="text-lg font-semibold font-jakarta border-r-[2px] pr-2">
                Assigned Students
              </h3>
              <h4 className="text-lg font-semibold font-jakarta pl-2">
                {data?.student.length}
              </h4>
            </div>
          </div>
          <div>
            <div className="tab-content">
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane
                  tab={
                    <p className="text-sm font-[600] text-center ml-0 font-jakarta">
                      Profile
                    </p>
                  }
                  key="1"
                >
                  <Button
                    className="btn-confirm bg-[#E7752B] text-[white] flex flex-row "
                    onClick={handleUpdate}
                  >
                    <Icon
                      name="edit-outline"
                      fill="white"
                      size="medium" // small, medium, large, xlarge
                      animation={{
                        type: "pulse", // zoom, pulse, shake, flip
                        hover: true,
                        infinite: false,
                      }}
                    />
                    <p className="pl-2 text-white">Finish Review</p>
                  </Button>
                  <div className="flex flex-row bg-white w-[100%]  border-[1px] rounded-lg p-4">
                    <div className="flex flex-row justify-between w-[100%]">
                      <div>
                        <div className="py-2">
                          <h1 className="text-[#344054] pb-[6px] font-jakarta">
                            Grade
                          </h1>

                          <Input
                            name="level"
                            type={"number"}
                            className="rounded-lg"
                            defaultValue={data.level}
                            // onChange={(e) => handleClass(e)}
                          />
                        </div>
                      </div>
                      <div className="py-2 ml-10">
                        <h1 className="text-[#344054] pb-[6px] font-jakarta">
                          Section
                        </h1>
                        <Input
                          className="rounded-lg"
                          name="section"
                          value={data.section}
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
                          value={data.homeRoomTeacher}
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
                  <div className="">
                    <div className="flex flex-row justify-between">
                      <h1 className="text-lg font-[600] font-jakarta mb-[16px] mt-[32px]">
                        Assigned Students
                      </h1>
                    </div>
                    <Table
                      loading={studentLoading}
                      dataSource={students}
                      rowSelection={rowSelection}
                      columns={columns}
                    />
                  </div>
                  <div className="mb-10">
                    <div className="flex flex-row justify-between">
                      <h1 className="text-lg font-[600] font-jakarta mb-[16px] mt-[32px]">
                        Assigned Courses
                      </h1>
                    </div>
                    <Table
                      loading={studentLoading}
                      rowSelection={rowSelectionCourse}
                      dataSource={item}
                      columns={courseColumns}
                    />
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={
                    <p className="text-sm font-[600] text-center ml-0 font-jakarta">
                      Attendance
                    </p>
                  }
                  key="2"
                >
                  <div className="mt-14" />
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
  );
}

export default UpdateClass;
