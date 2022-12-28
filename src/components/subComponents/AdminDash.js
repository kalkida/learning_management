import React, { useEffect, useState } from "react";
import Liner from "../graph/Liner";
import BarGraph from "../graph/BarGraph";
import { useSelector , useDispatch } from "react-redux";
import { Card, Progress, } from "antd";
import { DatePicker, Space } from 'antd';

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

const { RangePicker } = DatePicker;
export default function AdminDash() {

  const page = React.useRef();
  
  const [students, setStudents] = useState([]);
  var datas = [
    { name: "Sept", Total: 0 , totalday : "2" , howmuch : 0 },
    { name: "Oct", Total: 0 , totalday : "3" , howmuch : 0 },
    { name: "Nov", Total: 0 , totalday :"19", howmuch : 0 },
    { name: "Dec", Total: 0 , totalday:"23" , howmuch : 0},
    { name: "Jan", Total: 0 , totalday:"12" , howmuch : 0},
    { name: "Feb", Total: 0 ,totalday:"21" , howmuch : 0},
    { name: "Mar  ", Total: 0 ,totalday:"16" , howmuch : 0},
    { name: "Apr", Total: 0 ,totalday:"6" , howmuch : 0},
    { name: "May", Total: 0 ,totalday :"28" , howmuch : 0},
    { name: "June", Total: 0 , totalday :"13" , howmuch : 0},
    { name: "July", Total: 0 ,totalday :"17"  , howmuch : 0},
    { name: "Aug", Total: 0 ,totalday :"14"  , howmuch : 0},
  ]

  var datasteach = [
    { name: "Sept", Total: 0 , pages:"Sep" ,howmuch: 0 ,totalday:12},
    { name: "Oct", Total: 0 ,pages:"", howmuch: 0, totalday:17},
    { name: "Nov", Total: 0 ,pages:"", howmuch: 0 , totalday:9},
    { name: "Dec", Total: 0 ,pages:"", howmuch: 0 , totalday:21},
  { name: "Jan", Total: 0 ,pages:"" ,howmuch: 0, totalday:5},
  { name: "Feb", Total: 0 ,pages :"", howmuch:0, totalday:7},
  { name: "Mar  ", Total: 0 ,pages:"", howmuch:0, totalday:13},
  { name: "Apr", Total: 0 ,pages:"", howmuch:0, totalday:14},
  { name: "May", Total: 0 ,pages  :"", howmuch:0 , totalday:25},
  { name: "June", Total: 0 ,pages:"", howmuch:0 , totalday:11},
  { name: "July", Total: 0 ,pages:"", howmuch:0, totalday:6},
  { name: "Aug", Total: 0 ,pages:"Aug", howmuch:0,  totalday:2},
];

  const [Filters , setFilter] = useState("");
  var filtersrange = "Daily";
  var filtergen = "All Gender"
  const [datavalue , setDatavalue] =useState([])
  const [teachvalue , setTeachvalue] = useState([])
  const [data , setData] = useState([])
  const [data2 , setData2] = useState([])
  // const [isDaily , setIsDaily] = useState("none");
  const [Daily , setDaily] = useState("");
  const [isWeekly , setIsWeekly] = useState("");
  const [isMonthly , setIsMonthly] = useState("");
  const [isAnually , setIsAnually] = useState("");
  const [DailyTeach , setDailyTeach] = useState("");
  const [isWeeklyTeach , setIsWeeklyTeach] = useState("");
  const [isMonthlyTeach , setIsMonthlyTeach] = useState("");
  const [isAnuallyTeach , setIsAnuallyTeach] = useState("");
  const [isMale , setIsMale] = useState("none");
  const [isFemale , setIsFemale] = useState("none");
  const [isAll , setIsAll] = useState("none");
  const [malegender , setmalegender] = useState("")
  const [femalegender , setFemalegender] = useState("")
  const [Allgender , setAllgender] = useState("")
  const [FilterGender , setFilterGender] = useState("")
  const [male, setMale] = useState([]);
  const [female, setfemale] = useState([]);
  const [teachermale, setmaleteacher] = useState([]);
  const [teacherfemale, setfemailteacher] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [studentAttendance, setstudentAttendance] = useState([]);
  const [attendStudents, setAttendStudents] = useState();
  const school = useSelector((state) => state.user.profile.school);
  const [classes, setClasses] = useState([]);
  var days = []
  var weeks = []
  var months = []
  var years = []
  var daysteach = []
  var weeksteach = []
  var monthsteach = []
  var yearsteach = []
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(userAction.logout());
  };

  const schools = useSelector((state) => state.user.profile);
  
  var isDaily =  "white"
  var Student = [];
  const stud = []
  const value = new Date();
  const date = value.getDate() < 10 ? "0" + value.getDate() : value.getDate();
  const month =
    value.getMonth() + 1 < 10
      ? "0" + (value.getMonth() + 1)
      : value.getMonth() + 1;
  const year = value.getFullYear();

  const filterDate = year + "-" + month + "-" + date;
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const monthsnames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var rangtimes =  undefined
 
   var sep =[] , oct = [] , nov = [] , dec = [] , jan = [], feb = [],mar= [] , apr = [],
   may= [] ,jun = [], jul = [] ,aug =[]
   var septeach =[] , octteach = [] , novteach = [] , decteach = [] , janteach = [], 
   febteach = [],marteach= [] , aprteach = [],
   mayteach= [] ,junteach = [], julteach = [] ,augteach =[]

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
    getAttendanceClass();
    //getAttendanceGender();
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

  // const getAttendanceGender = async () => {
  //   const q = query(collection(firestoreDb, "schools", `${school}/AttendanceWithGender`));
  //   var temporary = [];
  //   var male = []
  //   const snap = await getDocs(q);
  //   snap.forEach((doc) => {
  //     var data = doc.data();
  //     temporary.push(data);
  //   });
  //   for (var i = 0; i < temporary.length; i++) {
  //     var male = temporary[i].Male;
  //     var female = temporary[i].Female;
  //  } 
     
  //   setTimeout(() => {
  //     setmalegender(male.length)
  //     setFemalegender(female.length)
  //     setAllgender(male.length+female.length)

  //   },2000);
      

  //   console.log("male  ", malegender ,"female ", femalegender, "all ", Allgender)
  //   // var male = temporary.filter((doc) => doc.sex === "Male");
  //   // var femail = temporary.filter((doc) => doc.sex === "Female");
  //   // setfemailteacher(femail);
  //   // setmaleteacher(male);
  //   // setTeacherData(temporary);
 
  // };



  const handledata = async (e) =>{
  rangtimes=e;
if(rangtimes !== undefined){

   var startdate = new Date(rangtimes[0]);
   var enddates = new Date(rangtimes[1]);
  var startdates = startdate.getFullYear() + '-' + (startdate.getMonth()+1) + '-' + startdate.getDate()
   var starttimestamp = new Date(startdates).getTime();
   var endtimestamp = new Date(enddates).getTime ();
   
   var filterDate = []; 
   var filterteacherData = []
   for (var i = 0; i < data.length; i++) {
     var teachtime= data[i].Date;
     var singleday = 24*60*60*1000;
     if(filtersrange == "Weekly" ){
      singleday = singleday * 7;
     }else if(filtersrange == "Monthly" || filtersrange == "Annually" ){
      singleday = singleday * 30;
     }
     var classes = data[i].class;
     const q = query(collection(firestoreDb, "schools", `${school}/class`));
     var temporary = [];
     const snap = await getDocs(q);
     snap.forEach((doc) => {
       if(doc.id == classes){
       temporary.push(doc.data());
       }
     });

     for (var t=0; t<temporary.length; t++) {
       var teststudent = temporary[t]; 
    }
    for( var base = 0; base < teststudent.student.length; base++) {
        var checkstudent = teststudent.student[base]
    }
    const q2 = query(collection(firestoreDb, "schools", `${school}/students`));
    var temp = [];
    const snaps = await getDocs(q2);
    snaps.forEach((doc) => {
      if(doc.id == checkstudent){
      temp.push(doc.data());
      }
    });
 
     var starting = 0;
     var boostmale = 0;
     var boostfemale = 0;
     for(var k=starttimestamp; k <= endtimestamp; k+=singleday) {
      var count =0;
     for (var j = 0; j <data[i].Date.length; j++){
      var timestamp = new Date(data[i].Date[j]).getTime()
      // if(k=== timestamp ){
      // count++
      // }
    
      if(filtersrange == "Weekly"){
        if(k < timestamp && timestamp < endtimestamp){
          var checker = timestamp - singleday;
          if(checker < k){
            count++
          }
        }
      }
      if(filtersrange == "Daily"){
        if(k=== timestamp ){
          count++
          }
      }
      if(filtersrange == "Monthly" || filtersrange == "Annually"){
        if(k < timestamp && timestamp < endtimestamp){
          var checker = timestamp - singleday;
          if(checker < k){
            count++
          }
        }
      }
     }
     
     var names = monthsnames[(new Date(k).getMonth())]+"-"+ new Date(k).getDate();
     filterDate.push({name:names,Total:count,howmuch:count})
       if(count>0){
         starting+=1
         for (var s=0; s<temp.length; s++) {
          console.log("weuietyi" ,temp[s].sex)
          if(temp[s].sex  == "Male"){
            console.log("jgk" ,temp[s].sex)
            if(count > 0){
              boostmale +=1
            }
            setmalegender(boostmale)
            setFemalegender(boostfemale)
          }    
          else if (temp[s].sex  ==  "Female"){
            if(count > 0){
              boostfemale +=1
            }
            setFemalegender(boostfemale)
            setmalegender(boostmale)

            // console.log("jgk" ,malegender)
          }
          setAllgender(starting)
       }
        if(filtersrange == "Weekly"){
          setIsWeekly(starting)
        }
        else if(filtersrange == "Monthly"){
          setIsMonthly(starting)
        }
        else if(filtersrange == "Annually"){
           setIsAnually(starting)
        }else{
          setDaily(starting)
        }
     }
    }
    if(data[i]?.teacher.length){
      for(var k=starttimestamp; k <= endtimestamp; k+=singleday) {
        var count =0;
      for (var z = 0; z <data[i].teacher.length; z++){
        var timestamp = new Date(data[i].teacher[z]).getTime()
        // if(k=== timestamp ){
        // count++
        // }
        if(filtersrange == "Weekly"){
          if(k < timestamp && timestamp < endtimestamp){
            var checker = timestamp - singleday;
            if(checker < k){
              count++
            }
          }
        }
        if(filtersrange == "Daily"){
          if(k=== timestamp ){
            count++
            }
        }
        if(filtersrange == "Monthly" || filtersrange == "Annually"){
          if(k < timestamp && timestamp < endtimestamp){
            var checker = timestamp - singleday;
            if(checker < k){
              count++
            }
          }
        }

        var names = monthsnames[(new Date(k).getMonth())]+"-"+ new Date(k).getDate();
        filterteacherData.push({name:names,Total:count,howmuch:count})
          if(count>0){
            starting+=1
           if(filtersrange == "Weekly"){
             setIsWeeklyTeach(starting)
           }
           else if(filtersrange == "Monthly"){
             setIsMonthlyTeach(starting)
           }
           else if(filtersrange == "Annually"){
              setIsAnuallyTeach(starting)
           }else{
             setDailyTeach(starting)
           }
        }
       }
     }
    }
    }
    console.log(filterDate)
    page.current = rangtimes;
  setTimeout(() => {  
    /// console.log("check " ,rangtimes)
   setDatavalue(filterDate)
   setTeachvalue(filterteacherData)

  }, 1000);
}
  }

  // useEffect(() =>{
  //   handledata(checksday);
  // },[checksday])

  const getAttendanceClass = async () =>{
    const q = query(collection(firestoreDb, "schools", `${school}/AttendanceForClass`));
    var temporary = [];
    const snap = await getDocs(q);
    snap.forEach((doc) => {
      var data = doc.data();
      temporary.push(data);
    });
    setData(temporary)
    for (var i = 0; i < temporary.length; i++) {
       var tmptime = temporary[i].Date;
    }
    for (var i = 0; i < temporary.length; i++) {
      var teachtime= temporary[i].teacher;
     }
     for (var i = 0; i < teachtime.length; i++) {
      var teachdates= teachtime[i];
      var now = new Date()
      var costdate = new Date(teachdates)
      if((costdate.getDate() == now.getDate())){
        console.log("costdate" , costdate.getDate());
          daysteach.push(costdate)
      }
      if ((costdate.getFullYear() == now.getFullYear()) &&(costdate.getMonth() == now.getMonth()) ) {
        monthsteach.push(costdate)
      }
      if ((costdate.getFullYear() == now.getFullYear())) { 
        yearsteach.push(costdate)
      }
      var end_of_week = new Date(now.getTime() + (6 - now.getDay()) * 24*60*60*1000 )
      if ( costdate >= now && costdate <= end_of_week) {
        weeks.push(costdate)
      }
     if(monthNames[costdate.getMonth()] === "December"){
        decteach.push(costdate)
       }
      if(monthNames[costdate.getMonth()] == "September"){
        septeach.push(costdate)
        if(datasteach[0].name){ 
            datasteach[0].Total = septeach.length
            datasteach[0].totalday = costdate.getDate()
        }
       } if (monthNames[costdate.getMonth()] == "October"){
        octteach.push(costdate)
        if(datasteach[1].name){ 
          datasteach[1].Total = octteach.length
          datasteach[1].totalday = costdate.getDate()
        }
       }
        if (monthNames[costdate.getMonth()] == "November"){
          novteach.push(costdate)
        if(datasteach[2].name){ 
          datasteach[2].Total = novteach.length 
          datasteach[2].totalday = costdate.getDate()
        }
       }
        if (monthNames[costdate.getMonth()] == "December"){
        if(datasteach[3].name){ 
          datasteach[3].Total = decteach.length
          datasteach[3].totalday = costdate.getDate()
        }
       }
        if (monthNames[costdate.getMonth()] == "January"){
          janteach.push(costdate)
        if(datasteach[4].name == "Jan"){ 
          datasteach[4].Total = janteach.length
          datasteach[4].totalday = costdate.getDate()
        }
       }
       if (monthNames[costdate.getMonth()] == "February"){
        febteach.push(costdate) 
        if(datasteach[5].name == "Feb"){ 
          datasteach[5].Total = febteach.length
          datasteach[5].totalday = costdate.getDate()
        }
       }
        if (monthNames[costdate.getMonth()] == "March"){
          marteach.push(costdate)
        if(datasteach[6].name == "Mar"){ 
          datasteach[6].Total = marteach.length
          datasteach[6].totalday = costdate.getDate()
        }
       }
        if (monthNames[costdate.getMonth()] == "April"){
          aprteach.push(costdate)
        if(datasteach[7].name == "Apr"){ 
          datasteach[7].Total = aprteach.length
          datasteach[7].totalday = costdate.getDate()
        }
       }
       if (monthNames[costdate.getMonth()] == "May"){
        mayteach.push(costdate)
        if(datasteach.name == "May"){ 
          datasteach[8].Total = mayteach.length
          datasteach[8].totalday = costdate.getDate()
        }
       }
        if (monthNames[costdate.getMonth()] === "June"){
          junteach.push(costdate)
        if(datas[9].name){ 
          datasteach[9].Total = junteach.length
          datasteach[9].totalday = costdate.getDate()
        }
       }
       else if (monthNames[costdate.getMonth()] == "July"){
        julteach.push(costdate)
        if(datasteach[10].name == "July"){ 
          datasteach[10].Total = julteach.length
          datasteach[10].totalday = costdate.getDate()
        }
       }
       else  {
        if(datas.name == "Aug"){ 
          augteach.push(costdate)
          datasteach[11].Total = augteach.length
          datasteach[11].totalday = costdate.getDate()
        }
       }
     }
    for (var i = 0; i < tmptime.length; i++) {
       var tmpdates = tmptime[i];
       var now = new Date()
       var costdate = new Date(tmpdates)
       if((costdate.getMonth() == now.getMonth())&&(costdate.getDate() == now.getDate())){
           days.push(costdate)
       }
       if ((costdate.getFullYear() == now.getFullYear()) &&(costdate.getMonth() == now.getMonth()) ) {
         months.push(costdate)
       }
       if ((costdate.getFullYear() == now.getFullYear()) ) { 
         years.push(costdate)
       }
       var end_of_week = new Date(now.getTime() + (6 - now.getDay()) * 24*60*60*1000 )
    
       if ( costdate >= now && costdate <= end_of_week) {
         weeks.push(costdate)
       }
       if(monthNames[costdate.getMonth()] === "December"){
        dec.push(costdate)
       }
       if(monthNames[costdate.getMonth()] == "September"){
        sep.push(costdate)
        if(datas[0].name){ 
            datas[0].Total = sep.length
            datas[0].totalday = costdate.getDate()
        }
       } if (monthNames[costdate.getMonth()] == "October"){
        oct.push(costdate)
        if(datas[1].name){ 
          datas[1].Total = oct.length
          datas[1].totalday = costdate.getDate()
        }
       }
        if (monthNames[costdate.getMonth()] == "November"){
          nov.push(costdate)
        if(datas[2].name){ 
          datas[2].Total = nov.length 
          datas[2].totalday = costdate.getDate()
        }
       }
        if (monthNames[now.getMonth()] == "December"){
        if(datas[3].name){ 
          datas[3].Total = dec.length
          datas[3].totalday = costdate.getDate()
        }
       }
        if (monthNames[costdate.getMonth()] == "January"){
          jan.push(costdate)
        if(datas[4].name == "Jan"){ 
          datas[4].Total = jan.length
          datas[4].totalday = costdate.getDate()
        }

       }
       if (monthNames[costdate.getMonth()] == "February"){
        feb.push(costdate)
        if(datas[5].name == "Feb"){ 
          datas[5].Total = feb.length
          datas[5].totalday = costdate.getDate()
        }
       }
        if (monthNames[costdate.getMonth()] == "March"){
          mar.push(costdate)
        if(datas[6].name == "Mar"){ 
          datas[6].Total = mar.length
          datas[6].totalday = costdate.getDate()
        }
       }
        if (monthNames[costdate.getMonth()] == "April"){
          apr.push(costdate)
        if(datas[7].name == "Apr"){ 
          datas[7].Total = apr.length
          datas[7].totalday = costdate.getDate()
        }
       }
       if (monthNames[costdate.getMonth()] == "May"){
        may.push(costdate)
        if(datas.name == "May"){ 
          datas[8].Total = may.length
          datas[8].totalday = costdate.getDate()
        }
       }
        if (monthNames[costdate.getMonth()] === "June"){
          jun.push(costdate)
        if(datas[9].name){ 
          datas[9].Total = jun.length
          datas[9].totalday = costdate.getDate()
        }
       }
       else if (monthNames[costdate.getMonth()] == "July"){
        jul.push(costdate)
        if(datas[10].name == "July"){ 
          datas[10].Total = jul.length
          datas[10].totalday = costdate.getDate()
        }
       }
       else  {
        if(datas.name == "Aug"){ 
          aug.push(costdate)
          datas[11].Total = aug.length
          datas[11].totalday = costdate.getDate()
        }
       }
    }
  setTimeout(() => {
    setDaily(days.length)
    setIsWeekly(weeks.length)
    setIsMonthly(months.length)
    setIsAnually(years.length)
    setDailyTeach(daysteach.length)
    setIsWeeklyTeach(weeksteach.length)
    setIsMonthlyTeach(monthsteach.length)
    setIsAnuallyTeach(yearsteach.length)
  }, 1000);


  setTimeout(() => {

    datas[0].howmuch = sep.length - aug.length
    datas[1].howmuch = oct.length - sep.length
    datas[2].howmuch = nov.length - oct.length
    datas[3].howmuch = dec.length - nov.length
    datas[4].howmuch = jan.length - dec.length
    datas[5].howmuch = feb.length - jan.length
    datas[6].howmuch = mar.length - feb.length
    datas[7].howmuch = apr.length - mar.length
    datas[8].howmuch = may.length - apr.length
    datas[9].howmuch = jun.length - may.length
    datas[10].howmuch = jul.length - jun.length
    datas[11].howmuch = aug.length - jul.length

    
    console.log("is daily ", days.length , "is weekly   ", weeks.length, "is monthly  ", isMonthly, "is yearly" ,years.length)
  }, 2000);
   setTimeout(() => {
    setDatavalue(datas)
   setTeachvalue(datasteach)
   }, 2000);
  }

  const handleFilterAnuallly = async (values) => {
    if(values){
     if (values.value === 'Daily'){
      setFilter("Daily") 
      setFilterGender("Daily")
      filtersrange = "Daily"
       setTimeout(() => {
        handledata(page.current)
       }, 500);
     }else if (values.value == 'Weekly'){
      setFilter("Weekly")   
      setFilterGender("Weekly") 
      filtersrange = "Weekly"
      setTimeout(() => {
        handledata(page.current)
       },500);
     }else if (values.value == 'Monthly'){
        console.log(values.value)
        setFilter(values.value) 
        setFilterGender("Monthly") 
        filtersrange = "Monthly"
        setTimeout(() => {
          handledata(page.current)
         }, 500);     
     }else {
      console.log(values.value)
       setFilter("Annually")
       filtersrange = "Annually"
       setFilterGender("Annually")
       setTimeout(() => {
        handledata(page.current)
       }, 1000);
     }
    }
  };

  const handleFilterGender = async (values) => {
    if(values){
     if (values.value === 'Male'){
      console.log(values.value)
       setTimeout(() => {
        setFilter("Male")
        filtersrange = "Male" 
        handledata(page.current)
       }, 1000);
     }else if (values.value == 'Female'){
      console.log(values.value)
      setTimeout(() => {
        setFilter("Female") 
        filtersrange = "Female" 
        handledata(page.current)
       }, 1000);
        
     }else {
      console.log(values.value)
       setTimeout(() => {
        filtersrange ="All Gender"
        setFilter("All Gender") 
        handledata(page.current)
       }, 1000);
     }
    }
    // return isAnually
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

    const studentss =[
      {
        id:1,
        label:
        <div 
        style={{display:"flex"}}
        >
        <span >Student Attendance</span>
        </div>,
        value:"Student Attendance"
      } ,
      {
        id:2,
        label:
        <div 
        style={{display:"flex"}}
        >
        <span >Student Attendances</span>
        </div>,
        value:"Student Attendances"
      } ,
     ]
  
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
      <p className="!font-jakarta text-left text-[#000000] text-[20px] font-bold align-middle -mt-16 mb-8 ml-5">
        Home
      </p> 
      <div className=" ml-4">
          <div style={{display:"flex" ,}}>
       <RangePicker  
       format={'YYYY-MM-DD'}
       className="!mr-2 !rounded-lg  !border-0 hover:!border-0 !text-[#98A2B3] !shadow-none hover:!shadow-none"
      onChange={(e) =>handledata(e)}
       />
<Select
      defaultValue={Dates[0]}
      // placeholder={Genders[2]}  
      options={Dates}
     onChange={handleFilterAnuallly}
    styles={{
      control: base => ({
        ...base,
        border: 0,
        // This line disable the blue border
        boxShadow: 'none',
        color:"#98A2B3"
      }),
      option: (baseStyles, state) => ({
        ...baseStyles,
        color: state.isSelected ? '#DC5FC9' : '#344054',
        fontSize:14,
        fontWeight:'bold',
        backgroundColor :"#FFF",
        borderColor :"white",
        borderWidth:0,
        borderRadius:15,
        width:'50%',
      }),
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          text: '#98A2B3',
          font:'#3599B8',
          primary25: '#FFF',
          primary: '#FFF',
          color: '#98A2B3',
        },
      })}
      className="!mr-2 !rounded-lg  !border-0 hover:!border-0 !text-[#667085]"
