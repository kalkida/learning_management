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
import '../../css/teacher.css'
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
  const [secData, setSecData] = useState([]);

  const uid = useSelector((state) => state.user.profile);
  const [newUser, setNewUser] = useState({
    avater: null,
    email: "",
    first_name: "",
    last_name: "",
    class: "",
    course:[],
    level: [],
    phone: "",
    school_id: uid.school,
  });

  const valueRef = useRef();

  const handleChange =(event) =>{
    setFile(event.target.files[0]);
  }; 
 
 async function handleUpload()  {
    if (!file) {
      alert("Please choose a file first!");
    }else{
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
           // setNewUser({...newUser , avater: valueRef.current})
           newUser.avater = valueRef.current;
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

  const getSection = async () => {

    const sec =[]
    const q = query(
      collection(firestoreDb, "sections"),
      where("school_id", "==", uid.school)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      sec.push({
        ...datas,
        key: doc.id,
      });
    });
    setSecData(sec);
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
      coursess.push({
        ...datas,
        key: doc.id,
      });
    });
    setCourseData(coursess);
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

  const handleSection = (value) => {
    setNewUser({ ...newUser, level: value });
  };
  const handleId = (value) => {   
     setNewUser({ ...newUser, id: uuid() });
     };
    const handleCourses = (value) => {
    setNewUser({ ...newUser, course: value });
      };
    // const handlename = (value) => {
    //  setNewUser({ ...newUser, first_name: value });
    //   };

  const setEmail = (e) => {
    setNewUser({ ...newUser, email: e.target.value });
  };
  const setPhone = (e) => {
    if (!e) {
      alert("Please write phone first!");
    }
    setNewUser({ ...newUser, phone: e.target.value });
    // setPhones(e.target.value);
    // // setNewUser({ ...newUser, ...[newUser.phone]=  allPhone });
    // setNewUser({ ...newUser, ["phone"]: allPhone });
  };
//   const setLevel = (e) => {
//     setNewUser({ ...newUser, level: e.target.value });
//   };
  const setFirstNmae = (e) => {
    setNewUser({ ...newUser, first_name: e.target.value });
  };
  const setLastName = (e) => {
    setNewUser({ ...newUser, last_name: e.target.value });
  };

  useEffect(() => {
      getClass();
      getCourse();
      getid();
      getSection();
  }, []);
  return (
    <>
      <div 
      style={{}}
      
      >
        <Form 
        layout="vertical"
        >
        <h1 className="h1"> Profile information</h1>
        <div style={{
          flexDirection:'row',
          justifyContent: "space-between",
          display: "flex",

        }}>
        <div style={{
           display: 'flex',
           alignItems:'flex-start',
           width: '50%',
           flexDirection:'column',

        }} >
         <text style={{
          textAlign: 'left',
          fontFamily:'plus jakarta sans',
          fontSize:16,
          fontWeight:'bold',
          padding:24
        }}>Profile Picture</text>
        <img  style ={{
          width:151,
          height:151,
          padding:8
        }}src="logo512.png" alt="profile" />
        <Form.Item  valuePropName="fileList">
        <input type="file" onChange={handleChange} accept="/image/*"   />
        </Form.Item>
        </div>
        <div 
        style={{
          display: "flex",
          flexDirection:'column',
          alignItems:'flex-start',
          paddingRight:120
        }}
        >
      <Form.Item label="First Name">
          <Input onChange={(e) => setFirstNmae(e)} />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input onChange={(e) => setLastName(e)} />
        </Form.Item>
        <Form.Item label="Class">
          <Select
            style={{
              width: 241,
            }}
            placeholder="select all classes"
            onChange={handleCourse}
            optionLabelProp="label"
            mode="multiple"

          >
            {classData.map((item, index) => (
              <Option key={item.key} value={item.key} label={item.level + item.section}>
                {item.level +item.section}
              </Option>
            ))}
          </Select>
        </Form.Item>
        </div>
        <div style={{
          display: "flex",
          flexDirection:'column',
          alignItems:'flex-end',
          paddingRight:120
        }}>
        <Form.Item label="Email">
          <Input onChange={(e) => setEmail(e)} />
        </Form.Item>
        <Form.Item label="Phone">
        <Input onChange={(e) => setPhone(e)} />
      </Form.Item>
      </div>
      </div>
 
      </Form>
      <div style={{ flex: 1, flexDirection: "row", marginLeft: 190 }}>
        <Button onClick={async() => await createNewTeacher()}>Save</Button>
        <Button>Cancel</Button>
      </div>
      </div>


    <div >
      <Form
        layout="vertical"
      >
        <Form.Item label="Courses">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select all courses"
            onChange={handleCourses}
            optionLabelProp="label"
            mode="multiple"
          
          >
            {coursesData.map((item, index) => (
              <Option key={item.key} value={item.cour} label={item.course_name}>
                {item.course_name}
              </Option>
            ))}
          </Select>
        </Form.Item>    
      </Form>
      </div>
      
    </>
  );
};

export default CreateNewTeacher;
