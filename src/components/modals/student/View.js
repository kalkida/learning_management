import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Tabs,
  Table,
  Tag,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";

function ViewStudent() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { data } = state;
    const [weekClass, setWeekClass] = useState();
    const [age, setAge] = useState();
    const [expriance, setExpriance] = useState();
    console.log(data.level)

  
    // var getworkTime = new Date(JSON.parse(data.working_since));
    // const workTime = getworkTime.getFullYear() + "-" + getworkTime.getMonth() + "-" + getworkTime.getDay()
  
    useEffect(() => {
  
      var today = new Date();
      var birthDate = new Date(JSON.parse(data.DOB));
      var calage = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calage--;
      }
  
    
  
      setAge(calage);
    }, []);
  
    const handleUpdate = () => {
      navigate("/update-teacher", { state: { data } });
    };
  
    const columns = [
      {
        title: "Course",
        dataIndex: "course_name",
        key: "course_name",
      },
      {
        title: "Subject",
        dataIndex: "subject",
        key: "subject",
        render: (item) => {
          return <div>{item.name}</div>;
        },
      },
      {
        title: "Class",
        dataIndex: "class",
        key: "class",
        render: (item) => {
          return (
            <div>
              {item.level}
              {"   "}
              {item.section}
            </div>
          );
        },
      },
    ];
  
    const classColumns = [
      {
        title: "Grade",
        dataIndex: "level",
        key: "course_name",
      },
      {
        title: "Section",
        dataIndex: "section",
        key: "secticon",
      },
    ];

    return (
        <>
        <div>
        <div className="profile-header">
          <div className="teacher-avater">
            <img src={data.avater ? data.avater : "img-5.jpg"} alt="profile" />
            <div className="profile-info">
              <h2>{data.first_name + " " + data.last_name}</h2>
              <h3>Contact</h3>
            </div>
          </div>
          <div className="header-extra">    
          <div>
            <h3>Class</h3>
            <h4>{data.level.level+ data.level.section }</h4>
{/* 
            <h4>{data.level?.map((item, i) => item.level + item.section + ",")}</h4> */}
          </div>
          {/* <div>
            <h3>Assigned Course</h3>
            <h4>{data?.course.length}</h4>
          </div> */}
        </div>
        </div>
        <div className="tab-content">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Profile" key="1">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="teacher-static">
                <div>
                  <h1>{data.level.level}</h1>
                  <span>Grade</span>
                </div>
                <div>
                  <h1>2</h1>
                  <span>Sibilings</span>
                </div>
                <div>
                  <h1>4</h1>
                  <span>Rank</span>
                </div>
                <div>
                  <h1>A</h1>
                  <span>Conduct</span>
                </div>
              </div>
              <h1  style={{ fontSize:22 , fontWeight:'bold' , marginTop:'10%' , marginBottom:'2%'}}>Student Information</h1>
              <div className="teacher-static">
                <div>
                <span>Age</span>
                <h2 style={{ fontSize:14 , fontWeight:'bold'}}>{age}</h2>
                </div>
                <div>
                <span>Sex</span>
                <h2 style={{ fontSize:14 , fontWeight:'bold'}}>{data.sex}</h2>
                </div>
                <div>
                <span>phoneNumber</span>
                <h2 style={{ fontSize:14 , fontWeight:'bold'}}>{data.phone[0]}</h2>
                </div>
                <div>
                  <span>Email</span>
                  <h2 style={{ fontSize:14 , fontWeight:'bold'}}>{data.email}</h2>
                </div>
                <div>
                  <span>Location</span>
                  <h2 style={{ fontSize:14 , fontWeight:'bold'}}>Lideta</h2>
                </div>
              </div>
              <div className="teacher-profile">
                <div className="career-profile">
                  <h1>Guardian Information</h1>
                  <div>
                    <h3> Full Name</h3>
                    <span> Guardian Name</span>
                  </div>
                  <div>
                    <h3>Phone Number</h3>
                    <span>{data.phone[1]}</span>
                  </div>
                  <div>
                    <h3>Email</h3>
                    <span>{data.email}</span>
                  </div>
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Course" key="2">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="teacher-course-list">
                <div className="tch-cr-list">
                  <h1>Assigned Courses</h1>
                </div>
                <Table dataSource={data.course} columns={columns} />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Class" key="3">
              <Button className="btn-confirm" onClick={handleUpdate}>
                Edit Profile
              </Button>
              <div className="teacher-course-list">
                <div className="tch-cr-list">
                  <h1>Assigned Classes</h1>
                </div>
                <Table dataSource={data.class} columns={classColumns} />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
        </div>



            {/* <Modal
                visible={openView}
                title="Student Profile"
                onCancel={handleViewCancel}
                width={756}
                footer={[
                    <Button key="back" onClick={handleViewCancel}>
                        Return
                    </Button>,

                ]}
            >
                <Row>
                    <Col style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img src={data.avater} alt="" style={{ width: "330px" }} />
                    </Col>
                    <Col style={{ width: "50%", padding: "10px" }}>
                        <Form
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 18 }}
                            layout="horizontal"
                        >
                            <Form.Item label="First Name">
                                <Input value={data.first_name} />
                            </Form.Item>
                            <Form.Item label="Last Name">
                                <Input value={data.last_name} />
                            </Form.Item>
                            <Form.Item label="Email">
                                <Input value={data.email} />
                            </Form.Item>
                            <Form.Item label="Date Of Birth">
                                <DatePicker defaultValue={moment(data.DOB, dateFormat)} />
                            </Form.Item>
                            <Form.Item label="Phone">
                                {data.phone?.map((item, index) => {
                                    return <Input value={item} />;
                                })}
                            </Form.Item>
                            <Form.Item label="Class">
                                <Input defaultValue={data.class?.level + data.class?.section} />
                            </Form.Item>
                            <Form.Item label="Level">
                                <Input value={data.level} />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>

            </Modal> */}
        </>
    )
}

export default ViewStudent