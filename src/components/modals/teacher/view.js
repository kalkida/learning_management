import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Button, Select, Row, Col, Tabs, Table, Tag } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import './style.css'

const { Option } = Select;

function TeacherView() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { data } = state;

    console.log(data)

    const handleUpdate = () => {
        navigate('/update-teacher', { state: { data } })
    }

    const teacherCourse = [{
        subject: "Math",
        Grade: "8",
        Section: "A",
        Class_week: "4",
        Branch: "4 Kilo"
    },
    {
        subject: "Chemistry",
        Grade: "8",
        Section: "B",
        Class_week: "2",
        Branch: "Bole"
    },
    {
        subject: "Biology",
        Grade: "9",
        Section: "B",
        Class_week: "3",
        Branch: "Gerji"
    },
    {
        subject: "History",
        Grade: "7",
        Section: "D",
        Class_week: "1",
        Branch: "Legehar"
    },
    {
        subject: "Physics",
        Grade: "11",
        Section: "A",
        Class_week: "4",
        Branch: "Saris"
    }]

    const columns = [
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject'


        },
        {
            title: 'Grade',
            dataIndex: 'Grade',
            key: 'Grade',
        },
        {
            title: 'Section',
            dataIndex: 'Section',
            key: 'Section'


        },
        {
            title: 'Class/Week',
            dataIndex: 'Class_week',
            key: 'Class_week',
        },
        {
            title: 'Branch',
            dataIndex: 'Branch',
            key: 'Branch',
        },

    ]

    return (
        <>
            <div>
                <div className="profile-header" >
                    <div className="teacher-avater" >
                        <img src={data.avater ? data.avater : "img-5.jpg"} alt="profile" />
                        <div className="profile-info">
                            <h2>{data.first_name + " " + data.last_name}</h2>
                            <h3>ID: {data.id}</h3>
                        </div>
                    </div>
                    <div className="header-extra">
                        <div>
                            <h3>Assigned Subject</h3>
                            <h4>{data.course?.map((item, i) => <Tag key={i} color={"orange"}>{item}</Tag>)}</h4>
                        </div>
                        <div>
                            <h3>Assigned Class</h3>
                            <h4>{data.class?.map((item, i) => <Tag key={i} color={"orange"}>{item}</Tag>)}</h4>
                        </div>
                    </div>
                </div>
                <div className="tab-content">
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Profile" key="1">
                            <Button className="btn-confirm" onClick={handleUpdate}>Edit Profile</Button>
                            <div className='teacher-static'>
                                <div>
                                    <h1>7.8</h1>
                                    <span>Assigned Grade</span>
                                </div>
                                <div>
                                    <h1>{data.class.length}</h1>
                                    <span>Classes</span>
                                </div>
                                <div>
                                    <h1>{data.course.length}</h1>
                                    <span>Course</span>
                                </div>
                                <div>
                                    <h1>6</h1>
                                    <span>Classes/Week</span>
                                </div>
                            </div>
                            <div className='teacher-profile'>
                                <div className='personal-info'>
                                    <h1>Personal Information</h1>
                                    <div className='info-content'>
                                        <div className='col'>
                                            <div>
                                                <h3>Age</h3>
                                                <span>2</span>
                                            </div>
                                            <div>
                                                <h3>Sex</h3>
                                                <span>Male</span>
                                            </div>
                                            <div>
                                                <h3>Phone number</h3>
                                                <span>{data.phone}</span>
                                            </div>
                                            <div>
                                                <h3>Email</h3>
                                                <span>{data.email}</span>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div>
                                                <h3>Address</h3>
                                                <span>Nifas Silk Lafto</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='career-profile'>
                                    <h1>Career Profile</h1>
                                    <div>
                                        <h3>Working Since</h3>
                                        <span>2018</span>
                                    </div>
                                    <div>
                                        <h3>Speciality</h3>
                                        <span>Teacher,Engineer</span>
                                    </div>
                                    <div>
                                        <h3>Work Expirence</h3>
                                        <span>4 year</span>
                                    </div>
                                </div>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Course" key="2">
                            <div className='teacher-course-list'>
                                <div className='tch-cr-list'>
                                    <h1>Assigned Courses</h1>
                                    <Button>Add/Remove</Button>
                                </div>
                                <Table dataSource={teacherCourse} columns={columns} />
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Course" key="3">
                            Content of Tab Pane 3
                        </Tabs.TabPane>
                    </Tabs>
                </div>

            </div>
            {/* {data && openView ?
                <Modal
                    visible={openView}
                    title="View Teacher"
                    onCancel={handleCancel}
                    width={756}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Return
                        </Button>,
                    ]}
                >

<Row>               
               <Col style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img src={data.avater} alt="" style={{ width: "330px" }} />
                    </Col>
                    <Col style={{ width: "50%", padding: "20px" }}>
                    <Form
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 24 }}
                        layout="horizontal"

                    >
                         <Form.Item label="first name">
                            <Input value={data.first_name} />
                        </Form.Item>
                        <Form.Item label="last name">
                            <Input value={data.last_name} />
                        </Form.Item>
                        <Form.Item label="phone">
                            <Input value={data.phone} />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input value={data.email} />
                        </Form.Item>
                        <Form.Item label="Courses">
                        <Input value={data.course} />
                        </Form.Item>
                        
                        <Form.Item label="class">
                        <Input value={data.class} />
                        </Form.Item>

                    </Form>
                    </Col>
                </Row>

                </Modal>
                : null} */}
        </>
    )
}

export default TeacherView