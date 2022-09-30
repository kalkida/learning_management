import React from 'react'
import { Button, Select, Table, Input } from "antd";

const { Search } = Input;

const attendanceData = [{
    name: "Solomon Abebe",
    id: "Id",
    absent: "1",
    daysAbsent: "4"
},
{
    name: "Abrham Abebe",
    id: "Id",
    absent: "2",
    daysAbsent: "3"
},
{
    name: "Bekele Hagos",
    id: "Id",
    absent: "0",
    daysAbsent: "2"
},
{
    name: "Berket Weldu",
    id: "Id",
    absent: "1",
    daysAbsent: "2"
},
{
    name: "Helen Samson",
    id: "Id",
    absent: "2",
    daysAbsent: "4"
},]

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Absent',
        dataIndex: 'absent',
        key: 'absent',
    },
    {
        title: 'DaysAbsent',
        dataIndex: 'daysAbsent',
        key: 'daysAbsent',
    },

];

function AttendanceView() {
    return (
        <>
            <h1 className='view-header' >7B Attendance</h1>
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
                        }} />
                </div>
            </div>
            <div>
                <Table dataSource={attendanceData} columns={columns} />
            </div>
        </>

    )
}

export default AttendanceView