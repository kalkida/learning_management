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
import { firestoreDb } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Input } from "antd";
import { useRef } from "react";
import { Select } from "antd";
import "../modals/courses/style.css";
import { PlusOutlined } from "@ant-design/icons";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const { Option } = Select;
const { Search } = Input;

export default function AddStudnets() {
  const uid = useSelector((state) => state.user.profile);
  const navigate = useNavigate();
  const [datas, setData] = useState([]);

  const [classes, setClasses] = useState([]);
  const [updateComplete, setUpdateComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleView = (data) => {
    console.log("course", data);
    navigate("/view-student", { state: { data } });
  };

  const handleUpdate = (data) => {
    console.log("data is set", data);
    navigate("/update-student", { state: { data } });
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
  const getClassDataOne = async (id) => {
    const docRef = doc(firestoreDb, "class", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var dataset = docSnap.data();
      dataset.key = id;
      return dataset;
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
      getClassDataOne(data.class).then((res) => {
        data.class = res;
      });
      temporary.push(data);
    });
    setLoading(false);
    setData(temporary);
  };

  const handleFilterClass = async (value) => {
    await getStudents();
    await getClass();
    var newData = datas.filter(function (val) {
      return val.class.level === value;
    });
    console.log(datas, newData);
    setData(newData);
  };

  const handleFilterSection = async (value) => {
    await getStudents();
    await getClass();

    var newData = datas.filter(function (val) {
      return val.class.section === value;
    });
    setData(newData);
  };

  const getClass = async () => {
    var branches = await getSchool();
    const q = query(
      collection(firestoreDb, "class"),
      where("school_id", "in", branches.branches)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach(async (doc) => {
      var data = doc.data();
      data.key = doc.id;
      temporary.push(data);
    });
    setClasses(temporary);
  };

  const columns = [
    {
      title: "FirstName",
      dataIndex: "first_name",
      key: "first_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Guardian Phone Number",
      key: "phone",
      dataIndex: "phone",
      render: (value) => {
        return (
          <>
            {value?.map((item, i) => (
              <PhoneInput
                placeholder="Enter Guardian Contact"
                className=" bg-white px-2"
                value={item}
                disabled
              />
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
      title: "Class",
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return (
          <h1>
            {item?.section}
            {item?.level}
          </h1>
        );
      },
    },

    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <a
            className="p-2 text-[white] hover:text-[#E7752B] rounded-sm bg-[#E7752B] hover:border-[#E7752B] hover:border-[1px] hover:bg-[white]"
            onClick={() => handleView(record)}
          >
            View{" "}
          </a>
          <a
            className="p-2 text-[white] hover:text-[#E7752B] rounded-sm bg-[#E7752B] hover:border-[#E7752B] hover:border-[1px] hover:bg-[white]"
            onClick={() => handleUpdate(record)}
          >
            Update
          </a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getStudents();
    getClass();
  }, [updateComplete]);

  return (
    <div>
      <div className="list-header">
        <h1 className="text-[24px] font-bold">List Of Students</h1>
      </div>
      <div className="list-sub">
        <div className="list-filter">
          <Select
            placeholder="Grade"
            style={{ width: 120 }}
            onChange={handleFilterClass}
          >
            {classes?.map((item, i) => (
              <Option key={item.key} value={item.level} lable={item.level}>
                {item.level}
              </Option>
            ))}
          </Select>
          <Select
            style={{ width: 120 }}
            placeholder="Section"
            onChange={handleFilterSection}
          >
            {classes?.map((item, i) => (
              <Option key={item.key} value={item.section} lable={item.section}>
                {item.section}
              </Option>
            ))}
          </Select>
        </div>
        <div className="course-search">
          <div>
            <Search
              placeholder="input search text"
              allowClear
              // onSearch={onSearch}
              style={{
                width: 200,
              }}
            />
          </div>
          <Link
            className="flex flex-col justify-center align-middle  h-8 w-[10vw] hover:text-[#E77528] border-[#E7752B] border-[2px] rounded-sm"
            to={"/add-student"}
          >
            <div className="flex flex-row justify-around">
              <PlusOutlined className="text-sm" />
              <h1 className="text-[15px]">Add Students</h1>
            </div>
          </Link>
        </div>
      </div>

      <Table
        loading={loading}
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={datas}
      />
    </div>
  );
}
