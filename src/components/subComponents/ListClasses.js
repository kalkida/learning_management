
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

export default function ListClasses() {
  const [datas, setData] = useState([]);
  const uid = useSelector((state) => state.user.profile);

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
      return dataset.name;
    }
    else {
      return id;
    }
  }

  const handleSections = async (id) => {
    const docRef = doc(firestoreDb, "sections", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var dataset = docSnap.data();
      return dataset.name;
    }
    else {
      return id;
    }
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
      data.course.map(async (item, i) => {
        var name = await handleCourse(item);
        data.course[i] = name;
      });
      data.sections.map(async (item, i) => {
        var name = await handleSections(item)
        data.sections[i] = name;
      })
      temporary.push(data);
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
              <Tag color={"green"}>{item}</Tag>
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
              <Tag color={"green"}>{item}</Tag>
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
          <a>View {record.name}</a>
          <a>Update</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getClasses();
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
        to={"/add-class"}
      >
        Add Classes
      </Link>
      <br />

      <Table style={{ marginTop: 20 }} columns={columns} dataSource={datas} />
    </div>
  );
}
