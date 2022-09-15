import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, TimePicker } from "antd";
import moment from "moment";

const { Option } = Select;

function View({ handleCancel, openView, data, coursedata, sectionData }) {
  return (
    <>
      {data && openView ? (
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
      ) : null}
    </>
  );
}

export default View;
