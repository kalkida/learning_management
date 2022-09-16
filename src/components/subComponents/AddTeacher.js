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
<<<<<<< HEAD
import View from "../modals/teachers/view";
import Update from "../modals/teachers/update";
=======
import View from "../modals/teacher/view";
import Update from "../modals/teacher/update";
>>>>>>> 4a00bf80afde258bea0b83278c3004073eedbb54

export default function AddTeacher() {
  const [datas, setData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
<<<<<<< HEAD
  const [viewLoading, setViewLoading] = useState(false);
  const [openView, setViewOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [viewData, setViewData] = useState();
  const [updateData, setUpdateData] = useState();
  const [updateComplete, setUpdateComplete] = useState(false);


  const showViewModal = async (data) => {
    setViewData(data);
    setViewOpen(true);
    setViewLoading(false);
    setViewLoading(false);
  };

  const showUpdateModal = (data) => {
    setUpdateData(data);
    setOpenUpdate(true);
  };

  const handleUpdateCancel = () => {
    setOpenUpdate(false);
  };

  const handleViewCancel = () => {
    setViewOpen(false);
  };
=======
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [updateComplete, setUpdateComplete] = useState(false);
  const [viewData, setViewData] = useState();
  const [coursedata, setCousreData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [sectionIdSingle, setSectionIdSingle] = useState([]);
  const [courseIdSingle, setCourseIdSingle] = useState([]);
>>>>>>> 4a00bf80afde258bea0b83278c3004073eedbb54

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
<<<<<<< HEAD
          <a onClick={() => showViewModal(record)}>View {record.name}</a>
          <a onClick={() => showUpdateModal(record)}>Update</a>
=======
          <a onClick={() => showViewModal(record)}>View </a>
          <a onClick={() => showUpdateModal(record)}>Update</a>
           {/* <a>View {record.name}</a> 
          <a>Update</a>  */}
>>>>>>> 4a00bf80afde258bea0b83278c3004073eedbb54
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
<<<<<<< HEAD
          openView={openView}
          handleViewCancel={handleViewCancel}
          data={viewData}
        />
      ) : null}
      {openUpdate ? (
        <Update
          openUpdate={openUpdate}
          handleUpdateCancel={handleUpdateCancel}
          data={updateData}
          setUpdateComplete={setUpdateComplete}
=======
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
>>>>>>> 4a00bf80afde258bea0b83278c3004073eedbb54
        />
      ) : null}
    </div>
  );
}
