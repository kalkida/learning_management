import React, { useEffect, useState } from "react";
import { Space, Table, Button, Col, DatePicker, Drawer, Form, Input, Row, Select } from "antd";
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
import "../modals/courses/style.css";
import "react-phone-number-input/style.css";
import { SearchOutlined } from "@ant-design/icons";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateNewStudnet from "./CreateNewStudnet";

const { Option } = Select;
const { Search } = Input;

export default function AddStudnets() {
  const school = useSelector((state) => state.user.profile.school);
  const navigate = useNavigate();
  const [datas, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleView = (data) => {
    navigate("/view-student", { state: { data } });
  };

  const getClassDataOne = async (id) => {
    const docRef = doc(firestoreDb, "schools", `${school}/class`, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var dataset = docSnap.data();
      dataset.key = id;
      return dataset;
    }
  };
  const getStudents = async () => {
    const q = query(collection(firestoreDb, "schools", `${school}/students`));
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
    setData(temporary);
    setLoading(false);
  };

  const handleFilterClass = async (value) => {
    getStudents();
    getClass();
    var newData = datas.filter(function (val) {
      return val.class.level === value;
    });
    setData(newData);
  };

  const handleFilterSection = async (value) => {
    getStudents();
    getClass();

    var newData = datas.filter(function (val) {
      return val.class.section === value;
    });
    setData(newData);
  };

  const getClass = async () => {
    const q = query(collection(firestoreDb, "schools", `${school}/class`));
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
      title: (
        <p className="font-jakarta font-[600] text-[16px] text-[#344054]">
          Name
        </p>
      ),
      dataIndex: "first_name",
      key: "first_name",
      render: (_, text) => <p>{text.first_name + " " + text.last_name}</p>,
    },
    {
      title: <p className="font-jakarta  font-[600]">ID</p>,
      key: "studentId",
      dataIndex: "studentId",
      render: (value) => {
        return <p>{value}</p>;
      },
    },
    {
      title: <p className="font-jakarta  font-[600]">Grade</p>,
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return <h1>{item.level}</h1>;
      },
    },
    {
      title: <p className="font-jakarta  font-[600]">Section</p>,
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return <h1>{item.section}</h1>;
      },
    },
    {
      title: <p className="font-jakarta  font-[600]">Age</p>,
      dataIndex: "DOB",
      key: "DOB",
      render: (item) => {
        var today = new Date();
        var birthDate = new Date(JSON.parse(item));
        var age = today.getFullYear() - birthDate.getFullYear();
        return <h1>{age}</h1>;
      },
    },
    {
      title: <p className="font-jakarta  font-[600]">Sex</p>,
      dataIndex: "sex",
      key: "sex",
      render: (item) => {
        if (item == "Male") {
          return <h1>M</h1>;
        } else {
          return <h1>F</h1>;
        }
      },
    },
  ];

  const add = () => {
    // navigate("/add-student");
    setOpen(true);
  };


  useEffect(() => {
    getStudents();
  }, []);

  return (
    <div className="bg-[#F9FAFB] min-h-[100vh]  -mt-14">
      <div className="list-header mb-2">
        <h1 className="text-2xl  font-[600] font-jakarta">List Of Students</h1>
      </div>
      <div className="list-sub mb-10">
        <div className="list-filter">
          <Select
            bordered={false}
            className="!rounded-[6px] border-[#EAECF0] border-[2px]"
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
            bordered={false}
            className="!rounded-[6px] border-[#EAECF0] border-[2px]"
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
            <Input
              style={{ width: 200 }}
              className="mr-3 !rounded-[6px]"
              placeholder="Search"
              //onSearch={onSearch}
              prefix={<SearchOutlined className="site-form-item-icon" />}
            />
          </div>
          <Button
            onClick={() => add()}
            icon={<FontAwesomeIcon className="pr-2" icon={faAdd} />}
            className="hover:border-[#DC5FC9] hover:font-[500] !text-[#DC5FC9] !border-[#DC5FC9] !rounded-[6px] "
          >
            Add Student
          </Button>
        </div>
      </div>

      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => handleView(record), // click row
          };
        }}
        loading={loading}
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={datas}
        pagination={{ position: ["bottomCenter"] }}
      />
      <CreateNewStudnet
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}
