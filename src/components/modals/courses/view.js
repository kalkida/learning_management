import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Input, Button, Select, TimePicker, Tabs, Table } from "antd";
import moment from "moment";
import './style.css';

const { Option } = Select;

function ViewCourse({ handleCancel, openView, data, coursedata, sectionData }) {

  const navigate = useNavigate();
  const Teacher = [{ name: "Teshome Belay" },
  { name: "Kalkidan Hailu" }];

  const columns = [
    {
      title: 'Teacher',
      dataIndex: 'name',
      key: 'name',
    },

  ];

  const handleUpdate = () => {
    console.log("navigation")
    navigate('/update-course');
  }
  return (
    <div>
      <div className="profile-header" >
        <div className="course-avater" >
          <img src="logo512.png" alt="profile" />
          <div className="profile-info">
            <h2>History 11A</h2>
            <h3>Grade 11A</h3>
          </div>
        </div>
        <div className="header-extra">
          <div>
            <h3>Assigned Teachers</h3>
            <h4>2</h4>
          </div>
          <div>
            <h3>Class/week</h3>
            <h4>7</h4>
          </div>
        </div>
      </div>
      <div className="tab-content">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Profile" key="1">
            <Button onClick={handleUpdate}>Edit Course</Button>
            <div className="course-description">
              <h4>Coures Description</h4>
              <Input.TextArea
                width="100%"
                rows={4}
                defaultValue="course Description course Description"
              />
            </div>
            <div className="asssign-teacher">
              <h4>Assigned Teachers</h4>
              <Table dataSource={Teacher} columns={columns} />
            </div>
            <div className="schedule">
              <h4>Weekly Schedule</h4>
              <div className="card-schedule">
                <h2 >Class 7B</h2>
                <div className="schedule-header">
                  <div>
                    <p> Period</p>
                  </div>
                  <div>
                    <p> Start time</p>
                    <p> End time</p>
                  </div>
                </div>

                <Input value={"monday"} style={{ width: "40%" }} />
                <TimePicker.RangePicker
                  style={{ width: "60%" }}
                  use12Hours
                  format={"hh:mm"}
                  value={
                    [
                      moment("2020-03-09 13:00"),
                      moment("2020-03-09 13:00"),
                    ]

                  }
                />
                <Input value={"Thusday"} style={{ width: "40%" }} />
                <TimePicker.RangePicker
                  style={{ width: "60%" }}
                  use12Hours

                  format={"hh:mm"}
                  value={
                    [
                      moment("2020-03-09 13:00"),
                      moment("2020-03-09 13:00"),
                    ]

                  }
                />
                <Input value={"Wednsday"} style={{ width: "40%" }} />
                <TimePicker.RangePicker
                  style={{ width: "60%" }}
                  use12Hours
                  format={"hh:mm"}
                  value={
                    [
                      moment("2020-03-09 13:00"),
                      moment("2020-03-09 13:00"),
                    ]

                  }
                />
                <Input value={"Thursday"} style={{ width: "40%" }} />
                <TimePicker.RangePicker
                  style={{ width: "60%" }}
                  use12Hours
                  format={"hh:mm"}
                  value={
                    [
                      moment("2020-03-09 13:00"),
                      moment("2020-03-09 13:00"),
                    ]

                  }
                />
                <Input value={"Friday"} style={{ width: "40%" }} />
                <TimePicker.RangePicker
                  style={{ width: "60%" }}
                  use12Hours
                  format={"hh:mm"}
                  value={
                    [
                      moment("2020-03-09 13:00"),
                      moment("2020-03-09 13:00"),
                    ]

                  }
                />

              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Attendance" key="2">
            Content of Tab Pane 2
          </Tabs.TabPane>
          <Tabs.TabPane tab="Assignment" key="3">
            Content of Tab Pane 3
          </Tabs.TabPane>
        </Tabs>
      </div>
      {/* {data && openView ? (
        <Modal
          visible={openView}
          title="View Course"
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Return
            </Button>,
          ]}
        >
          <Form
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
          >
            <Form.Item label="course name">
              <Input value={data?.course_name} />
            </Form.Item>
            {data.teachers ? (
              <Form.Item label="Teachers">
                <Select
                  style={{
                    width: "100%",
                  }}
                  optionLabelProp="label"
                  mode="multiple"
                  maxTagCount={2}
                  defaultValue={data?.teachers}
                >
                  {data?.teachers.map((item, index) => (
                    <Option
                      key={item.key}
                      label={
                        item.first_name +
                        " " +
                        (item.last_name ? item.last_name : "")
                      }
                    >
                      {item.first_name +
                        " " +
                        (item.last_name ? item.last_name : "")}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : null}
            <Form.Item label="Class">
              <Input value={data.class?.level + " " + data.class?.section} />
            </Form.Item>
            <Form.Item label="course description">
              <Input value={data.description} />
            </Form.Item>
            {data ? (
              <Form.Item label="Schedule">
                {data?.schedule.map((item) => (
                  <>
                    <Input value={item.day} style={{ width: "40%" }} />
                    <TimePicker.RangePicker
                      style={{ width: "60%" }}
                      use12Hours
                      disabled
                      format={"hh:mm"}
                      defaultValue={
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
              </Form.Item>
            ) : null}
          </Form>
        </Modal>
      ) : null} */}
    </div>
  );
}

export default ViewCourse;
