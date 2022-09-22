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
} from "firebase/firestore";
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
  
    const dataschedule = [
      {
  
      }
    ]
  
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
                navigate('/list-class')
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

    const getStudents = async (level) => {
        const children = [];
        const q = query(
            collection(firestoreDb, "students"),
            where("school_id", "==", uid.school),
            where("level", "==", level)
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
    }, []);

    const handleClass = (e) => {
        if (e.target.name === "level") {
            getStudents(e.target.value);
        }
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
                <h4>Assigned Students</h4>
                <Table dataSource={data.student} columns={columns} />
              </div>
              <div className="asssign-teacher">
                <h4>Assigned Courses</h4>
                <Table dataSource={datas} columns={courseColumns} />
              </div>
              <div className="asssign-teacher">
                <h4>Weekly Schedule</h4>
                <Table dataSource={datas} columns={scheduleColumn} />
              </div>

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
