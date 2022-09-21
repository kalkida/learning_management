import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Modal, Form, Select, Input, DatePicker, Row, Col, message, Tabs } from 'antd';
import moment from "moment";
import {
    doc,
    setDoc,
    getDocs,
    collection,
    where,
    query,
    updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firestoreDb, storage } from "../../../firebase";
import './style.css'

const { Option } = Select;

function TeacherUpdate({ openUpdate, handleUpdateCancel, updateComplete, setUpdateComplete }) {

    const navigate = useNavigate();
    const { state } = useLocation();
    const { data } = state;

    const dateFormat = 'YYYY/MM/DD';
    const valueRef = useRef();

    const [loading, setLoading] = useState(false);
    const [allPhone, setAllPhone] = useState(data.phone);
    const [input, setInputs] = useState(data.phone);
    const [phone, setPhones] = useState("");
    const [classOption, setClassOption] = useState([]);
    const [courseOption, setCourseOption] = useState([]);
    const [percent, setPercent] = useState(0);
    const [file, setFile] = useState("");
    const [updateTeacher, setUpdateTeacher] = useState({
        avater: data.avater,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        class: data.class,
        level: data.level,
        course: data.course,
        phone: data.phone,
        school_id: data.school_id,
    })

    const handleChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleUpdate = () => {

        setLoading(true);
        if (!file) {
            setDoc(doc(firestoreDb, "teachers", data.key), updateTeacher, { merge: true }).then(
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
                            updateTeacher.avater = valueRef.current;

                            if (updateTeacher.avater !== null) {
                                setDoc(doc(firestoreDb, "teachers", data.key), updateTeacher, { merge: true }).then(
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

    const handleCourse = (value) => {
        setUpdateTeacher({ ...updateTeacher, class: value });
    };

    const handleCourseItem = (value) => {
        setUpdateTeacher({ ...updateTeacher, course: value });
    };


    const onChange = (e) => {
        setUpdateTeacher({ ...updateTeacher, [e.target.name]: e.target.value })
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

    const getCourse = async () => {

        const children = [];

        const q = query(
            collection(firestoreDb, "courses"),
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
        setCourseOption(children);
    };



    useEffect(() => {
        getClass();
        getCourse();
    }, []);

    return (
        <>
            <div>
                <div className="profile-header" >
                    <div className="teacher-avater" >
                        <img src="img-5.jpg" alt="profile" />
                        <div className="profile-info">
                            <h2>Teacher Name</h2>
                            <h3>ID: 1334</h3>
                        </div>
                    </div>
                    <div className="header-extra">
                        <div>
                            <h3>Assigned Subject</h3>
                            <h4>Math,Physics</h4>
                        </div>
                        <div>
                            <h3>Assigned Class</h3>
                            <h4>Math,Physics</h4>
                        </div>
                    </div>
                </div>
                <div className="tab-content">
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Profile" key="1">
                            <Button className="btn-confirm" onClick={handleUpdate}>Confirm</Button>
                            <div className='edit-teacher'>
                                <h1>Edit Profile</h1>
                                <div className='update-card'>
                                    <div className='avater-img'>
                                        <h2>Profile Picture</h2>
                                        <img src='img-5.jpg' />
                                        <div className='img-btn'>
                                            <Button>Add</Button>
                                            <Button>Remove</Button>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div>
                                            <label>First</label>
                                            <Input defaultValue={"melaku"} />
                                        </div>
                                        <div>
                                            <label>Sex</label>
                                            <Input defaultValue={"Mail"} />
                                        </div>
                                        <div>
                                            <label>Branch</label>
                                            <Input defaultValue={"Saris"} />
                                        </div>
                                        <div>
                                            <label>Phone</label>
                                            <Input defaultValue={"+25192546546"} />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div>
                                            <label>Last Name</label>
                                            <Input defaultValue={"melaku"} />
                                        </div>
                                        <div>
                                            <label>ID</label>
                                            <Input defaultValue={"0354"} />
                                        </div>
                                        <div>
                                            <label>Date Of Birth</label>
                                            <Input defaultValue={"1996"} />
                                        </div>
                                        <div>
                                            <label>Email</label>
                                            <Input defaultValue={"teacher@gmail.com"} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Course" key="2">
                            Content of Tab Pane 3 course
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Course" key="3">
                            Content of Tab Pane 3
                        </Tabs.TabPane>
                    </Tabs>
                </div>

            </div>
            {/* {data && openUpdate ?
                <Modal
                    visible={openUpdate}
                    title="Update Teacher Profile"
                    onOk={handleUpdate}
                    width={756}
                    onCancel={handleUpdateCancel}
                    footer={[
                        <Button key="back" onClick={handleUpdateCancel}>
                            Return
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={handleUpdate}>
                            {percent ? percent + "%" : null}  Update
                        </Button>
                    ]}
                >
                    <Row>
                        <Col style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <img src={file ? URL.createObjectURL(file) : data.avater} alt="" style={{ width: "330px" }} />
                        </Col>
                        <Col style={{ width: "50%", padding: "10px" }}>
                            <Form
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 18 }}
                                layout="horizontal"
                            >
                                <Form.Item label="First Name" name="First Name" rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                    <Input name="first_name" defaultValue={data.first_name} onChange={(e) => onChange(e)} />
                                </Form.Item>
                                <Form.Item label="Last Name">
                                    <Input name='last_name' defaultValue={data.last_name} onChange={(e) => onChange(e)} />
                                </Form.Item>
                                <Form.Item label="Email">
                                    <Input name="email" defaultValue={data.email} onChange={(e) => onChange(e)} />
                                </Form.Item>
                                <Form.Item label="Phone" name="Phone" rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                    <Input name="phone" defaultValue={data.phone} onChange={(e) => onChange(e)} />

                                </Form.Item>
                                <Form.Item label="Class">
                                    <Select
                                        style={{
                                            width: "100%",
                                        }}
                                        placeholder="select all courses"
                                        defaultValue={data.class}
                                        onChange={handleCourse}
                                        optionLabelProp="label"
                                        mode="multiple"
                                    >
                                        {classOption.map((item, index) => (
                                            <Option value={item.level + item.section} label={item.level + item.section}>
                                                {item.level + item.section}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Course">
                                    <Select
                                        style={{
                                            width: "100%",
                                        }}
                                        placeholder="select all courses"
                                        defaultValue={data.course}
                                        onChange={handleCourseItem}
                                        optionLabelProp="label"
                                        mode="multiple"
                                        maxTagCount={2}
                                    >
                                        {courseOption.map((item, index) => (
                                            <Option value={item.course_name} label={item.course_name}>
                                                {item.course_name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Student Picture" valuePropName="fileList">
                                    <input type="file" onChange={handleChange} accept="/image/*" />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Modal>
                : null} */}
        </>
    );
}

export default TeacherUpdate