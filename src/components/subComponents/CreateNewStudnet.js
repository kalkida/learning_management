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
} from "firebase/firestore";
import { firestoreDb, storage } from "../../firebase";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const { Option } = Select;

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
    first_name: "",
    last_name: "",
    class: "",
    parent_id: [],
    level: "",
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
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("url is   ", url);
          valueRef.current = url;
          console.log("value with ref is ", valueRef.current);

          if (valueRef.current != null) {
            console.log("value with ref with ref is ", valueRef.current);
            setLoading(true);
            setNewUser({ ...newUser, avater: valueRef.current });
            if (newUser.avater !== null) {
              setDoc(doc(firestoreDb, "students", uuid()), newUser);
              console.log("Student  is createNewStudent    ", newUser);
              console.log("Student id   ", uuid());
              navigate("/list-student");
              setLoading(false);
            }
          }
          console.log("images is   ", images);
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

  const createNewStudent = async () => {
    console.log("start");
    setLoadingButton(true);
    await handleUpload();
    setLoadingButton(false);
    // if(!loading){

    // }else{
    //   return;
    // }
  };
  const children = [];
  const handleCourse = (value) => {
    setNewUser({ ...newUser, class: value });
  };
  const setAge = (value) => {
    setNewUser({ ...newUser, DOB: JSON.stringify(value._d) });
  };

  const setEmail = (e) => {
    setNewUser({ ...newUser, email: e.target.value });
  };
  const setPhone = (e) => {
    setPhones(e.target.value);
    setNewUser({ ...newUser, ["phone"]: allPhone });
  };
  const setLevel = (e) => {
    setNewUser({ ...newUser, level: e.target.value });
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
        <Form.Item
          label="First Name"
          name="First name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input onChange={(e) => setFirstNmae(e)} />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input onChange={(e) => setLastName(e)} />
        </Form.Item>
        <Form.Item label="Email">
          <Input onChange={(e) => setEmail(e)} />
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
          <Input onChange={(e) => setLevel(e)} />
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

        <Form.Item label="Class">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select all courses"
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
        <Form.Item label="Student Pictue" valuePropName="fileList">
          <input type="file" onChange={handleChange} accept="/image/*" />
        </Form.Item>
      </Form>
      <div style={{ flex: 1, flexDirection: "row", marginLeft: 190 }}>
        <Button
          loading={loadingbutton}
          onClick={async () => await createNewStudent()}
        >
          Save
        </Button>
        <Button>Cancel</Button>
      </div>
    </>
  );
};

export default CreateNewStudnet;
