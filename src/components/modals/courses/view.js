import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Button, Select } from 'antd';

const { Option } = Select;

function View({ handleCancel, openView, data, coursedata, sectionData }) {
    return (
        <>
            {data && openView ?
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
                            <Input value={data.course_name} />
                        </Form.Item>
                        <Form.Item label="Teachers">
                            <Select
                                style={{
                                    width: "100%",
                                }}

                                optionLabelProp="label"
                                mode="multiple"
                                maxTagCount={2}
                                defaultValue={data.teachers}
                            >
                                {data.teachers.map((item, index) => (
                                    <Option key={item.key} label={item.first_name + " " + (item.last_name ? item.last_name : "")}>
                                        {item.first_name + " " + (item.last_name ? item.last_name : "")}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Class">
                            <Input value={data.class.level + " " + data.class.section} />
                        </Form.Item>
                        <Form.Item label="course description">
                            <Input value={data.description} />
                        </Form.Item>
                        <Form.Item label="Schedule">
                            <Input value={data.sechedule} />
                        </Form.Item>


                    </Form>
                </Modal>
                : null}
        </>
    )
}

export default View