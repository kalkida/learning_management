import React, { useEffect, useState } from "react";
import { Space, Table, Button } from "antd";
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
import { Input } from "antd";
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
      title: (
        <p className="font-jakarta font-[600]">FirstName</p>
      ),
      dataIndex: "first_name",
      key: "first_name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: (
        <p className="font-jakarta  font-[600]">
          Guardian Phone Number
        </p>
      ),
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
      title: <p className="font-jakarta  font-[600]">Email</p>,
      dataIndex: "email",
      key: "email",
      render: (item) => {
        if (item) {
          return <h1>{item}</h1>;
        } else {
          return <div className="text-[#D0D5DD] font-light">No Data</div>;
        }
      },
    },
    {
      title: <p className="font-jakarta  font-[600]">Class</p>,
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return (
          <h1>
            {item?.level}
            {item?.section}
          </h1>
        );
      },
    },

    {
      title: <p className="font-jakarta  font-[600]">Action</p>,
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <a
            className="py-1 px-2 mr-2  text-[12px] font-jakarta text-[white] hover:text-[#E7752B] rounded-sm bg-[#E7752B] hover:border-[#E7752B] hover:border-[1px] hover:bg-[white]"
            onClick={() => handleView(record)}
          >
            View{" "}
          </a>
          <a
            className="py-1 px-2 mr-2  text-[12px] font-jakarta text-[white] hover:text-[#E7752B] rounded-sm bg-[#E7752B] hover:border-[#E7752B] hover:border-[1px] hover:bg-[white]"
            onClick={() => handleUpdate(record)}
          >
            Update
          </a>
        </Space>
      ),
    },
  ];

  const add = () => {
    navigate("/add-student");
  };

  useEffect(() => {
    getStudents();
    getClass();
  }, [updateComplete]);

  return (
    <div className="bg-[#F9FAFB] h-[100vh]  -mt-14">
      <div className="list-header mb-2">
        <h1 className="text-2xl  font-[600] font-jakarta">List Of Students</h1>
      </div>
      <div className="list-sub mb-10">
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
            onChange={handleFilterSection} o
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
              bordered={true}
            // onSearch={onSearch}
            />
          </div>
          <Button
            onClick={() => add()}
            className="hover:border-[#E7752B] hover:border-[2px]"
            style={{
              padding: 10,
              borderColor: "#E7752B",
              borderWidth: 2,
              color: "#E7752B",
              borderRadius: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <PlusOutlined />
            Add Student
          </Button>
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
