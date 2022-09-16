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

import { firebaseAuth } from "../../firebase";

export default function ParentDash() {
  const { Option } = Select;
  const user = firebaseAuth.currentUser
  console.log("user is  " + user.phoneNumber);
  const fileInputRef = useRef();

  const [courses, setcourse] = useState([]);
  const [allPhone, setAllPhone] = useState([]);
  const [input, setInputs] = useState([0]);
  const [phone, setPhones] = useState("");
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [images, setImages] = useState(null);

  const [classData, setClassData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  const focalimage = useRef(null)
  const [newUser, setNewUser] = useState({
    avater: null,
    email: "",
    first_name: "",
    last_name: "",
    parent_id: uuid(),
    phone_numbers: [user.phoneNumber],
    student: [],
  });

  const valueRef = useRef();

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };



  async function handleUpload() {
    if (!file) {
      //alert("Please choose a file first!");
      setDoc(doc(firestoreDb, "parents", uuid()), newUser);
      console.log("parent is created    ", newUser);
      console.log("Student id   ", uuid())
      navigate("/list-parent");
    }
    else{
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
            console.log("url is   ", url)
            valueRef.current = url
            console.log("value with ref is ", valueRef.current)
  
            if (valueRef.current != null) {
              console.log("value with ref with ref is ", valueRef.current)
              setLoading(true)
          //    setNewUser({ ...newUser, avater: valueRef.current })
              newUser.avater = valueRef.current;
              if (newUser.avater !== null) {
                setDoc(doc(firestoreDb, "parents", uuid()), newUser);
                console.log("parent is now    ", newUser);
                console.log("parent id   ", uuid())
                navigate("/list-parent");
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
      collection(firestoreDb, "students"),
      where("phone", "array-contains", `${user.phoneNumber}`)
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
    console.log("student data  ", classData)
  };

  const createNewParent = async () => {
    console.log("start")
    await handleUpload()
    // if(!loading){ 

    // }else{
    //   return;
    // }
  };
  const children = [];
  const handleCourse = (value) => {
    setNewUser({ ...newUser, student: value });
  };
 
  const setEmail = (e) => {
    setNewUser({ ...newUser, email: e.target.value });
  };
  const setPhone = (e) => {
    setPhones(e.target.value);
    // setNewUser({ ...newUser, ...[newUser.phone]=  allPhone });
    setNewUser({ ...newUser, ["phone"]: allPhone });
  };
  const setFirstNmae = (e) => {
    setNewUser({ ...newUser, first_name: e.target.value });
  };
  const setLastName = (e) => {
    setNewUser({ ...newUser, last_name: e.target.value });
  };

  useEffect(() => {
    getClass();
  }, []);
  return (
    <>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item label="First Name" name="First name" rules={[
          {
            required: true,
          },
        ]}>
          <Input onChange={(e) => setFirstNmae(e)} />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input onChange={(e) => setLastName(e)} />
        </Form.Item>
        <Form.Item label="Email">
          <Input onChange={(e) => setEmail(e)} />
        </Form.Item>
        <Form.Item label="phone_numbers" name="Phone_numbers" rules={[
        ]}>
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

        <Form.Item label="Students">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select your students"
            onChange={handleCourse}
            optionLabelProp="label"
            multiple={true}
          >
            {classData.map((item, index) => (
              <Option value={item.first_name} label={item.first_name}>
                {item.first_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Parent Pictue" valuePropName="fileList">
          <input type="file" onChange={handleChange} accept="/image/*" />
        </Form.Item>
      </Form>
      <div style={{ flex: 1, flexDirection: "row", marginLeft: 190 }}>
        <Button onClick={async () => await createNewParent()}>Save</Button>
        <Button>Cancel</Button>
      </div>
    </>
  );
}
