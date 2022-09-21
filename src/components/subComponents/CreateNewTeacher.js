import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Form, Input, Button, Select, DatePicker, Space } from "antd";
import { Link } from "react-router-dom";
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
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {
  InfoCircleOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
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

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });


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
  const handleChanges = (value) => {
    console.log(`selected ${value}`);
  };


  useEffect(() => {
      getClass();
      getCourse();
      getid();
      getSection();
  }, []);


  
  return (
    <>
    <div>
      <div 
      style={{
        height:357,
        backgroundColor:'#F9FAFB',
        borderRadius:8,
        borderWidth:1,
        top:95 ,
        display:'flex'
      }}
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
          // width: '50%',
           flexDirection:'column',

        }} >
         <text style={{
          textAlign: 'left',
          fontFamily:'plus jakarta sans',
          fontSize:16,
          fontWeight:'bold',
          padding:24,
          marginLeft:50,
        }}>Profile Picture</text>
        <img  style ={{
          width:151,
          height:151,
          padding:8,
          marginLeft:50,
        }}src={file ? URL.createObjectURL(file) :"logo512.png"}  />
        <Form.Item 
        style={{
          display: 'flex',
          //width:98,
          height:38,
          padding:20,
          gap:8,
          borderBlockColor:'#E7752B',
        }}
        >
        <input  type="file" onChange={handleChange} accept="/image/*"   />
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
      <Form.Item  style ={{
        minWidth:"100%",
        height:44,
        borderRadius:6,
        padding:10,
        gap:8
      }}label="First Name">
          <Input onChange={(e) => setFirstNmae(e)} />
        </Form.Item>
        <Form.Item style ={{
        width:'100%',
        height:44,
        borderRadius:6,
        padding:10,
        gap:8
      }} label="Last Name">
          <Input onChange={(e) => setLastName(e)} />
        </Form.Item>
        <Form.Item style ={{
        width:"100%",
        height:44,
        borderRadius:6,
        padding:10,
        gap:8
      }} label="Class">
          <Select
            placeholder="Select Classes"
            onChange={handleCourse}
            optionLabelProp="label"
            mode="multiple"

          >
            {classData.map((item, index) => (
              <Option key={item.key} value={item.level} label={item.level}>
                {item.level}
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
        <Form.Item style ={{
        width:'100%',
        height:44,
        borderRadius:6,
        padding:10,
        gap:8
      }} label="Section">
          <Select
            placeholder="Select Section"
            onChange={handleCourse}
            optionLabelProp="label"
            mode="multiple"

          >
            {classData.map((item, index) => (
              <Option key={item.key} value={item.section} label={item.section}>
                {item.section}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
        style ={{
          width:"100%",
          height:44,
          borderRadius:6,
          padding:10,
          gap:8,
        }}
        label="Email">
          <Input onChange={(e) => setEmail(e)} />
        </Form.Item>
        <Form.Item
        style ={{
          width:'100%',
          height:44,
          borderRadius:6,
          padding:10,
          gap:8,
        }}
        label="Phone">
        <Input onChange={(e) => setPhone(e)} />
      </Form.Item>
      </div>
      </div>
 
      </Form>
      </div>


    <div 
    style={{
      height:417,
      backgroundColor:'#F9FAFB',
      borderRadius:8,
      borderWidth:1,
      top:95 ,
      marginTop:50,
      display:'flex'
    }}
    >
<div  style={{
  padding:20
}}>
<h1 style={{ fontSize: 21 }}>Add Courses</h1>
      <Select
        defaultValue="Subject"
        style={{ width: 120, borderColor: "#E7752B", borderWidth: 4 }}
        onChange={handleChange}
      >
        <Option value="Subject">Subject</Option>

        <Option value="jack">Jack</Option>
        <Option value="disabled" disabled>
          Disabled
        </Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
      <Select
        style={{ width: 120, marginLeft: 30, marginRight: 30 }}
        defaultValue="Grade"
        onChange={handleChange}
      >
        <Option value="Grade">Grade</Option>

        <Option value="jack">Jack</Option>
        <Option value="disabled" disabled>
          Disabled
        </Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
      <Select
        style={{ width: 120, marginLeft: 30, marginRight: 30 }}
        defaultValue="Section"
        onChange={handleChange}
      >
        <Option value="Grade">Section</Option>

        <Option value="jack">Jack</Option>
        <Option value="disabled" disabled>
          Disabled
        </Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
      <Input
        style={{ width: 200, marginLeft: 200 }}
        placeholder="Search"
        prefix={<UserOutlined className="site-form-item-icon" />}
        suffix={
          <Tooltip title="Extra information">
            <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
          </Tooltip>
        }
      />

<Button 
 style={{
  padding:5,
  backgroundColor: "#E7752B",
  marginBottom: 20,
  color: "white",
  borderRadius: 5,
  marginLeft: 10,
  width:87
}}

 onClick={async() => await createNewTeacher()}>Confirm</Button>

      <Form
        layout="vertical"
      >
        <Form.Item label="Courses">
          <Select
            style={{
              width: "97%",
            }}
            placeholder="Select all courses"
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
      </div>
      </div>
    </>
  );
};

export default CreateNewTeacher;
