import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, Modal, message, TimePicker } from 'antd';
import { useSelector } from "react-redux";
import {
    doc,
    setDoc,
    getDocs,
    collection,
    where,
    query,
    updateDoc,
} from "firebase/firestore";
import { firestoreDb, storage } from "../../../firebase";
import TextArea from "antd/lib/input/TextArea";
import uuid from "react-uuid";
import moment from 'moment';

const { Option } = Select;

function Update({ handleCancel, openUpdate, data, updateComplete, setUpdateComplete, }) {

    const uid = useSelector((state) => state.user.profile);
    const [courses, setCourses] = useState({})
    const [input, setInput] = useState([]);
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [subject, setSubject] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [loading, setLoading] = useState(false);
    const [updateCourse, setUpdateCourse] = useState({
        course_name: data.course_name,
        teachers: data.teachers,
        class: data.class,
        schedule: data.schedule,
        description: data.description,
        school_id: data.school_id,
    })
    const days = ["Monday", "Thusday", "Wednsday", "Thursday", "Friday"];


    useEffect(() => {
        getCourseData();
    }, []);

    const handleUpdate = async () => {
        setLoading(true);
        console.log("data is", data)
        setDoc(doc(firestoreDb, "courses", data.key), updateCourse, { merge: true })
            .then(response => {
                setLoading(false)
                message.success("Data is updated successfuly")
                setUpdateComplete(!updateComplete)
                handleCancel()
            })
            .catch(error => {
                message.error("Data is not updated")
                console.log(error)
            }
            )
    }

    const getCourseData = async () => {

        const children = [];
        const teachersArrary = [];
        const subjectArrary = [];
        const q = query(
            collection(firestoreDb, "class"),
            where("school_id", "==", uid.school)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            var datas = doc.data();
            children.push({
                ...datas,
                key: doc.id,
            });
        });
        const qTeachers = query(
            collection(firestoreDb, "teachers"),
            where("school_id", "==", uid.school)
        );
        const queryTeachers = await getDocs(qTeachers);
        queryTeachers.forEach((doc) => {
            var datas = doc.data();
            teachersArrary.push({
                ...datas,
                key: doc.id,
            });
        });
        const qSubject = query(
            collection(firestoreDb, "subject"),
            where("school_id", "==", uid.school)
        );
        const querySubject = await getDocs(qSubject);
        querySubject.forEach((doc) => {
            var datas = doc.data();
            subjectArrary.push({
                ...datas,
                key: doc.id,
            });
        });
        setClasses(children);
        setTeachers(teachersArrary);
        setSubject(subjectArrary);
    };

    const handleCourse = (e) => {
        setUpdateCourse({ ...updateCourse, [e.target.name]: e.target.value });
    };

    const handleClass = (value) => {
        const classData = JSON.parse(value);
        setSelectedLevel(classData.level + classData.section)
        setUpdateCourse({ ...updateCourse, class: classData });
    }

    const handleSubject = (value) => {
        setSelectedSubject(value);
    }

    const handleTeacher = (value) => {
        const teacherdata = [];
        value.map((item, i) => {
            teacherdata.push(JSON.parse(item));

        })
        setUpdateCourse({ ...updateCourse, teachers: teacherdata });
    }
    const handleScheduler = (value, i) => {

        if (typeof value === "string") {
            updateCourse.schedule[i].day = value;
        }
        else {
            const timeValue = [];
            value.map((item, i) => {
                timeValue.push(JSON.stringify(item._d))
            })
            updateCourse.schedule[i].day = value;

        }
    }

    const handleNewScheduler = (value, i) => {

        if (typeof value === "string") {
            updateCourse.schedule[(data.schedule.length + i)].day = value;
        }
        else {
            const timeValue = [];
            value.map((item, i) => {
                timeValue.push(JSON.stringify(item._d))
            })
            updateCourse.schedule[(data.schedule.length + i)].time = timeValue;

        }
    }

    return (
        <div>
            {data && openUpdate ?
                <Modal
                    visible={openUpdate}
                    title="Update Course"
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Return
                        </Button>,
                        <Button key="submit" type='primary' loading={loading} onClick={handleUpdate}>
                            Update
                        </Button>,

                    ]}
                >
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                    >
                        <Form.Item label="Subject" name="Subject" rules={[
                            {
                                required: true,
                            },
                        ]}>
                            <Select
                                style={{
                                    width: "100%",
                                }}
                                placeholder="select Subjects"
                                onChange={handleSubject}
                                optionLabelProp="label"
                                defaultValue={data.course_name.split(" ")[0]}

                            >
                                {subject.map((item, index) => (
                                    <Option value={item.name} label={item.name}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Teachers" name="Teachers" rules={[
                            {
                                required: true,
                            },
                        ]}>
                            <Select
                                style={{
                                    width: "100%",
                                }}
                                placeholder="select Teachers"
                                onChange={handleTeacher}
                                optionLabelProp="label"
                                mode="multiple"
                                defaultValue={data.teachers}
                            >
                                {teachers.map((item, index) => (
                                    <Option key={item.key} value={JSON.stringify(item)} label={item.first_name + " " + (item.last_name ? item.last_name : "")}>
                                        {item.first_name + " " + (item.last_name ? item.last_name : "")}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Class" name="Class" rules={[
                            {
                                required: true,
                            },
                        ]}>
                            <Select
                                style={{
                                    width: "100%",
                                }}
                                placeholder="select Classes"
                                onChange={handleClass}
                                optionLabelProp="label"
                                defaultValue={data.class}
                            >
                                {classes.map((item, index) => (
                                    <Option key={item.key} value={JSON.stringify(item)} label={item.level + " " + item.section}>
                                        {item.level + " " + item.section}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Course Description">
                            <TextArea name="description" defaultValue={data.description} onChange={(e) => handleCourse(e)} />
                        </Form.Item>
                        <Form.Item label="Schedule" name="Schedule" rules={[
                            {
                                required: true,
                            },
                        ]}>
                            {data.schedule?.map((item, i) => (
                                <>
                                    <Select
                                        style={{ width: "40%" }}
                                        placeholder="First Select Days"
                                        onChange={(e) => handleScheduler(e, i)}
                                        defaultValue={item.day}
                                    >
                                        {days.map((item, index) => (
                                            <Option value={item} label={item}>
                                                {item}
                                            </Option>
                                        ))}
                                    </Select>
                                    <TimePicker.RangePicker
                                        style={{ width: "60%" }}
                                        format={"hh:mm"}
                                        use12Hours
                                        defaultValue={item.time.length ? [moment(JSON.parse(item.time[0])), moment(JSON.parse(item.time[1]))] : []}
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
                                            <Option value={item} label={item}>
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
                                    setUpdateCourse({ ...updateCourse, schedule: [...updateCourse.schedule, { day: "", time: [] }] });
                                }}
                            >
                                Add New
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                : null}
        </div>
    )
}

export default Update