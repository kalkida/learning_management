import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { firestoreDb } from "../../firebase";
import { Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { Select } from "antd";
import "../modals/courses/style.css";

const { Option } = Select;

export default function ListCourses() {
  const navigate = useNavigate();
  const { Search } = Input;
  const [datas, setData] = useState([]);
  const [unfiltered, setunfiltered] = useState([]);
  const school = useSelector((state) => state.user.profile.school);
  const [subject, setSubject] = useState([]);
  const [classes, setClasses] = useState([]);
  const [tableLoading, setTableTextLoading] = useState(true);

  const edit = () => {
    navigate("/add-course");
  };

  const getClassData = async (ID) => {
    const docRef = doc(firestoreDb, "schools", `${school}/class`, ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };

  const getTeacherData = async (ID) => {
    const docRef = doc(firestoreDb, "schools", `${school}/teachers`, ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      if (response.exists()) {
        data = response.data();
        data.key = response.id;
      }
    });
    return data;
  };

  const getData = async (data) => {
    if (data.class) {
      data.class = await getClassData(data.class);
    }
    data.teachers?.map(async (item, index) => {
      data.teachers[index] = await getTeacherData(item);
    });
    return data;
  };

  const getCourses = async () => {
    const q = query(collection(firestoreDb, "schools", `${school}/courses`));
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach(async (doc) => {
      var data = doc.data();
      data.key = doc.id;
      getData(data).then((response) => temporary.push(response));
    });

    setTimeout(() => {
      setData(temporary);
      setunfiltered(temporary);
      fetchSubjects(temporary);
      setTableTextLoading(false);
    }, 2000);
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

  const handleView = (data) => {
    navigate("/view-course", { state: { data } });
  };

  const columns = [
    {
      title: <p className="font-jakarta text-[#344054] font-[600]">Course</p>,
      dataIndex: "course_name",
      key: "course_name",
      render: (text, data) => {
        return (
          <p className="text-[14px] font-jakarta text-[#344054]">{text}</p>
        );
      },
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (text) => <a className="text-[#344054]"> {text}</a>,
    },
    {
      title: "Grade",
      dataIndex: "class",
      key: "class",
      render: (item, data) => {
        if (item.level) {
          return <div className="text-[#344054]">{item.level}</div>;
        } else if (data.grade) {
          return <div className="text-[#344054] font-[600]">{data.grade}</div>;
        } else {
          return <div className="text-[#D0D5DD] font-light">No Data</div>;
        }
      },
    },
    {
      title: "Section",
      dataIndex: "class",
      key: "class",
      render: (item, data) => {
        if (item.level) {
          return <div className="text-[#344054]">{item.section}</div>;
        } else if (data.grade) {
          return (
            <div className="text-[#344054] font-[600] capitalize">
              {data.section}
            </div>
          );
        } else {
          return <div className="text-[#D0D5DD] font-light ">No Data</div>;
        }
      },
    },
  ];
  const handleFilterSubject = async (value) => {
    if (value) {
      var dataer = unfiltered.filter((data) => {
        return data.subject === value;
      });
      setData(dataer);
    }
  };

  const handleFilterClass = async (value) => {
    if (value) {
      var dataer = unfiltered.filter((data) => {
        return data.grade + data.section == value;
      });
      setData(dataer);
    }
  };

  const onSearch = (value) => {
    if (value) {
      var dataer = unfiltered.filter((data) => {
        return data.course_name.includes(value.target.value);
      });
      setData(dataer);
    } else {
      setData(unfiltered);
    }
  };
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
    if (temporary.length == 0) {
      getCourses();
      // message.warning("No course found");
    }
  };

  useEffect(() => {
    getCourses();
    getClass();
  }, []);

  return (
    <div className="bg-[#F9FAFB] h-[100vh] -mt-14">
      <div className="list-header mb-10">
        <h1 className="text-2xl font-[600] font-jakarta">List Of Course</h1>
      </div>
      <div className="flex md:flex-row flex-col  md:justify-between">
        <div className="flex md:flex-row flex-col  w-[30%]">
          <Select
            className="hover:border-[#DC5FC9] border-[#EAECF0] border-[2px] bg-[white] !mr-4"
            placeholder="Subject"
            bordered={false}
            style={{
              width: 141,
              borderRadius: "8px",
              borderWidth: 2,
            }}
            onChange={handleFilterSubject}
          >
            {subject.map((item, i) => (
              <Option key={item} value={item} lable={item}>
                {item}
              </Option>
            ))}
          </Select>
          <Select
            className="hover:border-[#DC5FC9] border-[#EAECF0] border-[2px] bg-[white] "
            style={{
              width: 141,
              borderRadius: "8px",
              borderWidth: 2,
            }}
            placeholder="Class"
            bordered={false}
            onChange={handleFilterClass}
          >
            {classes?.map((item, i) => (
              <Option
                key={item.key}
                value={item.level + item.section}
                lable={item.level + item.section}
              >
                {item.level + item.section}
              </Option>
            ))}
          </Select>
        </div>
        <div className="flex md:flex-row flex-col">
          <div>
            <Input
              style={{
                width: 200,
                borderRadius: "8px",
                borderWidth: 2,
              }}
              className="mr-3 rounded-lg"
              placeholder="Search"
              onChange={onSearch}
              prefix={<SearchOutlined className="site-form-item-icon" />}
            />
          </div>
          {/* <CreateSubject /> */}

          <Button
            style={{
              borderRadius: "8px",
              borderWidth: 1,
            }}
            className=" !text-[#DC5FC9] !border-[#DC5FC9] ml-0 round"
            icon={<FontAwesomeIcon className="pr-2" icon={faAdd} />}
            onClick={() => edit()}
          >
            Add Course
          </Button>
        </div>
      </div>

      <br />

      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => handleView(record), // click row
          };
        }}
        pagination={{ position: ["bottomCenter"] }}
        loading={tableLoading}
        columns={columns}
        dataSource={datas}
      />
    </div>
  );
}
