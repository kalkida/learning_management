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
import { Space, Table, Tag } from "antd";
import { firestoreDb, storage } from "../../firebase";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { firebaseAuth } from "../../firebase";

const { Option } = Select;

export default function CreateRole() {
    const user = firebaseAuth.currentUser
    console.log("user is  " + user.phoneNumber);
    const [datas, setData] = useState([]);
    const uid = useSelector((state) => state.user.profile);
    const [isData, setIsData] = useState(false);
    const[profile ,setProfile] = useState(false)


    const getid = async () => {
        const Parent = []
        const q = query(
          collection(firestoreDb, "users"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          var datas = doc.data();
          Parent.push({
            ...datas,
            key: doc.id,
          });
        });
        console.log('parent ', Parent.map((item => item.role)));
      };

    const getStudents = async () => {
        const studentdata = []
    
        const citiesRef = collection(firestoreDb, "students");
        const q = query(citiesRef, where("phone", 'array-contains', `${user.phoneNumber}`));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.exists()){
        querySnapshot.forEach((doc) => {
            var datas = doc.data();
            studentdata.push({
              ...datas,
              key: doc.id,
            });
        console.log(doc.id, " => ", doc.data());
      }); 
      setData(studentdata); 
      await setDoc(doc(firestoreDb ,'users'),{
      role:{
        isParent : true,
        isAdmin :false,
        isTeacher :false      
      } ,
      school: datas[0].school_id
    }
      )
    } else {   
     console.log("query snapshot is undefined for query snapshot snapsh")
     alert("There is no student with your parent phone");
     }
  };

  useEffect(() => {
    getStudents();
    getid();
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
