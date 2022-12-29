import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createParentwhithStudent, fetchClass } from "../funcs";
import { Input, Button, Select, message, DatePicker, Drawer } from "antd";
import { Collapse, Space, Tag ,Table } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';

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
import { firestoreDb, storage } from "../../../firebase";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "../../../css/teacher.css";
import "../courses/style.css";
import "../teacher/style.css";
import { textAlign } from "@mui/system";
import Icon from 'react-eva-icons'

const { Option } = Select;
const { Search } = Input;
const { Panel } = Collapse;

const gender = ["Male", "Female", "Other"];

const HistoryProduct = ({ open, setOpen, data  }) => {
  const [allPhone, setAllPhone] = useState([]);
  const [input, setInputs] = useState([0]);
  const [phone, setPhones] = useState("");
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const [loadingbutton, setLoadingButton] = useState(false);
   console.log("record   is " + data)

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");

  const [classData, setClassData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  const school = useSelector((state) => state.user.profile.school);
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
      setDoc(doc(firestoreDb, "schools", `${school}/students`, newUID), {
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
                setDoc(
                  doc(firestoreDb, "schools", `${school}/students`, newUID),
                  {
                    ...newUser,
                    course: data,
                  }
                )
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
    const docRef = doc(firestoreDb, "schools", `${school}/class`, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var data = docSnap.data();
      return data.course;
    } else {
      return "";
    }
  };

  const getClass = async () => {
    const q = query(collection(firestoreDb, "schools", `${school}/class`));
    var children = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      children.push({
        id: doc.id,
        className: datas.level + datas.section,
        courses: datas.courses,
      });
    });
    setClassData(children);
  };

  const onRemove = () => {
    setFile("");
  };
  const modifyClassWithStudent = async (studnetId, classID) => {
    const washingtonRef = doc(
      firestoreDb,
      "schools",
      `${school}/class`,
      classID
    );
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


  const onClose = () => {
    setOpen(false);
  };


  const dataSource = [
    {
      key: '1',
      user: 'Incline Plc',
      item_name: 50000,
      item_count:'01 Jun 2022',
      Date: 'Recieved',
    },
    {
        key: '2',
        user: 'Daniel Nigus',
        item_name: 845,
        item_count:'13 Jun 2022',
        Date: 'Edited',
    },
    {
        key: '3',
        user: 'Daniel Negus',
        item_name: 95,
        item_count:'23 Jan 2022' ,
        Date: 'Checked Out',
    },
    {
        key: '4',
        user: 'Tackle',
        item_name: 90,
        item_count:'19 Dec 2022',
        Date: 'Deleted'
    },
  ];

  var Color = "black"

  const columnProduct = [
    {
      title: (
        // <div>
           <Select
                bordered={false}
                defaultValue="Name"
                // onChange={(e) => onSelect(e)}
                className="text-[#344054] !font-[500] !font-jakarta border-[#EAECF0] hover:border-[#EAECF0] !border-0 ml-[-5]"
              >
                <Option key={1} value={"all"}>
                  All
                </Option>
                <Option key={1} value={1}>
                  Parents
                </Option>
                <Option key={2} value={2}>
                  Teachers
                </Option>
              </Select>
      // </div>
        // <p className="font-jakarta font-[500] text-[14px] text-[#344054] background-[#FFF]">
        //   User
        // </p>
      ),
      dataIndex: "user",
      key: "user",
      render: (item) => {
        return <h1 className="font-jakarta text-[#344054] !font-jakarta font-[500]">{item}</h1>;
      },
    },
    {
      title: <p className="font-jakarta text-[#98A2B3] text-[14px] font-[500]">item</p>,
      key: "item_name",
      dataIndex: "item_name",
      render: (value) => {
        return <p className="font-jakarta text-[#344054] !font-jakarta font-[500]">{value}</p>;
      },
    },
    {
      title: <p className="font-jakarta  text-[#98A2B3] text-[14px] font-[500]">Date</p>,
      dataIndex: "item_count",
      key: "item_count",
      render: (item) => {
        return <h1 className="font-jakarta text-[#344054] !font-jakarta font-[500]">{item}</h1>;
      },
    },
    {
      title: <p className="font-jakarta text-[#98A2B3] text-[14px] font-[500]">Status</p>,
      dataIndex: "Date",
      key: "Date",
      render: (item) => {
            {console.log("render   ",item)}
            if(item === "Deleted"){
                Color = 'red'
            }
            if(item === "Recieved"){
                Color = 'green'
            }
            if(item === "Edited"){
                Color = 'black'
            }
            if(item === "Checked Out"){
                Color =  'pink'
            }
    return (
       <Tag className="!font-jakarta" color={Color} style={{borderRadius:15 , width:100, height:32 , fontSize:14, textAlign:'center',paddingTop:5,
       }} >
       {item}
     </Tag>
      )     
    }
    },    
  ];

  useEffect(() => {
    getClass();
  }, []);
  return (
    <div className="bg-[#F9FAFB] min-h-[100vh]  -mt-14">
      <Drawer
        title={<div className="flex">
             <span>United Corporations</span>
             <button style={{ alignSelf:'flex-end' , alignItems:'flex-end',
            marginLeft:"70%" , color:'black'
            }} 
            onClick={onClose}
            > 
             <Icon  fill={"#98A2B3"} name="close-outline" size="medium" />
             </button>
        </div>}
        width={620}
        onClose={onClose}
        closable={false}

        headerStyle={{
           justifyContent:'space-between',
           
        }}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        contentWrapperStyle={{
            alignSelf:'flex-end',
        }}
      >
        <div className="bg-[#FFF] " >
     <div className="!rounded-xl bg-[#F2F4F7]  h-[6vh] justify-items-center">
        <p className="text-[#344054] py-1 !text-base ml-3 leading-6 font-medium ">Item History</p>
        </div>
             <Table
        className="bg-[#FFFFFF]"
        style={{ marginTop: 20, backgroundColor:'#FFF'}}
        columns={columnProduct}
        dataSource={dataSource}
        pagination={false}
      />
        </div>
      </Drawer>
    </div>
  );
};

export default HistoryProduct;
