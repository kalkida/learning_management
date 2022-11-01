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
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useRef } from "react";
import Highlighter from "react-highlight-words";
import { Select } from "antd";
import "../modals/courses/style.css";
import { removeSingleClassToTeacher, fetchSubject } from "../modals/funcs";
import { PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
const { Option } = Select;
const { Search } = Input;

export default function AddTeacher() {
  const navigate = useNavigate();

  const [datas, setData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [course, setCourse] = useState([]);
  const [classes, setClasses] = useState([]);
  const [tableLoading, setTableTextLoading] = useState(true);
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

  const getClassData = async (ID, teach) => {
    const docRef = doc(firestoreDb, "class", ID);

    var data = "";
    const response = await getDoc(docRef);
    if (response.exists()) {
      data = response.data();
      data.key = response.id;
    } else {
      console.log("none exist data", data);
      console.log("data  ", ID, "and  ", teach);
      //removeSingleClassToTeacher(ID, teach);
    }

    return data;
  };

  const getCourseData = async (ID) => {
    const docRef = doc(firestoreDb, "courses", ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });

    return data;
  };

  const getData = async (data, teach) => {
    if (data.class) {
      data.class?.map(async (item, index) => {
        data.class[index] = await getClassData(item, teach);
      });

      data.course?.map(async (item, index) => {
        var course = await getCourseData(item);
        var subject = await fetchSubject(course.subject);
        course.subject = subject;
        data.course[index] = course;

        console.log("courses  :", data.course);
      });

      return data;
    } else {
      return data;
    }
  };

  const getTeacher = async () => {
    const q = query(
      collection(firestoreDb, "teachers"),
      where("school_id", "==", uid.school)
    );
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();
      data.key = doc.id;
      getData(data, doc.id).then((response) => {
        temporary.push(response);
      });
    });
    setTimeout(() => {
      setData(temporary);
      setTableTextLoading(false);
    }, 2000);
  };

  const handleView = (data) => {
    navigate("/view-teacher", { state: { data } });
  };

  const handleUpdate = (data) => {
    console.log(data);
    navigate("/update-teacher", { state: { data } });
  };

  const getClass = async () => {
    const q = query(
      collection(firestoreDb, "class"),
      where("school_id", "==", uid.school)
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

  const getCourse = async () => {
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
      data.subject = await fetchSubject(data.subject);
      temporary.push(data);
    });
    setCourse(temporary);
  };

  const handleFilterSubject = async (value) => {
    if (value) {
      var branches = await getSchool();
      const q = query(
        collection(firestoreDb, "teachers"),
        where("school_id", "in", branches.branches),
        where("course", "array-contains", value)
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
        collection(firestoreDb, "teachers"),
        where("school_id", "in", branches.branches),
        where("class", "array-contains", value)
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

  const edit = () => {
    navigate("/add-teacher");
  };

  const columns = [
    {
      title: (
        <p className="font-jakarta text-[#344054] font-[600]">Full Name </p>
      ),
      dataIndex: "first_name",
      key: "first_name",
      width: "20%",
      render: (text, data) => {
        return (
          <p className="text-[14px] font-jakarta text-[#344054]">
            {data.first_name} {data.last_name}
          </p>
        );
      },
    },
    {
      title: <p className="font-jakarta text-[#344054] font-[600]">Subject </p>,
      dataIndex: "last_name",
      key: "last_name",
      width: "20%",

      render: (text, data) => {
        return (
          <div>
            {data.course.map((item) => (
              <p className="text-[14px] font-jakarta text-[#344054]">
                {item?.subject?.name}
              </p>
            ))}
          </div>
        );
      },
    },
    {
      title: <p className="font-jakarta text-[#344054] font-[600]">Class </p>,
      dataIndex: "class",
      key: "class",
      width: "20%",

      render: (value) => {
        if (value?.length) {
          return (
            <>
              {value?.map((item, i) => (
                <>
                  {" "}
                  {item ? (
                    <div className="text-[#344054]">
                      {item.level + item.section}
                    </div>
                  ) : null}
                </>
              ))}
            </>
          );
        } else {
          return <div className="text-[#D0D5DD] font-light">No Data</div>;
        }
      },
    },
    {
      title: <p className="font-jakarta  font-[600]">Sex</p>,
      dataIndex: "sex",
      key: "sex",
      width: "20%",

      render: (item) => {
        if (item == "Male") {
          return <h1>M</h1>;
        } else {
          return <h1>F</h1>;
        }
      },
    },
    {
      title: <p className="font-jakarta text-[#344054] font-[600]">Contact </p>,
      key: "phone",
      dataIndex: "phone",
      width: "20%",

      render: (text) => {
        if (text) {
          return <a>{text}</a>;
        } else {
          return <div className="text-[#D0D5DD] font-light">No Data</div>;
        }
      },
    },
  ];

  useEffect(() => {
    getTeacher();
    getClass();
    getCourse();
  }, []);

  return (
    <div className="bg-[#F9FAFB] min-h-[100vh] -mt-14">
      <div className="list-header mb-10">
        <h1 className="text-2xl font-[600] font-jakarta">List Of Teachers</h1>
      </div>
      <div className="list-sub">
        <div className="flex flex-row w-[50%]">
          <Select
            className="hover:border-[#E7752B] border-[#EAECF0] border-[2px] bg-[white] !mr-5 !rounded-[6px]"
            placeholder="Subject"
            bordered={false}
            style={{ width: 161 }}
            onChange={handleFilterSubject}
          >
            {course?.map((item, i) => (
              <Option key={item.key} value={item.key} lable={item.course_name}>
                {item.subject.name}
              </Option>
            ))}
          </Select>
          <Select
            className="hover:border-[#E7752B] border-[#EAECF0] border-[2px] bg-[white] !mr-5 !rounded-[6px] "
            style={{ width: 161 }}
            placeholder="Grade"
            bordered={false}
            onChange={handleFilterClass}
          >
            {classes?.map((item, i) => (
              <Option
                key={item.key}
                value={item.key}
                lable={item.level + item.section}
              >
                {item.level}
              </Option>
            ))}
          </Select>
          <Select
            className="hover:border-[#E7752B] border-[#EAECF0] border-[2px] bg-[white] !rounded-[6px]"
            style={{ width: 161 }}
            placeholder="Section"
            bordered={false}
            onChange={handleFilterClass}
          >
            {classes?.map((item, i) => (
              <Option
                key={item.key}
                value={item.key}
                lable={item.level + item.section}
              >
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
          {/* add padding  */}
          <Button
            onClick={() => edit()}
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
            Add Teacher
          </Button>
          {/* <Link to={"/add-teacher"}>
              <PlusOutlined />
              Add teacher
            </Link> */}
        </div>
      </div>

      <br />

      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => handleView(record), // click row
          };
        }}
        loading={tableLoading}
        columns={columns}
        dataSource={datas}
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  );
}
