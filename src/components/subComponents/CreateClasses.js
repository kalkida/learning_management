import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Form, Input, Button, Select, DatePicker, message,TimePicker ,Table  ,Tag} from "antd";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import { firestoreDb, storage } from "../../firebase";
import uuid from "react-uuid";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import '../modals/courses/style.css';
const { Option } = Select;

const CreateClasses = () => {

  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.profile);
  const [input, setInput] = useState([]);
  const [students, setStudents] = useState([]);
  const days = ["Monday", "Thusday", "Wednsday", "Thursday", "Friday"];
  const [coursesData ,setCourseData]= useState([]);
  const [selectedRowKeys , setSelectedRowKeys] = useState([]);
  const [newClass, setNewClass] = useState({
    level: "",
    student: [],
    course:[],
    section: "",
    school_id: uid.school,
  });

  const columns = [
    {
      title: 'Courses _name',
      dataIndex: 'course_name',
      key: 'course_name'


    },
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

  const getStudents = async (level) => {

    const children = [];
    const q = query(
      collection(firestoreDb, "students"),
      where("school_id", "==", uid.school), where("level", "==", level)
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

  const handleScheduler = (value, i) => {
    // if (typeof value === "string") {
    //   updateCourse.schedule[i].day = value;
    // } else {
    //   const timeValue = [];
    //   value.map((item, i) => {
    //     timeValue.push(JSON.stringify(item._d));
    //   });
    //   updateCourse.schedule[i].day = value;
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
    // deleteDoc(doc(firestoreDb, "courses", data.key), updateCourse)
    //   .then((response) => {
    //     setLoading(false);
    //     message.success("Data is Deleted successfuly");
    //     navigate('/list-course')

    //   })
    //   .catch((error) => {
    //     message.error("Data is not Deleted, Try Again");
    //     console.log(error);
    //   });
  }

//  const selectRow = (record) => {
//     const selectedRowKeys = [...selectedRowKeys];
//     if (selectedRowKeys.indexOf(record.key) >= 0) {
//       selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
//     } else {
//       selectedRowKeys.push(record.key);
//     }
//     setSelectedRowKeys({ selectedRowKeys });
//   }
//  const  onSelectedRowKeysChange = (selectedRowKeys) => {
//   setNewClass({...newClass, course : selectedRowKeys });
//   }

const onSelectChange = (newSelectedRowKeys) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  setSelectedRowKeys(newSelectedRowKeys);
  setNewClass({...newClass ,course : newSelectedRowKeys});
};
const rowSelection = {
  selectedRowKeys,
  onChange: onSelectChange,
  selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
          key: 'odd',
          text: 'Select Odd Row',
          onSelect: (changableRowKeys) => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                  if (index % 2 !== 0) {
                      return false;
                  }

                  return true;
              });
              setSelectedRowKeys(newSelectedRowKeys);
          },
      },
      {
          key: 'even',
          text: 'Select Even Row',
          onSelect: (changableRowKeys) => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                  if (index % 2 !== 0) {
                      return true;
                  }

                  return false;
              });
              setSelectedRowKeys(newSelectedRowKeys);
          },
      },
  ],
};

  // const rowSelection = {
  //   selectedRowKeys: selectRow.map((row) => row.id),
  //   onSelectAll: (selected, selectedRows) => {
  //     setSelectedRowKeys(selectedRows);
  //   },
  // };

  const createNewClass = async () => {
    const q = query(
      collection(firestoreDb, "class"),
      where("school_id", "==", uid.school), where("level", "==", newClass.level), where("section", "==", newClass.section),
    );
    const checkIsExist = (await getDocs(q)).empty;
    if (checkIsExist) {
      setDoc(doc(firestoreDb, "class", uuid()), newClass)
        .then(response => {
          message.success("Class Created");
          navigate("/list-Classes");
        })
        .catch(error => console.log(error));

    }
    else {
      message.error("This Class already exist");
    }
  };


  const getData = async (data) => {

    data.class = await getClassData(data.class)
    data.subject = await getSubjectData(data.subject)

    return data;
  }

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

  const getCourse = async () => {
    const coursess = []
    const q = query(
      collection(firestoreDb, "courses"),
      where("school_id", "==", uid.school)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var datas = doc.data();
     
      getData(datas).then(response => coursess.push({...response, key:doc.id }))
      // coursess.push({
      //   ...datas,
      //   key: doc.id,
      // });
    });
   // getData(data).then(response => temporary.push(response))
    //setCourseData(coursess);
    setTimeout(() => {
      setCourseData(coursess);
    }, 2000);
  };


  const onCancle = () => {
    navigate("/list-Classes")
  }

    


  const handleClass = (e) => {
    if (e.target.name === "level") {

      getStudents(e.target.value);
    }
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
  };

  const handleStudent = (value) => {

    value.map((item, i) => {
      value[i] = JSON.parse(item);
    })
    setNewClass({ ...newClass, student: value });
  }

  const handleCourses = (value) => {
    setNewClass({ ...newClass, course: value });
      };

  useEffect(() => {
    getCourse();
}, []);

  return (
    <>
    <div>
    <div className="create-header">
          <h1>Add Classes</h1>
          <Button onClick={() => createNewClass()}>Submit</Button>
        </div>
     <div style={{
         padding:15,
         backgroundColor:'#FFFFFF',
         borderRadius:5,
         borderWidth:2
     }}>
              <div className="course-content">
                {/* <div className="course-category"> */}
                  <div >
                    <div>
                      <span>Class</span>
                    <Input name="level" type={"number"} onChange={(e) => handleClass(e)} />
                    </div>
                    <div>
                    <span>Student</span>
                    <Select
                      style={{
                        width: "100%",
                      }}

                      placeholder="select Student"
                      onChange={handleStudent}
                      optionLabelProp="label"
                      mode="multiple"
                    >
                      {students.map((item, index) => (
                        <Option key={item.key} value={JSON.stringify(item)} label={item.first_name + " " + (item.last_name ? item.last_name : "")}>
                        {item.first_name + " " + (item.last_name ? item.last_name : "")}
                      </Option>
                      ))}
                    </Select>
                  {/* </div> */}
                  </div>
                </div>
                <div style={{
                  marginLeft: "20px",
                }}>
                      <span>Section</span>
                      <Input name="section" onChange={(e) => handleClass(e)} />
                    </div>
                
              </div>
           </div>
           <div className="list-header">
      <h1 style={{ fontSize: 28 , marginTop:20 }}>Add Courses</h1>
    </div>
           <div 
    style={{
      backgroundColor:'#F9FAFB',
      borderRadius:8,
      borderWidth:1,
      top:95 ,
      marginTop:20,
    }}
    >
<div  style={{
  padding:5
}}>
          {/* <Select
            style={{
              width: "100%",
            }}
            placeholder="Select all courses"
            onChange={handleCourses}
            optionLabelProp="label"
            mode="multiple"
          
          >
            {coursesData.map((item, index) => (
              <Option key={item.key} value={item.course_name} label={item.course_name}>
                {item.course_name}
              </Option>
              
            ))}
          </Select> */}
          <div >
          <Table rowSelection={rowSelection} dataSource={coursesData} columns={columns} />
          {/* <Table
           rowSelection={rowSelection}
              columns={columns}
              dataSource={coursesData}
              onRow={(record) => ({
              onClick: () => {
             selectRow(record);
          },
        })}
      /> */}
            </div>   
      </div>
      </div>
      <div style={{
        marginTop: '20px',
      }}>

      </div>
      <div className="schedule">
              <div className="up-card-schedule">
              <h1 style={{ fontSize:24 , fontWeight:'bold' , padding:10}}> Schedule</h1>
    {/* <h2 >Class {updateCourse.class ? updateCourse.class.level + updateCourse.class.section : null}</h2> */}
                <div className="schedule-header">
                  <div>
                    <p> Period</p>
                  </div>
                  <div>
                    <p> Start time</p>
                    <p> End time</p>
                  </div>
                </div>

                {/* {days?.map((item, i) => (
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
                ))} */}
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
                    // setUpdateCourse({
                    //   ...updateCourse,
                    //   schedule: [...updateCourse.schedule, { day: "", time: [] }],
                    // });
                  }}
                >
                  Add New
                </Button>

              </div>
            </div>
          
            <Button className="btn-dlt" type="primary" danger onClick={handleDelete}>Delete</Button>
            
      {/* <div style={{ flex: 1, flexDirection: "row", marginLeft: 190 }}>
        <Button onClick={() => createNewClass()} type="primary">Save</Button>
        <Button onClick={onCancle}>Cancle</Button>
      </div> */}
      </div>
    </>
  );
};

export default CreateClasses;
