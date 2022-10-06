import React, { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
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
import { Button } from "antd";
import { Link } from "react-router-dom";
import CreateSubject from "../modals/subject/createSubject";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useRef } from "react";
import Highlighter from "react-highlight-words";
import { Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "../modals/courses/style.css";

const { Option } = Select;

export default function ListCourses() {
  const navigate = useNavigate();
  const { Search } = Input;

  const [datas, setData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  const [subject, setSubject] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(true);
  const searchInput = useRef(null);
  const [tableLoading, setTableTextLoading] = useState(true);

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

  const getClassData = async (ID) => {
    const docRef = doc(firestoreDb, "class", ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };

  const getSubjectData = async (ID) => {
    const docRef = doc(firestoreDb, "subject", ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };

  const getTeacherData = async (ID) => {
    const docRef = doc(firestoreDb, "teachers", ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };

  const getData = async (data) => {
    if (data.class) {
      data.class = await getClassData(data.class);
    }
    data.subject = await getSubjectData(data.subject);

    data.teachers?.map(async (item, index) => {
      data.teachers[index] = await getTeacherData(item);
    });
    return data;
  };

  const getCourses = async () => {
    var branches = await getSchool();
    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "in", branches.branches)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach(async (doc) => {
      var data = doc.data();
      data.key = doc.id;
      getData(data).then((response) => temporary.push(response));
    });

    setTimeout(() => {
      setData(temporary);
      setTableTextLoading(false);
    }, 2000);
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

  const getsubject = async () => {
    var branches = await getSchool();
    const q = query(
      collection(firestoreDb, "subject"),
      where("school_id", "in", branches.branches)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach(async (doc) => {
      var data = doc.data();
      data.key = doc.id;
      temporary.push(data);
    });
    setSubject(temporary);
  };

  const handleView = (data) => {
    navigate("/view-course", { state: { data } });
  };

  const handleUpdate = (data) => {
    navigate("/update-course", { state: { data } });
  };

  const columns = [
    {
      title: "Course",
      dataIndex: "course_name",
      key: "course_name",
      ...getColumnSearchProps("course_name"),
      render: (text, data) => {
        console.log(data);
        return <div>{text}</div>;
      },
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      ...getColumnSearchProps("subject"),
      render: (text) => <a>{text.name}</a>,
    },
    {
      title: "Grade",
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return <div>{item.level}</div>;
      },
    },
    {
      title: "Section",
      dataIndex: "class",
      key: "class",
      render: (item) => {
        return <div>{item.section}</div>;
      },
    },

    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <div className="flex flex-row justify-around">
          <a
            className="p-2 mr-2 text-[white] hover:text-[#E7752B] rounded-sm bg-[#E7752B] hover:border-[#E7752B] hover:border-[1px] hover:bg-[white]"
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
        </div>
      ),
    },
  ];
  const handleFilterSubject = async (value) => {
    if (value) {
      var branches = await getSchool();
      const q = query(
        collection(firestoreDb, "courses"),
        where("school_id", "in", branches.branches),
        where("subject", "==", value)
      );
      var temporary = [];
      const snap = await getDocs(q);
      snap.forEach(async (doc) => {
        var data = doc.data();
        data.key = doc.id;
        getData(data).then((response) => temporary.push(response));
      });
      setTimeout(() => {
        setData(temporary);
      }, 2000);
    }
  };

  const handleFilterClass = async (value) => {
    if (value) {
      var branches = await getSchool();
      const q = query(
        collection(firestoreDb, "courses"),
        where("school_id", "in", branches.branches),
        where("class", "==", value)
      );
      var temporary = [];
      const snap = await getDocs(q);
      snap.forEach(async (doc) => {
        var data = doc.data();
        data.key = doc.id;
        getData(data).then((response) => temporary.push(response));
      });
      setTimeout(() => {
        setData(temporary);
      }, 2000);
    }
  };

  const onSearch = (value) => {
    console.log("search Value: " + value);
  };

  useEffect(() => {
    getCourses();
    getClass();
    getsubject();
  }, []);

  return (
    <div>
      <div className="list-header -mt-10">
        <h1 className="text-3xl font-bold">List Of Course</h1>
        <CreateSubject />
      </div>
      <div className="list-sub">
        <div className="list-filter">
          <Select
            className="hover:border-[#E7752B] border-[#E7752B]"
            defaultValue="Subject"
            style={{ width: 120 }}
            onChange={handleFilterSubject}
          >
            {subject?.map((item, i) => (
              <Option key={item.key} value={item.key} lable={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
          <Select
            style={{ width: 120 }}
            defaultValue="Class"
            onChange={handleFilterClass}
          >
            {classes?.map((item, i) => (
              <Option
                key={item.key}
                value={item.key}
                lable={item.level + item.section}
              >
                {item.level + item.section}
              </Option>
            ))}
          </Select>
        </div>
        <div className="course-search">
          <div>
            <Search
              placeholder="input search text"
              allowClear
              onSearch={onSearch}
              style={{
                width: 200,
              }}
            />
          </div>
          <div>
            <Link to={"/add-course"}>
              <PlusOutlined />
              Add Courses
            </Link>
          </div>
        </div>
      </div>

      <br />

      <Table
        loading={tableLoading}
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={datas}
      />
    </div>
  );
}
