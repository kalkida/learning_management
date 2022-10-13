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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
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

      <div className="bg-[#F9FAFB] h-[100vh] p-2 -mt-14">
        <div className="add-header mb-6 items-center">
          < h1 className="text-[1.5rem] font-jakarta" > Edit Student</h1 >
          <button 
          className="btn-confirm  bg-[#E7752B]"
          onClick={async () => await updateStudent()}>
            <FontAwesomeIcon className="mr-2 text-[#FFF]" icon={faCheck} />Confirm
          </button>
        </div >

        <div className="tab-content">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab={
              <p className="text-base font-bold text-center ml-5 font-jakarta">Profile</p>
            } key="1">

              <div className="add-teacher">
                <div className="avater-img">
                  <div>
                    <h2 className="text-[#475467] text-sm font-jakarta">Student Picture</h2>
                    <img src={file ? URL.createObjectURL(file) : data.avater ? data.avater : "img-5.jpg"} />
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
                        <input type="hidden" id="filename" />
                        <input
                          type="button"
                          value="Change Photo"
                          id="fakeBrowse"
                          onClick={HandleBrowseClick}
                        />
                      </button>
                      <button onClick={onRemove}>Remove</button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-between">
                  <div className="flex flex-col w-[40%] mr-10">
                    <div className="py-4">
                      <label>First Name</label>
                      <Input
                        name="first_name"
                        placeholder="Eneter First Name"
                        defaultValue={updateStudent.first_name}
                        onChange={(e) => onChange(e)}
                      />
                    </div>

                    <div>
                      <label>Class</label>
                      <Select
                        placeholder="Select Class"
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
                    <div className="py-4">
                      <label>Date of Birth</label>
                      <DatePicker style={{ width: "100%" }}
                        onChange={handleDob}
                        defaultValue={
                          updateStudent.DOB
                            ? moment(JSON.parse(updateStudent.DOB))
                            : ""
                        }
                      />
                    </div>

                  </div>
                  <div className="flex flex-col w-[40%]  mr-10">
                    <div className="py-4">
                      <label>Last Name</label>
                      <Input
                        name="last_name"
                        placeholder="Enter Last Name"
                        defaultValue={updateStudent.last_name}
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
                    <div className="py-4">
                      <label>Email</label>
                      <Input
                        name="email"
                        placeholder="Enter Email Address"
                        defaultValue={updateStudent.email}
                        onChange={(e) => onChange(e)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[40%] mr-10">
                    <div className="py-4">
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
                      <label>Student Id</label>
                      <Input
                        name="studentId"
                        placeholder="Enter Student Id"
                        defaultValue={updateStudent.studentId}
                        onChange={(e) => onChange(e)}
                      />
                    </div>
                    {/* <div>
              <Button
                className="float-right -bottom-[5.5vh] border-[2px] border-[#E7752B] text-[#E7752B] rounded-lg flex flex-row  "
                onClick={handleCancle}
              >
                <CloseCircleFilled className="mt-[1px]" />
                Cancel
              </Button>
            </div> */}
                  </div>
                  <div></div>
                </div>
              </div>
              <div style={{ flex: 1, flexDirection: "row", marginLeft: 190 }}></div>

            </Tabs.TabPane>
            <Tabs.TabPane tab={
              <p className="text-xl font-bold text-center ml-5 font-jakarta">Course</p>
            } key="2">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="teacher-course-list">
                <div className="tch-cr-list">
                  <h1 className="text-xl font-bold  font-jakarta">Assigned Courses</h1>
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
