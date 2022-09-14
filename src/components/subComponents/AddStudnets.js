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

export default function AddStudnets() {
  const uid = useSelector((state) => state.user.profile);
  const shcool = useSelector((state) => state.user.shcool);
  const [datas, setData] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [openView, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState();

  const showViewModal = async (data) => {
    setViewLoading(true);
    setViewData(data);
    setViewOpen(true);
    setViewLoading(false);
    setViewLoading(false);
  };

  const handleViewCancel = () => {
    setViewOpen(false);
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
          {console.log(record)}
          <Button loading={viewLoading} onClick={() => showViewModal(record)}>
            View {record.name}
          </Button>
          <a>Update</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getStudents();
  }, []);

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
    </div>
  );
}
