import React from 'react'
import { Button, Select, Table } from "antd"

const attendanceData = [{
    name: "Solomon Abebe",
    id: "ID",
    absent: "1",
    daysAbsent: "4"
},
{
    name: "Abrham Abebe",
    id: "ID",
    absent: "2",
    daysAbsent: "3"
},
{
    name: "Bekele Hagos",
    id: "ID",
    absent: "0",
    daysAbsent: "3"
},
{
    name: "Berket Weldu",
    id: "ID",
    absent: "1",
    daysAbsent: "4"
},
{
    name: "Helen Samson",
    id: "ID",
    absent: "2",
    daysAbsent: "1"
},]

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'


    },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Absent',
        dataIndex: 'absent',
        key: 'absent',
    },
    {
        title: 'Days Absent',
        dataIndex: 'daysAbsent',
        key: 'daysAbsent',
    },

];

function AttendanceList() {
    return (
        <>
            <Button className="btn-confirm">Confirm</Button>
            <div className='at-filters'>

                <Select defaultValue={"Today"} />
                <Select defaultValue={"Period"} />
            </div>
            <div>
                <Table dataSource={attendanceData} columns={columns} />
            </div>
        </>

    )
}

export default AttendanceList