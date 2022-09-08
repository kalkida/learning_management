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

function Update({ handleCancel, openUpdate, data, updateComplete, setUpdateComplete, }) {

    const uid = useSelector((state) => state.user.profile);
    const [courses , setCourses] =useState({})
    const [loading, setLoading] = useState(false);
    const [updateCourse, setUpdateCourse] = useState({
        id: data.id,
        name: data.name,
        description: data.description,
        school_id: data.school_id,
    });

    const handleUpdate = async () => {
        setLoading(true);
        console.log("data is", data)
        setDoc(doc(firestoreDb, "courses", data.key), updateCourse)
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


    // const getClass = async () => {

    //     const children = [];

    //     const q = query(
    //         collection(firestoreDb, "courses"),
    //         where("school_id", "==", uid.school)
    //     );
    //     const querySnapshot = await getDocs(q);
    //     querySnapshot.forEach((doc) => {
    //         var datas = doc.data();
    //         children.push({
    //             ...datas,
    //             key: doc.id,
    //         });
    //     });

    //     setCourses(children);
    // };

    // useEffect(() => {
    //     getClass();
    // }, []);


    const setcoursname = (e) => {
        setUpdateCourse({ ...updateCourse, name: e.target.value });
    };
    const setcoursdescription = (e) => {
        setUpdateCourse({ ...updateCourse, description: e.target.value });
    };

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
                        <Form.Item label="Course name">
                            <Input defaultValue={data.name} onChange={(e) => setcoursname(e)} />
                        </Form.Item>

                        <Form.Item label="Course description">
                            <Input defaultValue={data.description} onChange={(e) => setcoursdescription(e)} />
                        </Form.Item>

                    </Form>
                </Modal>
                : null}
        </div>
    )
}

export default Update