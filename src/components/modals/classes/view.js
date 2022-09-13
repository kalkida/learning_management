import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Button, Select } from 'antd';

const { Option } = Select;

function View({ handleCancel, openView, data }) {
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
                            <Input value={data.level} />
                        </Form.Item>
                        <Form.Item label="Section">
                            <Input value={data.section} />
                        </Form.Item>
                        <Form.Item label="Students">

                            <Select
                                style={{
                                    width: "100%",
                                }}
                                defaultValue={data.student}
                                maxTagCount={2}
                                optionLabelProp="label"
                                mode="multiple"
                            >
                                {data.student.map((item, index) => (
                                    <Option key={item.key} label={item.first_name + " " + (item.last_name ? item.last_name : "")}>
                                        {item.first_name + " " + (item.last_name ? item.last_name : "")}
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