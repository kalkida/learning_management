import React, { useEffect, useState } from "react";
import Liner from "../graph/Liner";
import BarGraph from "../graph/BarGraph";
import { useSelector , useDispatch } from "react-redux";
import { Card, Progress, } from "antd";
import Grid from "@mui/material/Grid";
import { firestoreDb } from "../../firebase";
import { Button } from "antd";
import ChartStudent from "../graph/studentGraph/Chart";
import ChartStaff from "../graph/staffGraph/Chart";
import ChartTeacher from "../graph/teacherGraph/Chart";

import { userAction } from "../../redux/user";
import {
  getDocs,
  query,
  collection,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { async } from "@firebase/util";
import "../modals/attendance/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown} from "@fortawesome/free-solid-svg-icons";
import { faArrowUp} from "@fortawesome/free-solid-svg-icons";
import Icon from 'react-eva-icons'
import "../../Auth/stylle.css"
 import Select ,{components} from 'react-select'
import { classAction } from "../../redux/class";
import { IssuesCloseOutlined } from "@ant-design/icons";

//  const { Option } = Select;
export default function AdminDash() {
  const [students, setStudents] = useState([]);
  // const [isDaily , setIsDaily] = useState("none");
  
  const [isWeekly , setIsWeekly] = useState("none");
  const [isMonthly , setIsMonthly] = useState("none");
  const [isAnually , setIsAnually] = useState("none");
  const [isMale , setIsMale] = useState("none");
  const [isFemale , setIsFemale] = useState("none");
  const [isAll , setIsAll] = useState("none");
  const [male, setMale] = useState([]);
  const [female, setfemale] = useState([]);
  const [teachermale, setmaleteacher] = useState([]);
  const [teacherfemale, setfemailteacher] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [studentAttendance, setstudentAttendance] = useState([]);
  const [attendStudents, setAttendStudents] = useState();
  const school = useSelector((state) => state.user.profile.school);
  const [classes, setClasses] = useState([]);
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(userAction.logout());
  };

  const schools = useSelector((state) => state.user.profile);
  
  var isDaily =  "white"
  var Student = [];
  const value = new Date();
  const date = value.getDate() < 10 ? "0" + value.getDate() : value.getDate();
  const month =
    value.getMonth() + 1 < 10
      ? "0" + (value.getMonth() + 1)
      : value.getMonth() + 1;
  const year = value.getFullYear();

  const filterDate = year + "-" + month + "-" + date;

  const getStudents = async () => {
    const q = query(collection(firestoreDb, "schools", `${school}/students`));
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();
      data.key = doc.id;
      temporary.push(data);
    });
    var male = temporary.filter((doc) => doc.sex === "Male");
    var femail = temporary.filter((doc) => doc.sex === "Female");
    Student = temporary;
    setStudents(temporary);
    setMale(male);
    setfemale(femail);
  };

  useEffect(() => {
    getStudents();
    getAbsentStudent();
    getTeacher();
  }, []);

  const getTeacher = async () => {
    const q = query(collection(firestoreDb, "schools", `${school}/teachers`));
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();
      temporary.push(data);
    });
    var male = temporary.filter((doc) => doc.sex === "Male");
    var femail = temporary.filter((doc) => doc.sex === "Female");
    setfemailteacher(femail);
    setmaleteacher(male);
    setTeacherData(temporary);
  };

  const getAbsentClass = async () => {
    var temporary = [];

    const queryCourse = query(
      collection(firestoreDb, "schools", `${school}/class`)
    );

    const snapCourse = await getDocs(queryCourse);
    snapCourse.forEach(async (doc) => {
      var data = doc.data();
      data.student.map(
        async (doc, i) => (data.student[i] = await getStudentsSex(doc))
      );
      temporary.push(data);
    });
    setClasses(temporary);
  };

  const Dates =[
    {
      id:1,
      label:
      <div 
      style={{display:"flex"}}
      >
      <div style={{
        display: "block"
      }}>
      <Icon name = "checkmark-outline" 
      fill={isDaily}
      size="medium"
      />
      </div>
      <span style={{marginLeft:10 }}>Daily</span>
      </div>,
      value:"Daily"
    } ,
    {
      id:2,
      label:
      <div 
      style={{display:"flex"}}
      >
      <div style={{
        display: "block"
      }}>
      <Icon name = "checkmark-outline" 
      fill={isDaily}
      size="medium"
      />
      </div>
      <span style={{marginLeft:10 }}>Weekly</span>
      </div>,
      value:"Weekly"
    } ,
    {
      id:3,
      label:
      <div 
      style={{display:"flex"}}
      >
      <div style={{
        display: "block"
      }}>
      <Icon name = "checkmark-outline" 
       fill={isDaily}
      size="medium"
      />
      </div>
      <span style={{marginLeft:10 }}>Monthly</span>
      </div>,
      value:"Monthly"
    } ,
    {
      id:4,
      label:
      <div 
      style={{display:"flex"}}
      >
      <div style={{
        display: "block"
      }}>
      <Icon name = "checkmark-outline" 
       fill={"#DC5FC9"}
      size="medium"
      />
      </div>
      <span style={{marginLeft:10 }}>Annually</span>
      </div>,
      value:"Annually"
    }]
  
    const Genders =[
      {
        id:1,
        label:
        <div 
        style={{display:"flex"}}
        >
        <div style={{
          display: isMale
        }}>
        <Icon name = "checkmark-outline" 
         fill={"DC5FC9"}
        size="medium"
        />
        </div>
        <span style={{marginLeft:10 }}>Male</span>
        </div>,
        value:"Male",
        icon:"arrow-ios-downward-outline"
        
      } ,
      {
        id:2,
        label:
        <div 
        style={{display:"flex"}}
        >
        <div style={{
          display: isFemale
        }}>
        <Icon name = "checkmark-outline"
         fill={"DC5FC9"}
        size="medium"
        />
        </div>
        <span style={{marginLeft:10 }}>Female</span>
        </div>,
        value:"Female",
        icon:"arrow-ios-downward-outline"
      } ,
      {
        id:3,
        label:
        <div 
        style={{display:"flex"}}
        >
        <div style={{
          display: isAll
        }}>
        <Icon name = "checkmark-outline" 
        fill={"#DC5FC9"}
        size="medium"
        />
        </div>
        <span style={{marginLeft:10 }}>All Genders</span>
        </div>,
        value:"All Genders",
        icon:"arrow-ios-downward-outline"
      } ,
    ]

    const handleselect =({item}) =>{
      return(
        <div className="flex items-center">
          <div className="w-3 h-3 mr-1 text-wtf-majorelle">
          <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full stroke-current fill-transparent"
          >
            <path d="M17.335 8.333 10 15.667l-3.333-3.334" stroke="#7047EB"
            stroke-width="1.5" stroke-linecap="round" stroke-strokeLinejoin="round"
            > 
              </path>
          </svg>
          <span className="text-wtf-majorelle font-medium">{item}</span>
          </div>
        </div>
      )
    }

  const getStudentsSex = async (ID) => {
    const docRef = doc(firestoreDb, "schools", `${school}/students`, ID);
    var data = "";
    await getDoc(docRef).then((response) => {
      data = response.data();
      data.key = response.id;
    });
    return data;
  };

  const getAbsentStudent = async () => {
    getAbsentClass();
    var temporary = [];
    const queryCourse = query(
      collection(firestoreDb, "schools", `${school}/courses`)
    );
    const snapCourse = await getDocs(queryCourse);

    snapCourse.forEach(async (docs) => {
      const queryAttendace = query(
        collection(firestoreDb, "attendanceanddaily", `${docs.id}/attendace`),
        where("date", "==", filterDate)
      );

      const snap = await getDocs(queryAttendace);
      snap.forEach((doc) => {
        var data = doc.data();
        data.key = data.id;
        var hasData = false;
        temporary.forEach((item) => {
          if (item.studentId == data.studentId) {
            hasData = true;
          }
        });
        if (!hasData) {
          temporary.push(data);
        }
      });
    });
    setTimeout(() => {
      const calc = ((Student.length - temporary.length) / Student.length) * 100;
      setAttendStudents(calc);
      setstudentAttendance(temporary);
    }, 1000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#FFF",
        width: "100%",
      }}
    >
      <p className="!font-jakarta text-left text-[#344054] text-[24px] font-bold align-middle -mt-16 mb-8 ml-5">
        Home
      </p>


           
      <div className="at-filters ml-5">
          <div style={{display:"flex" ,}}>

          {/* <select  className="!mr-4 !rounded-lg border-[2px] hover:border-[#DC5FC9] w-40">
            <option style={{ chec }} value="tesla">
             <div 
             className="w-80"
             >
             <Icon name = "checkmark-outline" 
             fill="#DC5FC9"
              size="medium"
               />
              <span className="Check">
              ceklr</span>
             </div>
            </option>
            <option value="vol">vol</option>
            <option value="merch">merch</option>
           </select> */}

          <Select
          placeholder={"01 Jun 2022 -03 Jun 2022"}
          options={classAction}
    styles={{
      option: (baseStyles, state) => ({
        ...baseStyles,
        color: state.isSelected ? '#DC5FC9' : 'black',
      }
      ),
      borderColor:"gray",
      borderWidth:1,
      width:"80%"
    }}
    theme={(theme,isSelected) => ({
      ...theme,
      borderRadius: 8,
      colors: {
        ...theme.colors,
        primary25: 'white',
        primary: 'white',
      },
    })}
    className="!mr-4 !rounded-lg border-[2px] hover:border-[#DC5FC9]"
    captureMenuScroll={false}
