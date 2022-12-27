import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createParentwhithStudent, fetchClass } from "../funcs";
import { Input, Button, Select, message, DatePicker, Drawer } from "antd";
import { Collapse, Space } from 'antd';

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

const HistorySupplier = ({ open, setOpen, data  }) => {
  const [allPhone, setAllPhone] = useState([]);
  const [input, setInputs] = useState([0]);
  const [phone, setPhones] = useState("");
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const [loadingbutton, setLoadingButton] = useState(false);
  console.log("record   is " + data.item_count)

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
        <div className="bg-[#FFF]">
        <p className="text-[#d3d3d3] text-sm">Arsenal Football Club Official Website: get the latest club news, highlights,
             fixtures and results. Become a free digital member to get exclusive content.</p>
        <div className="py-2 ">
        
            </div>
            <div className="py-2 ">
            <Space direction="vertical">
    <Collapse collapsible="header" 
    bordered={false}
    style={{width:550}} className="!border-[#d3d3d3]"   defaultActiveKey={['1']}>
      <Panel header="Supplier Information" className="!border-[#d3d3d3] !bg-[#FFF] !rounded-xl"  key="1">
        <div  style={{flexDirection:'row', display:'flex' , justifyContent:'space-between',alignItems:'center' }}>
        <p className="text-[#344054] "  >Contact person</p>
        <p className="text-[#d3d3d3]" >Neboyu Samuel</p>        
        </div>
        <div  style={{flexDirection:'row', display:'flex' , justifyContent:'space-between',alignItems:'center' }}>
        <p className="text-[#344054] "  >Contact Number</p>
        <p className="text-[#d3d3d3]" >+251913134567</p>        
        </div>
        <div  style={{flexDirection:'row', display:'flex' , justifyContent:'space-between',alignItems:'center' }}>
        <p className="text-[#344054] "  >Email</p>
        <p className="text-[#d3d3d3]" >Neboyu@gmail.com</p>        
        </div>
        <div  style={{flexDirection:'row', display:'flex' , justifyContent:'space-between',alignItems:'center' }}>
        <p className="text-[#344054] "  >Bank</p>
        <p className="text-[#d3d3d3]" >CBE</p>        
        </div>
        <div  style={{flexDirection:'row', display:'flex' , justifyContent:'space-between',alignItems:'center' }}>
        <p className="text-[#344054] "  >Bank account</p>
        <p className="text-[#d3d3d3]" >100000256789</p>        
        </div>
      </Panel>
    </Collapse>
    <Collapse collapsible="icon" bordered={false} className="!border-[#d3d3d3]  mt-20"  defaultActiveKey={['1']}>
      <Panel header="Supplier History" className="!border-[#d3d3d3] !bg-[#FFF] !rounded-xl"  key="1">
      <div  style={{flexDirection:'row', display:'flex' , justifyContent:'space-between',alignItems:'center'}}>
        <p className="text-[#d3d3d3] "  >item</p>
        <p className="text-[#d3d3d3]" >Amount</p>
        <p className="text-[#d3d3d3]"  >Date</p>
        
        </div>
        <div  style={{flexDirection:'row', display:'flex' , justifyContent:'space-between' , alignContent:'center' }}>
        <p className="text-[#344054] ">Books</p>
        <p className="text-[#344054]">1000</p>
        <p className="text-[#344054]"  >Jun 2022</p>
        </div>
        <div  style={{flexDirection:'row', display:'flex' , justifyContent:'space-between', alignItems:'flex-start' }}>
        <p className="text-[#344054]  "  style={{ alignSelf:'flex-start'}}>Pencil</p>
        <p className="text-[#344054] px-5 "  style={{ alignSelf:'center' , marginLeft:9}}>1500</p>
        <p className="text-[#344054] "  style={{ alignSelf:'flex-end'}}>Jun 2022</p>
        </div>
      </Panel>
    </Collapse>
  </Space>
          </div>
        </div>
        <div className="absolute bottom-0 w-[100%] mb-3 px-5 ">
          <Button className="w-[25%] mr-5 !rounded-lg" onClick={onClose}>Cancel</Button>
          <Button
            className="w-[65%] !bg-[#DC5FC9] !text-[white] hover:!text-[white] !rounded-lg shadow-md -z-0 "
            onClick={async () => await createNewStudent()}
            icon={<FontAwesomeIcon className="mr-2" icon={faCheck} />}
          >
            Confirm
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default HistorySupplier;
