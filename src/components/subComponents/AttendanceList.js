import React from 'react'
import { Button, Select, Table, Input } from "antd";
import { useNavigate } from 'react-router-dom';

import '../modals/attendance/style.css'

const { Search } = Input;

function AttendanceList() {

    const navigate = useNavigate();

    const onView = (data) => {
        navigate('/view-attendance', { state: { data: data } })
    }

    const attendanceData = [{
        name: "Solomon Abebe",
        course: "Maths,Physics",
        age: "31",
        sex: "Male"
    },
    {
        name: "Abrham Abebe",
        course: "Maths",
        age: "22",
        sex: "Male"
    },
    {
        name: "Bekele Hagos",
        course: "Physics",
        age: "30",
        sex: "Male"
    },
    {
        name: "Berket Weldu",
        course: "Maths",
        age: "21",
        sex: "Male"
    },
    {
        name: "Helen Samson",
        course: "Maths,Physics",
        age: "32",
        sex: "Female"
    },]

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (<a onClick={() => onView(record)}>{record.name}</a>)
        },
        {
            title: 'Course',
            dataIndex: 'course',
            key: 'course',
            render: (_, record) => (<a onClick={() => onView(record)}>{record.course}</a>)

        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            render: (_, record) => (<a onClick={() => onView(record)}>{record.age}</a>)

        },
        {
            title: 'Sex',
            dataIndex: 'sex',
            key: 'sex',
            render: (_, record) => (<a onClick={() => onView(record)}>{record.sex}</a>)

        },

    ];

    return (
        <>
            <div className='at-filters'>
                <div>
                    <Select defaultValue={"Today"} />
                    <Select defaultValue={"Period"} />
                    <Select defaultValue={"Course"} />
                </div>
                <div>
                    <Search
                        placeholder="Search "
                        allowClear
                        // onSearch={onSearch}
                        style={{
                            width: 200,
                        }}
                    />
                </div>
            </div>
            <div>
                <Table dataSource={attendanceData} columns={columns} />
            </div>
        </>

    )
}

export default AttendanceList