/>
<Select
    defaultValue={Genders[2]}  
    placeholder={Genders[2]}   
    options={Genders}
    onChange={handleFilterGender}
    
    // components={{ Option: IconOption }}
    styles={{  
      control: base => ({
      ...base,
      border: 0,
      // This line disable the blue border
      boxShadow: 'none' ,
      color:"#98A2B3",
    }),
      option: (baseStyles, state) => ({
        ...baseStyles,
        color: state.isSelected ? '#DC5FC9' : '#344054',
        display: state.isSelected ? setIsAll("block") : setIsAll("none"),
        backgroundColor: state.isSelected ? "#FFFFFF" : "#FFFFFF",
        fontSize:14,
        fontWeight:'bold',
        borderColor :"white",
        width:'40%',  
      }),
      placeholder:() =>({
        color : '#667085',
        fontSize: 20
      })
     
    }}
    theme={(theme) => ({
      ...theme,
      borderRadius: 0,
      colors: {
        primary25: '#FFF',
        primary: '#FFF',
        neutral50: '#667085'
        
      },
    })}
    className=" !rounded-lg ml-[-2px] !border-0 hover:!border-0  !border-[white]"
/> 
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
                {/* <h1 className="text-base text-[#344054] ">Student Attendance</h1>
                <Icon 
                name ="arrow-ios-downward-outline"
                fill="#344054"
                size="medium"  
                /> */}
                <Select
      defaultValue={studentss[0]}
      options={studentss}
    styles={{
      control: base => ({
        ...base,
        border: 0,
        // This line disable the blue border
        boxShadow: 'none',
        color:"#344054",
        fontSize:16,
        zIndex:0,
        opaacity:1
      }),
      option: (baseStyles, state) => ({
        ...baseStyles,
        color: state.isSelected ? '#DC5FC9' : '#344054',
        fontSize:14,
        fontWeight:'bold',
        backgroundColor :"#FFF",
        borderColor :"white",
        borderWidth:0,
        width: "100%",
        opaacity:1
      }),
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          primary25: '#FFF',
          primary: '#FFF',
          color: '#98A2B3',
          opaacity:1
        },
      })}
      className="!ml-[-10px] !rounded-lg  !border-0 hover:!border-0 !text-[#667085]"
