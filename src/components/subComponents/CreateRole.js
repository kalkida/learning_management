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
  addDoc
} from "firebase/firestore";
import { Space, Table, Tag } from "antd";
import { firestoreDb, storage } from "../../firebase";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { firebaseAuth } from "../../firebase";

const { Option } = Select;

export default function CreateRole() {
    const navigate = useNavigate();
    const user = firebaseAuth.currentUser
    console.log("user is  " + user.phoneNumber);
    const [datas, setData] = useState([]);
   // const uid = useSelector((state) => state.user.profile);
    const [isData, setIsData] = useState(false);
    const[profile ,setProfile] = useState(false)

    const getTeacher = async () => {
        const studentdata = []
    
        const citiesRef = collection(firestoreDb, "teachers");
        const q = query(citiesRef, where("phone", '==', `${user.phoneNumber}`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            var datas = doc.data();
            studentdata.push({
              ...datas,
              key: doc.id,
            });
        console.log(doc.id, " => ", doc.data());
      }); 
      setData(studentdata); 
      console.log("data is ", datas)
      if(datas.length > 0){
        const docRef = await addDoc(collection(firestoreDb, "users"), {
            role:{
                isParent : false,
                isAdmin :false,
                isTeacher : true      
              } ,
              school: datas[0].school_id,
              name : "Teacher"
          });
          console.log("Document written with ID: ", docRef.id);

      navigate("/teacher");     

    } else {  
      const teacherdata =[]
      const newRef = collection(firestoreDb, "students");
      const q1 = query(newRef, where("phone", 'array-contains', `${user.phoneNumber}`));
      const querySnapshots = await getDocs(q1);
      querySnapshots.forEach((doc) => {
          var dating = doc.data();
          teacherdata.push({
            ...dating,
            key: doc.id,
          });
      console.log(doc.id, " => ", doc.data());
    }); 
    setData(teacherdata); 
    console.log("data is ", datas)
    if(datas.length > 0){
      const docRef = await addDoc(collection(firestoreDb, "users"), {
          role:{
              isParent : true,
              isAdmin :false,
              isTeacher : false      
            } ,
            school: datas[0].school_id,
            name : "Parent"
        });
        console.log("Document written with ID: ", docRef.id);

    navigate("/parent");     

  } else {

        const docRef = await addDoc(collection(firestoreDb, "users"), {
            role:{
                isParent : true,
                isAdmin :false,
                isTeacher : false      
              } ,
              name : "Parent",
          });
          console.log("Document written with ID: ", docRef.id);

            navigate("/parent");     
     }
    }
  };

  useEffect(() => {
    getTeacher();
}, []);


const columns = [
    {
      title: "FirstName",
      dataIndex: "first_name",
      key: "first_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Phone Number",
      key: "phone",
      dataIndex: "phone",
      render: (value) => {
        return (
          <>
            {value?.map((item) => (
              <Tag color={"green"}>{item}</Tag>
            ))}
          </>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: (item) => {
        return <Tag color={"green"}>{item}</Tag>;
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>View {record.name}</a>
        </Space>
      ),
    },
  ];


  return (
    <div>
      <br />
      <Table style={{ marginTop: 20 }} columns={columns} dataSource={datas} />
    </div>
  )
}
