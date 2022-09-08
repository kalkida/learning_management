
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
import View from '../modals/classes/view';
import Update from '../modals/classes/update';
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

  const handleCourse = async (id) => {
    const docRef = doc(firestoreDb, "courses", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var dataset = docSnap.data();
      const data = { id: id, name: dataset.name }
      return data;
    }
    else {
      const data = { id: id, name: id }
      return data;
    }
  }

  const handleSections = async (id) => {
    const docRef = doc(firestoreDb, "sections", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var dataset = docSnap.data();
      const data = { id: id, name: dataset.name }
      return data;
    }
    else {
      const data = { id: id, name: id }
      return data;
    }
  }

  const handleNameId = async (data) => {
    data.course.map((item, i) => {
      handleCourse(item).then(response => data.course[i] = response);

    });
    data.sections.map((item, i) => {
      handleSections(item).then(response => data.sections[i] = response);
    })
    return data;
  }

  const handleViewCancel = () => {
    setOpenView(false);
  };

  const handleView = (data) => {
    handleData(data)
    setViewData(data);
    setOpenView(true);
  }

  const handleData = (data) => {
    const courseArray = [];
    const sectionArray = [];
    const courseId = [];
    const sectionId = [];
    data.course.map((item) => {
      courseId.push(item.id)
      courseArray.push(item.name)

    })
    data.sections.map((item) => {
      sectionId.push(item.id)
      sectionArray.push(item.name)
    })
    setSectionData(sectionArray);
    setCousreData(courseArray);
    setSectionIdSingle(sectionId);
    setCourseIdSingle(courseId);
  }

  const handleUpdateCancel = () => {
    setOpenUpdate(false);
  };

  const handleUpdate = (data) => {
    handleData(data)
    setViewData(data);
    setOpenUpdate(true);
  }

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
      handleNameId(data).then(response => {
        response.key = doc.id;
        temporary.push(response);

      });
    });
    setData(temporary);
  };

  const columns = [
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Course",
      key: "course",
      dataIndex: "course",
      render: (value) => {
        return (
          <>
            {value?.map((item) => (
              <Tag color={"green"}>{item.name}</Tag>
            ))}
          </>
        );
      },
    },
    {
      title: "Sections",
      key: "sections",
      dataIndex: "sections",
      render: (value) => {
        return (
          <>
            {value?.map((item) => (
              <Tag color={"green"}>{item.name}</Tag>
            ))}
          </>
        );
      },
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
          float: "left"
        }}
        to={"/add-class"}
      >
        Add Classes
      </Link>
      <CreateSection />
      <br />

      <Table style={{ marginTop: 20 }} columns={columns} dataSource={datas} />
      {viewData ?
        <View
          handleCancel={handleViewCancel}
          openView={openView}
          data={viewData}
          coursedata={coursedata}
          sectionData={sectionData}
        /> : null}
      {viewData ?
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
        /> : null}
    </div>
  );

