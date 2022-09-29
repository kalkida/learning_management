import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Form, Input, Button, Select, DatePicker, message, Space } from "antd";
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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import "../../css/teacher.css";
import Highlighter from "react-highlight-words";
import "../modals/courses/style.css";
import "../modals/teacher/style.css";

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
  const [images, setImages] = useState(null);

  const [classData, setClassData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  var [newUser, setNewUser] = useState({
    DOB: "",
    avater: null,
    email: "",
    sex: "",
    first_name: "",
    last_name: "",
    class: "",
    phone: [],
    school_id: uid.school,
  });

  const valueRef = useRef();

  async function handleUpload() {
    if (!file) {
      alert("Please choose a file first!");
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
                setDoc(doc(firestoreDb, "students", uuid()), newUser)
                  .then((reponse) =>
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

  const createNewStudent = async () => {
    setLoadingButton(true);
    await handleUpload();
    setLoadingButton(false);
  };
  const handlelevel = async (value) => {
    var data = await getCourses(value);
    console.log("curcuse ", value);
    await setNewUser({ ...newUser, courses: data });
    await setNewUser({ ...newUser, class: value });

    console.log(newUser);
  };

  const handleStudent = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleDob = (value) => {
    setNewUser({ ...newUser, DOB: JSON.stringify(value) });
  };
  const setPhone = (e, index) => {
    allPhone[index] = e.target.value;
    setPhones(e.target.value);
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
    <>
      <div className="add-header">
        <h1>Add Students</h1>
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

        <div className="add-form">
          <div className="col">
            <div>
              <label>First Name</label>
              <Input name="first_name" onChange={(e) => handleStudent(e)} />
            </div>
            <div
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                display: "flex",
              }}
            >
              <div style={{ marginRight: "5%" }}>
                <label>Class</label>
                <Select
                  placeholder="Select Class"
                  onChange={handlelevel}
                  optionLabelProp="label"
                  style={{
                    width: "100%",
                  }}
                >
                  {classData.map((item, index) => (
                    <Option
                      key={item.id}
                      value={item.id}
                      label={item.className}
                    >
                      {item.className}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <label>Date of Birth</label>
              <DatePicker style={{ width: "100%" }} onChange={handleDob} />
            </div>
            <div className="add-header">
              <button onClick={async () => await createNewStudent()}>
                Submit
              </button>
            </div>
          </div>
          <div className="col">
            <div>
              <label>Last Name</label>
              <Input name="last_name" onChange={(e) => handleStudent(e)} />
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
              <label>Email</label>
              <Input name="email" onChange={(e) => handleStudent(e)} />
            </div>
          </div>
          <div className="col">
            <div>
              <label>Guardian Contact</label>
              {input.map((_, index) => {
                return <Input onChange={(e) => setPhone(e, index)} />;
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
            <div>
              <Button
                className="btn-dlt"
                style={{ marginTop: "60%" }}
                onClick={handleCancle}
                type="primary"
                danger
              >
                Cancel
              </Button>
            </div>
          </div>
          <div></div>
        </div>
      </div>

      <div style={{ flex: 1, flexDirection: "row", marginLeft: 190 }}></div>
    </>
  );
};

export default CreateNewStudnet;