/>

                {/* //<h1 className="text-[16px] text-[#98A2B3]">{students.length}</h1> */}
            </div>
            <div className="flex flex-row justify-start align-bottom items-center mt-1">
            <h1 className="text-3xl text-[#344054] ">
            {(filtersrange == "Annually")? 
                isAnually:(filtersrange == "Weekly")? isWeekly : (filtersrange == "Monthly")? 
                isMonthly : (filtersrange == "Daily") ? 
                Daily :(filtersrange == "Male") ? malegender :(filtersrange == "Female") ?
               femalegender : Allgender}</h1>
            <h4 className="text-base text-[#0B1354]">/ {attendStudents}   </h4>
                <FontAwesomeIcon className="pr-2  mb-2 ml-5 text-[#0ceb20]" icon={faArrowUp} />
                <h4 className="text-sm text-[#0ceb20]" style={{marginLeft:-4}}>{(filtersrange == "Annually")? 
                isAnually:(filtersrange == "Weekly")? isWeekly : (filtersrange == "Monthly")? 
                isMonthly : (filtersrange == "Daily") ? 
                Daily :(filtersrange == "Male") ? malegender :(filtersrange == "Female") ?
               femalegender : Allgender }%</h4>
                </div>
                <h4 className="text-base text-[#344054] font-normal mb-5">Absent</h4>
            <div className="flex" >
                  <ChartStudent title="" aspect={4 /1} datas = {datavalue} />
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
                <h1 className="text-base text-[#344054] font-normal"  >Teacher Attendance</h1>
            </div>
            <div className="flex flex-row justify-start align-bottom items-center">
            <h1 className="text-3xl text-[#344054]">{(FilterGender == "Annually")? isAnuallyTeach:(FilterGender == "Weekly")? 
              isWeeklyTeach : (FilterGender == "Monthly")? isMonthlyTeach : DailyTeach }</h1>
            <h4 className="text-base text-[#344054]">/ 50    </h4>
                <FontAwesomeIcon className="pr-2  mb-2 ml-5 text-[red]" icon={faArrowDown} />
                <h4 className="text-sm text-[red]" style={{marginLeft:-4}}>{(FilterGender == "Annually")? (50 -isAnuallyTeach):
                (FilterGender == "Weekly")? (50 -isWeeklyTeach) : (FilterGender == "Monthly")? 
                (50- isMonthlyTeach) : (50 - DailyTeach) }</h4>
                </div>
                <h4 className="text-base text-[#344054] font-normal  mb-5">Absent</h4>
            <ChartTeacher title="" aspect={2 / 1} datas ={teachvalue} />
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
            <h1 className="text-xl text-[#98A2B3]">Available Soon</h1>
                </div>
            </div>
            {/* <Liner datas={students} /> */}
            <div className="mt-[19%]">
            <ChartStaff  title="" aspect={2 / 1} />
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
            <h1 className="text-xl text-[#98A2B3]">Available Soon</h1>
                </div>
            </div>
            <div className="mt-[19%]">
            <ChartStaff  title="" aspect={2 / 1} />
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