import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Modal, Form, Select, Input, DatePicker, Row, Col, message, Tabs, Table } from 'antd';
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
import './style.css'
import { getIdToken } from 'firebase/auth';

const { Option } = Select;
const { Search } = Input;
const gender = ["Male", "Female", "Other"]

function UpdateStudents() {

    const dateFormat = 'YYYY/MM/DD';
    const valueRef = useRef();

    const [loading, setLoading] = useState(false);
    const [allPhone, setAllPhone] = useState(data.phone);
    const [input, setInputs] = useState(data.phone);
    const [phone, setPhones] = useState("");
    const [classOption, setClassOption] = useState([]);
    const [percent, setPercent] = useState(0);
    const [file, setFile] = useState("");
    const { state } = useLocation();
    const { data } = state;
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
                    setUpdateComplete(!updateComplete)
                    handleUpdateCancel()
                })
                .catch(error => {
                    message.error("Data is not updated")
                    console.log(error)
                })
        } else {
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percentR = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    // update progress
                    setPercent(percentR);
                },
                (err) => console.log(err),
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {

                        valueRef.current = url
                        if (valueRef.current != null) {
                            updateStudent.avater = valueRef.current;

                            if (updateStudent.avater !== null) {
                                setDoc(doc(firestoreDb, "students", data.key), updateStudent, { merge: true }).then(
                                    response => {
                                        setLoading(false)
                                        message.success("Data is updated successfuly")
                                        setUpdateComplete(!updateComplete)
                                        handleUpdateCancel()
                                    })
                                    .catch(error => {
                                        message.error("Data is not updated")
                                        console.log(error)
                                    })
                            }
                        }

                    });
                }
            );

        }
    };

    const getClassID = async (ID) => {
        const docRef = doc(firestoreDb, "class", ID)
        var data = "";
        await getDoc(docRef).then(response => {
            data = response.data();
            data.key = response.id;
        })
        return data;
    }

    const handleCourse = async (value) => {
        const classData = await getClassID(value);
        setUpdateStudent({ ...updateStudent, class: classData });

    };
    const setAge = (value) => {
        setUpdateStudent({ ...updateStudent, DOB: JSON.stringify(value._d) });
    };

    const setPhone = (e, index) => {
        allPhone[index] = e.target.value;
        setUpdateStudent({ ...updateStudent, phone: allPhone });
    };

    const onChange = (e) => {
        setUpdateStudent({ ...updateStudent, [e.target.name]: e.target.value })
    }

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
            <h4>{data.level.level+ data.level.section }</h4>
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
                Edit Profile
              </Button>
              <div className="add-header">
          <h1>Add Students</h1>
          {/* <button onClick={async () => await CreateNewStudnet()}>Confirm</button> */}
        </div>
        <div className="add-teacher">
          <div className="avater-img">
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
          </div>

          <div className="add-form">
            <div className="col"> 
              <div>
                <label>First Name</label>
                <Input name="first_name" onChange={(e) => handleStudent(e)} />
              </div>
            <div style={{ flexDirection:'row'  , justifyContent: 'space-between',display:'flex' }} >
              <div style={{ marginRight:'5%'}}>
                <label>Grade</label>
                <Select
                  placeholder="Select Grade"
                  onChange={handlelevel}
                  optionLabelProp="label"
                  style={{
                    width: "100%",
                  }}
                >
                  {classData.map((item, index) => (
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
                  onChange={handlesection}
                  optionLabelProp="label"
                  style={{
                    width: "100%",
                  }}
                >
                  {classData.map((item, index) => (
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
                <label>Date of Birth</label>
                <DatePicker style={{ width: "100%" }} onChange={handleDob} />
              </div>
              <div className="add-header">
              <button onClick={async () => await createNewStudent()}>Submit</button>
            
              
              {/* <button onClick={handleCancle}>Cancel</button> */}
              {/* <Button
          type="primary"
          loading={loadingbutton}
          onClick={async () => await createNewStudent()}
        >
          Save
        </Button> */}

              </div>
            </div>
            <div className="col">
            <div>
                <label>Last Name</label>
                <Input name="last_name" onChange={(e) => handleStudent(e)} />
              </div>
              <div>
                <label>Sex </label>
                <Select
                  placeholder="Select Gender"
                  onChange={handleGender}
                  optionLabelProp="label"
                  style={{
                    width: "100%",
                  }}
                >
                  {gender.map((item, index) => (
                    <Option
                      key={item.index}
                      value={item}
                      label={item}
                    >
                      {item}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <label>Email</label>
                <Input name="email" onChange={(e) => handleStudent(e)} />
              </div>
            </div>
            <div className="col">
            <div>
                <label>Guardian Contact</label>
                {input.map((_, index) => {
                  return <Input onChange={(e) => setPhone(e)} />;
                 })}
               {phone !== "" ? (
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
              </div>
            </div>
            <div>
              
            </div>
           
          </div>
        </div>
              <h1  style={{ fontSize:22 , fontWeight:'bold' , marginTop:'10%' , marginBottom:'2%'}}>Student Information</h1>
              <div className="teacher-static">
                <div>
                <span>Age</span>
                <h2 style={{ fontSize:14 , fontWeight:'bold'}}>{age}</h2>
                </div>
                <div>
                <span>Sex</span>
                <h2 style={{ fontSize:14 , fontWeight:'bold'}}>{data.sex}</h2>
                </div>
                <div>
                <span>phoneNumber</span>
                <h2 style={{ fontSize:14 , fontWeight:'bold'}}>{data.phone[0]}</h2>
                </div>
                <div>
                  <span>Email</span>
                  <h2 style={{ fontSize:14 , fontWeight:'bold'}}>{data.email}</h2>
                </div>
                <div>
                  <span>Location</span>
                  <h2 style={{ fontSize:14 , fontWeight:'bold'}}>Lideta</h2>
                </div>
              </div>
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
                <Table dataSource={data.course} columns={columns} />
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
                <Table dataSource={data.class} columns={classColumns} />
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