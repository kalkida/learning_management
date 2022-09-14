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

const CreateClasses = () => {

  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);

  const [students, setStudents] = useState([]);
  const [newClass, setNewClass] = useState({
    level: "",
    student: [],
    section: "",
    school_id: uid.school,
  });

  const getStudents = async (level) => {

    const children = [];
    const q = query(
      collection(firestoreDb, "students"),
      where("school_id", "==", uid.school), where("level", "==", level)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
      children.push({
        ...datas,
        key: doc.id,
      });
    });
    setStudents(children);
  };

  const createNewClass = async () => {
    const q = query(
      collection(firestoreDb, "class"),
      where("school_id", "==", uid.school), where("level", "==", newClass.level), where("section", "==", newClass.section),
    );
    const checkIsExist = (await getDocs(q)).empty;
    if (checkIsExist) {
      setDoc(doc(firestoreDb, "class", uuid()), newClass)
        .then(response => {
          message.success("Class Created");
          navigate("/list-Classes");
        })
        .catch(error => console.log(error));

    }
    else {
      message.error("This Class already exist");
    }
  };


  const onCancle = () => {
    navigate("/list-Classes")
  }

  const handleClass = (e) => {
    if (e.target.name === "level") {

      getStudents(e.target.value);
    }
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
  };

  const handleStudent = (value) => {

    value.map((item, i) => {
      value[i] = JSON.parse(item);
    })
    setNewClass({ ...newClass, student: value });
  }

  return (
    <>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item label="Level" name="Level" rules={[
          {
            required: true,
          },
        ]}>
          <Input name="level" type={"number"} onChange={(e) => handleClass(e)} />
        </Form.Item>
        <Form.Item label="Section" name="Section" rules={[
          {
            required: true,
          },
        ]}>
          <Input name="section" onChange={(e) => handleClass(e)} />
        </Form.Item>
        <Form.Item label="Students">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select Students"
            onChange={handleStudent}
            optionLabelProp="label"
            mode="multiple"
          >
            {students.map((item, index) => (
              <Option value={JSON.stringify(item)} label={item.first_name + " " + (item.last_name ? item.last_name : "")}>
                {item.first_name + " " + (item.last_name ? item.last_name : "")}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <div style={{ flex: 1, flexDirection: "row", marginLeft: 190 }}>
        <Button onClick={() => createNewClass()}>Save</Button>
        <Button onClick={onCancle}>Cancle</Button>
      </div>
    </>
  );
};

export default CreateClasses;
