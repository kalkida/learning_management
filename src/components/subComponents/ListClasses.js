import React, { useEffect, useState } from "react";
import { Space, Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
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
import "../modals/courses/style.css";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useRef } from "react";
import Highlighter from "react-highlight-words";
import { Select } from "antd";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../modals/courses/style.css";

const { Option } = Select;
const LEVEL = ["1", " 2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const SECTION = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export default function ListClasses() {
  const navigate = useNavigate();

  const [datas, setData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  const school = useSelector((state) => state.user.profile.school);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [tableLoading, setTableLoading] = useState(true);

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleView = (data) => {
    navigate("/view-class", { state: { data } });
  };

  const handleUpdate = (data) => {
    navigate("/update-class", { state: { data } });
  };

  const handleAdd = (data) => {
    navigate("/add-class");
  };

  const getClasses = async () => {
    const q = query(collection(firestoreDb, "schools", `${school}/class`));
    var temporary = [];
    const snap = await getDocs(q);

    snap.forEach((doc) => {
      var data = doc.data();
      data.key = doc.id;
      temporary.push(data);
    });
    console.log(temporary);
    setData(temporary);
    setTableLoading(false);
  };

  const columns = [
    {
      title: <p className="font-jakarta text-[#344054] font-[600]">Class</p>,
      dataIndex: "class",
      key: "class",
      sorter: (a, b) => a.level - b.level,

      render: (text, data) => (
        <a className="text-[14px] font-jakarta text-[#344054]">
          {data.level}
          {""}
          {data.section}
        </a>
      ),
    },
    {
      title: "Grade",
      dataIndex: "level",
      key: "level",
      sorter: (a, b) => a.level - b.level,

      render: (text) => <a className="text-[#344054]">{text}</a>,
    },

    {
      title: "Section",
      key: "section",
      dataIndex: "section",
      sorter: (a, b) => a.section - b.section,

      render: (text) => <a className="text-[#344054]">{text}</a>,
    },
    {
      title: "Number of Students",
      key: "class",
      width: "20%",
      render: (_, record) => (
        <div className="flex flex-row justify-around">
          {record?.student.length}
        </div>
      ),
    },
  ];
  const handleFilterLevel = async (value) => {
    const q = query(
      collection(firestoreDb, "schools", `${school}/class`),
      where("level", "==", value)
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

  const handleFilterSection = async (value) => {
    const q = query(
      collection(firestoreDb, "schools", `${school}/class`),
      where("section", "==", value)
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

  useEffect(() => {
    getClasses();
  }, []);

  return (
    <div className="bg-[#F9FAFB] h-[100vh]  -mt-14">
      <h1 className="text-2xl mb-7 font-[600] font-jakarta text-[#344054] ">
        List Of Class
      </h1>
      <div className="list-sub">
        <div className="flex flex-row  w-[30%]">
          <Select
            placeholder="Grade"
            className="hover:border-[#E7752B] border-[#EAECF0] border-[2px] bg-[white] !mr-5 !rounded-[6px]"
            bordered={false}
            style={{ width: 141 }}
            onChange={handleFilterLevel}
          >
            {LEVEL.map((item, i) => (
              <Option key={i} name="level" value={item}>
                {item}
              </Option>
            ))}
          </Select>
          <Select
            bordered={false}
            style={{ width: 141 }}
            placeholder="Section"
            className="hover:border-[#E7752B] border-[#EAECF0] border-[2px] bg-[white] !rounded-[6px]"
            onChange={handleFilterSection}
          >
            {SECTION.map((item, i) => (
              <Option key={i} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
        <div className="course-search">
          <Input
            style={{ width: 200 }}
            className="mr-3 border-[#EAECF0] !rounded-lg"
            placeholder="Search"
            prefix={<SearchOutlined className="site-form-item-icon" />}
          />
          <Button
            bordered={false}
            onClick={() => handleAdd()}
            icon={<FontAwesomeIcon className="pr-2" icon={faAdd} />}
            className="border-[2px] !border-[#E7752B] flex flex-row justify-center !text-[#E7752B] bg-white !rounded-lg "
          >
            Add Class
          </Button>
        </div>
      </div>
      {/* <CreateSection /> */}
      <br />
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => handleView(record), // click row
          };
        }}
        loading={tableLoading}
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={datas}
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  );
}
