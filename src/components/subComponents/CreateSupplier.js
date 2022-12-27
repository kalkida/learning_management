import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createParentwhithStudent, fetchClass } from "../modals/funcs";
import { Input, Button, Select, message, DatePicker, Drawer } from "antd";
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
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "../../css/teacher.css";
import "../modals/courses/style.css";
import "../modals/teacher/style.css";
import { textAlign } from "@mui/system";
import Icon from 'react-eva-icons'

const { Option } = Select;
const { Search } = Input;

const gender = ["Male", "Female", "Other"];

const CreateNewSupplier = ({ open, setOpen }) => {
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
             <span>Create Supplier</span>
             <button style={{ alignSelf:'flex-end' , alignItems:'flex-end',
            marginLeft:"75%" , color:'black'
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
        <div className="py-2 px-5">
              <label style={{ paddingBottom: 2 }}>Supplier Name</label>
              <Input
                style={{ marginTop: 2 }}
                className="py-6 mt-2 !rounded-lg !border-[#d3d3d3] "
                name="first_name"
                placeholder="United Training"
                // onChange={(e) => handleStudent(e)}
              />
            </div>
          <div className="grid grid-cols-2 gap-4 ">
          <div className="py-2 px-5">
              <label>Contact Person</label>
              <Input
                style={{ marginTop: 6 }}
                className=" !rounded-lg !border-[#d3d3d3] "
                name="email"
                placeholder="Name"
                onChange={(e) => handleStudent(e)}
              />
            </div>
            <div className="py-2 px-5">
            <label>Contact Number</label>
            <Input
              style={{ marginTop: 6 ,color:"#475467" }}
              className=" !rounded-lg !border-[#d3d3d3] text-[#475467]"
              name="email"
              placeholder="Add Phone Number"
              onChange={(e) => handleStudent(e)}
            />
          </div>
       

          </div>
          <div className="py-2 px-5">
            <label>Email</label>
            <Input
              style={{ marginTop: 6 }}
              className=" !rounded-lg !border-[#d3d3d3] "
              name="email"
              placeholder="Add Email"
              onChange={(e) => handleStudent(e)}
            />
          </div>
          
         
            <div className="grid grid-cols-2 gap-4 ">
            <div className="py-2 px-5">
              <label>Bank </label>
              <Select
                bordered={true}
                placeholder="Add Bank"
                className="py-6 mt-6 !rounded-lg !border-[#d3d3d3] hover:border-[#667085]"
                onChange={handleGender}
                optionLabelProp="label"
                style={{
                  width: "100%",
                  marginTop: 6,
                }}
              >
                {gender.map((item, index) => (
                  <Option key={index} value={item} label={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
        
        <div className="py-2 px-5">
            <label>Bank  Account</label>
            <Input
              style={{ marginTop: 6 }}
              className=" !rounded-lg !border-[#d3d3d3] "
              name="email"
              placeholder="Add Account"
              onChange={(e) => handleStudent(e)}
            />
          </div>
          
       
        </div>
        <div className="py-2 px-5">
              <label style={{ paddingBottom: 6 }}>Description</label>
              <Input.TextArea
           style={{
            borderColor:"#667085"
          }}
            placeholder="Add Description"
            rows={4}
            name="description"
            className="!border-[1px] !border-[#d3d3d3] !rounded-lg"
            // onChange={(e) => handleCourse(e)}
          />
            </div>
        </div>
        {/* <div
          style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 32,
            marginBottom: 16,
          }}      >
          <h1 className="text-[1.5rem] font-jakarta text-[#344054]">Guardian</h1>
          <div className="p-6 bg-[#FFF] border-[1px] border-[#D0D5DD] rounded-lg">
            {input.map((item, index) => {
              return (
                <div className="mt-5">
                  <h1 className="text-lg font-[500]">Phone {index + 1}</h1>
                  <PhoneInput
                    placeholder="Enter Guardian Contact"
                    className="py-1 border-[2px] bg-white px-2 mb-2 mt-6 !rounded-lg"
                    style={{ marginTop: 6, width: "100%" }}
                    value={item}
                    country="ET"
                    onChange={(e) => setPhone(e, index)}
                  />
                </div>
              );
            })}
            <Button
              className="!rounded-lg mt-5"
              style={{ width: "100%" }}
              onClick={() => {
                setInputs([...input, 0]);
                setAllPhone([...allPhone, phone]);
              }}
            >
              Add New
            </Button>
          </div>
        </div> */}
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

export default CreateNewSupplier;
