import { MailFilled } from "@ant-design/icons";
import { Form, Input, Select } from "antd";
import React from "react";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const AddParent = () => (
  <Form {...formItemLayout}>
    <Form.Item
      label="Phone Number"
      help="Add Parent phone number For Authentication"
    >
      <Input placeholder="+251" />
    </Form.Item>

    <Form.Item label="Email" validateStatus="warning">
      <Input placeholder="example@domain.com" prefix={<MailFilled />} />
    </Form.Item>

    <Form.Item
      label="First Name"
      hasFeedback
      //   validateStatus="validating"
      //   help="Only First name "
    >
      <Input placeholder="I'm the content is being validated" id="validating" />
    </Form.Item>

    <Form.Item label="Last Name">
      <Input placeholder="only last name" />
    </Form.Item>

    <Form.Item label="Section" hasFeedback validateStatus="warning">
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="select one country"
        defaultValue={["china"]}
        onChange={handleChange}
        optionLabelProp="label"
      >
        <Option value="china" label="China">
          <div className="demo-option-label-item">
            <span role="img" aria-label="China">
              🇨🇳
            </span>
            China (中国)
          </div>
        </Option>
        <Option value="usa" label="USA">
          <div className="demo-option-label-item">
            <span role="img" aria-label="USA">
              🇺🇸
            </span>
            USA (美国)
          </div>
        </Option>
        <Option value="japan" label="Japan">
          <div className="demo-option-label-item">
            <span role="img" aria-label="Japan">
              🇯🇵
            </span>
            Japan (日本)
          </div>
        </Option>
        <Option value="korea" label="Korea">
          <div className="demo-option-label-item">
            <span role="img" aria-label="Korea">
              🇰🇷
            </span>
            Korea (韩国)
          </div>
        </Option>
      </Select>
    </Form.Item>
  </Form>
);

export default AddParent;