/>
<Select
      defaultValue={Dates[0]}
    options={Dates}
    styles={{
      option: (baseStyles, state) => ({
        ...baseStyles,
        color: state.isSelected ? '#DC5FC9' : 'black',
      }),
      }}
    
    theme={(theme,isSelected) => ({
      ...theme,
      borderRadius: 8,
      colors: {
        ...theme.colors,
        primary25: 'white',
        primary: 'white',
      },
    })}
    className="!mr-4 border-[2px] hover:border-[#DC5FC9]"


/>
{/* <Select
              bordered={false}
              className="!mr-4 !rounded-lg border-[2px] hover:border-[#DC5FC9] w-[60%] ant-select-selection"
              placeholder={"Annually"}
              onSelect={"Annually"}
             // onChange={handleFilterAnuallly}
            >
              {Dates?.map((item, i) => (
                <Option key={item.id} value={item.id} lable={item.value}       
                  >
                  <div style={{ display:"flex"  }}> 
                  <Icon name = "checkmark-outline" 
                  //  fill={"#DC5FC9"}
                   size="medium"
                 />
                 <span style={{
                  marginLeft:10
                 }} >
                  {item.value}
                  </span>
                  </div> 
                </Option>
              ))}
            </Select> */}

<Select
    defaultValue={Genders[0]}     
    options={Genders}
    // components={{ Option: IconOption }}
    styles={{
      option: (baseStyles, state) => ({
        ...baseStyles,
        color: state.isSelected ? '#DC5FC9' : 'black',
        display: state.isSelected ? setIsAll("block") : setIsAll("none")
      }),
      width:"80%"
    }}
    theme={(theme,isSelected) => ({
      ...theme,
       borderRadius: 8,
      colors: {
        ...theme.colors,
        primary25: 'white',
        primary: 'white',
      },
    })}
    className="!mr-4 !rounded-lg border-[2px] hover:border-[#DC5FC9]"
    captureMenuScroll={false}
