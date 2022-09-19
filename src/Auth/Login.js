import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, message, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/user";
import { Link, useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "react-phone-number-input/style.css";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import PhoneInput from "react-phone-number-input";
import OtpInput from "react-otp-input";
import { phoneLogin } from "../redux/user";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [finished, setFinished] = useState(false);
  const [otp, setOTP] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const current = useSelector((state) => state.user.value);
  const [buttons, setButtons] = useState(false);
  const [value, setValue] = React.useState(0);

  const generateRecaptcha = () => {
    setButtons(true);
    window.recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          console.log("prepared phone auth process", response);
        },
      },
      firebaseAuth
    );
  };

  const verifyOTP = (e) => {
    let otp = e;
    setOTP(otp);
    if (otp.length === 6) {
      let confirmationResult = window.confirmationResult;
      confirmationResult.confirm(otp).then((result) => {
        const user = result.user;
        var dat = {
          user: user,
          type: "teacher",
        };
        dispatch(phoneLogin(dat));
      });
    }
  };

  const signInPhone = () => {
    generateRecaptcha();

    const appVerifier = window.recaptchaVerifier;
    if (phone) {
      setFinished(true);
    }

    signInWithPhoneNumber(firebaseAuth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log(confirmationResult);
        setButtons(false);
      })
      .catch((error) => {
        console.log(error);
        setButtons(false);
      });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setPhone();
  };
  const Alerts = () => {
    return message.error("invalid password");
  };

  const onFinish = () => {
    setLoading(true);
    var data = {
      email: email,
      password: password,
    };
    dispatch(userLogin(data))
      .then((res) => {
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    if (current) {
      navigate("/");
    }
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <img
        src={require("../assets/Vector1.png")}
        style={{
          width: 400,
          height: 300,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <img
        src={require("../assets/data.png")}
        style={{
          width: 400,
          height: 300,
          position: "absolute",
          bottom: 0,
          right: 0,
          zIndex: 1,
        }}
      />
      <img
        src={require("../assets/Vector.png")}
        style={{
          width: 400,
          height: 300,
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      />
      <img
        src={require("../assets/logo1.png")}
        style={{
          width: 120,
          height: 60,
          position: "absolute",
          left: "45%",
          top: "20%",
        }}
      />
      <h1
        style={{
          position: "absolute",
          color: "black",
          fontWeight: "bold",
          left: "45%",
          top: "35%",
          fontSize: 26,

        }}
      >
        Login To Laba
      </h1>
      <Form
        // layout="vertical"
        style={{
          position: "absolute",
          color: "black",
          fontWeight: "bold",
          left: "43%",
          top: "45%",
          fontSize: 26,
        }}
        // name="basic"
        size="large"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 40,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            className="hover:border-[#E7752B] text-[gray] font-light"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input
            type="password"
            className="hover:border-[#E7752B] text-[gray] font-light"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            // offset: 8,
            span: 16,
          }}
        >
          <Button
            className="w-[250px] active:bg-[#E7752B] after:bg-[#E7752B] visited:bg-[#E7752B] hover:bg-[white] hover:border-[#E7752B] hover:text-[#E7752B] bg-[#E7752B] text-white  border-[#E7752B]"
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

// {/* <Box sx={{ width: "100%" }}>
//   <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//     <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
//       <Tab label="Admin" {...a11yProps(0)} />
//       <Tab label="Teacher or Parent" {...a11yProps(1)} />
//       {/* <Tab label="Parent" {...a11yProps(2)} /> */}
//     </Tabs>
//   </Box>
//   <TabPanel value={value} index={0}>
//     <Form
//       name="basic"
//       labelCol={{
//         span: 8,
//       }}
//       wrapperCol={{
//         span: 16,
//       }}
//       initialValues={{
//         remember: true,
//       }}
//       onFinish={onFinish}
//       onFinishFailed={onFinishFailed}
//       autoComplete="off"
//     >
//       <Form.Item
//         label="Email"
//         name="email"
//         rules={[
//           {
//             required: true,
//             message: "Please input your email!",
//           },
//         ]}
//       >
//         <Input onChange={(e) => setEmail(e.target.value)} />
//       </Form.Item>

//       <Form.Item
//         label="Password"
//         name="password"
//         rules={[
//           {
//             required: true,
//             message: "Please input your password!",
//           },
//         ]}
//       >
//         <Input.Password onChange={(e) => setPassword(e.target.value)} />
//       </Form.Item>

//       <Form.Item
//         name="remember"
//         valuePropName="checked"
//         wrapperCol={{
//           offset: 8,
//           span: 16,
//         }}
//       >
//         <Checkbox>Remember me</Checkbox>
//       </Form.Item>

//       <Form.Item
//         wrapperCol={{
//           offset: 8,
//           span: 16,
//         }}
//       >
//         <Button loading={loading} type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   </TabPanel>
//   <TabPanel value={value} index={1}>
//     <PhoneInput
//       placeholder="Enter phone number"
//       value={phone}
//       onChange={setPhone}
//     />
//     {finished ? (
//       <div style={{ marginTop: 20 }}>
//         <OtpInput
//           value={otp}
//           onChange={(e) => verifyOTP(e)}
//           numInputs={6}
//           separator={<span>---</span>}
//         />
//       </div>
//     ) : null}
//     <Button
//       id="sign-in-button"
//       loading={buttons}
//       type="primary"
//       style={{ marginTop: 20 }}
//       onClick={() => signInPhone()}
//     >
//       Request OTP
//     </Button>
//   </TabPanel>
// </Box>; */}
