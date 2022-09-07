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

const CreateClasses = () => {

  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);

  const [courses, setcourse] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [newClass, setNewClass] = useState({
    grade: "",
    course: [],
    sections: [],
    school_id: uid.school,
  });

  const getClass = async () => {

    const children = [];
    const sectionArray = [];

    const q = query(
      collection(firestoreDb, "courses"),
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

    const sectionQuary = query(
      collection(firestoreDb, "sections"),
      where("school_id", "==", uid.school)
    );
    const sectionQuerySnapshot = await getDocs(sectionQuary);
    sectionQuerySnapshot.forEach((doc) => {
      var datas = doc.data();
      sectionArray.push({
        ...datas,
        key: doc.id,
      });
    });
    setcourse(children);
    setSectionData(sectionArray);
  };

  const createNewClass = async () => {
    await setDoc(doc(firestoreDb, "class", uuid()), newClass);
    navigate("/list-Classes");
  };

  const onCancle = () => {
    navigate("/list-Classes")
  }

  const handleCourse = (value) => {
    setNewClass({ ...newClass, course: value });
  };

  const handleSection = (value) => {
    setNewClass({ ...newClass, sections: value });

  }

  const setGrade = (e) => {
    setNewClass({ ...newClass, grade: e.target.value });
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
        <Form.Item label="Grade">
          <Input type={"number"} onChange={(e) => setGrade(e)} />
        </Form.Item>
        <Form.Item label="Courses">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select all courses"
            onChange={handleCourse}
            optionLabelProp="label"
            mode="multiple"
          >
            {courses.map((item, index) => (
              <Option value={item.key} label={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Section">
          <Select
            style={{ width: "100%" }}
            placeholder="Select Section"
            onChange={handleSection}
            mode="multiple"
          >
            {sectionData.map((item, i) => (
              <Option value={item.key} lable={item.name}>
                {item.name}
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
