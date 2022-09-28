import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  TimePicker,
  Tabs,
  Table,
} from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import "./style.css";
import AttendanceList from "../../subComponents/AttendanceList";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { firebaseAuth, firestoreDb } from "../../../firebase";

const { Option } = Select;

function ViewClass() {
  const [datas, setData] = useState([]);
  const[classData , setClassData] = useState([]);
  const uid = useSelector((state) => state.user.profile);
  const { state } = useLocation();
  const { data } = state;
  const [coursesData, setCourseData] = useState([]);
  console.log(data);

  const navigate = useNavigate();

  const dataschedule = [{}];

  const scheduleColumn = [
    {
      title: "Course",
      dataIndex: "subject",
      key: "subject",
      render: (item) => {
        return <div>{item.name}</div>;
      },


    },
 
    {
      title: "Period",
      dataIndex: "schedule",
      key: "schedule",
      render: (value) => {
        moment.locale('en')
        return (
          <>
            {value?.map((item, i) => (
               <h1>
                 {/* {moment(item.time[0]).format('d MMM')} */}
                {(item.time + "    ,   ")} 
             </h1>
            ))}
          </>
        );
      },
    },
    {
      title: "Day",
      dataIndex: "schedule",
      key: "schedule",
      render: (value) => {
        return (
          <>
            {value?.map((item, i) => (
               <h1>
               {(item.day)}
             </h1>
            ))}
          </>
        );
      },
    },
 
    // {
    //   title: "Tuesday",
    //   dataIndex: "schedule",
    //   key: "schedule",
    //   render: (value) => {
    //     return (
    //       <>
    //         {value?.map((item, i) => (
    //            <h1>
    //            {item.day}
    //          </h1>
    //         ))}
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: "Wednesday",
    //   dataIndex: "schedule",
    //   key: "schedule",
    //   render: (value) => {
    //     return (
    //       <>
    //         {value?.map((item, i) => (
    //            <h1>
    //            {item.day}
    //          </h1>
    //         ))}
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: "Thursday",
    //   dataIndex: "schedule",
    //   key: "schedule",
    //   render: (value) => {
    //     return (
    //       <>
    //         {value?.map((item, i) => (
    //            <h1>
    //            {item.day}
    //          </h1>
    //         ))}
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: "Friday",
    //   dataIndex: "schedule",
    //   key: "schedule",
    //   render: (value) => {
    //     return (
    //       <>
    //         {value?.map((item, i) => (
    //            <h1>
    //            {item.day}
    //          </h1>
    //         ))}
    //       </>
    //     );
    //   },
    // },
  ];
  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
  ];

  const courseColumns = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: "Level",
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
  ];
  const getSchool = async () => {
    const docRef = doc(firestoreDb, "schools", uid.school);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      var dataset = docSnap.data();
      return dataset;
    } else {
    }
  };
  // const getStudent = async () =>{
  //   const docRef = doc(firestoreDb, "student", data.St);
  //   var data = "";
  //   await getDoc(docRef).then((response) => {
  //     data = response.data();
  //     data.key = response.id;
  //   });
  //   return data;
  // }

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
    data.class = await getClassData(data.class);
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
    console.log("dataaa     ", data.course.length);
    for (var i = 0; i < data.course.length; i++) {
      snap.forEach(async (doc) => {
        var datause = doc.data();
        datause.key = doc.id;
        if (datause.key == data.course[i]) {
          console.log("==============================");
          console.log(data.course[i]);
          console.log("==============================");
          getData(datause).then((response) => temporary.push(response));
        }
      });
    }
    setTimeout(() => {
      setData(temporary);
    }, 2000);
  };

  const handleUpdate = () => {
    navigate("/update-class", { state: { data } });
  };

  useEffect(() => {
    getCourses();
  }, []);
  return (
    <div>
      <div className="flex flex-row justify-between align-bottom border-[2px] p-10 -mt-20 rounded-md">
        <div className="flex flex-row justify-center align-middle">
          <img
            className="w-20 border-[black] border-[2px]"
            src="logo512.png"
            alt="profile"
          />
          <div className="flex flex-row mt-8 ml-2">
            <h2>{data?.level}</h2>
            <h3>{data?.section}</h3>
          </div>
        </div>
        <div className="header-extra">
          <div>
            <h3>Assigned Students</h3>
            <h4>{data?.student.length}</h4>
          </div>
          {/* <div>
            <h3>Assigned Course</h3>
            <h4>{data?.course.length}</h4>
          </div> */}
        </div>
      </div>
      <div className="tab-content">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Profile" key="1">
            <Button className="btn-confirm" onClick={handleUpdate}>
              Edit Class
            </Button>
            <div className="asssign-teacher">
              <h4 className="text-[24px] mb-10">Assigned Students</h4>
              <Table dataSource={data.student} columns={columns} />
            </div>
            <div className="asssign-teacher -mt-10">
              <h4 className="text-[24px]">Assigned Courses</h4>
              <Table dataSource={datas} columns={courseColumns} />
            </div>
            <div className="asssign-teacher">
              <h4>Weekly Schedule</h4>
              <Table dataSource={datas} columns={scheduleColumn} />
            </div>
            {/* <div className="schedule">
              <h4>Weekly Schedule</h4>
              <div className="card-schedule">
                <h2 >Class {data.class ? data.class.level + data.class.section : ""}</h2>
                <div className="schedule-header">
                  <div>
                    <p> Period</p>
                  </div>
                  <div>
                    <p> Start time</p>
                    <p> End time</p>
                  </div>
                </div>
                {data.schedule?.map((item) => (
                  <>
                    <Input value={item.day} style={{ width: "40%" }} />
                    <TimePicker.RangePicker
                      style={{ width: "60%" }}
                      use12Hours
                      format={"hh:mm"}
                      value={
                        item.time?.length
                          ? [
                            moment(JSON.parse(item?.time[0])),
                            moment(JSON.parse(item?.time[1])),
                          ]
                          : []
                      }
                    />
                  </>
                ))}

              </div>
            </div> */}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Attendance" key="2">
            <AttendanceList />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewClass;

// import React, { useEffect, useState } from "react";
// import { Modal, Form, Input, Button, Select } from "antd";

// const { Option } = Select;

// function View({ handleCancel, openView, data }) {
//   return (
//     <>
//       {data && openView ? (
//         <Modal
//           visible={openView}
//           title="View Class"
//           onCancel={handleCancel}
//           footer={[
//             <Button key="back" onClick={handleCancel}>
//               Return
//             </Button>,
//           ]}
//         >
//           <Form
//             labelCol={{ span: 4 }}
//             wrapperCol={{ span: 14 }}
//             layout="horizontal"
//           >
//             <Form.Item label="Grade">
//               <Input value={data?.level} />
//             </Form.Item>
//             <Form.Item label="Section">
//               <Input value={data?.section} />
//             </Form.Item>
//             <Form.Item label="Students">
//               <Select
//                 style={{
//                   width: "100%",
//                 }}
//                 defaultValue={data?.student}
//                 maxTagCount={2}
//                 optionLabelProp="label"
//                 mode="multiple"
//               >
//                 {data.student?.map((item, index) => (
//                   <Option
//                     key={item.key}
//                     label={
//                       item.first_name +
//                       " " +
//                       (item.last_name ? item.last_name : "")
//                     }
//                   >
//                     {item.first_name +
//                       " " +
//                       (item.last_name ? item.last_name : "")}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Form>
//         </Modal>
//       ) : null}
//     </>
//   );
// }

// export default View;
