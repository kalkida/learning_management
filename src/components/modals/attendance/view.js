import React, { useEffect, useState } from 'react'
import { Button, Select, Table, Input, DatePicker } from "antd";
import { useLocation } from 'react-router-dom';
import { firestoreDb } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { async } from '@firebase/util';

const { Search } = Input;

function AttendanceView() {

    const { state } = useLocation();
    const { data } = state;
    const [Students, setStudents] = useState(data.class.student);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Students?.map(async (item, index) => {
            if (item.key) {
                Students[index].attendace = await getAttendace(item.key)
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }, [])

    const getAttendace = async (ID) => {
        const q = query(
            collection(firestoreDb, "attendanceanddaily", `${data.key}/attendace`), where("studentId", "==", ID)
        );
        var temporary = [];

        const snap = await getDocs(q);
        snap.forEach((doc) => {
            var data = doc.data();
            data.key = doc.id;
            temporary.push(data);

        });
        return temporary;
    }

    const columns = [
        {
            title: 'Student Name',
            dataIndex: 'class',
            key: 'name',
            render: (_, record) => (
                <a >{record.first_name + " " + record.last_name}</a>
            ),
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },

        {
            title: 'Days Absent',
            dataIndex: 'attendance',
            key: 'attendance',
            render: (_, record) => (
                <a >{record.attendace ? record.attendace.length : 0}</a>
            ),
        },

    ];

    const onFilter = (value) => {
        console.log(value)
        console.log(value.year() + "-" + (value.month() + 1) + "-" + value.date());
    }

    return (
        <>
            <h1 className='view-header' >{data.class.level + data.class.section} Attendance</h1>
            <div className='at-filters'>
                <div>
                    <DatePicker onChange={onFilter} placeholder={"Selecet Date"} />

                </div>
                <div>
                    <Search
                        placeholder="Search "
                        allowClear
                        // onSearch={onSearch}
                        style={{
                            width: 200,
                        }} />
                </div>
            </div>
            <div>
                <Table loading={loading} dataSource={Students} columns={columns} />
            </div>
        </>

    )
}

export default AttendanceView