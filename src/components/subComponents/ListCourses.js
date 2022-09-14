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
import View from '../modals/courses/view';
import Update from '../modals/courses/update';
import CreateSubject from "../modals/subject/createSubject";

export default function ListCourses() {
  const [datas, setData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);
  const [viewData, setViewData] = useState();

  const getSchool = async () => {
    const docRef = doc(firestoreDb, "schools", uid.school);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      var dataset = docSnap.data();
      return dataset;
    } else {
    }
  };

  const getCourses = async () => {
    var branches = await getSchool();
    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "in", branches.branches)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();
      data.key = doc.id;
      temporary.push(data);
    });
    setData(temporary);
  };

  const handleViewCancel = () => {
    setOpenView(false);
  };

  const handleView = (data) => {
    setViewData(data);
    setOpenView(true);
  }

  const handleUpdateCancel = () => {
    setOpenUpdate(false);
  };

  const handleUpdate = (data) => {
    setViewData(data);
    setOpenUpdate(true);
  }

  const columns = [
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
      render: (text) => <a>{text}</a>,
    },
    // {
    //   title: "id",
    //   key: "id",
    //   dataIndex: "id",
    //   render: (text) => <a>{text}</a>,
    // },
    {
      title: "Course Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Level",
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return <Tag color={"green"}>{item.level}{console.log(item)}</Tag>;
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleView(record)}>View </a>
          <a onClick={() => handleUpdate(record)}>Update</a>
          {/* <a>View {record.name}</a>
          <a>Update</a> */}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getCourses();
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
        to={"/add-course"}
      >
        Add Courses
      </Link>
      <CreateSubject />
      <br />

      <Table style={{ marginTop: 20 }} columns={columns} dataSource={datas} />
      {viewData ?
        <View
          handleCancel={handleViewCancel}
          openView={openView}
          data={viewData}
        /> : null}
      {viewData ?
        <Update
          handleCancel={handleUpdateCancel}
          openUpdate={openUpdate}
          data={viewData}
          setUpdateComplete={setUpdateComplete}
          updateComplete={updateComplete}
        /> : null}
    </div>
  );
}
