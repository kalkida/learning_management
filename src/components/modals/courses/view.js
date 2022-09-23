import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal, Form, Input, Button, Select, TimePicker, Tabs, Table } from "antd";
import moment from "moment";
import './style.css';
import AttendanceList from "../../subComponents/AttendanceList";

const { Option } = Select;

function ViewCourse() {
  const { state } = useLocation();
  const { data } = state;

  const navigate = useNavigate();

  const columns = [
    {
      title: 'Teachers',
      dataIndex: 'first_name',
      key: 'first_name'


    },
    {
      title: '',
      dataIndex: 'last_name',
      key: 'last_name',
    },
  ];
  const handleUpdate = () => {
    navigate('/update-course', { state: { data } });
  }
  return (
    <div>
      <div className="profile-header" >
        <div className="course-avater" >
          <img src="logo512.png" alt="profile" />
          <div className="profile-info">
            <h2>{data.course_name}</h2>
            <h3>Grade {data.class ? data.class.level + data.class.section : ""}</h3>
          </div>
        </div>
        <div className="header-extra">
          <div>
            <h3>Assigned Teachers</h3>
            <h4>{data.teachers.length}</h4>
          </div>
          <div>
            <h3>Class/week</h3>
            <h4>{data.schedule.length}</h4>
          </div>
        </div>
      </div>
      <div className="tab-content">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Profile" key="1">
            <Button className="btn-confirm" onClick={handleUpdate}>Edit Course</Button>
            <div className="course-description">
              <h4>Coures Description</h4>
              <Input.TextArea
                width="100%"
                rows={4}
                defaultValue={data.description}
              />
            </div>
            <div className="asssign-teacher">
              <h4>Assigned Teachers</h4>
              <Table dataSource={data.teachers} columns={columns} />
            </div>
            <div className="schedule">
              <h4>Weekly Schedule</h4>
              <div className="card-schedule">
                <h2 >Class {data.class ? data.class.level + data.class.section : ""}</h2>
                <div className="schedule-header">
                  <div>
                    <p> Period</p>
                  </div>
                  <div>
                    <p> Start time</p>
                    <p> End time</p>
                  </div>
                </div>
                {data.schedule?.map((item) => (
                  <>
                    <Input value={item.day} style={{ width: "40%" }} />
                    <TimePicker.RangePicker
                      style={{ width: "60%" }}
                      use12Hours
                      format={"hh:mm"}
                      value={
                        item.time?.length
                          ? [
                            moment(JSON.parse(item?.time[0])),
                            moment(JSON.parse(item?.time[1])),
                          ]
                          : []
                      }
                    />
                  </>
                ))}

              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Attendance" key="2">
            <AttendanceList />

          </Tabs.TabPane>
          <Tabs.TabPane tab="Assignment" key="3">
            Content of Tab Pane 3
          </Tabs.TabPane>
        </Tabs>
      </div>

    </div>
  );
}

export default ViewCourse;
