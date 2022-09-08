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
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                    >
                        <Form.Item label="course name">
                            <Input value={data.name} />
                        </Form.Item>

                        <Form.Item label="course description">
                            <Input value={data.description} />
                        </Form.Item>
                  
                        
                    </Form>
                </Modal>
                : null}
        </>
    )
}

export default View