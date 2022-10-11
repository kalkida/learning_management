import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Modal,
  Form,
  Select,
  Input,
  DatePicker,
  Row,
  Col,
  message,
  Tabs,
  Table,
} from "antd";
import moment from "moment";
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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firestoreDb, storage } from "../../../firebase";
import "./style.css";

const { Option } = Select;
const { Search } = Input;
const gender = ["Male", "Female", "Other"];

function TeacherUpdate() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { data } = state;

  const valueRef = useRef();

  const [classOption, setClassOption] = useState([]);
  const [courseOption, setCourseOption] = useState([]);
  const [file, setFile] = useState("");
  const [subject, setSubject] = useState([]);
  const [selectedRowKeysCourse, setSelectedRowKeysCourse] = useState([]);
  const [selectedClassKeys, setSelectedClassKeys] = useState([]);
  const [classData, setClassData] = useState([]);
  const [updateTeacher, setUpdateTeacher] = useState({
    avater: data.avater,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    class: data.class,
    course: data.course,
    phone: data.phone,
    DOB: data.DOB,
    sex: data.sex,
    working_since: data.working_since,
    school_id: data.school_id,
  });

  const handleUpdate = () => {
    if (!file) {
      console.log(updateTeacher);
      setDoc(
        doc(firestoreDb, "teachers", data.key),
        { ...updateTeacher, class: selectedClassKeys },
        {
          merge: true,
        }
      )
        .then((response) => {
          message.success("Data is updated successfuly");
          navigate("/list-teacher");
        })
        .catch((error) => {
          message.error("Data is not updated");
          console.log(error);
        });
    } else {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            valueRef.current = url;
            if (valueRef.current != null) {
              updateTeacher.avater = valueRef.current;

              if (updateTeacher.avater !== null) {
                console.log(updateTeacher);
                setDoc(doc(firestoreDb, "teachers", data.key), updateTeacher, {
                  merge: true,
                })
                  .then((response) => {
                    message.success("Data is updated successfuly");
                    navigate("/list-teacher");
                  })
                  .catch((error) => {
                    message.error("Data is not updated");
                    console.log(error);
                  });
              }
            }
          });
        }
      );
    }
  };

  const handleChangeTeacher = (e) => {
    console.log(e.target.name);
    setUpdateTeacher({ ...updateTeacher, [e.target.name]: e.target.value });
  };

  const handleGender = (value) => {
    setUpdateTeacher({ ...updateTeacher, sex: value });
  };
  const handleDob = (value) => {
    setUpdateTeacher({ ...updateTeacher, DOB: JSON.stringify(value) });
  };
  const handleWork = (value) => {
    setUpdateTeacher({
      ...updateTeacher,
      working_since: JSON.stringify(value),
    });
  };

  const onRemove = () => {
    setFile("");
  };
  const getClass = async () => {
    const children = [];
    const q = query(
      collection(firestoreDb, "class"),
      where("school_id", "==", data.school_id)
    );
    const Snapshot = await getDocs(q);
    Snapshot.forEach((doc) => {
      var datas = doc.data();
      datas.key = doc.id;
      children.push(datas);
    });
    setClassOption(children);
  };

  const getCourse = async () => {
    const children = [];

    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "==", data.school_id)
    );
    const Snapshot = await getDocs(q);
    Snapshot.forEach((doc) => {
      var datas = doc.data();
      datas.key = doc.id;
      getData(datas).then((response) => children.push(response));
    });
    setTimeout(() => {
      setCourseOption(children);
    }, 2000);
  };

  const getID = () => {
    if (data?.class) {
      var classArr = [];
      var courseArr = [];
      data?.class?.map((item) => {
        classArr.push(item.key);
      });
      data?.course?.map((item) => {
        courseArr.push(item.key);
      });
      setUpdateTeacher({ ...updateTeacher, class: classArr });
      setUpdateTeacher({ ...updateTeacher, course: courseArr });
      setSelectedClassKeys(classArr);
      setSelectedRowKeysCourse(courseArr);
    }
  };

  const getSubject = async () => {
    const coursess = [];
    const q = query(
      collection(firestoreDb, "subject"),
      where("school_id", "==", data.school_id)
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

  const getClassData = async (ID) => {
    const docRef = doc(firestoreDb, "class", ID);
    var datas = "";
    await getDoc(docRef).then((response) => {
      datas = response.data();
      datas.key = response.id;
    });
    return datas;
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

  const handleFilterSubject = async (value) => {
    if (value) {
      const q = query(
        collection(firestoreDb, "courses"),
        where("school_id", "==", data.school_id),
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
        setCourseOption(temporary);
      }, 2000);
    }
  };

  const handleFilterClass = async (value) => {
    if (value) {
      const q = query(
        collection(firestoreDb, "courses"),
        where("school_id", "==", data.school_id),
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
        setCourseOption(temporary);
      }, 2000);
    }
  };

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

  const onSelectChange = (course) => {
    setUpdateTeacher({ ...updateTeacher, course: course });
    setSelectedRowKeysCourse(course);
  };

  const onSelectChangeClass = (clas) => {
    setUpdateTeacher({ ...updateTeacher, class: clas });
    setSelectedClassKeys(clas);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeysCourse,
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
          setSelectedRowKeysCourse(newSelectedRowKeys);
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
          setSelectedRowKeysCourse(newSelectedRowKeys);
        },
      },
    ],
  };

  const rowSelectionClass = {
    selectedRowKeys: selectedClassKeys,
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
          setSelectedClassKeys(newSelectedRowKeys);
        },
      },
    ],
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
      key: "level",
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
    getID();
    getSubject();
  }, []);

  return (
    <>
      <div>
        <div className="profile-header">
          <div className="teacher-avater">
            <img
              src={updateTeacher.avater ? updateTeacher.avater : "img-5.jpg"}
              alt="profile"
            />
            <div className="profile-info">
              <h2
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: "600",
                  lineHeight: "28px",
                  fontSize: 20,
                }}
              >
                {updateTeacher.first_name + " " + updateTeacher.last_name}
              </h2>
              <h3>Contact</h3>
            </div>
          </div>
          <div className="header-extra-th">
            <div>
              <h3>Class</h3>
              {data?.class ? (
                <h4>
                  {data.class?.map(
                    (item, i) => item.level + item.section + ","
                  )}
                </h4>
              ) : (
                <h4>Class Not Assigned</h4>
              )}
            </div>
            <div>
              <h3>Subject</h3>
              {data?.course ? (
                <h4>{data.course?.map((item, i) => item.course_name + ",")}</h4>
              ) : (
                <h1>Course Not Assigned</h1>
              )}{" "}
            </div>
          </div>
        </div>
        <div className="tab-content">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Profile" key="1">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Confirm
              </Button>
              <div className="add-teacher">
                c{" "}
                <h1
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: "600",
                    lineHeight: "28px",
                    fontSize: 24,
                  }}
                >
                  Edit Profile
                </h1>
                <div>
                  <div className="avater-img">
                    <div>
                      <h2
                        style={{
                          fontFamily: "Plus Jakarta Sans",
                          fontWeight: "600",
                          lineHeight: "28px",
                          fontSize: 16,
                        }}
                      >
                        Profile Picture
                      </h2>
                      <img
                        src={
                          file
                            ? URL.createObjectURL(file)
                            : data.avater
                            ? data.avater
                            : "img-5.jpg"
                        }
                      />
                    </div>
                    <div className="file-content">
                      <span>
                        This will be displayed to you when you view this profile
                      </span>

                      <div className="img-btn">
                        {/* <input type="file" onChange={handleChange} accept="/image/*" /> */}
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
                          defaultValue={updateTeacher.first_name}
                          name="first_name"
                          onChange={(e) => handleChangeTeacher(e)}
                        />
                      </div>
                      <div>
                        <label>Last Name</label>
                        <Input
                          defaultValue={updateTeacher.last_name}
                          name="last_name"
                          onChange={(e) => handleChangeTeacher(e)}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div>
                        <label>Phone</label>
                        <Input
                          defaultValue={updateTeacher.phone}
                          name="phone"
                          onChange={(e) => handleChangeTeacher(e)}
                        />
                      </div>
                      <div>
                        <label>Email</label>
                        <Input
                          defaultValue={updateTeacher.email}
                          name="email"
                          onChange={(e) => handleChangeTeacher(e)}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div>
                        <label>Date Of Birth</label>
                        <DatePicker
                          style={{ width: "100%" }}
                          onChange={handleDob}
                          defaultValue={
                            updateTeacher.DOB
                              ? moment(JSON.parse(updateTeacher.DOB))
                              : ""
                          }
                        />
                      </div>
                      <div>
                        <label>Sex</label>
                        <Select
                          defaultValue={updateTeacher.sex}
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
                        <label>Working Since</label>
                        <DatePicker
                          style={{ width: "100%" }}
                          onChange={handleWork}
                          defaultValue={
                            updateTeacher.working_since
                              ? moment(JSON.parse(updateTeacher.working_since))
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Course" key="2">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Confirm
              </Button>

              <div>
                <div className="teacher-course-list">
                  <h1>Add/Remove Courses</h1>
                  <div className="tch-cr-list">
                    <div>
                      <Select
                        placeholder={"Subject"}
                        onChange={handleFilterSubject}
                      >
                        {subject?.map((item, i) => (
                          <Option key={item.key} value={item.key}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                      <Select
                        placeholder={"Class"}
                        onChange={handleFilterClass}
                      >
                        {classOption?.map((item, i) => (
                          <Option key={item.key} value={item.key}>
                            {item.level + item.section}
                          </Option>
                        ))}
                      </Select>
                    </div>
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
                  <Table
                    rowSelection={rowSelection}
                    dataSource={courseOption}
                    columns={columns}
                  />
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Class" key="3">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Confirm
              </Button>

              <div>
                <div className="teacher-course-list">
                  <h1>Add/Remove Class</h1>

                  <Table
                    rowSelection={rowSelectionClass}
                    dataSource={classOption}
                    columns={classColumns}
                  />
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default TeacherUpdate;
