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
import { Button, message } from "antd";
import { firestoreDb } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

import { Select } from "antd";
import "../modals/courses/style.css";
import { fetchSubject } from "../modals/funcs";
import { PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
const { Search } = Input;

export default function AddTeacher() {
  const navigate = useNavigate();

  const [datas, setData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  const school = useSelector((state) => state.user.profile.school);
  const [course, setCourse] = useState([]);
  const [subjects, setSubject] = useState([]);
  const [grade, setGrade] = useState([]);
  const [seciton, setSection] = useState([]);
  const [classes, setClasses] = useState([]);
  const [tableLoading, setTableTextLoading] = useState(true);
  const LEVEL = [
    "1",
    " 2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
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

  const getClassData = async (ID, teach) => {
    const docRef = doc(firestoreDb, "schools", `${school}/class`, ID);

    var data = "";
    const response = await getDoc(docRef);
    if (response.exists()) {
      data = response.data();
      data.key = response.id;
    } else {
      console.log("none exist data", data);
      console.log("data  ", ID, "and  ", teach);
    }

    return data;
  };

  const getCourseData = async (ID) => {
    const docRef = doc(firestoreDb, "schools", `${school}/courses`, ID);
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
        data.course[index] = course;

        console.log("courses  :", data.course);
      });

      return data;
    } else {
      return data;
    }
  };

  const getTeacher = async () => {
    const q = query(collection(firestoreDb, "schools", `${school}/teachers`));
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

  const getCourse = async () => {
    const q = query(collection(firestoreDb, "schools", `${school}/courses`));
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();
      data.key = doc.id;
      temporary.push(data);
    });
    setCourse(temporary);
    fetchSubjects(temporary);
  };

  const handleFilterSubject = async (value) => {
    var temporary = [];
    if (value) {
      datas.map((item) => {
        var exists = false;
        item.course.map((item) => {
          if (item.subject == value) {
            exists = true;
          }
        });
        if (exists) {
          temporary.push(item);
        }
      });
      setData(temporary);
      if (temporary.length == 0) {
        getTeacher();
        message.warning("No Teacher found");
      }
    }
  };

  const handleFilterClass = async (value) => {
    if (value) {
      const q = query(
        collection(firestoreDb, `${school}/teachers`),
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
            {data?.first_name} {data?.last_name}
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
        if (data?.course.length > 0) {
          return (
            <div className="flex flex-row">
              {data.course.slice(0, 2).map((item) => (
                <p className="text-[14px] font-jakarta text-[#344054]">
                  {item?.subject},
                </p>
              ))}{" "}
              ...
            </div>
          );
        } else {
          return (
            <div>
              <p className="text-[14px] font-jakarta text-[#7d8594]">No Data</p>
            </div>
          );
        }
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
            <div className="flex flex-row">
              {value?.slice(0, 3).map((item, i) => (
                <>
                  {" "}
                  {item ? (
                    <div className="text-[#344054]">
                      {item.level + item.section},
                    </div>
                  ) : null}
                </>
              ))}
              {value.length > 3 ? "..." : ""}
            </div>
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
          return <p>{text}</p>;
        } else {
          return <div className="text-[#D0D5DD] font-light">No Data</div>;
        }
      },
    },
  ];
  const fetchSubjects = async (da) => {
    var temporary = [];
    if (da) {
      da.map((item) => {
        if (temporary.includes(item.subject) == false) {
          temporary.push(item.subject);
        }
      });
      setSubject(temporary);
    }
  };

  const fetchGrade = async (da) => {
    var temporary = [];
    if (da) {
      da.map((item) => {
        if (temporary.includes(item.subject) == false) {
          temporary.push(item.subject);
        }
      });
      setSubject(temporary);
      console.log("data", temporary);
    }
  };

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
            className="hover:border-[#DC5FC9] border-[#EAECF0] border-[2px] bg-[white] !mr-5 !rounded-[6px]"
            placeholder="Subject"
            bordered={false}
            style={{ width: 161 }}
            onChange={handleFilterSubject}
          >
            {subjects?.map((item, i) => (
              <Option key={item} value={item} lable={item}>
                {item}
              </Option>
            ))}
          </Select>
          <Select
            className="hover:border-[#DC5FC9] border-[#EAECF0] border-[2px] bg-[white] !mr-5 !rounded-[6px] "
            style={{ width: 161 }}
            placeholder="Grade"
            bordered={false}
            onChange={handleFilterClass}
          >
            {LEVEL.map((item, i) => (
              <Option key={item} value={item} lable={item}>
                {item}
              </Option>
            ))}
          </Select>
          <Select
            className="hover:border-[#DC5FC9] border-[#EAECF0] border-[2px] bg-[white] !rounded-[6px]"
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
            className="hover:border-[#DC5FC9] hover:border-[2px]"
            style={{
              padding: 10,
              borderColor: "#DC5FC9",
              borderWidth: 2,
              color: "#DC5FC9",
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
