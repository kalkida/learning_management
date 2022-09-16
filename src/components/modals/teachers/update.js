import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form, Select, Input, DatePicker, Row, Col, message } from 'antd';
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

const { Option } = Select;

function Update({ openUpdate, handleUpdateCancel, data, updateComplete, setUpdateComplete }) {

    console.log(data)
    const dateFormat = 'YYYY/MM/DD';
    const valueRef = useRef();

    const [loading, setLoading] = useState(false);
    const [classOption, setClassOption] = useState([]);
    const [percent, setPercent] = useState(0);
    const [file, setFile] = useState("");
    const [coursesData, setCourseData] = useState([]);
    const [personData, setPersonData] = useState([]);


    const [updateTeacher, setUpdateTeacher] = useState({
        avater: data.avater,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        class: data.class,
        courses: data.courses,
        parent_id: data.parent_id,
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
            setDoc(doc(firestoreDb, "students", data.key), updateTeacher, { merge: true }).then(
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
                                setDoc(doc(firestoreDb, "students", data.key), updateTeacher, { merge: true }).then(
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

    const getCourse = async () => {
        const coursess = []
        const q = query(
            collection(firestoreDb, "courses"),
            where("school_id", "==", data.school_id)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            var datas = doc.data();
            coursess.push({
                ...datas,
                key: doc.id,
            });
        });
        setCourseData(coursess);
    };
    const handleCourse = (value) => {
        setUpdateTeacher({ ...updateTeacher, courses: value });
    };
    const handleClass = (value) => {
        setUpdateTeacher({ ...updateTeacher, class: value });
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

    const getid = async () => {
        const Teacher = []
        const q = query(
            collection(firestoreDb, "users"),
            where("role.isTeacher", "==", true)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            var datas = doc.data();
            Teacher.push({
                ...datas,
                key: doc.id,
            });
        });
        setPersonData(Teacher);
    };

    const handlename = (value) => {
        setUpdateTeacher({ ...updateTeacher, first_name: value });
    }

    useEffect(() => {
        getClass();
        getCourse();
        getid();
    }, []);

    return (
        <>
            {data && openUpdate ?
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
                                    <Select
                                        style={{
                                            width: "100%",
                                        }}
                                        placeholder="see all users"
                                        onChange={handlename}
                                        optionLabelProp="label"
                                        defaultValue={data.first_name}
                                    >
                                        {personData?.map((item, index) => (
                                            <Option key={item.key} value={item.key} label={item.name}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
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
                                    <Input name='phone' defaultValue={data.phone} onChange={(e) => onChange(e)} />

                                </Form.Item>
                                <Form.Item label="Courses">
                                    <Select
                                        style={{
                                            width: "100%",
                                        }}
                                        placeholder="select all courses"
                                        onChange={handleCourse}
                                        optionLabelProp="label"
                                        defaultValue={data.courses}
                                    >
                                        {coursesData?.map((item, index) => (
                                            <Option key={item.key} value={item.key} label={item.name}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Level" name="Level" rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                    <Input defaultValue={data.level} name="level" onChange={(e) => onChange(e)} />
                                </Form.Item>
                                <Form.Item label="Class">
                                    <Select
                                        style={{
                                            width: "100%",
                                        }}
                                        placeholder="select all courses"
                                        defaultValue={data.class}
                                        onChange={handleClass}
                                        optionLabelProp="label"
                                    >
                                        {classOption?.map((item, index) => (
                                            <Option key={item.key} value={item.key} label={item.grade}>
                                                {item.grade}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Teacher Picture" valuePropName="fileList">
                                    <input type="file" onChange={handleChange} accept="/image/*" />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Modal>
                : null}
        </>
    );
}

export default Update