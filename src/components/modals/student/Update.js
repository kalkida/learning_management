import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Select, Input, DatePicker, message, Tabs, Table } from "antd";
import moment from "moment";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firestoreDb, storage } from "../../../firebase";
import { fetchParents, fetchClass } from "../funcs";
import "./style.css";

const { Option } = Select;
const { Search } = Input;

const gender = ["Male", "Female", "Other"];

function UpdateStudents() {
  const valueRef = useRef();
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhones] = useState("");
  const [classOption, setClassOption] = useState([]);
  const [file, setFile] = useState("");
  const [courseData, setClassCourses] = useState([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const { state } = useLocation();
  const { data } = state;
  const [allPhone, setAllPhone] = useState(data.phone);
  const [selectedRowKeys, setSelectedRowKeys] = useState(data.course);

  const [input, setInputs] = useState(data.phone);
  const [updateStudent, setUpdateStudent] = useState({
    DOB: data.DOB,
    avater: data.avater,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    sex: data.sex,
    class: data.class,
    course: selectedRowKeys,
    className: data.className,
    phone: data.phone,
    studentId: data.studentId,
    school_id: data.school_id,
  });

  const isObject = (obj) => {
    return Object.prototype.toString.call(obj) === "[object Object]";
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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
  ];

  const handleUpdate = async () => {
    var users;
    if (isObject(updateStudent.class)) {
      users = await getClassID(updateStudent.class.key);
      updateStudent.class = updateStudent.class.key;
    } else {
      users = await getClassID(updateStudent.class);
    }
    console.log(users);

    setLoading(true);
    if (!file) {
      setDoc(
        doc(firestoreDb, "students", data.key),
        {
          ...updateStudent,
          course: users.course,
          className: users.level + users.section,
        },
        {
          merge: true,
        }
      )
        .then((_) => {
          setLoading(false);
          message.success("Data is updated successfuly");
          navigate("/list-student");
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
        (snapshot) => {
          const percentR = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            valueRef.current = url;
            if (valueRef.current != null) {
              updateStudent.avater = valueRef.current;

              if (updateStudent.avater !== null) {
                setDoc(
                  doc(firestoreDb, "students", data.key),
                  { ...updateStudent, course: users.course },
                  {
                    merge: true,
                  }
                )
                  .then((response) => {
                    setLoading(false);
                    message.success("Data is updated successfuly");
                    navigate("/list-student");
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

  const getClassID = async (ID) => {
    const docRef = doc(firestoreDb, "class", ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };

  const handleGender = (value) => {
    setUpdateStudent({ ...updateStudent, sex: value });
  };

  const handleDob = (value) => {
    setUpdateStudent({ ...updateStudent, DOB: JSON.stringify(value) });
  };

  const onRemove = () => {
    setFile("");
  };

  const setPhone = (e, index) => {
    allPhone[index] = e.target.value;
    setUpdateStudent({ ...updateStudent, phone: allPhone });
  };

  const onChange = (e) => {
    setUpdateStudent({ ...updateStudent, [e.target.name]: e.target.value });
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
  const getCourses = async (courses) => {
    const children = [];
    const q = query(
      collection(firestoreDb, "courses"),
      where("course_id", "in", courses)
    );
    const Snapshot = await getDocs(q);
    Snapshot.forEach((doc) => {
      var datas = doc.data();
      children.push({
        ...datas,
        key: doc.id,
      });
    });
    for (var i = 0; i < children.length; i++) {
      children[i] = {
        ...children[i],
        subject: await getSubjectData(children[i].subject),
      };
    }
    var parentsAre = await fetchParents(data.phone);
    setParents(parentsAre);
    setClassCourses(children);
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
      children.push({
        ...datas,
        key: doc.id,
      });
    });
    setClassOption(children);
    getCourses(data.course);
    setCourseLoading(false);
  };

  const handlesection = async (value) => {
    setUpdateStudent({ ...updateStudent, class: value });
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

  useEffect(() => {
    getClass();
  }, []);

  return (
    <>
      <div>
        <div className="st-profile-header border-t-[0px] border-l-[0px] border-r-[0px] -mt-10 border-b-[0px]">
          <div className="flex flex-row align-middle -ml-5">
            <img
              className="w-[8vw] h-[15vh] rounded-full"
              src={data.avater ? data.avater : "img-5.jpg"}
              alt="profile"
            />
            <div className="flex flex-col justify-center ml-4">
              <h2 className="text-xl">
                {data.first_name + " " + data.last_name}
              </h2>
            </div>
          </div>
          <div className="header-extra">
            <div>
              <h3>Class</h3>
              <h4>{data.class?.level + data.class?.section}</h4>
            </div>
            <div>
              <h3>Assigned Course</h3>
              <h4>{data.course?.length}</h4>
            </div>
          </div>
        </div>

        <div className="tab-content">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Profile" key="1">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Confirm Profile
              </Button>
              <div className="add-header">
                <h1>Student Profile</h1>
              </div>
              <div className="add-teacher">
                <div className="add-form">
                  <div className="col">
                    <div style={{ marginTop: "30%" }}>
                      <div className="avatar-img">
                        <h2>Student Picture</h2>
                        <img
                          src={file ? URL.createObjectURL(file) : "img-5.jpg"}
                        />
                      </div>
                      <div>
                        <div className="file-content">
                          {/* <span>This will be displayed to you when you view this profile</span> */}
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
                              <input
                                type="hidden"
                                id="filename"
                                readonly="true"
                              />
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
                    </div>
                  </div>
                  <div className="col">
                    <div>
                      <label>First Name</label>
                      <Input
                        defaultValue={updateStudent.first_name}
                        name="first_name"
                        onChange={(e) => onChange(e)}
                      />
                    </div>

                    <div>
                      <label>Date of Birth</label>
                      <DatePicker
                        style={{ width: "100%" }}
                        onChange={handleDob}
                        defaultValue={
                          updateStudent.DOB
                            ? moment(JSON.parse(updateStudent.DOB))
                            : ""
                        }
                      />
                    </div>
                    <div>
                      <label>Last Name</label>
                      <Input
                        defaultValue={updateStudent.last_name}
                        name="last_name"
                        onChange={(e) => onChange(e)}
                      />
                    </div>
                    <div>
                      <label>Sex </label>
                      <Select
                        placeholder="Select Gender"
                        onChange={handleGender}
                        defaultValue={updateStudent.sex}
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
                  </div>
                  <div className="col">
                    <div
                      style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        display: "flex",
                      }}
                    >
                      <label>Class</label>
                      <Select
                        placeholder="Select Section"
                        defaultValue={data.class}
                        onChange={handlesection}
                        optionLabelProp="label"
                        style={{
                          width: "100%",
                        }}
                      >
                        {classOption.map((item, index) => (
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
                    <div>
                      <label>Guardian Contact</label>
                      {data.phone.map((item, index) => {
                        return (
                          <Input
                            defaultValue={item}
                            name="phone"
                            onChange={(e) => setPhone(e, index)}
                          />
                        );
                      })}
                      {phone !== "" ? (
                        <Button
                          className="mt-2"
                          onClick={() => {
                            setInputs(...input, 0);
                            setAllPhone([...allPhone, phone]);
                          }}
                        >
                          Add New
                        </Button>
                      ) : null}
                    </div>
                    <div>
                      <label>Email</label>
                      <Input
                        defaultValue={updateStudent.email}
                        name="email"
                        onChange={(e) => onChange(e)}
                      />
                    </div>
                    <div>
                      <label>Student Id</label>
                      <Input
                        defaultValue={updateStudent.studentId}
                        name="studentId"
                        onChange={(e) => onChange(e)}
                      />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
              <h1
                id="gardian"
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginTop: "2%",
                  marginBottom: "0%",
                }}
              >
                Guardian
              </h1>
              <div className="mt-8 border-[1px] bg-[#F9FAFB] rounded-lg">
                {parents.map((item, index) => (
                  <div className="border-b-[1px] mt-2 flex flex-row justify-between w-[40vw] p-2">
                    <div>
                      <h1 className="font-bold">Guardian {index + 1}</h1>
                    </div>
                    <div>
                      <span className="font-light text-xs">Full Name</span>
                      <h1>{item.fullName}</h1>
                    </div>
                    <div>
                      <span className="font-light text-xs">Phone Number</span>
                      <h1>{item.phoneNumber}</h1>
                    </div>
                    <div>
                      <span className="font-light text-xs">Email</span>
                      <h1>{item.email}</h1>
                    </div>
                    <div>
                      <span className="font-light text-xs">Type</span>
                      <h1>{item.type}</h1>
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Course" key="2">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="teacher-course-list">
                <div className="tch-cr-list">
                  <h1>Assigned Courses</h1>
                </div>
                <Table
                  rowSelection={rowSelection}
                  loading={courseLoading}
                  dataSource={courseData}
                  columns={columns}
                />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default UpdateStudents;