/> 
            {/* <Select
              bordered={false}
              placeholder={"01 Jun 2022 -03 Jun 2022"}
             
              className="!mr-4 !rounded-lg border-[2px] hover:border-[#DC5FC9]"
            >
              {classes?.map((item, i) => (
                <Option
                  key={item.key}
                  value={item.key}
                  lable={item.level + item.section}
                >
                  {item.level + item.section}
                </Option>
              ))}
            </Select>
        
            <Select
              bordered={false}
              className="!mr-4 !rounded-lg border-[2px] hover:border-[#DC5FC9]"
              placeholder={"Annually"}
               onClick={handleselect}
             // onChange={handleFilterAnuallly}
            >
              {Dates?.map((item, i) => (
                <Option key={item.id} value={item.id} lable={item.name} 
              
                  >
                  {item.name}
                </Option>
              ))}
            </Select>
            <Select
              bordered={false}
              className="!mr-4 !rounded-lg border-[2px] hover:border-[#DC5FC9]"
              placeholder={"All Genders"}
              
             // onChange={handleFilterAnuallly}
            >
              {Genders?.map((item, i) => (
                <Option key={item.id} value={item.id} lable={item.name} >
                  {item.name}
                </Option>
              ))}
            </Select> */}
          </div>
        </div>

      {/* <Button
              className=" !bg-[#DC5FC9] hover:!text-[white] !rounded-[8px] !text-[white]"
              onClick={async () => await logout()}
            >
              Logout
            </Button> */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
      <Grid item xs={12} sm={12} md={12}>
          <Card bordered={false} className="w-[100%] mb-10" >
            <div className="flex flex-row justify-start align-bottom items-center">
              {/* <div style={{ flexDirection:'row' , flex:1 , justifyContent:'flex-start'}}> */}
                <h1 className="text-lg text-[#0B1354] ">Student Attendance</h1>
                <Icon 
                name ="arrow-ios-downward-outline"
                fill="#0B1354"
                size="medium"  
                />

                {/* //<h1 className="text-[16px] text-[#98A2B3]">{students.length}</h1> */}
            </div>
            <div className="flex flex-row justify-start align-bottom items-center">
            <h1 className="text-4xl text-[#0B1354]">541</h1>
            <h4 className="text-base text-[#0B1354]">/ 5790    </h4>
                <FontAwesomeIcon className="pr-2  mb-2 ml-5 text-[#0ceb20]" icon={faArrowUp} />
                <h4 className="text-sm text-[#0ceb20]" style={{marginLeft:-4}}>8%</h4>
                </div>
                <h4 className="text-base text-[#0B1354] mb-10">Absent</h4>
            <div className="flex" >
                  <ChartStudent title="" aspect={3 /1} />
                  </div>

          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Card
            bordered={false}
            className="w-[100%] min-h-[419px]"
          >
              <div className="flex flex-row justify-start align-bottom items-center">
              {/* <div style={{ flexDirection:'row' , flex:1 , justifyContent:'flex-start'}}> */}
                <h1 className="text-lg text-[#98A2B3]">Teacher Attendance</h1>
                {/* <FontAwesomeIcon className="pr-2 mb-1 ml-2" icon={faArrowDownLong} /> */}
                {/* //<h1 className="text-[16px] text-[#98A2B3]">{students.length}</h1> */}
            </div>
            <div className="flex flex-row justify-start align-bottom items-center">
            <h1 className="text-4xl text-[#0B1354]">46</h1>
            <h4 className="text-base text-[#0B1354]">/ 786    </h4>
                <FontAwesomeIcon className="pr-2  mb-2 ml-5 text-[#0ceb20]" icon={faArrowDown} />
                <h4 className="text-sm text-[#0ceb20]" style={{marginLeft:-4}}>2</h4>
                </div>
                <h4 className="text-base text-[#98A2B3] mb-5">Absent</h4>
            <ChartTeacher title="" aspect={2 / 2} />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            bordered={false}
            className="w-[100%] min-h-[419px]"
          >
            <div>
            <div className="flex flex-row justify-start align-bottom items-center">
              {/* <div style={{ flexDirection:'row' , flex:1 , justifyContent:'flex-start'}}> */}
                <h1 className="text-base text-[#98A2B3]">Staff Attendance</h1>
                {/* <FontAwesomeIcon className="pr-2 mb-1 ml-2" icon={faArrowDownLong} /> */}
                {/* //<h1 className="text-[16px] text-[#98A2B3]">{students.length}</h1> */}
            </div>
            <div className="flex flex-row justify-start align-bottom items-center">
            <h1 className="text-2xl text-[#98A2B3]">Available Soon</h1>
                </div>
            </div>
            {/* <Liner datas={students} /> */}
            <div className="mt-[21%]">
            <ChartStaff  title="" aspect={2 / 2} />
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            bordered={false}
            className="w-[100%] min-h-[419px]"
          >
            <div>
            <div className="flex flex-row justify-start align-bottom items-center">
              {/* <div style={{ flexDirection:'row' , flex:1 , justifyContent:'flex-start'}}> */}
                <h1 className="text-base text-[#98A2B3]">Inventory</h1>
                {/* <FontAwesomeIcon className="pr-2 mb-1 ml-2" icon={faArrowDownLong} /> */}
                {/* //<h1 className="text-[16px] text-[#98A2B3]">{students.length}</h1> */}
            </div>
            <div className="flex flex-row justify-start align-bottom items-center">
            <h1 className="text-2xl text-[#98A2B3]">Available Soon</h1>
                </div>
            </div>
            <div className="mt-[21%]">
            <ChartStaff  title="" aspect={2 / 2} />
            </div>
            {/* <Liner datas={teacherData} /> */}
          </Card>
        </Grid>
      
      </Grid>
    </div>
  );
}



