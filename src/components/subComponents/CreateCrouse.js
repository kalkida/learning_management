import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Form, Input, Button, Select, TimePicker, message } from "antd";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore";
import { firestoreDb, storage } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/lib/input/TextArea";
import { setLogLevel } from "firebase/app";
import _default from "antd/lib/time-picker";
import { NodeExpandOutlined } from "@ant-design/icons";
import { borderColor } from "@mui/system";

const { Option } = Select;
const days = ["Monday", "Thusday", "Wednsday", "Thursday", "Friday"];
const CreateCrouse = () => {
  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subject, setSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [input, setInput] = useState([0]);
  const [newCourse, setNewCourse] = useState({
    course_name: selectedSubject + " " + selectedLevel,
    teachers: [],
    class: {},
    schedule: [{ day: "", time: [] }],
    description: "",
    school_id: uid.school,
  });

  const getCourseData = async () => {
    const children = [];
    const teachersArrary = [];
    const subjectArrary = [];
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
    const qTeachers = query(
      collection(firestoreDb, "teachers"),
      where("school_id", "==", uid.school)
    );
    const queryTeachers = await getDocs(qTeachers);
    queryTeachers.forEach((doc) => {
      var datas = doc.data();
      teachersArrary.push({
        ...datas,
        key: doc.id,
      });
    });
    const qSubject = query(
      collection(firestoreDb, "subject"),
      where("school_id", "==", uid.school)
    );
    const querySubject = await getDocs(qSubject);
    querySubject.forEach((doc) => {
      var datas = doc.data();
      subjectArrary.push({
        ...datas,
        key: doc.id,
      });
    });
    setClasses(children);
    setTeachers(teachersArrary);
    setSubject(subjectArrary);
  };

  const createNewCourse = async () => {
    newCourse.course_name = selectedSubject + " " + selectedLevel;

    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "==", uid.school),
      where("course_name", "==", newCourse.course_name)
    );

    const checkIsExist = (await getDocs(q)).empty;

    if (checkIsExist) {
      setDoc(doc(firestoreDb, "courses", uuid()), newCourse)
        .then((reponse) => {
          message.success("Course Created");
          navigate("/list-Course");
        })
        .catch((error) => {
          message.error("Coures is not created, Try again");
          console.log(error);
        });
    } else {
      message.warning("Course Already exist");
    }
  };

  const onCancle = () => {
    navigate("/list-Course");
  };

  const handleCourse = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleClass = (value) => {
    const classData = JSON.parse(value);
    setSelectedLevel(classData.level + classData.section);
    setNewCourse({ ...newCourse, class: classData });
  };

  const handleSubject = (value) => {
    setSelectedSubject(value);
  };

  const handleTeacher = (value) => {
    const teacherdata = [];
    value.map((item, i) => {
      teacherdata.push(JSON.parse(item));
    });
    setNewCourse({ ...newCourse, teachers: teacherdata });
  };
  const handleScheduler = (value, i) => {
    if (typeof value === "string") {
      newCourse.schedule[i].day = value;
    } else {
      const timeValue = [];
      value.map((item, i) => {
        timeValue.push(JSON.stringify(item._d))
        console.log(JSON.stringify(item._d))
      })
      newCourse.schedule[i].time = timeValue;
    }
  };
  useEffect(() => {
    getCourseData();
  }, []);

  return (
    <>

    <div  
        style={{
          backgroundColor: '#FFFFFF',
          color:'white' 
        }}
    >
      
      <Form
        layout="vertical"
        style={{
          padding: 24,
          top:110,
          left:280,
          borderRadius:8,
          gap:24,
          minHeight: 400,
          backgroundColor: "#F9FAFB",
        }}
      >
        <text  style={{
        height:32,
        left:43,
        fontWeight:'bold',
        fontSize:24,
        fontFamily:'Plus Jakarta sans',
        color: '#344054'
      }}>Course information</text>

       <Form.Item 
       style={{ 
        alignItems:'flex-start',
        padding:0,
        gap:12,
        height:143,
        top:80,
        left:43
       }}
       >
        <text
        style={{
          fontSize:14,
          fontFamily:'Plus jakarta sans',
          fontWeight:'500',
          height:20
        }}
        > Description</text> 
          <TextArea name="description" onChange={(e) => handleCourse(e)}   
          style={{
           height:117,
           top:26,
           borderRadius:6,
           gap:6
          }}
          />
        </Form.Item>

        <div  className="site-layout-background"
        style={{
          display:'flex',
          flexDirection:'row',
          alignItems:'flex-start',
          marginTop:24,
          gap:249,
          width:'60%',
          height:182,
          top:249,
          order:2,
        }}
        >
       <div  style={{
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        padding:'0',
        gap:12,
        width:250,
        height:152,
        top:250,
        marginTop:24

       }}>
        <Form.Item
          label="Subject"
          name="Subject"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select Subjects"
            onChange={handleSubject}
            optionLabelProp="label"
          >
            {subject.map((item, index) => (
              <Option value={item.name} label={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Class"
          name="Class"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select Classes"
            onChange={handleClass}
            optionLabelProp="label"
          >
            {classes.map((item, index) => (
              <Option
                value={JSON.stringify(item)}
                label={item.level + " " + item.section}
              >
                {item.level + " " + item.section}
              </Option>
            ))}
          </Select>
        </Form.Item>

        </div>
        <Form.Item
          label="Teachers"
          name="Teachers"
          rules={[
            {
              required: true,
            },
          ]}

          style={{
            display:'flex',
            width:250,
            height:182,
            left:499,
            gap:34 ,
            marginTop:24
          }}
        >
          <Select
            style={{
              width: 250,
              
            }}
            placeholder="select Teachers"
            onChange={handleTeacher}
            optionLabelProp="label"
            mode="multiple"
          >
            {teachers.map((item, index) => (
              <Option
                key={item.key}
                value={JSON.stringify(item)}
                label={
                  item.first_name + " " + (item.last_name ? item.last_name : "")
                }
              >
                {item.first_name + " " + (item.last_name ? item.last_name : "")}
              </Option>
            ))}
          </Select>
        </Form.Item>
        </div>
       
        </Form>
        <Form
        // labelCol={{ span: 4 }}
        // wrapperCol={{ span: 14 }}
        layout="vertical"
        style={{
          flexDirection:'column',
          display: 'flex',
          backgroundColor:'#FFFFFFF',
          position: 'absolute', 
          width: 648 ,
          paddingTop:50,

        }}
      >
       
      <div style={{
        width:50 ,
        display: 'flex',
        backgroundColor:'#FFFFFFF',
        marginBottom:40
      }}/>
        <Form.Item  rules={[
          {
            required: true,
          },
        ]}
        style={{
          display:'flex',
          justifyContent:'center',
          flexDirection:'column',
          alignItems:"flex-start",
          minheight:400,
          paddingLeft:34,
          backgroundColor:'#F9FAFB',
        }}
        
        >
  <div   style={{
    display:'flex',
    flexDirection:'column',
  }}>
     <text style={{
          fontSize:24,
          fontWeight:'600',
          fontFamily:'plus jakarta sans',
          top:24,
          left:24,
          paddingLeft:34,
          paddingTop:34

        }}>Schedule</text>
        <text style={{
          fontSize:20,
          fontWeight:'600',
          fontFamily:'plus jakarta sans',
          top:80,
          left:4,
          paddingLeft:34,
          color:'#EA8848'

        }}>Class 7B</text>

</div>
        <div  
        style={{
          flexDirection:'row',
          display:'flex',
        }}>
          <Button
            style={{ 
            display: 'flex',
            flexDirection:'row',
            alignItems:'flex-start',
            paddingLeft:40,
            paddingTop:16,
            gap:8,
            border:1,
            height:40

          }}
          >
            Period
          </Button>
          <Button
            style={{ 
              display: 'flex',
              flexDirection:'row',
              alignItems:'flex-start',
              paddingLeft:110,
              paddingTop:16,
              gap:8,
              border:1,
              height:40
            }}
          >
            Start Time
          </Button>
          <Button
            style={{ 
              display: 'flex',
              flexDirection:'row',
              alignItems:'flex-start',
              paddingLeft:110,
              paddingTop:16,
              gap:8,
              border:1,
              height:40

            }}
          >
            End Time
          </Button>
          </div>

        <div  style={{
          width:600,
          alignItems:'flex-start',

        }}>
          {input.map((item, i) => (
            <>
              <Select
                style={{ 
                width: 200 ,
                 top:40,
                 gap:40,
                 paddingLeft:8,
                }}
                placeholder="First Select Days"
                onChange={(e) => handleScheduler(e, i)}
              >
                {days.map((item, index) => (
                  <Option value={item} label={item}>
                    {item}
                  </Option>
                ))}
              </Select>
              <TimePicker.RangePicker
                style={{ width: 250,
                top:40,
                left:20,
                justifyContent: "space-between",
                gap:32,
                paddingLeft:20,
              
              }}
                format={"hh:mm"}
                use12Hours
                onChange={(e) => handleScheduler(e, i)}
              />
            </>
          ))}
          </div>
         
        </Form.Item>
        <div style={{ flex: 1, flexDirection: "row", marginLeft: 190 , marginTop:50 , paddingBottom:50 }}>
        <Button
            style={{ float: "left" }}
            onClick={() => {
              setInput([...input, 7]);
              setNewCourse({
                ...newCourse,
                schedule: [...newCourse.schedule, { day: "", time: [] }],
              });
            }}
          >
            Add New
          </Button>
        <Button type="primary" onClick={() => createNewCourse()}>Save</Button>
        <Button onClick={onCancle}>Cancel</Button>
      </div>
      </Form>
      </div>
     
    </>
  );
};

export default CreateCrouse;
