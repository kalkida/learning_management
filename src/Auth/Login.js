import React, { useEffect, useState , useLayoutEffect} from "react";
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
import image from "../assets/vectors_1.png";
import image1 from "../assets/clip6.png";
import { phoneLogin } from "../redux/user";
import logo from "../assets/log.png";
// import { Parallax, ParallaxLayer } from "@reactspring/parallax";

function TabPanel(props) {
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export default function Login() {
  const [width, height] = useWindowSize();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [setLogingIn, setLoadingData] = useState(false);
  const [finished, setFinished] = useState(false);
  const [otp, setOTP] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const current = useSelector((state) => state.user.value);
  const [buttons, setButtons] = useState(false);
  const [value, setValue] = React.useState(0);
  const [LeftValue, setLeftValue] = useState("");
  const [WidthValue, setWidthValue] = useState("");
  const [OverLeftValue, setOverLeftValue] = useState("");
  const [OverWidthValue, setOverWidthValue] = useState("");
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPhone();
  };
  const Alerts = () => {
    return message.error("invalid password");
  };

  const onFinish = () => {
    console.log("data");
    setLoading(true);
    var data = {
      email: email,
      password: password,
    };
    dispatch(userLogin(data))
      .then((res) => {
        if (res.error) {
          message.error("Failed to login");
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handlechanging =()=>{
    if(size.width <= 1400){
      setLeftValue("60%")
      setOverLeftValue("5%")
      setWidthValue("40%")
      console.log("Size: " + LeftValue)
    }else {
      console.log("Size: ")
    }
  }

  const [size, setSize] = useState(); const resizeHanlder = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setSize({
      width: width,
      height: height,
    });
  };

  // Listening for the window resize event
  useEffect(() => {
    window.addEventListener('resize', resizeHanlder);

    // Cleanup function
    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', resizeHanlder);
    }
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLeftValue(size.width > 2000 ? 2000 : size>1000 )
  //   }, 2000);
  // })

  useEffect(() => {
    if (current) {
      navigate("/"); 
    }
  });
 
  return (
    <div className="flex min-h-screen" >
      <div className="w-full md:w-1/2 flex items-center">
        <div className="w-full max-w-70 mx-auto px-4 py-15">
          <div className="flex items-center justify-center">
          <img src={logo} className="w-10" />
          </div>
          <div className="text-center my-5">
          <h1
         className="text-center text-2xl font-medium mb-10 !font-jakarta">Sign in To Laba</h1>
          </div>
          <div className="lg:flex lg:items-center mb-2">
          </div>
          <div className="relative flex items-center justify-center h-5 mb-2">
          </div>
          <div className="ml-[25%]">
          <div className="flex flex-col justify-center mb-[20px] ">
              <input
                required
                placeholder="Email Address"
                className="border-[#D0D5DD] focus:bg-[#FCF2FB] !font-jakarta  outline-none border-[2px] text-[gray] font-light h-[44px] w-[300px] hover:border-[#DC5FC9] focus:border-[#DC5FC9] rounded-lg p-2"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-[20px]">
              <input
                required
                type="password"
                placeholder="password"
                className="border-[#D0D5DD] focus:bg-[#FCF2FB] !font-jakarta outline-none border-[2px] text-[gray] font-light h-[44px] w-[300px] hover:border-[#DC5FC9] focus:border-[#DC5FC9] rounded-lg p-2"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              onClick={() => onFinish()}
              className="!font-jakarta w-[300px] !h-[44px] !rounded-lg  hover:!bg-gradient-to-l hover:from-[#DC5FC9] hover:to-[#DC5FC9] 
              !bg-gradient-to-r from-[#DC5FC9] to-[#FAAA35] 
              !text-[white] hover:!text-[white] hover:!border-[#DC5FC9]  border-[#DC5FC9]"
              disabled={loading}
              
              loading={loading}
              type="submit"
            >
              Login
            </Button>
            </div>
            <div className="flex items-center justify-center mt-5">

            </div>
        </div>
      </div>
      {/* <div className="flex flex-col w-[50vw] justify-center "
      >
        <div className="flex flex-row justify-center mb-5">
          <img src={logo} className="w-10" />
        </div>
        <h1
         className="text-center text-2xl font-medium mb-10 !font-jakarta">Sign in To Laba</h1>
        <div className="flex flex-row justify-center">
          <div>
            <div className="flex flex-col justify-center mb-[20px] ">
              <input
                required
                placeholder="Email Address"
                className="border-[#D0D5DD] focus:bg-[#FCF2FB] !font-jakarta  outline-none border-[2px] text-[gray] font-light h-[44px] w-[300px] hover:border-[#DC5FC9] focus:border-[#DC5FC9] rounded-lg p-2"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-[20px]">
              <input
                required
                type="password"
                placeholder="password"
                className="border-[#D0D5DD] focus:bg-[#FCF2FB] !font-jakarta outline-none border-[2px] text-[gray] font-light h-[44px] w-[300px] hover:border-[#DC5FC9] focus:border-[#DC5FC9] rounded-lg p-2"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={() => onFinish()}
              className="!font-jakarta w-[300px] !h-[44px] !rounded-lg  hover:!bg-gradient-to-l hover:from-[#DC5FC9] hover:to-[#DC5FC9] 
              !bg-gradient-to-r from-[#DC5FC9] to-[#FAAA35] 
              !text-[white] hover:!text-[white] hover:!border-[#DC5FC9]  border-[#DC5FC9]"
              disabled={loading}
              
              loading={loading}
              type="submit"
            >
              Login
            </Button>
            <br />
            <div className="flex flex-col">
              <a className="text-center py-6 hover:text-[#667085] text-[#667085] text-xs !font-jakarta">
              <a href="https://www.laba.school/contact" rel="noreferrer">
                 Contact Us
              </a>
              </a>
            </div>
          </div>
        </div>
      </div>     */}
    <div className="hidden md:block md:w-1/2 bg-wtf-pigmentblue relative overflow-hidden justify-center">
      <svg className="absolute top-0 left-0" width={720} height={784} viewBox={"0 0 720 784"} 
      fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
        <path
          d = "M-392.905 -502.476L-391.004 -501.739C-391.004 -501.739 326.491 -197.031 501.442 -56.8491C676.392 83.3324 662.208 352.981 508.59 506.599C354.972 660.217 85.3233 674.401 -54.8582 499.451C-195.04 324.5 -499.748 -392.994 -499.748 -392.994L-500.485 -394.895C-516.584 -436.403 -527.156 -463.658 -494.411 -496.402C-461.667 -529.146 -434.412 -518.575 -392.905 -502.476Z"
          fill="#DC5FC9"
          >
        </path>
      </svg>
      <svg className="absolute top-0 left-0" width={392} height={487} viewBox={"0 0 392 487"} 
      fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
        <path
        d="M-336.818 -308.216L-335.645 -307.762C-335.645 -307.762 106.836 -120.048 214.706 -33.6373C322.576 52.7737 313.735 219.111 218.923 313.922C124.112 408.734 -42.2253 417.575 -128.636 309.705C-215.047 201.835 -402.761 -240.646 -402.761 -240.646L-403.215 -241.819C-413.132 -267.417 -419.644 -284.226 -399.434 -304.435C-379.225 -324.644 -362.416 -318.133 -336.818 -308.216Z"
        fill ="#FCC5F3"
        >
        </path>
        </svg>  
      <svg className="absolute bottom-0 left-0" width={632} height={316} viewBox={"0 0 632 316"} 
      fill={"#DC5FC9"} xmlns={"http://www.w3.org/2000/svg"}>
        <path
        d="M-351.418 900.397L-350.856 898.948C-350.856 898.948 -118.665 351.944 -11.8154 218.578C95.0341 85.2126 300.633 96.0786 417.79 213.235C534.947 330.392 545.813 535.991 412.447 642.841C279.081 749.69 -267.923 981.882 -267.923 981.882L-269.372 982.444C-301.016 994.711 -321.795 1002.77 -346.768 977.793C-371.74 952.821 -363.685 932.042 -351.418 900.397Z"
        fill="#DC5FC9"></path>
      </svg>
      <svg className="absolute bottom-0 right-0" width={477} height={768} viewBox={"0 0 477 768"} 
      fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
        <path
        d="M334.917 239.653L336.582 240.299C336.582 240.299 965.06 507.074 1118.29 629.839C1271.52 752.603 1259.04 988.825 1124.43 1123.43C989.823 1258.04 753.6 1270.52 630.836 1117.29C508.071 964.063 241.296 335.585 241.296 335.585L240.65 333.92C226.556 297.562 217.301 273.688 245.993 244.996C274.685 216.304 298.559 225.559 334.917 239.653Z"
        fill="#00ACFF"
        >
        </path>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center ">
          <div className=" w-89  px-8 bg-white py-4 justify-center  rounded shadow-menu m-40">
     <div style={{position:'absolute', backgroundColor:'white', 
     width:280,height:350, borderRadius:15 ,margin:'-25%', marginLeft:'-20%' ,padding:20 }}>
            <div className="w-6 h-6">
              <img className="block w-6 h-6 ml-5 mt-5 mb-5" src={logo} />
            </div>
            <p className="text-18 mt-10 !font-jakarta  ">
            Laba School is the best option for chechking Student Performance. I experienced the way things work, and wow, are you kidding me! Laba is gonna change the industry!
                .</p>
            <div className="relative flex items-center mt-10">
            <img className="block w-8 h-8 rounded-full" 
            src={image1}
            />
            <div className="ml-2 ">
              <h4 className="text-16 font-medium !font-jakarta ">admin</h4>
              <span className="text-wtf-wildblue !font-jakarta mt[-2]">@Laba</span>
            </div>
            </div>
            </div>
            </div>
        </div>
     
    </div>

  {/* //   <div className="md:w-[50vw] w-0 invisible md:visible md:block w-[100%] h-[100vh]"
  //   > 
  //     <img src={image1}  viewBox={"0 0 720 787"}
  //     style={{ margin:0,
  //       padding:0,
  //       zIndex:8,
  //       top:0,
  //       position:'absolute', 
  //       width: size.width > 2000? 1000 : size.width > 1500 ? 750 : size.width>1000 ? 500: 200,
  //       height: size.height
  //       }}
  //     />
  // </div>  */}
    
   
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
