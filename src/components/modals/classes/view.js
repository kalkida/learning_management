import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Button, Select } from 'antd';

const { Option } = Select;

function View({ handleCancel, openView, data, coursedata, sectionData }) {
    return (
        <>
            {data && openView ?
                <Modal
                    visible={openView}
                    title="View Class"
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Return
                        </Button>,
                    ]}
                >
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                    >
                        <Form.Item label="Grade">
                            <Input value={data.grade} />
                        </Form.Item>
                        <Form.Item label="Courses">
                            {coursedata.length ?
                                <Select
                                    style={{
                                        width: "100%",
                                    }}
                                    defaultValue={coursedata}

                                    optionLabelProp="label"
                                    mode="multiple"
                                >
                                    {data.course.map((item, index) => (
                                        <Option key={item.name} label={item.name}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                                : null}
                        </Form.Item>

                        <Form.Item label="Section">
                            <Select
                                style={{ width: "100%" }}
                                value={sectionData}
                                mode="multiple"
                            >
                                {data.sections.map((item, i) => (
                                    <Option key={item.name} lable={item.name}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Form>
                </Modal>
                : null}
        </>
    )
}

export default View