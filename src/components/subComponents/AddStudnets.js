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
import { Button } from "antd";
import { firestoreDb } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useRef } from "react";
import Highlighter from "react-highlight-words";
import { Select } from "antd";
import "../modals/courses/style.css";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Search } = Input;

export default function AddStudnets() {
  const uid = useSelector((state) => state.user.profile);
  const navigate = useNavigate();
  const shcool = useSelector((state) => state.user.shcool);
  const [datas, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [classes, setClasses] = useState([]);
  const searchInput = useRef(null);
  const [updateComplete, setUpdateComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

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

  const getClassData = async (ID) => {
    const docRef = doc(firestoreDb, "class", ID);
    var response = await getDoc(docRef);
    var data = response.data();
    data.key = response.id;
    return data;
  };

  const getData = async (data) => {
    data.class = await getClassData(data.class);
    return data;
  };

  const handleFilterClass = async (value) => {
    setData("");
    if (value) {
      var branches = await getSchool();
      const q = query(
        collection(firestoreDb, "students"),
        where("level", "==", value)
      );
      var temporary = [];
      const snap = await getDocs(q);
      snap.forEach(async (doc) => {
        var data = doc.data();
        data.key = doc.id;
        temporary.push(data);
        getData(data).then((response) => temporary.push(response));
      });
      setData(temporary);
    }
  };

  const handleFilterSection = async (value) => {
    if (value) {
      var branches = await getSchool();
      const q = query(
        collection(firestoreDb, "students"),
        where("school_id", "in", branches.branches),
        where("section", "array-contains", value)
      );
      var temporary = [];
      const snap = await getDocs(q);
      snap.forEach(async (doc) => {
        var data = doc.data();
        data.key = doc.id;
        temporary.push(data);
        getData(data).then((response) => temporary.push(response));
      });
      setData(temporary);
    }
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
      title: "Phone Number",
      key: "phone",
      dataIndex: "phone",
      render: (value) => {
        return (
          <>
            {value?.map((item, i) => (
              <h1>{item}</h1>
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
        <h1 style={{ fontSize: 28 }}>List Of Students</h1>
      </div>
      <div className="list-sub">
        <div className="list-filter">
          <Select
            placeholder="Grade"
            style={{ width: 120 }}
            onChange={handleFilterClass}
          >
            {classes?.map((item, i) => (
              <Option key={item.key} value={item.key} lable={item.level}>
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
          <div>
            <Link to={"/add-student"}>
              <PlusOutlined className="site-form-item-icon" />
              Add Students
            </Link>
          </div>
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
