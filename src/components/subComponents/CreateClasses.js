import { useEffect, useState } from "react";
import { Input, Button, Select, message, TimePicker, Table, Tag } from "antd";
import { Skeleton } from "antd";
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

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../modals/courses/style.css";

const { Option } = Select;

const CreateClasses = () => {
  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);
  const [input, setInput] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const days = ["Monday", "Thusday", "Wednsday", "Thursday", "Friday"];
  const [coursesData, setCourseData] = useState([]);
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
      title: "Courses _name",
      dataIndex: "course_name",
      key: "course_name",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: "Level",
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return <div>{item.level}</div>;
      },
    },
    {
      title: "Section",
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return <div>{item.section}</div>;
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
    setStudents(children);
  };

  const handleNewScheduler = (value, i) => {};
  const handleDelete = () => {};

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setNewClass({ ...newClass, course: newSelectedRowKeys });
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

  const getData = async (data) => {
    data.class = await getClassData(data.class);
    data.subject = await getSubjectData(data.subject);
    return data;
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

  const constractCourse = async (querySnapshot) => {
    var data = [];

    return data;
  };
  const getCourse = async () => {
    console.log(newClass);
    var variables = [];
    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "==", uid.school)
      // where("class", "==", newClass.class)
    );
    var querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      getData(datas).then((response) => {
        var newDAtas = response;
        newDAtas.key = doc.id;
        console.log("dat", newDAtas);
        variables.push(newDAtas);
      });
    });
    setTimeout(() => {
      setCourseData(variables);
      setLoading(false);
    }, 2000);
  };

  const handleClass = (e) => {
    setClassSelected(false);
    if (e.target.name === "level") {
      getStudents(e.target.value);
    }
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
    setClassSelected(true);
  };

  const handleStudent = (value) => {
    value.map((item, i) => {
      var newItem = JSON.parse(item);
      value[i] = newItem.key;
    });
    setNewClass({ ...newClass, student: value });
  };

  useEffect(() => {
    getCourse();
  }, []);

  return (
    <>
      <div className="bg-[#E8E8E8] p-10 -mt-0 h-[100vh]">
        <div className="flex flex-row justify-between mb-2">
          <h1 className="text-3xl font-bold mb-6">Create Class</h1>
          <Button
            className="text-[#E7752B] border-[1px] border-[#E7752B]  hover:bg-[#E7752B] z-0"
            onClick={() => createNewClass()}
          >
            Submit
          </Button>
        </div>
        <div
          style={{
            padding: 15,
            backgroundColor: "#FFFFFF",
            borderRadius: 5,
            borderWidth: 2,
          }}
        >
          <div className="course-content">
            <div>
              <div className="py-2">
                <span>Class</span>
                <Input
                  name="level"
                  type={"number"}
                  onChange={(e) => handleClass(e)}
                />
              </div>
              <div>
                <span>Student</span>
                <Select
                  style={{
                    width: "100%",
                  }}
                  placeholder="select Student"
                  onChange={handleStudent}
                  optionLabelProp="label"
                  mode="multiple"
                >
                  {students.map((item, index) => (
                    <Option
                      key={item.key}
                      value={JSON.stringify(item)}
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
                {/* </div> */}
              </div>
            </div>
            <div className="py-2 ml-10">
              <span>Section</span>
              <Input name="section" onChange={(e) => handleClass(e)} />
            </div>
          </div>
        </div>
        <div className="list-header">
          <h1 className="text-2xl font-semibold" style={{ marginTop: 20 }}>
            Add Courses
          </h1>
        </div>
        <div
          style={{
            backgroundColor: "#F9FAFB",
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
                dataSource={coursesData}
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
