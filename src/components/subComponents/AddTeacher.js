import React, { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import { useSelector } from "react-redux";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { firebaseAuth, firestoreDb } from "../../firebase";
import { Button } from "antd";
import { Link } from "react-router-dom";
import View from "../modals/teacher/view";
import Update from "../modals/teacher/update";

export default function AddTeacher() {
  const [datas, setData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [updateComplete, setUpdateComplete] = useState(false);
  const [viewData, setViewData] = useState();
  const [coursedata, setCousreData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [sectionIdSingle, setSectionIdSingle] = useState([]);
  const [courseIdSingle, setCourseIdSingle] = useState([]);

  const getSchool = async () => {
    const docRef = doc(firestoreDb, "schools", uid.school);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      var dataset = docSnap.data();
      return dataset;
    } else {
    }
  };

  const getTeacher = async () => {
    var branches = await getSchool();
    const q = query(
      collection(firestoreDb, "teachers"),
      where("school_id", "in", branches.branches)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();   
      data.key =doc.id
      temporary.push(data);
    });
    setData(temporary);
  };

  const handleViewCancel = () => {
    setOpenView(false);
  };

  const showUpdateModal = (data) => {
    setUpdateData(data)
    setOpenUpdate(true);
  };

  const handleView = (data) => {
    // handleData(data);
    setViewData(data);
    setOpenView(true);
  };


  const handleUpdateCancel = () => {
    setOpenUpdate(false);
  };

  const handleUpdate = (data) => {
    // handleData(data);
    setViewData(data);
    setOpenUpdate(true);
  };

  const showViewModal = async (data) => {
    // const id = data.class
    // const docRef = doc(firestoreDb, "class", id);
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   var dataset = docSnap.data();
    //   data.class = dataset.grade;
    // }
    setViewData(data)
    setOpenView(true);
  };


  const columns = [
    {
      title: "FirstName",
      dataIndex: "first_name",
      key: "first_name",
      render: (text) => <a>{text}</a>,
    },
    { 
      title: "Course",
      key: "course",
      dataIndex: "course",
      render: (text) => <a>{text}</a>,    
      // render: (value) => {
      //   return (
      //     <>
      //       {value?.map((item) => (
      //         <Tag color={"green"}>{item}</Tag>
      //       ))}
      //     </>
      //   );
      // },
    },
    {
      title: "Phone Number",
      key: "phone",
      dataIndex: "phone",
      render: (text) => <a>{text}</a>,
      // render: (value) => {
      //   return (
      //     console.log(datas.length)
      //     // <>
      //     //   {value.length ?
      //     //     value.map((item) => (
      //     //       <Tag color={"green"}>{item}</Tag>
      //     //     ))
      //     //     : null}
      //     // </>
      //   );
      // },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      render: (text) => <a>{text}</a>,
      // render: (item) => {
      //   return <Tag color={"green"}>{item}</Tag>;
      // },
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showViewModal(record)}>View </a>
          <a onClick={() => showUpdateModal(record)}>Update</a>
           {/* <a>View {record.name}</a> 
          <a>Update</a>  */}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getTeacher();
  }, [updateComplete]);

  return (
    <div>
      <Link
        style={{
          padding: 10,
          backgroundColor: "black",
          marginBottom: 20,
          color: "white",
          borderRadius: 10,
        }}
        to={"/add-teacher"}
      >
        Add Teacher
      </Link>
      <br />

      <Table style={{ marginTop: 20 }} columns={columns} dataSource={datas} />
      {viewData ? (
        <View
          handleCancel={handleViewCancel}
          openView={openView}
          data={viewData}
          coursedata={coursedata}
          sectionData={sectionData}
        />
      ) : null}
      {updateData ? (
        <Update
          handleUpdateCancel={handleUpdateCancel}
          openUpdate={openUpdate}
          data={updateData}
          setUpdateComplete={setUpdateComplete}
          updateComplete={updateComplete}
          coursedata={coursedata}
          sectionData={sectionData}
          sectionIdSingle={sectionIdSingle}
          courseIdSingle={courseIdSingle}
        />
      ) : null}
    </div>
  );
}
