import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Modal,
  Form,
  Select,
  Input,
  DatePicker,
  Row,
  Col,
  message,
  Tabs,
  Table,
} from "antd";
import moment from "moment";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firestoreDb, storage } from "../../../firebase";
import "./style.css";
import { getIdToken } from "firebase/auth";
import { useSelector } from "react-redux";

const { Option } = Select;
const { Search } = Input;
const gender = ["Male", "Female", "Other"];

function UpdateStudents() {
  const dateFormat = "YYYY/MM/DD";
  const valueRef = useRef();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [phone, setPhones] = useState("");
  const [classOption, setClassOption] = useState([]);
  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState("");

  const [classData, setClassData] = useState([]);
  const { state } = useLocation();
  const { data } = state;
  const [allPhone, setAllPhone] = useState(data.phone);
  const [input, setInputs] = useState(data.phone);
  const [updateStudent, setUpdateStudent] = useState({
    DOB: data.DOB,
    avater: data.avater,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    sex: data.sex,
    section: data.section,
    level: data.level,
    phone: data.phone,
    school_id: data.school_id,
  });

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };


    const dateFormat = 'YYYY/MM/DD';
    const valueRef = useRef();
    
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [phone, setPhones] = useState("");
    const [classOption, setClassOption] = useState([]);
    const [percent, setPercent] = useState(0);
    const [file, setFile] = useState("");
    
     const [classData, setClassData] = useState([]);
    const { state } = useLocation();
    const { data } = state;
    const [allPhone, setAllPhone] = useState(data.phone);
    const [input, setInputs] = useState([0]);
    const [updateStudent, setUpdateStudent] = useState({
        DOB: data.DOB,
        avater: data.avater,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        sex: data.sex,
        section: data.section,
        level: data.level,
        phone: data.phone,
        school_id: data.school_id,
    })

    const handleChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleUpdate = () => {

        setLoading(true);
        if (!file) {
            setDoc(doc(firestoreDb, "students", data.key), updateStudent, { merge: true }).then(
                response => {
                    setLoading(false)
                    message.success("Data is updated successfuly")
                    navigate('/list-student')
                })
                .catch(error => {
                    message.error("Data is not updated")
                    console.log(error)
                })
                  .then((response) => {
                    setLoading(false);
                    message.success("Data is updated successfuly");
                    navigate("/list-student");
                  })
                  .catch((error) => {
                    message.error("Data is not updated");
                    console.log(error);
                  });
              }
            }
          });
        }
      );
    }
  };

  const getClassID = async (ID) => {
    const docRef = doc(firestoreDb, "class", ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };

  const handleGender = (value) => {
    setUpdateStudent({ ...updateStudent, sex: value });
  };

  const handleCourse = async (value) => {
    const classData = await getClassID(value);
    setUpdateStudent({ ...updateStudent, class: classData });
  };
  const handleDob = (value) => {
    setUpdateStudent({ ...updateStudent, DOB: JSON.stringify(value) });
  };

  const onRemove = () => {
    setFile("");
  };
  // const setAge = (value) => {
  //     setUpdateStudent({ ...updateStudent, DOB: JSON.stringify(value._d) });
  // };

  const setPhone = (e, index) => {
    console.log(index);
    console.log("setPhone", e.target.value);
    allPhone[index] = e.target.value;
    console.log("setPhone", allPhone);
    setUpdateStudent({ ...updateStudent, phone: allPhone });
  };

  const onChange = (e) => {
    setUpdateStudent({ ...updateStudent, [e.target.name]: e.target.value });
  };

  const getClass = async () => {
    const children = [];

    const q = query(
      collection(firestoreDb, "class"),
      where("school_id", "==", data.school_id)
    );
    const Snapshot = await getDocs(q);
    Snapshot.forEach((doc) => {
      var datas = doc.data();
      children.push({
        ...datas,
        key: doc.id,
      });
    });
    setClassOption(children);
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

  const handlelevel = (value) => {
    setUpdateStudent({ ...updateStudent, level: value });
  };

  const handlesection = (value) => {
    setUpdateStudent({ ...updateStudent, section: value });
  };

  //   const getData = async (data) => {
  //     data.class = await getClassData(data.class);
  //     data.subject = await getSubjectData(data.subject);
  //     return data;
  // }

  function HandleBrowseClick() {
    var fileinput = document.getElementById("browse");
    fileinput.click();
  }

  function handleFile(event) {
    var fileinput = document.getElementById("browse");
    var textinput = document.getElementById("filename");
    textinput.value = fileinput.value;
    setFile(event.target.files[0]);
  }

  useEffect(() => {
    getClass();
  }, []);

  return (
    <>
      <div>
        <div className="profile-header">
          <div className="teacher-avater">
            <img src={data.avater ? data.avater : "img-5.jpg"} alt="profile" />
            <div className="profile-info">
              <h2>{data.first_name + " " + data.last_name}</h2>
              <h3>Contact</h3>
            </div>
          </div>
          <div className="header-extra">
            <div>
              <h3>Class</h3>
              <h4>{data.level.level + data.level.section}</h4>
              {/* 
            <h4>{data.level?.map((item, i) => item.level + item.section + ",")}</h4> */}
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
                Confirm Profile
              </Button>
              <div className="add-header">
                <h1>Student Profile</h1>
              </div>
              <div className="add-teacher">
                {/* <div className="avater-img">
            <div>
              <h2>Profile Picture</h2>
              <img src={file ? URL.createObjectURL(file) : "img-5.jpg"} />
            </div>
            <div className="file-content">
              <span>This will be displayed to you when you view this profile</span>

              <div className="img-btn">
                <button>
                  <input type="file" id="browse" name="files" style={{ display: "none" }} onChange={handleFile} accept="/image/*" />
                  <input type="hidden" id="filename" readonly="true" />
                  <input type="button" value="Add Photo" id="fakeBrowse" onClick={HandleBrowseClick} />
                </button>
                <button onClick={onRemove}>Remove</button>
              </div>
            </div>
          </div> */}

                <div className="add-form">
                  <div className="col">
                    <div style={{ marginTop: "30%" }}>
                      <div className="avatar-img">
                        <h2>Student Picture</h2>
                        <img
                          src={file ? URL.createObjectURL(file) : "img-5.jpg"}
                        />
                      </div>
                      <div>
                        <div className="file-content">
                          {/* <span>This will be displayed to you when you view this profile</span> */}
                          <div className="img-btn">
                            <button>
                              <input
                                type="file"
                                id="browse"
                                name="files"
                                style={{ display: "none" }}
                                onChange={handleFile}
                                accept="/image/*"
                              />
                              <input
                                type="hidden"
                                id="filename"
                                readonly="true"
                              />
                              <input
                                type="button"
                                value="Add Photo"
                                id="fakeBrowse"
                                onClick={HandleBrowseClick}
                              />
                            </button>
                            <button onClick={onRemove}>Remove</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div>
                      <label>First Name</label>
                      <Input
                        defaultValue={updateStudent.first_name}
                        name="first_name"
                        onChange={(e) => onChange(e)}
                      />
                    </div>

                    <div>
                      <label>Date of Birth</label>
                      <DatePicker
                        style={{ width: "100%" }}
                        onChange={handleDob}
                        defaultValue={
                          updateStudent.DOB
                            ? moment(JSON.parse(updateStudent.DOB))
                            : ""
                        }
                      />
                    </div>
                    <div>
                      <label>Last Name</label>
                      <Input
                        defaultValue={updateStudent.last_name}
                        name="last_name"
                        onChange={(e) => onChange(e)}
                      />
                    </div>
                    <div>
                      <label>Sex </label>
                      <Select
                        placeholder="Select Gender"
                        onChange={handleGender}
                        defaultValue={updateStudent.sex}
                        optionLabelProp="label"
                        style={{
                          width: "100%",
                        }}
                      >
                        {gender.map((item, index) => (
                          <Option key={item.index} value={item} label={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="col">
                    <div
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        display: "flex",
                      }}
                    >
                      <div style={{ marginRight: "5%" }}>
                        <label>Grade</label>
                        <Select
                          placeholder="Select Grade"
                          defaultValue={updateStudent.level}
                          onChange={handlelevel}
                          optionLabelProp="label"
                          style={{
                            width: "100%",
                          }}
                        >
                          {classOption.map((item, index) => (
                            <Option
                              key={item.key}
                              value={item.key}
                              label={item.level}
                            >
                              {item.level}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label>Section</label>
                        <Select
                          placeholder="Select Section"
                          defaultValue={updateStudent.section}
                          onChange={handlesection}
                          optionLabelProp="label"
                          style={{
                            width: "100%",
                          }}
                        >
                          {classOption.map((item, index) => (
                            <Option
                              key={item.key}
                              value={item.section}
                              label={item.section}
                            >
                              {item.section}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label>Guardian Contact</label>
                      {/* {data.phone.map((item, index) => {
       return (<Input disabled={true} defaultValue={item} name="phone" onChange={(e) => onChange(e)} />);
                   })}  */}

                {data.phone.map((item, index) => {
                  return (<Input  disabled={true} defaultValue={item} name="phone" onChange={(e) => setPhone(e ,index)} />);
                 })}   
              {input.map((_, index) => {
                  return <Input onChange={(e) => setPhone(e , index)} />;
                 })}
            {phone.length !== "" ? (
               <Button
                 onClick={() => {
                 setInputs([...input, 0]);
                 setAllPhone([...allPhone, phone]);
              }}
             >
              Add New
             </Button>
          ) : null}            
            </div>
              <div>
                <label>Email</label>
                <Input defaultValue={updateStudent.email} name="email" onChange={(e) => onChange(e)} />
              </div>
              <div>

              </div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginTop: "10%",
                  marginBottom: "2%",
                }}
              >
                Guardian
              </h1>
              <div className="teacher-profile">
                <div className="career-profile">
                  <h1>Guardian Information</h1>
                  <div>
                    <h3> Full Name</h3>
                    <span> Guardian Name</span>
                  </div>
                  <div>
                    <h3>Phone Number</h3>
                    <span>{data.phone[1]}</span>
                  </div>
                  <div>
                    <h3>Email</h3>
                    <span>{data.email}</span>
                  </div>
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Course" key="2">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="teacher-course-list">
                <div className="tch-cr-list">
                  <h1>Assigned Courses</h1>
                </div>
                {/* <Table dataSource={data.course} columns={columns} /> */}
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Class" key="3">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="teacher-course-list">
                <div className="tch-cr-list">
                  <h1>Assigned Classes</h1>
                </div>
                {/* <Table dataSource={data.class} columns={classColumns} /> */}
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>

    /* // <Modal
                //     visible={openUpdate}
                //     title="Update Student Profile"
                //     onOk={handleUpdate}
                //     width={756}
                //     onCancel={handleUpdateCancel}
                //     footer={[
                //         <Button key="back" onClick={handleUpdateCancel}>
                //             Return
                //         </Button>,
                //         <Button key="submit" type="primary" loading={loading} onClick={handleUpdate}>
                //             {percent ? percent + "%" : null}  Update
                //         </Button>
                //     ]}
                // >
                //     <Row>
                //         <Col style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                //             <img src={file ? URL.createObjectURL(file) : data.avater} alt="" style={{ width: "330px" }} />
                //         </Col>
                //         <Col style={{ width: "50%", padding: "10px" }}>
                //             <Form
                //                 labelCol={{ span: 7 }}
                //                 wrapperCol={{ span: 18 }}
                //                 layout="horizontal"
                //             >
                //                 <Form.Item label="First Name" name="First Name" rules={[
                //                     {
                //                         required: true,
                //                     },
                //                 ]}>
                //                     <Input name="first_name" defaultValue={data.first_name} onChange={(e) => onChange(e)} />
                //                 </Form.Item>
                //                 <Form.Item label="Last Name">
                //                     <Input name='last_name' defaultValue={data.last_name} onChange={(e) => onChange(e)} />
                //                 </Form.Item>
                //                 <Form.Item label="Email">
                //                     <Input name="email" defaultValue={data.email} onChange={(e) => onChange(e)} />
                //                 </Form.Item>
                //                 <Form.Item label="Phone" name="Phone" rules={[
                //                     {
                //                         required: true,
                //                     },
                //                 ]}>
                //                     {/* {data.phone.map((item, index) => {
                //                         return <Input defaultValue={item} name="phone" onChange={(e) => onChange(e)} />;
                //                     })} */
    //                    //</> //input.map((item, index) => {
    //                         return <Input defaultValue={item} onChange={(e) => setPhone(e, index)} />;
    //                     })}
    //                     <Button
    //                         onClick={() => {
    //                             setInputs([...input, 0]);
    //                             setAllPhone([...allPhone, phone]);
    //                         }}
    //                     >
    //                         Add New
    //                     </Button>

    //                 </Form.Item>
    //                 <Form.Item label="Level" name="Level" rules={[
    //                     {
    //                         required: true,
    //                     },
    //                 ]}>
    //                     <Input defaultValue={data.level} name="level" onChange={(e) => onChange(e)} />
    //                 </Form.Item>
    //                 <Form.Item label="Date Of Birth" name="Date of Birth" rules={[
    //                     {
    //                         required: true,
    //                     },
    //                 ]}>
    //                     <DatePicker defaultValue={moment(data.DOB, dateFormat)} onChange={setAge} />
    //                 </Form.Item>

    //                 <Form.Item label="Class">
    //                     <Select
    //                         style={{
    //                             width: "100%",
    //                         }}
    //                         placeholder="select all class"
    //                         defaultValue={data.class}
    //                         onChange={handleCourse}
    //                         optionLabelProp="label"
    //                     >
    //                         {classOption.map((item, index) => (
    //                             <Option value={item.key} label={item.level + item.section}>
    //                                 {item.level + item.section}
    //                             </Option>
    //                         ))}
    //                     </Select>
    //                 </Form.Item>
    //                 <Form.Item label="Student Picture" valuePropName="fileList">
    //                     <input type="file" onChange={handleChange} accept="/image/*" />
    //                 </Form.Item>
    //             </Form>
    //         </Col>
    //     </Row>
    // </Modal> */}
  );
}

export default UpdateStudents;