{/* 
/// progress bar in case we need it
<div className=" flex flex-col justify-center">
<Progress
  type="circle"
  strokeColor={"#DC5FC9"}
  percent={parseFloat(attendStudents).toFixed(1)}
  width={"9rem"}
/>
</div>
<div className="flex flex-col justify-center ">
<h1 className="!font-jakarta text-[16px] flex flex-row">
  {" "}
  <a className="w-5 mr-2 h-2 mt-2 bg-[#475467] rounded-lg"></a>
  {studentAttendance.length} Absent Students
</h1>
<h1 className="!font-jakarta text-[16px] flex flex-row">
  {" "}
  <a className="w-5 mr-2 h-2 mt-2 bg-[#98A2B3] rounded-lg"></a>
  {students.length - studentAttendance.length} Present Students
</h1>
</div>
</div>
<h1
style={{
fontWeight: "bold",
marginBottom: 40,
marginTop: 30,
fontSize: 18,
}}
></h1>
<div style={{ display: "flex", flexDirection: "row" }}>
<div
style={{
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  width: "100%",
}}
>
<div>
  <div className="relative flex flex-col justify-center">
    {true ? (
      <h1 className="!font-jakarta w-60%  text-gray-400 h-10 p-4">No Data</h1>
    ) : (
      <Progress
        type="circle"
        strokeColor={"#DC5FC9"}
        percent={75}
        width={"6rem"}
      />
    )}
  </div>
  <h1 className="!font-jakarta text-center">Weekly</h1>
</div>
<div>
  <div className="relative flex flex-col justify-center">
    {true ? (
      <h1 className="!font-jakarta w-60%  text-gray-400 h-10 p-4">No Data</h1>
    ) : (
      <Progress
        type="circle"
        strokeColor={"#DC5FC9"}
        percent={75}
        width={"6rem"}
      />
    )}
  </div>
  <h1 className="text-center">Monthly</h1>
</div>
<div>
  <div className="relative flex flex-col justify-center">
    {true ? (
      <h1 className="w-60%  text-gray-400 h-10 p-4">No Data</h1>
    ) : (
      <Progress
        type="circle"
        strokeColor={"#DC5FC9"}
        percent={75}
        width={"6rem"}
      />
    )}
  </div>
  <h1 className="!font-jakarta text-center">Yearly</h1>
</div>
</div> 
========================================================================
 <div>
                <h1 className="!font-jakarta text-[18px] font-semibold">{students.length}</h1>
                <Progress
                  strokeColor={"#DC5FC9"}
                  percent={100}
                  showInfo={false}
                />
                <h1 className="text-[14px] !font-jakarta">Total</h1>
              </div>
              <div>
                <div className="flex flex-row justify-between">
                  <h1 className="text-[18px] font-semibold !font-jakarta">{male.length}</h1>
                  <h1 className="text-[18px] font-semibold !font-jakarta">{female.length}</h1>
                </div>
                <Progress
                  strokeColor={"#DC5FC9"}
                  percent={100}
                  showInfo={false}
                  success={{
                    percent: (100 * male.length) / students.length,
                  }}
                />
                <div className="flex flex-row justify-between">
                  <h1 className="text-[14px] !font-jakarta">Female</h1>
                  <h1 className="text-[14px] !font-jakarta">Male</h1>
                </div>
              </div>
          ===============================================================================
            <div>
                <h1 className="text-[18px] font-semibold !font-jakarta">
                  {teacherData.length}
                </h1>
                <Progress
                  strokeColor={"#DC5FC9"}
                  percent={100}
                  showInfo={false}
                />
                <h1 className="text-[14px] !font-jakarta">Total</h1>
              </div>
              <div>
                <div className="flex flex-row justify-between">
                  <h1 className="text-[18px] font-semibold">
                    {teacherfemale.length}
                  </h1>
                  <h1 className="text-[18px] font-semibold">
                    {teachermale.length}
                  </h1>
                </div>
                <Progress
                  strokeColor={"#DC5FC9"}
                  percent={100}
                  showInfo={false}
                  success={{
                    percent:
                      (teacherfemale.length * 100) /
                      (teachermale.length + teacherfemale.length),
                  }}
                />
                <div className="flex flex-row justify-between">
                  <h1 className="text-[14px] ">Female</h1>
                  <h1 className="text-[14px]">Male</h1>
                </div>
              </div>
*/}