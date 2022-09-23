import React, { useState, useEffect } from "react";
//import { Form, Input, Button, Select, Modal, message } from "antd";
import {
    doc,
    setDoc,
    getDocs,
    collection,
    where,
    query,
    updateDoc,
    getDoc,
    deleteDoc
} from "firebase/firestore";
import moment from "moment";
import { firestoreDb, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal, Form, Input, Button, Select, TimePicker, Tabs, Table,message } from "antd";
import './style.css';
import AttendanceList from "../../subComponents/AttendanceList";
import uuid from "react-uuid";
import { async } from "@firebase/util";

const { Option } = Select;

function UpdateClass() {

    const uid = useSelector((state) => state.user.profile);
    const [input, setInput] = useState([]);
    const [loading, setLoading] = useState(false);
    const [courses, setcourse] = useState([]);
    const [students, setStudents] = useState([]);
    const [sectionMainData, setSectionMainData] = useState([]);
    const { state } = useLocation();
    const { data } = state;
    console.log("================================")
    console.log(data)

    const [updateClass, setUpdateClass] = useState({
        level: data.level,
        student: data.student,
        section: data.section,
        school_id: data.school_id,
        course: data.course,
    });

    const [datas, setData] = useState([]);
    const [coursesData , setCourseData] = useState([])
    const [updateComplete , setUpdateComplete] = useState([])
  //  console.log( data)
  
    const navigate = useNavigate();
  
    const days = ["Monday", "Thusday", "Wednsday", "Thursday", "Friday"];
  

    const handleScheduler = (value, i) => {
      // if (typeof value === "string") {
      //   updateCourse.schedule[i].day = value;
      // } else {
      //   const timeValue = [];
      //   value.map((item, i) => {
      //     timeValue.push(JSON.stringify(item._d));
      //   });
      //   updateCourse.schedule[i].day = timeValue;
      // }
    };
  
    const handleNewScheduler = (value, i) => {
      // if (typeof value === "string") {
      //   updateCourse.schedule[data.schedule.length + i].day = value;
      // } else {
      //   const timeValue = [];
      //   value.map((item, i) => {
      //     timeValue.push(JSON.stringify(item._d));
      //   });
      //   updateCourse.schedule[data.schedule.length + i].time = timeValue;
      // }
    };

    const handleDelete = () => {
      deleteDoc(doc(firestoreDb, "class", data.key), updateClass)
        .then((response) => {
          setLoading(false);
          message.success("Data is Deleted successfuly");
          navigate('/list-class')
  
        })
        .catch((error) => {
          message.error("Data is not Deleted, Try Again");
          console.log(error);
        });
    }
    const scheduleColumn =[
      {
        title: 'Period',
        dataIndex: 'period',
        key: 'period'
  
  
      },
      {
        title: 'Monday',
        dataIndex: 'monday',
        key: 'monday',
      },
      {
        title: 'Tuesday',
        dataIndex: 'tuesday',
        key: 'tuesday',
      },
      {
        title: 'Wednesday',
        dataIndex: 'wednesday',
        key: 'wednesday',
      },
      {
        title: 'Thursday',
        dataIndex: 'thursday',
        key: 'thursday',
      },
      {
        title: 'Friday',
        dataIndex: 'friday',
        key: 'friday',
      },
  
  
  
    ]
    const columns = [
      {
        title: 'First Name',
        dataIndex: 'first_name',
        key: 'first_name'
  
      },
      {
        title: 'Last Name',
        dataIndex: 'last_name',
        key: 'last_name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
      },
    ];
  
    const courseColumns = [
      {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
        render: (item) => {
          return (
            <div>
              {item.name}
            </div>
          );
        },
  
      },
      {
        title: 'Level',
        dataIndex: 'class',
        key: 'class',
        render: (item) => {
          return (
            <div>
              {item.level}
            </div>
          );
        },
      },
      {
        title: 'Section',
        dataIndex: 'class',
        key: 'class',
        render: (item) => {
          return (
            <div>
              {item.section}
            </div>
          );
        },
      },
    ];


    const handleUpdate = async () => {
        // const q = query(
        //     collection(firestoreDb, "class"),
        //     where("school_id", "==", updateClass.school_id), where("level", "==", updateClass.level), where("section", "==", updateClass.section),
        // );
        // const checkIsExist = (await getDocs(q)).empty;
        // if (checkIsExist) {
        setLoading(true);
        setDoc(doc(firestoreDb, "class", data.key), updateClass, { merge: true })
            .then((response) => {
                setLoading(false);
                message.success("Data is updated successfuly");
                setUpdateComplete(!updateComplete);
                navigate('/list-classes')
            })
            .catch((error) => {
                message.error("Data is not updated");
                console.log(error);
            });
        // }
        // else {
        //     message.error("This Level and Section Exist")
        // }
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
      
  const getClassData = async (ID) => {
    const docRef = doc(firestoreDb, "class", ID)
    
    var data = "";
    await getDoc(docRef).then(response => {
      data = response.data();
      data.key = response.id;
    })
    return data;
  }

  const getSubjectData = async (ID) => {
    const docRef = doc(firestoreDb, "subject", ID)
    var data = "";
    await getDoc(docRef).then(response => {
      data = response.data();
      data.key = response.id;
    })
    return data;
  }

  const getTeacherData = async (ID) => {
    const docRef = doc(firestoreDb, "teachers", ID)
    var data = "";
    await getDoc(docRef).then(response => {
      data = response.data();
      data.key = response.id;
    })
    return data;
  }
  const getData = async (data) => {

    data.class = await getClassData(data.class)
    data.subject = await getSubjectData(data.subject)

    data.teachers?.map(async (item, index) => {
      data.teachers[index] = await getTeacherData(item)
    })
    return data;
  }


    const getCourse = async (course) =>{
      var branches = await getSchool();
      const q = query(
        collection(firestoreDb, "courses"),
        where("school_id", "in", branches.branches));
      var temporary = [];
      const snap = await getDocs(q);
      console.log("dataaa     ",data.course.length)
  for (var i = 0; i < course.length; i++) {
      snap.forEach(async (doc) => {
        var datause = doc.data();
        datause.key = doc.id;
      if(datause.key == course[i]) {
        console.log("==============================")
        console.log(course[i]);
        console.log("==============================")
        getData(datause).then(response => temporary.push(response))
      }
      });
  }
      setTimeout(() => {
        setData(temporary);
      }, 2000);
    }

    const getStudents = async (level) => {
        const children = [];
        const q = query(
            collection(firestoreDb, "students"),
            where("school_id", "==", uid.school),
            where("level", "==", data.level)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            var datas = doc.data();
            children.push({
                ...datas,
                key: doc.id,
            });
        });
        setStudents(children);
    };

    const getClass = async () => {
        const children = [];
        const sectionArray = [];

        const q = query(
            collection(firestoreDb, "courses"),
            where("school_id", "==", uid.school),
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            var datas = doc.data();
            children.push({
                ...datas,
                key: doc.id,
            });
        });

        const sectionQuary = query(
            collection(firestoreDb, "sections"),
            where("school_id", "==", uid.school)
        );
        const sectionQuerySnapshot = await getDocs(sectionQuary);
        sectionQuerySnapshot.forEach((doc) => {
            var datas = doc.data();
            sectionArray.push({
                ...datas,
                key: doc.id,
            });
        });
        setcourse(children);
        setSectionMainData(sectionArray);
    };

    const getStudentID = async (ID) => {

        const docRef = doc(firestoreDb, "students", ID)
        var data = "";
        await getDoc(docRef).then(response => {
            data = response.data();
            data.key = response.id;
        })
        return data;

    }
    useEffect(() => {
        getClass();
        getStudents(data.level);
       // getCourse(data.course);
    }, []);

    const handleClass = (e) => {
        if (e.target.name === "level") {
            getStudents(e.target.value);
        }
        setUpdateClass({...updateClass, level: e.target.value});
    }

    const handleSection = (e) => {
    
      setUpdateClass({...updateClass, section: e.target.value});
  }


    const handleCoursse = (value) =>{
      value.map(async (item, i) => {
        const response = await getStudentID(item)
        value[i] = response;
    });
    setUpdateClass({ ...updateClass, student: value });

    }
    const handleStudent = (value) => {
        value.map(async (item, i) => {
            const response = await getStudentID(item)
            value[i] = response;
        });
        setUpdateClass({ ...updateClass, student: value });

    };

    return (
        <div>
        <div className="profile-header" >
          <div className="course-avater" >
            <img src="logo512.png" alt="profile" />
            <div className="profile-info">
              <h2>{data?.level}</h2>
              <h3>{data ?.section}</h3>
            </div>
          </div>
          <div className="header-extra">
            <div>
              <h3>Assigned Students</h3>
              <h4>{data ?.student.length}</h4>
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
              <Button className="btn-confirm" onClick={handleUpdate}>Edit Class</Button>
              <div className="asssign-teacher">
              <div className="assign-header">
                <h1  style={{
                  fontSize:24,
                  fontWeight: "bold",
                }} >Assigned Students</h1>
                         <Select
                                placeholder="select Students"
                                onChange={handleStudent}
                                defaultValue={data.student}
                                optionLabelProp="label"
                                mode="multiple"
                                maxTagCount={2}
                            >
                                {students.map((item, index) => (
                                    <Option value={item.key} label={item.first_name + " " + (item.last_name ? item.last_name : "")}>
                                        {item.first_name + " " + (item.last_name ? item.last_name : "")}
                                    </Option>
                                ))}
                            </Select>
                            </div>
                <Table dataSource={data.student} columns={columns} />
              
              </div>
              <div className="asssign-teacher">
              <div className="assign-header">
              <h1  style={{
                  fontSize:24,
                  fontWeight: "bold",
                }} >Assigned Courses</h1>
                <div style={{ alignSelf:'flex-end' , width:'30%'}}>
                  <text>level</text>
                 <Input  defaultValue={data.level} onChange={(e) => handleClass(e)} />
                 <text>section</text>
                 <Input  defaultValue={data.section} onChange={(e) => handleSection(e)} />
                 </div>
                    </div>    
                <Table dataSource={datas} columns={courseColumns} />
              </div>
              <div className="schedule">
              <h1  style={{
                  fontSize:24,
                  fontWeight: "bold",
                }} >Weekly Schedule</h1>
              <div className="up-card-schedule">
                <h2 >Class {updateClass.class ? updateClass.class.level + updateClass.class.section : null}</h2>
                <div className="schedule-header">
                  <div>
                    <p> Period</p>
                  </div>
                  <div>
                    <p> Start time</p>
                    <p> End time</p>
                  </div>
                </div>

                {data.schedule?.map((item, i) => (
                  <>
                    <Select
                      style={{ width: "40%" }}
                      placeholder="First Select Days"
                      onChange={(e) => handleScheduler(e, i)}
                      defaultValue={item.day}
                      in
                    >
                      {days.map((item, index) => (
                        <Option key={index} value={item} label={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                    <TimePicker.RangePicker
                      style={{ width: "60%" }}
                      format={"hh:mm"}
                      use12Hours
                      defaultValue={
                        item.time.length
                          ? [
                            moment(JSON.parse(item.time[0])),
                            moment(JSON.parse(item.time[1])),
                          ]
                          : []
                      }
                      onChange={(e) => handleScheduler(e, i)}
                    />
                  </>
                ))}
                {input.map((item, i) => (
                  <>
                    <Select
                      style={{ width: "40%" }}
                      placeholder="First Select Days"
                      onChange={(e) => handleNewScheduler(e, i)}
                    >
                      {days.map((item, index) => (
                        <Option key={index} value={item} label={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                    <TimePicker.RangePicker
                      style={{ width: "60%" }}
                      format={"hh:mm"}
                      use12Hours
                      onChange={(e) => handleNewScheduler(e, i)}
                    />
                  </>
                ))}
                <Button
                  style={{ float: "right" }}
                  onClick={() => {
                    setInput([...input, 0]);
                    // setUpdateClass({
                    //   ...updateClass,
                    //   schedule: [...updateClass.schedule, { day: "", time: [] }],
                    // });
                  }}
                >
                  Add New
                </Button>

              </div>
            </div>
            <Button className="btn-dlt" type="primary" danger onClick={handleDelete}>Delete</Button>

              </Tabs.TabPane>
          <Tabs.TabPane tab="Attendance" key="2">
            <AttendanceList />

          </Tabs.TabPane>
        </Tabs>
      </div>

    </div>
            

        // <div>
        //     {data && openUpdate ? (
        //         <Modal
        //             visible={openUpdate}
        //             title="Update Class"
        //             onCancel={handleCancel}
        //             footer={[
        //                 <Button key="back" onClick={handleCancel}>
        //                     Return
        //                 </Button>,
        //                 <Button key="submit" type='primary' loading={loading} onClick={handleUpdate}>
        //                     Update
        //                 </Button>,

        //             ]}
        //         >
        //             <Form
        //                 labelCol={{ span: 4 }}
        //                 wrapperCol={{ span: 14 }}
        //                 layout="horizontal"
        //             >
        //                 <Form.Item label="Level">
        //                     <Input disabled name="level" defaultValue={data.level} onChange={(e) => handleClass(e)} />
        //                 </Form.Item>


        //                 <Form.Item label="Section">
        //                     <Input disabled name="section" defaultValue={data.section} onChange={(e) => handleClass(e)} />
        //                 </Form.Item>
        //                 <Form.Item label="Students">
        //                     <Select
        
        //                         style={{
        //                             width: "100%",
        //                         }}
        //                         placeholder="select Students"
        //                         onChange={handleStudent}
        //                         defaultValue={data.student}
        //                         optionLabelProp="label"
        //                         mode="multiple"
        //                         maxTagCount={2}
        //                     >
        //                         {students.map((item, index) => (
        //                             <Option value={item.key} label={item.first_name + " " + (item.last_name ? item.last_name : "")}>
        //                                 {item.first_name + " " + (item.last_name ? item.last_name : "")}
        //                             </Option>
        //                         ))}
        //                     </Select>
        //                 </Form.Item>

        //             </Form>
        //         </Modal>)
        //         : null}
        // </div>
    )
}

export default UpdateClass;
