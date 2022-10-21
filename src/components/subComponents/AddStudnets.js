import React, { useEffect, useState } from "react";
import { Space, Table, Button } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
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
import { SearchOutlined } from "@ant-design/icons";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        <p className="font-jakarta font-[600] text-[16px] text-[#344054]">
          FirstName
        </p>
      ),
      dataIndex: "first_name",
      key: "first_name",
      render: (text) => <p>{text}</p>,
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
        return <h1>{item?.level}</h1>;
      },
    },
    {
      title: <p className="font-jakarta  font-[600]">Section</p>,
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return <h1>{item?.section}</h1>;
      },
    },
    {
      title: <p className="font-jakarta  font-[600]">Age</p>,
      dataIndex: "DOB",
      key: "DOB",
      render: (item) => {
        var today = new Date();
        var birthDate = new Date(JSON.parse(item));
        var age = today - birthDate;
        var newAge = moment(age).format("YY");

        return <h1>{newAge}</h1>;
      },
    },
    {
      title: <p className="font-jakarta  font-[600]">Gender</p>,
      dataIndex: "sex",
      key: "sex",
      render: (item) => {
        if (item == "Male") {
          return <h1>M</h1>;
        }
      },
    },

    {
      title: <p className="font-jakarta  font-[600]">Action</p>,
      key: "action",
      width: "10%",
      render: (_, record) => (
        <div className="flex flex-row justify-around">
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
        </div>
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
            onChange={handleFilterSection}
            o
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
              className="mr-3 rounded-lg"
              placeholder="Search"
              //onSearch={onSearch}
              prefix={<SearchOutlined className="site-form-item-icon" />}
            />
          </div>
          <Button
            onClick={() => add()}
            icon={<FontAwesomeIcon className="pr-2" icon={faAdd} />}
            className="hover:border-[#E7752B] hover:font-[500] !text-[#E7752B] !border-[#E7752B]"
          >
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
