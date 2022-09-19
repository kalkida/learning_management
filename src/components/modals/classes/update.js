import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Modal, message } from "antd";
import { useSelector } from "react-redux";
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
import uuid from "react-uuid";
import { async } from "@firebase/util";

const { Option } = Select;

function Update({
    handleCancel,
    openUpdate,
    data,
    updateComplete,
    setUpdateComplete,
}) {


    const uid = useSelector((state) => state.user.profile);

    const [loading, setLoading] = useState(false);
    const [courses, setcourse] = useState([]);
    const [students, setStudents] = useState([]);
    const [sectionMainData, setSectionMainData] = useState([]);
    const [updateClass, setUpdateClass] = useState({
        level: data.level,
        student: data.student,
        section: data.section,
        school_id: data.school_id,
    });

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
                handleCancel();
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
            {data && openUpdate ? (
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
                        <Form.Item label="Level">
                            <Input disabled name="level" defaultValue={data.level} onChange={(e) => handleClass(e)} />
                        </Form.Item>


                        <Form.Item label="Section">
                            <Input disabled name="section" defaultValue={data.section} onChange={(e) => handleClass(e)} />
                        </Form.Item>
                        <Form.Item label="Students">
                            <Select
                                style={{
                                    width: "100%",
                                }}
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
                        </Form.Item>

                    </Form>
                </Modal>)
                : null}
        </div>
    )
}

export default Update;
