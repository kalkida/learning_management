import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Form, Input, Button, Select, DatePicker } from "antd";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  updateDoc
} from "firebase/firestore";
import { firestoreDb, storage } from "../../firebase";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const { Option } = Select;

const CreateNewTeacher = () => {
  const fileInputRef = useRef();

  const [courses, setcourse] = useState([]);
  const [allPhone, setAllPhone] = useState([]);
  const [input, setInputs] = useState([0]);
  const [phone, setPhones] = useState("");
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const [image, setImage] = useState(null);

  const [loading , setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [images , setImages] = useState(null);

  const [classData, setClassData] = useState([]);
  const [coursesData ,setCourseData]= useState([]);
  const [personData, setPersonData] = useState([]);

  const uid = useSelector((state) => state.user.profile);
  const [newUser, setNewUser] = useState({
    avater: null,
    email: "",
    first_name: "",
    last_name: "",
    id:"",
    class: "",
    courses:[],
    level: [],
    phone: [],
    school_id: uid.school,
  });

  const valueRef = useRef();

  const handleChange =(event) =>{
    setFile(event.target.files[0]);
  }; 
 
 async function handleUpload()  {
    if (!file) {
      alert("Please choose a file first!");
    }
    
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
          console.log("url is   ",url)
          valueRef.current = url
          console.log("value with ref is ",valueRef.current)
          
          if(valueRef.current != null){
          console.log("value with ref with ref is ",valueRef.current)
          setLoading(true)
          setNewUser({...newUser , avater: valueRef.current})
          if(newUser.avater !==null){
           setDoc(doc(firestoreDb, "teachers", uuid()), newUser);
           console.log("Teacher  is createteacher    " ,newUser);
           console.log("teacher id   ", uuid())
          navigate("/list-teacher"); 
          setLoading(false)
          }
          }
        console.log("images is   ",images)         
        });
      }
    );
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


  const getCourse = async () => {
    const coursess = []
    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "==", uid.school)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      courses.push({
        ...datas,
        key: doc.id,
      });
    });
    setCourseData(courses);
  };

  const getid = async () => {
    const Teacher = []
    const q = query(
      collection(firestoreDb, "users"),
      where("role.isTeacher", "==", true)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      Teacher.push({
        ...datas,
        key: doc.id,
      });
    });
    setPersonData(Teacher);
  };



  const createNewTeacher = async () => {
    console.log("start")
    await handleUpload() 
  };
  const children = [];
  const handleCourse = (value) => {
    setNewUser({ ...newUser, class: value });
  };
  const handleId = (value) => {   
     setNewUser({ ...newUser, id: uuid() });
     };
    const handleCourses = (value) => {
    setNewUser({ ...newUser, courses: value });
      };
    const handlename = (value) => {
     setNewUser({ ...newUser, first_name: value });
      };

  const setEmail = (e) => {
    setNewUser({ ...newUser, email: e.target.value });
  };
  const setPhone = (e) => {
    setPhones(e.target.value);
    // setNewUser({ ...newUser, ...[newUser.phone]=  allPhone });
    setNewUser({ ...newUser, ["phone"]: allPhone });
  };
//   const setLevel = (e) => {
//     setNewUser({ ...newUser, level: e.target.value });
//   };
//   const setFirstNmae = (e) => {
//     setNewUser({ ...newUser, first_name: e.target.value });
//   };
  const setLastName = (e) => {
    setNewUser({ ...newUser, last_name: e.target.value });
  };

  useEffect(() => {
      getClass();
      getCourse();
      getid();
  }, []);
  return (
    <>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item label="Teacher Pictue" valuePropName="fileList">
          <input type="file" onChange={handleChange} accept="/image/*"   />
        </Form.Item>
        <Form.Item label="Id">
          <Select
            style={{
              width: "100%",
            }}
            placeholder={"Teacher Id"}
            onChange={handleId}
            optionLabelProp="label"
          >
            {personData.map((item, index) => (
              <Option value={item.key} label={item.user_id}>
                {item.user_id}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Class">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select all classes"
            onChange={handleCourse}
            optionLabelProp="label"
          >
            {classData.map((item, index) => (
              <Option value={item.key} label={item.grade}>
                {item.grade}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Courses">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select all courses"
            onChange={handleCourses}
            optionLabelProp="label"
          >
            {coursesData.map((item, index) => (
              <Option value={item.key} label={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="name">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="see all users"
            onChange={handlename}
            optionLabelProp="label"
          >
            {personData.map((item, index) => (
              <Option value={item.key} label={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>


        {/* <Form.Item label="First Name">
          <Input onChange={(e) => setFirstNmae(e)} />
        </Form.Item> */}
        <Form.Item label="Last Name">
          <Input onChange={(e) => setLastName(e)} />
        </Form.Item>
        <Form.Item label="Email">
          <Input onChange={(e) => setEmail(e)} />
        </Form.Item>
        <Form.Item label="Phone">
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
        <Form.Item label="Level">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select all level"
            onChange={handleCourse}
            optionLabelProp="label"
          >
            {classData.map((item, index) => (
              <Option value={item.key} label={item.sections}>
                {item.sections}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item label="Level">
          <Input onChange={(e) => setLevel(e)} />
        </Form.Item> */}
      </Form>
      <div style={{ flex: 1, flexDirection: "row", marginLeft: 190 }}>
        <Button onClick={async() => await createNewTeacher()}>Save</Button>
        <Button>Cancel</Button>
      </div>
    </>
  );
};

export default CreateNewTeacher;
