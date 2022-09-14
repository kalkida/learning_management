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
import View from "../modals/student/View";
import Update from "../modals/student/Update";

export default function AddStudnets() {
  const uid = useSelector((state) => state.user.profile);
  const shcool = useSelector((state) => state.user.shcool);
  const [datas, setData] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [openView, setViewOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [viewData, setViewData] = useState();
  const [updateData, setUpdateData] = useState();
  const [updateComplete, setUpdateComplete] = useState(false);

  const showViewModal = async (data) => {
    setViewLoading(true);
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

  const getStudents = async () => {
    const q = query(
      collection(firestoreDb, "students"),
      where("school_id", "==", uid.school)
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
          <a onClick={() => showViewModal(record)}>View {record.name}</a>
          <a onClick={() => showUpdateModal(record)}>Update</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getStudents();
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
        to={"/add-student"}
      >
        Add User
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
