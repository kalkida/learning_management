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
import { firebaseAuth, firestoreDb } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import View from "../modals/teacher/view";
import Update from "../modals/teacher/update";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useRef } from "react";
import Highlighter from "react-highlight-words";
import { Select } from "antd";
import "../modals/courses/style.css";
import {
  InfoCircleOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
const { Option } = Select;

export default function AddTeacher() {
  const navigate = useNavigate();

  const [datas, setData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [updateComplete, setUpdateComplete] = useState(false);
  const [viewData, setViewData] = useState();
  const [coursedata, setCousreData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [sectionIdSingle, setSectionIdSingle] = useState([]);
  const [courseIdSingle, setCourseIdSingle] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

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

  const getSchool = async () => {
    const docRef = doc(firestoreDb, "schools", uid.school);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      var dataset = docSnap.data();
      return dataset;
    } else {
    }
  };

  const getTeacher = async () => {
    var branches = await getSchool();
    const q = query(
      collection(firestoreDb, "teachers"),
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

  const handleViewCancel = () => {
    setOpenView(false);
  };

  const showUpdateModal = (data) => {
    setUpdateData(data);
    setOpenUpdate(true);
  };

  const handleView = (data) => {
    navigate("/view-teacher", { state: { data } });
    // handleData(data);
    // setViewData(data);
    // setOpenView(true);
  };

  const handleUpdateCancel = () => {
    setOpenUpdate(false);
  };

  const handleUpdate = (data) => {
    // handleData(data);
    navigate("/update-teacher", { state: { data } });
  };

  const columns = [
    {
      title: "FirstName",
      dataIndex: "first_name",
      key: "first_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Course",
      key: "course",
      dataIndex: "course",
      // render: (text) => <a>{text}</a>,

      render: (value) => {
        return (
          <>
            {/* {value.map((item) => (
              <Tag color={"green"}>{item}</Tag>
            ))} */}
          </>
        );
      },
    },
    {
      title: "Phone Number",
      key: "phone",
      dataIndex: "phone",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      // render: (text) => <a>{text}</a>,
      render: (value) => {
        return (
          <>
            {/* {value?.map((item, i) => (
              <Tag color={"green"}>{item}</Tag>
            ))} */}
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
          {/* <a>View {record.name}</a> 
          <a>Update</a>  */}
        </Space>
      ),
    },
  ];

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  useEffect(() => {
    getTeacher();
  }, [updateComplete]);

  return (
    <div>
      <div className="list-header">
        <h1 style={{ fontSize: 28 }}>List Of Teachers</h1>
      </div>
      <div className="list-sub">
        <div className="list-filter">
          <Select
            defaultValue="Subject"
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="Subject">Subject</Option>

            <Option value="jack">Jack</Option>
            <Option value="disabled" disabled>
              Disabled
            </Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <Select
            style={{ width: 120 }}
            defaultValue="Class"
            onChange={handleChange}
          >
            <Option value="Grade">Grade</Option>

            <Option value="jack">Jack</Option>
            <Option value="disabled" disabled>
              Disabled
            </Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>
        <div className="course-search">
          <div>
            <Input
              style={{ width: 200 }}
              placeholder="Search"
              prefix={<UserOutlined className="site-form-item-icon" />}
              suffix={
                <Tooltip title="Extra information">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </div>
          <div>
            <Link to={"/add-teacher"}>
              <PlusOutlined className="site-form-item-icon" />
              Add teacher
            </Link>
          </div>
        </div>
      </div>

      <Table style={{ marginTop: 20 }} columns={columns} dataSource={datas} />
      {viewData ? (
        <View
          handleCancel={handleViewCancel}
          openView={openView}
          data={viewData}
          coursedata={coursedata}
          sectionData={sectionData}
        />
      ) : null}
      {updateData ? (
        <Update
          handleUpdateCancel={handleUpdateCancel}
          openUpdate={openUpdate}
          data={updateData}
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
