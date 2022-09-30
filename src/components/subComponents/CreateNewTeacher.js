import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Form, Input, Button, Select, DatePicker, Space, Table } from "antd";
import { Link } from "react-router-dom";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { firestoreDb, storage } from "../../firebase";
import uuid from "react-uuid";
import "../../css/teacher.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import "../modals/courses/style.css";
import "../modals/teacher/style.css";

const { Option } = Select;
const { Search } = Input;

const gender = ["Male", "Female", "Other"];

const CreateNewTeacher = () => {
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState("");

  const [classData, setClassData] = useState([]);
  const [coursesData, setCourseData] = useState([]);
  const [secData, setSecData] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedClassKeys, setSelectedClassKeys] = useState([]);
  const [subject, setSubject] = useState();
  const searchInput = useRef(null);
  const schools = useSelector((state) => state.user.profile.school);
  const uid = useSelector((state) => state.user.profile);
  const [newUser, setNewUser] = useState({
    avater: null,
    email: "",
    first_name: "",
    last_name: "",
    class: "",
    course: [],
    DOB: "",
    sex: "",
    working_since: "",
    phone: "",
    school_id: uid.school,
  });

  const valueRef = useRef();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const onSelectChange = (newSelectedRowKeys) => {
    setNewUser({ ...newUser, course: newSelectedRowKeys });
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onSelectChangeClass = (newSelectedRowKeys) => {
    console.log("its me ", newSelectedRowKeys);
    setNewUser({ ...newUser, class: newSelectedRowKeys });
    setSelectedClassKeys(newSelectedRowKeys);
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

  const rowSelectionClass = {
    selectedClassKeys,
    onChange: onSelectChangeClass,
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
          setSelectedClassKeys(newSelectedRowKeys);
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

  async function handleUpload() {
    if (!file) {
      setDoc(doc(firestoreDb, "teachers", uuid()), newUser);
      setDoc(doc(firestoreDb, "users", uuid()), {
        phoneNumber: newUser.phone,
        role: {
          isAdmin: false,
          isTeacher: true,
          isParent: false,
        },
        school: schools,
      });
      navigate("/list-teacher");
    } else {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            valueRef.current = url;
            if (valueRef.current != null) {
              newUser.avater = valueRef.current;
              if (newUser.avater !== null) {
                setDoc(doc(firestoreDb, "teachers", uuid()), newUser);
                setDoc(doc(firestoreDb, "users", uuid()), {
                  phoneNumber: newUser.phone,
                  role: {
                    isAdmin: false,
                    isTeacher: true,
                    isParent: false,
                  },
                  school: schools,
                });
                navigate("/list-teacher");
              }
            }
          });
        }
      );
    }
  }

  const getClass = async () => {
    const children = [];
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
    setClassData(children);
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

  const getSubjectData = async (ID) => {
    const docRef = doc(firestoreDb, "subject", ID);
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

  const getCourse = async () => {
    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "==", uid.school)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach(async (doc) => {
      var data = doc.data();
      data.key = doc.id;
      getData(data).then((response) => {
        temporary.push(response)
        console.log(response)
      }

      );
    });

    setTimeout(() => {
      setCourseData(temporary);
      setLoading(false)
    }, 2000);
  };

  const getSubject = async () => {
    const coursess = [];
    const q = query(
      collection(firestoreDb, "subject"),
      where("school_id", "==", uid.school)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      coursess.push({
        ...datas,
        key: doc.id,
      });
    });
    setSubject(coursess);
  };

  const createNewTeacher = async () => {
    await handleUpload();
  };

  const handleChangeTeacher = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleGender = (value) => {
    setNewUser({ ...newUser, sex: value });
  };
  const handleDob = (value) => {
    setNewUser({ ...newUser, DOB: JSON.stringify(value) });
  };
  const handleWork = (value) => {
    setNewUser({ ...newUser, working_since: JSON.stringify(value) });
  };

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
        setCourseData(temporary);
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
        setCourseData(temporary);
      }, 2000);
    }
  };

  const onRemove = () => {
    setFile("");
  };

  const columns = [
    {
      title: "Course",
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
      title: "Class",
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return (
          <div>
            {item.level}
            {"   "}
            {item.section}
          </div>
        );
      },
    },
  ];

  const classColumns = [
    {
      title: "Grade",
      dataIndex: "level",
      key: "course_name",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "secticon",
    },
  ];

  useEffect(() => {
    getClass();
    getCourse();
    getSubject();
  }, []);

  function HandleBrowseClick() {
    var fileinput = document.getElementById("browse");
    fileinput.click();
  }

  function handleFile(event) {
    var fileinput = document.getElementById("browse");
    var textinput = document.getElementById("filename");
    textinput.value = fileinput.value;
    setFile(event.target.files[0]);
  }
  return (
    <>
      <div>
        <div className="add-header">
          <h1>Add Teacher</h1>
          <button onClick={async () => await createNewTeacher()}>
            Confirm
          </button>
        </div>
        <div className="add-teacher">
          <div className="avater-img">
            <div>
              <h2>Profile Picture</h2>
              <img src={file ? URL.createObjectURL(file) : "img-5.jpg"} />
            </div>
            <div className="file-content">
              <span>
                This will be displayed to you when you view this profile
              </span>

              <div className="img-btn">
                <button>
                  <input
                    type="file"
                    id="browse"
                    name="files"
                    style={{ display: "none" }}
                    onChange={handleFile}
                    accept="/image/*"
                  />
                  <input type="hidden" id="filename" readonly="true" />
                  <input
                    type="button"
                    value="Add Photo"
                    id="fakeBrowse"
                    onClick={HandleBrowseClick}
                  />
                </button>
                <button onClick={onRemove}>Remove</button>
              </div>
            </div>
          </div>

          <div className="add-form">
            <div className="col">
              <div>
                <label>First Name</label>
                <Input
                  name="first_name"
                  onChange={(e) => handleChangeTeacher(e)}
                />
              </div>
              <div>
                <label>Last Name</label>
                <Input
                  name="last_name"
                  onChange={(e) => handleChangeTeacher(e)}
                />
              </div>
            </div>
            <div className="col">
              <div>
                <label>Phone</label>
                <Input name="phone" onChange={(e) => handleChangeTeacher(e)} />
              </div>

              <div>
                <label>Email</label>
                <Input name="email" onChange={(e) => handleChangeTeacher(e)} />
              </div>
            </div>
            <div className="col">
              <div>
                <label>Date of Birth</label>
                <DatePicker style={{ width: "100%" }} onChange={handleDob} />
              </div>
              <div>
                <label>Sex </label>
                <Select
                  placeholder="Select Gender"
                  onChange={handleGender}
                  optionLabelProp="label"
                  style={{
                    width: "100%",
                  }}
                >
                  {gender.map((item, index) => (
                    <Option key={item.index} value={item} label={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <label>Working since</label>
                <DatePicker style={{ width: "100%" }} onChange={handleWork} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ padding: 20 }}>
            <div className="list-header">
              <h1 style={{ fontSize: 28 }}>Add Course </h1>
            </div>
            <div className="list-sub">
              <div className="list-filter">
                <Select
                  placeholder="Subject"
                  style={{ width: 120 }}
                  onChange={handleFilterSubject}
                >
                  {subject?.map((item, i) => (
                    <Option key={item.key} value={item.key} label={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
                <Select
                  style={{ width: 120 }}
                  placeholder="Class"
                  onChange={handleFilterClass}
                >
                  {classData?.map((item, i) => (
                    <Option
                      key={item.key}
                      value={item.key}
                      label={item.level + item.section}
                    >
                      {item.level + item.section}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="course-search">
                <div>
                  <Search
                    placeholder="input search text"
                    allowClear
                    // onSearch={onSearch}
                    style={{
                      width: 200,
                    }}
                  />
                </div>
              </div>
            </div>
            <br />
            <Table
              loading={loading}
              rowSelection={rowSelection}
              dataSource={coursesData}
              columns={columns}
            />
          </div>
        </div>
        <div>
          <div style={{ padding: 20 }}>
            <div className="list-header">
              <h1 style={{ fontSize: 28 }}>Add Class </h1>
            </div>
            <br />
            <Table
              rowSelection={rowSelectionClass}
              dataSource={classData}
              columns={classColumns}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewTeacher;
