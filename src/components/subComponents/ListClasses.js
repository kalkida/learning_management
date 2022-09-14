import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Modal, Button } from "antd";
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
import { Link } from "react-router-dom";
import { async } from "@firebase/util";
import View from "../modals/classes/view";
import Update from "../modals/classes/update";
import CreateSection from "../modals/section/createSection";

export default function ListClasses() {
  const [datas, setData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  const [isData, setIsData] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
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

  const handleViewCancel = () => {
    setOpenView(false);
  };

  const handleView = (data) => {
    // handleData(data)
    setViewData(data);
    setOpenView(true);
  };

  const handleData = (data) => {
    const courseArray = [];
    const sectionArray = [];
    const courseId = [];
    const sectionId = [];
    data.course.map((item) => {
      courseId.push(item.id);
      courseArray.push(item.name);
    });
    data.sections.map((item) => {
      sectionId.push(item.id);
      sectionArray.push(item.name);
    });
    setSectionData(sectionArray);
    setCousreData(courseArray);
    setSectionIdSingle(sectionId);
    setCourseIdSingle(courseId);
  };

  const handleUpdateCancel = () => {
    setOpenUpdate(false);
  };

  const handleUpdate = (data) => {
    handleData(data);
    setViewData(data);
    setOpenUpdate(true);
  };

  const getClasses = async () => {
    var branches = await getSchool();
    const q = query(
      collection(firestoreDb, "class"),
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

  const columns = [
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Section",
      key: "section",
      dataIndex: "section",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleView(record)}>View </a>
          <a onClick={() => handleUpdate(record)}>Update</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getClasses();
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
          float: "left",
        }}
        to={"/add-class"}
      >
        Add Classes
      </Link>
      <CreateSection />
      <br />

      <Table style={{ marginTop: 20 }} columns={columns} dataSource={datas} />
      {openView ? (
        <View
          handleCancel={handleViewCancel}
          openView={openView}
          data={viewData}
          // coursedata={coursedata}
          // sectionData={sectionData}
        />
      ) : null}
      {openUpdate ? (
        <Update
          handleCancel={handleUpdateCancel}
          openUpdate={openUpdate}
          data={viewData}
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
