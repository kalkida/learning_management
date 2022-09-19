import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Form, Input, Button, Select, DatePicker, message } from "antd";
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
  const handleCourse = (value) => {
    const classData = JSON.parse(value);
    setNewUser({ ...newUser, class: classData });
  };
  const setAge = (value) => {
    setNewUser({ ...newUser, DOB: JSON.stringify(value._d) });
  };

  const handleStudent = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  const setPhone = (e) => {
    setPhones(e.target.value);
    setNewUser({ ...newUser, ["phone"]: allPhone });
  };
  const handleCancle = () => {
    navigate("/list-student")
  }

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
      </Form>
      <div style={{ flex: 1, flexDirection: "row", marginLeft: 190 }}>
        <Button
          type="primary"
          loading={loadingbutton}
          onClick={async () => await createNewStudent()}
        >
          Save
        </Button>
        <Button onClick={handleCancle}>Cancel</Button>
      </div>
    </>
  );
};

export default CreateNewStudnet;
