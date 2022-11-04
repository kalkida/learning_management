import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Form, Input, Button, Select, DatePicker, Space, Table } from "antd";
import {
  addSingleTeacherToCourse,
  fetchClass,
  fetchSubject,
  fetchclassFromCourse,
  addSingleClassToTeacher,
} from "../modals/funcs";
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
  updateDoc,
} from "firebase/firestore";
import { firestoreDb, storage } from "../../firebase";
import uuid from "react-uuid";
import "../../css/teacher.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../modals/courses/style.css";
import "../modals/teacher/style.css";
import { SearchOutlined } from "@ant-design/icons";
const { Option } = Select;

const gender = ["Male", "Female", "Other"];

const CreateNewTeacher = () => {
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);

  const [file, setFile] = useState("");

  const [classData, setClassData] = useState([]);
  const [coursesData, setCourseData] = useState([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [classLoading, setClassLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [subject, setSubject] = useState();
  const schools = useSelector((state) => state.user.profile.school);
  const uid = useSelector((state) => state.user.profile);
  const [newUser, setNewUser] = useState({
    avater: null,
    email: "",
    first_name: "",
    last_name: "",
    class: [],
    course: [],
    DOB: "",
    sex: "",
    working_since: "",
    phone: "",
    school_id: uid.school,
  });

  const valueRef = useRef();

  const getClassToSet = async (courses) => {
    var data = [];
    courses.map(async (item) => {
      var set = await fetchclassFromCourse(item);
      data.push(set.class);
    });
    setNewUser({ ...newUser, class: data });
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    getClassToSet(newSelectedRowKeys);
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

  async function handleUpload() {
    var newUserUUID = uuid();
    var temporary = [];
    newUser.course.map(async (item) => {
      var set = await fetchclassFromCourse(item.key, schools);
      temporary.push(set.class);
    });
    if (!file) {
      await setDoc(
        doc(firestoreDb, "schools", `${schools}/teachers`, newUserUUID),
        {
          ...newUser,
          course: selectedRowKeys,
          class: temporary,
        }
      );
      await setDoc(doc(firestoreDb, "users", newUserUUID), {
        phoneNumber: newUser.phone,
        role: {
          isAdmin: false,
          isTeacher: true,
          isParent: false,
        },
        school: schools,
      });
      selectedRowKeys.map((items) => {
        addSingleTeacherToCourse(newUserUUID, items, schools);
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
                setDoc(
                  doc(
                    firestoreDb,
                    "schools",
                    `${schools}/teachers`,
                    newUserUUID
                  ),
                  {
                    ...newUser,
                    course: selectedRowKeys,
                    class: temporary,
                  }
                );

                setDoc(doc(firestoreDb, "users", newUserUUID), {
                  phoneNumber: newUser.phone,
                  role: {
                    isAdmin: false,
                    isTeacher: true,
                    isParent: false,
                  },
                  school: schools,
                });
                selectedRowKeys.map((items) => {
                  addSingleTeacherToCourse(newUserUUID, items, schools);
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
    const q = query(collection(firestoreDb, "schools", `${schools}/class`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      children.push({
        ...datas,
        key: doc.id,
      });
    });
    setClassData(children);
    setClassLoading(false);
  };

  const getData = async (data) => {
    data.class = await fetchClass(data.class);
    return data;
  };

  const getCourse = async () => {
    const q = query(collection(firestoreDb, "schools", `${schools}/courses`));
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach(async (doc) => {
      var data = doc.data();
      data.key = doc.id;
      getData(data).then((response) => {
        temporary.push(response);
      });
    });

    setTimeout(() => {
      setCourseData(temporary);
      setCourseLoading(false);
      setClassLoading(false);
    }, 2000);
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
        collection(firestoreDb, "schools", `${schools}/courses`),
        where("subject", "==", value)
      );
      var temporary = [];
      const snap = await getDocs(q);
      snap.forEach(async (doc) => {
        var data = doc.data();
        data.key = doc.id;
        getData(data).then((response) => {
          temporary.push(response);
        });
      });
      setCourseData(temporary);
    }
  };

  const handleFilterClass = async (value) => {
    if (value) {
      const q = query(
        collection(firestoreDb, "schools", `${schools}/courses`),
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
        return <div>{item}</div>;
      },
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      render: (_, item) => {
        return (
          <div>
            {item.grade}
            {"   "}
            {item.section}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getClass();
    getCourse();
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
    <div className="-mt-14">
      <div className="bg-[#F9FAFB] h-[auto] pb-20 ">
        <div className="add-header mb-6">
          <h1 className="text-2xl font-bold font-jakarta text-[#344054] ">
            Add Teacher
          </h1>
          <button
            className="bg-[#E7752B] text-[white] rounded-lg shadow-md -z-0"
            onClick={async () => await createNewTeacher()}
          >
            Confirm
            <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
          </button>
        </div>
        <div className="rounded-[6px] border-[1px] bg-[#FFF]">
          <div className="ml-5 flex flex-row mt-[32px]">
            <div>
              <h2 className="text-[14px] font-[500] font-jakarta text-[#475467] text-center">
                Teacher Picture
              </h2>
              <div className="rounded-full border-[2px] border-[#E7752B] bg-[white] w-[6vw]">
                <img
                  src={file ? URL.createObjectURL(file) : "img-5.jpg"}
                  className="w-[8vw] h-[6vw] rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center ml-3">
              <span className="font-jakarta text-[12px] mb-2">
                This will be displayed to you when you view this profile
              </span>

              <div className="img-btn">
                {/* <input type="file" onChange={handleChange} accept="/image/*" /> */}
                <button className="border-[2px] border-[#E7752B] text-[12px] rounded-lg bg-[#E7752B] text-white">
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
                    value="Change Photo"
                    id="fakeBrowse"
                    onClick={HandleBrowseClick}
                  />
                </button>
                <button
                  className="border-[2px] border-[#E7752B] text-[12px] rounded-lg text-[#E7752B]"
                  onClick={onRemove}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 p-5">
            <div className="py-2">
              <h1 className="text-[#344054] pb-[6px] font-jakarta">
                First Name
              </h1>
              <Input
                className="!border-[2px] !rounded-lg"
                name="first_name"
                onChange={(e) => handleChangeTeacher(e)}
              />
            </div>
            <div className="py-2">
              <h1 className="text-[#344054] pb-[6px] font-jakarta">
                Last Name
              </h1>
              <Input
                className="!border-[2px] !rounded-lg"
                name="last_name"
                onChange={(e) => handleChangeTeacher(e)}
              />
            </div>
            <div className="py-2">
              <h1 className="text-[#344054] pb-[6px] font-jakarta">Phone</h1>
              <Input
                className="!border-[2px] !rounded-lg"
                name="phone"
                onChange={(e) => handleChangeTeacher(e)}
              />
            </div>
            <div className="py-2">
              <h1 className="text-[#344054] pb-[6px] font-jakarta">Email</h1>
              <Input
                className="!border-[2px] !rounded-lg"
                name="email"
                placeholder="Email Address"
                onChange={(e) => handleChangeTeacher(e)}
              />
            </div>
            <div className="py-2 -mt-4">
              <h1 className="text-[#344054] pb-2  font-jakarta">
                Date Of Birth
              </h1>
              <DatePicker
                className="!border-[2px] !rounded-lg"
                style={{ width: "100%" }}
                onChange={handleDob}
              />
            </div>
            <div className="-mt-2">
              <h1 className="text-[#344054] pb-[6px] font-jakarta">Sex</h1>
              <Select
                bordered={false}
                className="!border-[2px] !rounded-lg h-9"
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
            <div className="-mt-2">
              <h1 className="text-[#344054] pb-[6px] font-jakarta ">
                Working Since
              </h1>

              <DatePicker
                className="text-center w-[100%] !rounded-lg h-9 flex pt-1"
                onChange={handleWork}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="list-header">
            <h1 className=" pt-2 font-jakarta font-semibold text-xl  text-[#344054] my-5">
              Courses{" "}
            </h1>
          </div>
          <div className="bg-[#FFFFFF] p-[24px] border-[1px] !rounded-lg">
            <div className="list-sub mb-2">
              <div className="list-filter">
                <Select
                  bordered={false}
                  className="border-[2px] !rounded-[6px]"
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
                  bordered={false}
                  className="border-[2px] !rounded-[6px]"
                  style={{ width: 120, marginRight: 15 }}
                  placeholder="Grade"
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
                <Select
                  bordered={false}
                  className="border-[2px] !rounded-[6px]"
                  style={{ width: 120 }}
                  placeholder="Section"
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
                  <Input
                    style={{ width: 200 }}
                    className="mr-3 !rounded-lg"
                    placeholder="Search"
                    prefix={<SearchOutlined className="site-form-item-icon" />}
                  />
                </div>
              </div>
            </div>
            <Table
              className="!bg-white"
              loading={courseLoading}
              rowSelection={rowSelection}
              dataSource={coursesData}
              columns={columns}
              pagination={{ position: ["bottomCenter"] }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewTeacher;
