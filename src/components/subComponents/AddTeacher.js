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
import View from "../modals/teachers/view";
import Update from "../modals/teachers/update";

export default function AddTeacher() {
  const [datas, setData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
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
      temporary.push(data);
    });
    setData(temporary);
  };

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
          <a onClick={() => showViewModal(record)}>View {record.name}</a>
          <a onClick={() => showUpdateModal(record)}>Update</a>
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
        />
      ) : null}
    </div>
  );
}
