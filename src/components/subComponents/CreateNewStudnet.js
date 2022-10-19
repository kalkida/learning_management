import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createParentwhithStudent, fetchClass } from "../modals/funcs";
import { Input, Button, Select, DatePicker, message, Space } from "antd";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  getDoc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { firestoreDb, storage } from "../../firebase";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CloseCircleFilled } from "@ant-design/icons";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "../../css/teacher.css";
import "../modals/courses/style.css";
import "../modals/teacher/style.css";
import Icon from "react-eva-icons";

const { Option } = Select;
const { Search } = Input;

const gender = ["Male", "Female", "Other"];

const CreateNewStudnet = () => {
  const [allPhone, setAllPhone] = useState([]);
  const [input, setInputs] = useState([0]);
  const [phone, setPhones] = useState("");
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const [loadingbutton, setLoadingButton] = useState(false);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");

  const [classData, setClassData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  var [newUser, setNewUser] = useState({
    DOB: "",
    studentId: "",
    avater: null,
    email: "",
    sex: "",
    first_name: "",
    last_name: "",
    class: "",
    className: "",
    phone: [],
    school_id: uid.school,
  });

  const valueRef = useRef();

  async function handleUpload() {
    var newUID = uuid();
    var data = await getCourses(newUser.class);
    var classN = await fetchClass(newUser.class);
    console.log(classN);
    if (!file) {
      setDoc(doc(firestoreDb, "students", newUID), {
        ...newUser,
        course: data,
        className: classN.level + classN.section,
      })
        .then(
          (_) => modifyClassWithStudent(newUID, newUser.class),
          newUser.phone.map((item) => {
            createParentwhithStudent(item, uid.school);
          }),
          message.success("Student Added Successfuly")
        )
        .catch((error) => {
          console.log(error);
          message.error("Student is not added, Try Again");
        });
      navigate("/list-student");
      setLoading(false);
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
              setLoading(true);
              //    setNewUser({ ...newUser, avater: valueRef.current })
              newUser.avater = valueRef.current;
              if (newUser.avater !== null) {
                setDoc(doc(firestoreDb, "students", newUID), {
                  ...newUser,
                  course: data,
                })
                  .then(
                    (reponse) => modifyClassWithStudent(newUID, newUser.class),
                    newUser.phone.map((item) => {
                      createParentwhithStudent(item, uid.school);
                    }),
                    message.success("Student Added Successfuly")
                  )
                  .catch((error) => {
                    console.log(error);
                    message.error("Student is not added, Try Again");
                  });
                navigate("/list-student");
                setLoading(false);
              }
            }
          });
        }
      );
    }
  }
  const getCourses = async (id) => {
    const docRef = doc(firestoreDb, "class", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var data = docSnap.data();
      return data.course;
    } else {
      return "";
    }
  };

  const getClass = async () => {
    const q = query(
      collection(firestoreDb, "class"),
      where("school_id", "==", uid.school)
    );
    var children = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      children.push({
        id: doc.id,
        className: datas.section + datas.level,
        courses: datas.courses,
      });
    });
    setClassData(children);
  };

  const onRemove = () => {
    setFile("");
  };
  const modifyClassWithStudent = async (studnetId, classID) => {
    const washingtonRef = doc(firestoreDb, "class", classID);
    await updateDoc(washingtonRef, {
      student: arrayUnion(studnetId),
    });
  };

  const createNewStudent = async () => {
    setLoadingButton(true);
    await handleUpload();
    setLoadingButton(false);
  };
  const handlelevel = async (value) => {
    await setNewUser({ ...newUser, class: value });
    modifyClassWithStudent(value);
  };

  const handleStudent = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleDob = (value) => {
    setNewUser({ ...newUser, DOB: JSON.stringify(value) });
  };
  const setPhone = (e, index) => {
    allPhone[index] = e;
    setPhones(e);
    setNewUser({ ...newUser, ["phone"]: allPhone });
  };
  const handleCancle = () => {
    navigate("/list-student");
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

  const handleGender = (value) => {
    setNewUser({ ...newUser, sex: value });
  };

  useEffect(() => {
    getClass();
  }, []);
  return (
    <div className="bg-[#F9FAFB] h-[100vh] p-4 -mt-14">
      <div className="add-header mb-10 items-center">
        < h1 className="text-[1.5rem] font-jakarta" > Add Student</h1 >
        <button onClick={async () => await createNewStudent()}>
          <FontAwesomeIcon className="mr-2" icon={faCheck} />Confirm
        </button>
      </div >
      <div className="add-teacher bg-[#FFF]">
        <div className="avater-img">
          <div className="-mx-6">
            <h3 className="text-sm font-jakarta -mb-2 color-[#475467]">Student Picture</h3>
            <div className="rounded-full  border-[#E7752B] bg-[white]">
            <img src={file ? URL.createObjectURL(file) : "img-5.jpg"} />
            </div>
          </div>
          <div className="file-content ml-10" style={{ marginTop:20}}>
            <span className="text-[#475467] text-sm font-jakarta justify-center flex items-stretch width[v-20h] ">
              This will be displayed to you when you view this profile
            </span>

            <div className="img-btn -mt-2">
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
                  value="Add Photo"
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
              <label style={{ paddingBottom:6}}>First Name</label>
              <Input style={{marginTop:6}} className="py-6 mt-6" name="first_name" placeholder="Enter First Name" onChange={(e) => handleStudent(e)} />
            </div>

            <div>
              <label>Class</label>
              <Select
                placeholder="Select Class"
                onChange={handlelevel}
                optionLabelProp="label"
                style={{
                  width: "100%",
                  marginTop:6
                }}
              >
                {classData.map((item, index) => (
                  <Option key={item.id} value={item.id} label={item.className}>
                    {item.className}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="py-4">
              <label>Date of Birth</label>
              <DatePicker style={{ width: "100%" ,marginTop:6 }} onChange={handleDob} />
            </div>

          </div>
          <div className="flex flex-col w-[40%]  mr-10">
            <div className="py-4">
              <label>Last Name</label>
              <Input style={{marginTop:6}}name="last_name" placeholder="Enter Last Name" onChange={(e) => handleStudent(e)} />
            </div>
            <div>
              <label>Sex </label>
              <Select
                placeholder="Select Gender"
                onChange={handleGender}
                optionLabelProp="label"
                style={{
                  width: "100%",
                  marginTop:6
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
              <Input style={{marginTop:6}} name="email" placeholder="Enter Email Address" onChange={(e) => handleStudent(e)} />
            </div>
          </div>
          <div className="flex flex-col w-[40%] mr-10">
            <div className="py-4">
              <label>Guardian Contact</label>
              {input.map((_, index) => {
                return (
                  <PhoneInput
                    placeholder="Enter Guardian Contact"
                    className="py-1 border-[1px] bg-white px-2 mb-2 mt-6"
                    style={{marginTop:6}}
                    country="ET"
                    onChange={(e) => setPhone(e, index)}
                  />
                );
              })}
              {phone !== "" ? (
                <Button
                  onClick={() => {
                    setInputs([...input, 0]);
                    setAllPhone([...allPhone, phone]);
                  }}
                >
                  Add New
                </Button>
              ) : null}
            </div>
            <div className="-py-6 -mt-2">
              <label>Student Id</label>
              <Input style={{marginTop:6}} name="studentId" placeholder="Enter Student Id" onChange={(e) => handleStudent(e)} />
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
    </div >
  );
};

export default CreateNewStudnet;
