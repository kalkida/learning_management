import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, Modal, message } from 'antd';
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
import uuid from "react-uuid";

const { Option } = Select;

function Update({ handleCancel, openUpdate, data, updateComplete, setUpdateComplete, coursedata, sectionData, sectionIdSingle, courseIdSingle }) {

    const uid = useSelector((state) => state.user.profile);

    const [loading, setLoading] = useState(false);
    const [courses, setcourse] = useState([]);
    const [sectionMainData, setSectionMainData] = useState([]);
    const [updateClass, setUpdateClass] = useState({
        grade: data.grade,
        course: courseIdSingle,
        sections: sectionIdSingle,
        school_id: data.school_id,
    });

    const handleUpdate = async () => {
        setLoading(true);
        setDoc(doc(firestoreDb, "class", data.key), updateClass, { merge: true })
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


    const getClass = async () => {

        const children = [];
        const sectionArray = [];

        const q = query(
            collection(firestoreDb, "courses"),
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

    useEffect(() => {
        getClass();
    }, []);



    const handleCourse = (value) => {
        setUpdateClass({ ...updateClass, course: value });
    };

    const handleSection = (value) => {
        setUpdateClass({ ...updateClass, sections: value });

    }

    const setGrade = (e) => {
        setUpdateClass({ ...updateClass, grade: e.target.value });
    };

    return (
        <div>
            {data && openUpdate ?
                <Modal
                    visible={openUpdate}
                    title="Update Class"
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
                        <Form.Item label="Grade">
                            <Input defaultValue={data.grade} onChange={(e) => setGrade(e)} />
                        </Form.Item>
                        <Form.Item label="Courses">

                            <Select
                                style={{
                                    width: "100%",
                                }}
                                defaultValue={coursedata}
                                optionLabelProp="label"
                                mode="multiple"
                                onChange={handleCourse}
                            >
                                {courses.map((item, index) => (
                                    <Option key={item.name} value={item.key} label={item.key}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Section">
                            <Select
                                style={{ width: "100%" }}
                                defaultValue={sectionData}
                                mode="multiple"
                                onChange={handleSection}
                            >
                                {sectionMainData.map((item, i) => (
                                    <Option key={item.name} value={item.key} lable={item.key}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Form>
                </Modal>
                : null}
        </div>
    )
}

export default Update