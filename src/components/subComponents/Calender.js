import React, { useState } from 'react'
import {
    Tag,
    Calendar,
    Typography,
    DatePicker,
} from "antd";
import moment from "moment";
import Icon from 'react-eva-icons'

function Calender() {
    const [attendanceData, setAttendanceData] = useState([
        {
            month: "January",
            defaultDate: new Date().getFullYear() + "-1-1",
            absentDays: [],
        },
        {
            month: "February",
            defaultDate: new Date().getFullYear() + "-2-1",
            absentDays: [],
        },
        {
            month: "March",
            defaultDate: new Date().getFullYear() + "-3-1",
            absentDays: [],
        },
        {
            month: "April",
            defaultDate: new Date().getFullYear() + "-4-1",
            absentDays: [],
        },
        {
            month: "May",
            defaultDate: new Date().getFullYear() + "-5-1",
            absentDays: [],
        },
        {
            month: "June",
            defaultDate: new Date().getFullYear() + "-6-1",
            absentDays: [],
        },
        {
            month: "July",
            defaultDate: new Date().getFullYear() + "-7-1",
            absentDays: [],
        },
        {
            month: "Augest",
            defaultDate: new Date().getFullYear() + "-8-1",
            absentDays: [],
        },
        {
            month: "September",
            defaultDate: new Date().getFullYear() + "-9-1",
            absentDays: [],
        },
        {
            month: "October",
            defaultDate: new Date().getFullYear() + "-10-1",
            absentDays: [],
        },
        {
            month: "November",
            defaultDate: new Date().getFullYear() + "-11-1",
            absentDays: [],
        },
        {
            month: "December",
            defaultDate: new Date().getFullYear() + "-12-1",
            absentDays: [],
        },
    ]);

    const dateCellRender = (date, value) => {
        const listData = getListData(date, value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.content}>
                        <Tag color={item.type}>{item.content}</Tag>
                    </li>
                ))}
            </ul>
        );
    };

    const getListData = (currentDate, value) => {
        let listData;
        value.forEach((element) => {
            const Dates = new Date(element);

            if (
                Dates.getDate() === currentDate.date() &&
                Dates.getMonth() === currentDate.month()
            ) {
                listData = [
                    {
                        type: "#eb3131",
                        content: Dates.getDate(),
                    },
                ];
            }
        });
        return listData || [];
    };

    return (
        <div className="bg-[#F9FAFB] min-h-[100vh] -mt-14">
            <div className="list-header mb-10">
                <h1 className="text-2xl font-[600] font-jakarta">Academic Calender</h1>
            </div>
            <div className="list-sub mb-10 flex">
                <div className='w-[20%] px-4'>
                    <div className='flex justify-between border-b-2'>
                        <Icon
                            name="arrow-ios-back-outline"
                            fill="#667085"
                            size="large" // small, medium, large, xlarge

                        />
                        <p>MARCH</p>
                        <Icon
                            name="arrow-ios-forward-outline"
                            fill="#667085"
                            size="large" // small, medium, large, xlarge

                        />
                    </div>
                    <div className='mt-5'>
                        <div className='flex mb-4'>
                            <Tag color="#dc5fc9" style={{ paddingRight: "5px", width: "1.7rem", alignItems: "center", display: 'flex' }}>2</Tag>
                            <span>Adwa Victory Celebration</span>
                        </div>
                        <div className='flex mb-4'>
                            <Tag color="magenta" style={{ paddingRight: "5px", width: "1.7rem", alignItems: "center", display: 'flex' }}>18</Tag>
                            <span>Teachers Metting</span>
                        </div>
                        <div className='flex mb-4'>
                            <Tag color="#dc5fc9" style={{ paddingRight: "5px", width: "1.7rem", alignItems: "center", display: 'flex' }}>30</Tag>
                            <span>Eid-alFitr</span>
                        </div>
                    </div>
                </div>
                <div className='w-[80%]'>
                    <div className="st-at bg-white border-2 rounded-xl p-5">
                        <div>
                            <div className="flex justify-between mb-4 ">
                                <div className="flex py-4 items-center">
                                    <DatePicker
                                        picker="year"
                                        className="!rounded-[6px] border-[2px]"
                                    />
                                </div>
                                <div className="flex flex-row justify-end bg-white p-4 ">
                                    <div className="flex items-center mr-5">
                                        <div
                                            className="bg-[#7048EC] w-[2rem] h-[0.5rem] mr-1"
                                            style={{ borderRadius: "10px" }}
                                        />
                                        <span>No Class</span>
                                    </div>
                                    <div className="flex items-center mr-5">
                                        <div
                                            className="bg-[#5290F6] w-[2rem] h-[0.5rem] mr-1"
                                            style={{ borderRadius: "10px" }}
                                        />
                                        <span color="gold">Exam</span>
                                    </div>
                                    <div className="flex items-center mr-5">
                                        <div
                                            className="bg-[#F1BFE9] w-[2rem] h-[0.5rem] mr-1"
                                            style={{ borderRadius: "10px" }}
                                        />
                                        <span color="lime">Half Day</span>
                                    </div>
                                    <div className="flex items-center mr-5">
                                        <div
                                            className="bg-[#DC5FC9] w-[2rem] h-[0.5rem] mr-1"
                                            style={{ borderRadius: "10px" }}
                                        />
                                        <span color="lime">Event</span>
                                    </div>
                                </div>
                            </div>

                            <div className="calender-card">
                                {attendanceData?.map((item, index) => (
                                    <div key={index} className="site-calendar-card">
                                        <Calendar
                                            value={moment(item.defaultDate)}
                                            headerRender={() => {
                                                return (
                                                    <div style={{ padding: 8, textAlign: "center" }}>
                                                        <Typography.Title level={4}>
                                                            {" "}
                                                            {item.month}
                                                        </Typography.Title>
                                                    </div>
                                                );
                                            }}
                                            dateCellRender={(date) =>
                                                dateCellRender(date, item.absentDays)
                                            }
                                            fullscreen={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Calender