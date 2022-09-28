import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Form, Input, Button, Select, DatePicker, message ,Space } from "antd";
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

const gender = ["Male", "Female", "Other"]

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
  const [newUser, setNewUser] = useState({
    DOB: "",
    avater: null,
    email: "",
    sex:"",
    first_name: "",
    last_name: "",
    level: "",
    section: "",
    phone: [],
    school_id: uid.school,
  });

  const valueRef = useRef();

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  async function handleUpload() {
    if (!file) {
      alert("Please choose a file first!");
    }
    else {
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
            valueRef.current = url
            if (valueRef.current != null) {
              setLoading(true)
              //    setNewUser({ ...newUser, avater: valueRef.current })
              newUser.avater = valueRef.current;
              if (newUser.avater !== null) {
                setDoc(doc(firestoreDb, "students", uuid()), newUser)
                  .then(reponse => message.success("Student Added Successfuly"))
                  .catch(error => {
                    console.log(error);
                    message.error("Student is not added, Try Again");
                  })
                navigate("/list-student");
                setLoading(false)
              }
            }

          });
        }
      );
    }
  }

 


  const getClass = async () => {
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

  const onRemove = () => {
    setFile('');
  }

  const createNewStudent = async () => {

    setLoadingButton(true);
    await handleUpload();
    setLoadingButton(false);
    // if(!loading){

    // }else{
    //   return;
    // }
  };
  const children = [];
  const handlelevel = (value) => {
    setNewUser({ ...newUser, level: value });
  };

  const handlesection = (value) => {
    setNewUser({ ...newUser, section: value });
  };
  const handleStudent = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleDob = (value) => {
    setNewUser({ ...newUser, DOB: JSON.stringify(value) });
  };
  const setPhone = (e , index) => {
    console.log(index);
    console.log('setPhone', e.target.value);
      allPhone[index] = e.target.value;
    setPhones(e.target.value);
    setNewUser({ ...newUser, ["phone"]: allPhone });
  };
  const handleCancle = () => {
    navigate("/list-student")
  }
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
          {/* <button onClick={async () => await CreateNewStudnet()}>Confirm</button> */}
        </div>
        <div className="add-teacher">
          <div className="avater-img">
            <div>
              <h2>Profile Picture</h2>
              <img src={file ? URL.createObjectURL(file) : "img-5.jpg"} />
            </div>
            <div className="file-content">
              <span>This will be displayed to you when you view this profile</span>

              <div className="img-btn">
                <button>
                  <input type="file" id="browse" name="files" style={{ display: "none" }} onChange={handleFile} accept="/image/*" />
                  <input type="hidden" id="filename" readonly="true" />
                  <input type="button" value="Add Photo" id="fakeBrowse" onClick={HandleBrowseClick} />
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
            <div style={{ flexDirection:'row'  , justifyContent: 'space-between',display:'flex' }} >
              <div style={{ marginRight:'5%'}}>
                <label>Grade</label>
                <Select
                  placeholder="Select Grade"
                  onChange={handlelevel}
                  optionLabelProp="label"
                  style={{
                    width: "100%",
                  }}
                >
                  {classData.map((item, index) => (
                    <Option
                      key={item.key}
                      value={item.key}
                      label={item.level}
                    >
                      {item.level}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <label>Section</label>
                <Select
                  placeholder="Select Section"
                  onChange={handlesection}
                  optionLabelProp="label"
                  style={{
                    width: "100%",
                  }}
                >
                  {classData.map((item, index) => (
                    <Option
                      key={item.key}
                      value={item.section}
                      label={item.section}
                    >
                      {item.section}
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
              <button onClick={async () => await createNewStudent()}>Submit</button>
            
              
              {/* <button onClick={handleCancle}>Cancel</button> */}
              {/* <Button
          type="primary"
          loading={loadingbutton}
          onClick={async () => await createNewStudent()}
        >
          Save
        </Button> */}

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
                    <Option
                      key={item.index}
                      value={item}
                      label={item}
                    >
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
                  return <Input onChange={(e) => setPhone(e , index)} />;
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
              <Button className="btn-dlt" style={{ marginTop:'60%'}} onClick={handleCancle}  type="primary" danger >Cancel</Button>
              </div>
            </div>
            <div>
              
            </div>
           
          </div>
        </div>

      {/* <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item
          label="First Name"
          name="First name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input name="first_name" onChange={(e) => handleStudent(e)} />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input name="last_name" onChange={(e) => handleStudent(e)} />
        </Form.Item>
        <Form.Item label="Email">
          <Input name="email" onChange={(e) => handleStudent(e)} />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="Phone"
          rules={[
            {
              required: true,
            },
          ]}
        >
          {input.map((_, index) => {
            return <Input onChange={(e) => setPhone(e)} />;
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
        </Form.Item>

        <Form.Item
          label="Level"
          name="Level"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input name="level" onChange={(e) => handleStudent(e)} />
        </Form.Item>
        <Form.Item
          label="Date Of Birth"
          name="Date of Birth"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker onChange={setAge} />
        </Form.Item>

        <Form.Item label="Class data">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select your class"
            onChange={handleCourse}
            optionLabelProp="label"
          >
            {classData.map((item, index) => (
              <Option value={JSON.stringify(item)} label={item.level + item.section}>
                {item.level + item.section}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Student Pictue" valuePropName="fileList">
          <input type="file" onChange={handleChange} accept="/image/*" />
        </Form.Item>
      </Form> */}
      <div style={{ flex: 1, flexDirection: "row", marginLeft: 190 }}>
      
      </div>
    </>
  );
};

export default CreateNewStudnet;
