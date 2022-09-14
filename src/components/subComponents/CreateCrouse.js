import React, { useEffect, useState, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import { createCourses } from "../../redux/courses";

const { Option } = Select;

const CreateCrouse = () => {
  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();
  const [courses, setcourse] = useState([]);
  const [newCourse, setNewCourse] = useState({
    id: uuid(),
    name: "",
    description: "",
    school_id: uid.school,
  });

  const getClass = async () => {
    const children = [];
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
    setcourse(children);
  };

  const createNewCourse = async () => {
    dispatch(createCourses(newCourse));
    navigate("/list-Course");
  };

  const onCancle = () => {
    navigate("/list-Course");
  };

  const setCourseName = (e) => {
    setNewCourse({ ...newCourse, name: e.target.value });
  };
  const setCourseDescription = (e) => {
    setNewCourse({ ...newCourse, description: e.target.value });
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
        <Form.Item label="Course Name">
          <Input onChange={(e) => setCourseName(e)} />
        </Form.Item>
        <Form.Item label="Course Description">
          <Input onChange={(e) => setCourseDescription(e)} />
        </Form.Item>
      </Form>
      <div style={{ flex: 1, flexDirection: "row", marginLeft: 190 }}>
        <Button onClick={() => createNewCourse()}>Save</Button>
        <Button onClick={onCancle}>Cancel</Button>
      </div>
    </>
  );
};

export default CreateCrouse;
