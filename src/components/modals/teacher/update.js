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
    updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firestoreDb, storage } from "../../../firebase";
import './style.css'
import { getIdToken } from 'firebase/auth';

const { Option } = Select;
const { Search } = Input;
const gender = ["Male", "Female", "Other"]

function TeacherUpdate({ openUpdate, handleUpdateCancel, updateComplete, setUpdateComplete }) {

    const navigate = useNavigate();
    const { state } = useLocation();
    const { data } = state;

    const dateFormat = 'YYYY/MM/DD';
    const valueRef = useRef();

    const [loading, setLoading] = useState(false);
    const [classOption, setClassOption] = useState([]);
    const [courseOption, setCourseOption] = useState([]);
    const [percent, setPercent] = useState(0);
    const [file, setFile] = useState("");
    const [updateCourseView, setUpdateCourseView] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedClassKeys, setSelectedClassKeys] = useState([])

    const [updateTeacher, setUpdateTeacher] = useState({
        avater: data.avater,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        class: data.class,
        course: data.course,
        phone: data.phone,
        DOB: data.DOB,
        sex: data.sex,
        working_since: data.working_since,
        school_id: data.school_id,
    })

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
                                console.log(updateTeacher)
                                setDoc(doc(firestoreDb, "teachers", data.key), updateTeacher, { merge: true }).then(
                                    response => {
                                        setLoading(false)
                                        message.success("Data is updated successfuly")
                                        navigate('/list-teacher')
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

    const handleChangeTeacher = (e) => {
        setUpdateTeacher({ ...updateTeacher, [e.target.name]: e.target.value });
    };

    const handleGender = (value) => {
        setUpdateTeacher({ ...updateTeacher, sex: value });
    };
    const handleDob = (value) => {
        setUpdateTeacher({ ...updateTeacher, DOB: JSON.stringify(value) });
    };
    const handleWork = (value) => {
        setUpdateTeacher({ ...updateTeacher, working_since: JSON.stringify(value) });
    };

    const onRemove = () => {
        setFile('');
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

    const getID = () => {
        var classArr = [];
        var courseArr = [];
        data.class?.map((item) => {
            classArr.push(item.key)
        })
        data.course?.map((item) => {
            courseArr.push(item.key)
        })
        setUpdateTeacher({ ...updateTeacher, class: classArr });
        setUpdateTeacher({ ...updateTeacher, course: courseArr });
        setSelectedClassKeys(classArr);
        setSelectedRowKeys(courseArr);
    }

    const columns = [
        {
            title: 'Course',
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
            title: "Class",
            dataIndex: "class",
            key: "class",
            render: (item) => {
                return (
                    <div>
                        {item.level}
                        {"   "}
                        {item.section}
                    </div>
                );
            },
        },
    ]

    const classColumns = [
        {
            title: 'Grade',
            dataIndex: 'level',
            key: 'level'


        },
        {
            title: 'Section',
            dataIndex: 'section',
            key: 'secticon',

        },

    ]

    const onSelectChange = (newSelectedRowKeys) => {
        setUpdateTeacher({ ...updateTeacher, course: newSelectedRowKeys });
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const onSelectChangeClass = (newSelectedRowKeys) => {
        setUpdateTeacher({ ...updateTeacher, class: newSelectedRowKeys });
        setSelectedClassKeys(newSelectedRowKeys);
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


    const rowSelectionClass = {
        selectedClassKeys,
        onChange: onSelectChangeClass,
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
                    setSelectedClassKeys(newSelectedRowKeys);
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
                    setSelectedClassKeys(newSelectedRowKeys);
                },
            },
        ],
    };

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
        getCourse();
        getID()
    }, []);

    return (
        <>
            <div>
                <div className="profile-header" >
                    <div className="teacher-avater" >
                        <img src={updateTeacher.avater ? updateTeacher.avater : "img-5.jpg"} alt="profile" />
                        <div className="profile-info">
                            <h2>{updateTeacher.first_name + " " + updateTeacher.last_name}</h2>
                            <h3>Contact</h3>
                        </div>
                    </div>
                    <div className="header-extra-th">
                        <div>
                            <h3>Class</h3>
                            <h4>{data.class?.map((item, i) => item.level + item.section + ",")}</h4>
                        </div>
                        <div>
                            <h3>Subject</h3>
                            <h4>{data.course?.map((item, i) => item.course_name + ",")}</h4>
                        </div>

                    </div>
                </div>
                <div className="tab-content">
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Profile" key="1">
                            <Button className="btn-confirm" onClick={handleUpdate}>Confirm</Button>
                            <div className='add-teacher'>
                                <h1>Edit Profile</h1>
                                <div>
                                    <div className="avater-img">
                                        <div>
                                            <h2>Profile Picture</h2>
                                            <img src={file ? URL.createObjectURL(file) : data.avater ? data.avater : "img-5.jpg"} />
                                        </div>
                                        <div className="file-content">
                                            <span>This will be displayed to you when you view this profile</span>

                                            <div className="img-btn">
                                                {/* <input type="file" onChange={handleChange} accept="/image/*" /> */}
                                                <button>
                                                    <input type="file" id="browse" name="files" style={{ display: "none" }} onChange={handleFile} accept="/image/*" />
                                                    <input type="hidden" id="filename" readonly="true" />
                                                    <input type="button" value="Add Photo" id="fakeBrowse" onClick={HandleBrowseClick} />
                                                </button>
                                                <button onClick={onRemove}>Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='add-form'>
                                        <div className='col'>
                                            <div>
                                                <label>First Name</label>
                                                <Input defaultValue={updateTeacher.first_name} onChange={(e) => handleChangeTeacher(e)} />
                                            </div>
                                            <div>
                                                <label>Last Name</label>
                                                <Input defaultValue={updateTeacher.last_name} onChange={(e) => handleChangeTeacher(e)} />
                                            </div>
                                        </div>
                                        <div className='col'>

                                            <div>
                                                <label>Phone</label>
                                                <Input defaultValue={updateTeacher.phone} onChange={(e) => handleChangeTeacher(e)} />
                                            </div>
                                            <div>
                                                <label>Email</label>
                                                <Input defaultValue={updateTeacher.email} onChange={(e) => handleChangeTeacher(e)} />
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div >
                                                <label>Date Of Birth</label>
                                                <DatePicker style={{ width: "100%" }} onChange={handleDob} defaultValue={updateTeacher.DOB ? moment(JSON.parse(updateTeacher.DOB)) : ''} />
                                            </div>
                                            <div>
                                                <label>Sex</label>
                                                <Select defaultValue={updateTeacher.sex} placeholder="Select Gender"
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
                                                    ))}</Select>
                                            </div>
                                            <div>
                                                <label>Working Since</label>
                                                <DatePicker style={{ width: "100%" }} onChange={handleWork} defaultValue={updateTeacher.working_since ? moment(JSON.parse(updateTeacher.working_since)) : ''} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Course" key="2">
                            <Button className="btn-confirm" onClick={handleUpdate}>Confirm</Button>

                            <div>
                                <div className='teacher-course-list'>
                                    <h1>Add/Remove Courses</h1>
                                    <div className='tch-cr-list'>
                                        <div>
                                            <Select defaultValue={"Subject"} />
                                            <Select defaultValue={"Class"} />
                                        </div>
                                        <div>
                                            <Search
                                                placeholder="input search text"
                                                allowClear
                                                // onSearch={onSearch}
                                                style={{
                                                    width: 200,
                                                }}
                                            />

                                        </div>
                                    </div>
                                    <Table rowSelection={rowSelection} dataSource={courseOption} columns={columns} />
                                </div>
                            </div>

                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Class" key="3">
                            <Button className="btn-confirm" onClick={handleUpdate}>Confirm</Button>

                            <div>
                                <div className='teacher-course-list'>
                                    <h1>Add/Remove Class</h1>

                                    <Table rowSelection={rowSelectionClass} dataSource={classOption} columns={classColumns} />
                                </div>
                            </div>
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