import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Button, Select,Row, Col } from 'antd';

const { Option } = Select;

function View({ handleCancel, openView, data, coursedata, sectionData ,classData }) {
    return (
        <>
 {data && openView ?
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
                        <Form.Item label="Section">
                        <Input value={data.level} />
                        </Form.Item>

                    </Form>
                    </Col>
                </Row>

                </Modal>
                : null}
        </>
    )
}

export default View