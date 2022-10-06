import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMessage,
  faMicrophone,
  faBook,
  faCalendar,
  faFile,
  faFeather,
  faGraduationCap,
  faCity,
} from "@fortawesome/free-solid-svg-icons";
import ListAnnouncment from "./subComponents/ListAnnouncment";
import BookOnline from "@mui/icons-material/BookOnline";

import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from "@mui/icons-material/Cloud";
import { Avatar, Breadcrumb, Layout, Menu } from "antd";
import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import AdminDash from "./subComponents/AdminDash";
import TeacherDash from "./subComponents/TeacherDash";
import ParentDash from "./subComponents/ParentDash";
import Navigation from "./Navigation";
import AddParent from "./subComponents/AddParent";
import { useSelector, useDispatch } from "react-redux";
import { userAction } from "../redux/user";
import AddStudnets from "./subComponents/AddStudnets";
import CreateNewStudnet from "./subComponents/CreateNewStudnet";
import ListClasses from "./subComponents/ListClasses";
import ListCourses from "./subComponents/ListCourses";
import AddClass from "./subComponents/CreateClasses";
import AddTeacher from "./subComponents/AddTeacher";
import CreateNewTeacher from "./subComponents/CreateNewTeacher";
import CreateCrouse from "./subComponents/CreateCrouse";
import CreateRole from "./subComponents/CreateRole";
import ParentProfile from "./subComponents/ParentProfile";
import ViewCourse from "./modals/courses/view";
import UpdateCourse from "./modals/courses/update";
import TeacherView from "./modals/teacher/view";
import TeacherUpdate from "./modals/teacher/update";
import ViewClass from "./modals/classes/view";
import UpdateClass from "./modals/classes/update";
import ViewStudent from "./modals/student/View";
import UpdateStudent from "./modals/student/Update";
import AttendanceList from "./subComponents/AttendanceList";
import AttendanceView from "./modals/attendance/view";

const { Header, Content, Sider } = Layout;

const Layouts = () => {
  const navigate = useNavigate();
  const profile = useSelector((state) => state.user.profile);
  const user = useSelector((state) => state.user.value);
  const role = useSelector((state) => state.user.profile.role);
  const current = JSON.parse(user);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(userAction.logout());
  };
  const SiderGenerator = () => {
    if (profile == undefined || profile == "undefined") {
      return (
        <Paper sx={{ width: 320, maxWidth: "100%", backgroundColor: "white" }}>
          <MenuList style={{ backgroundColor: "white" }}>
            <MenuItem>
              <ListItemIcon>
                <BookOnline fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link to="/list-parent ">Parent Data</Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCopy fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link to="/parent ">Profile</Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentPaste fontSize="small" />
              </ListItemIcon>
              <ListItemText>Notification</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      );
    }
    if (profile.role["isAdmin"] == true) {
      const currentURL = window.location.pathname;
      return (
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            height: "100%",
            width: "auto",
            marginLeft: 1.5,
          }}
        >
          <MenuList
            style={{
              borderBottomWidth: 0,
              marginTop: 10,
              borderWidth: 0,
              borderColor: "white",
            }}
          >
            <div className="flex flex-row pt-3 h-[5vh] w-[100%] hover:bg-[#FCF0E8]">
              <div>
                <FontAwesomeIcon
                  icon={faHome}
                  className="text-xl px-5 text-[#2c5886]"
                />
              </div>
              <div>
                <Link
                  className="hover:bg-[#FCF0E8] text-lg open:bg-[#FCF0E8]"
                  style={{
                    color: currentURL === "/admin" ? "#E7752B" : "#2c5886",
                  }}
                  to="/admin"
                >
                  Home
                </Link>
              </div>
            </div>
            <div className="flex flex-row pt-3 h-[5vh] w-[100%] hover:bg-[#FCF0E8]">
              <div>
                <FontAwesomeIcon
                  icon={faMessage}
                  className="text-xl px-5 text-[#2c5886]"
                />
              </div>
              <div>
                <Link
                  className="hover:bg-[#FCF0E8] text-lg"
                  style={{
                    color: currentURL === "/message" ? "#E7752B" : "#2c5886",
                  }}
                  to="/message"
                >
                  Messages
                </Link>
              </div>
            </div>
            <div className="flex flex-row pt-3 h-[5vh] w-[100%] hover:bg-[#FCF0E8]">
              <div>
                <FontAwesomeIcon
                  icon={faMicrophone}
                  className="text-xl px-5 text-[#2c5886]"
                />
              </div>
              <div>
                <Link
                  className="hover:bg-[#FCF0E8] text-lg"
                  style={{
                    color:
                      currentURL === "/announcment" ? "#E7752B" : "#2c5886",
                  }}
                  to="/announcment"
                >
                  Announcement
                </Link>
              </div>
            </div>
            <div className="flex flex-row pt-3 h-[5vh] w-[100%] hover:bg-[#FCF0E8]">
              <div>
                <FontAwesomeIcon
                  icon={faBook}
                  className="text-xl px-5 text-[#2c5886]"
                />
              </div>
              <div>
                <Link
                  className="hover:bg-[#FCF0E8] text-lg"
                  style={{
                    color:
                      currentURL === "/list-Course" ? "#E7752B" : "#2c5886",
                  }}
                  to="/list-Course"
                >
                  Courses
                </Link>
              </div>
            </div>
            <div className="flex flex-row pt-3 h-[5vh] w-[100%] hover:bg-[#FCF0E8]">
              <div>
                <FontAwesomeIcon
                  icon={faCity}
                  className="text-xl px-5 text-[#2c5886]"
                />
              </div>
              <div>
                <Link
                  className="hover:bg-[#FCF0E8] text-lg"
                  style={{
                    color:
                      currentURL === "/list-classes" ? "#E7752B" : "#2c5886",
                  }}
                  to="/list-classes"
                >
                  Classes
                </Link>
              </div>
            </div>
            <div className="flex flex-row pt-3 h-[5vh] w-[100%] hover:bg-[#FCF0E8]">
              <div>
                <FontAwesomeIcon
                  icon={faFeather}
                  className="text-xl px-5 text-[#2c5886]"
                />
              </div>
              <div>
                <Link
                  className="hover:bg-[#FCF0E8] text-lg"
                  style={{
                    color:
                      currentURL === "/list-teacher" ? "#E7752B" : "#2c5886",
                  }}
                  to="/list-teacher"
                >
                  Teacher
                </Link>
              </div>
            </div>
            <div className="flex flex-row pt-3 h-[5vh] w-[100%] hover:bg-[#FCF0E8]">
              <div>
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  className="text-xl px-5 text-[#2c5886]"
                />
              </div>
              <div>
                <Link
                  className="hover:bg-[#FCF0E8] text-lg"
                  style={{
                    color:
                      currentURL === "/list-student" ? "#E7752B" : "#2c5886",
                  }}
                  to="/list-student"
                >
                  Student
                </Link>
              </div>
            </div>
            <div className="flex flex-row pt-3 h-[5vh] w-[100%] hover:bg-[#FCF0E8]">
              <div>
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="text-xl px-5 text-[#2c5886]"
                />
              </div>
              <div>
                <Link
                  className="hover:bg-[#FCF0E8] text-lg"
                  style={{
                    color: currentURL === "/attendance" ? "#E7752B" : "#2c5886",
                  }}
                  to="/attendance"
                >
                  Attendance
                </Link>
              </div>
            </div>
            <div className="flex flex-row pt-3 h-[5vh] w-[100%] hover:bg-[#FCF0E8]">
              <div>
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="text-xl px-5 text-[#2c5886]"
                />
              </div>
              <div>
                <Link
                  className="hover:bg-[#FCF0E8] text-lg"
                  style={{
                    color: currentURL === "/schedule" ? "#E7752B" : "#2c5886",
                  }}
                  to="/schedule"
                >
                  Schedule
                </Link>
              </div>
            </div>
          </MenuList>
          <MenuItem style={{ bottom: 0, position: "fixed", bottom: 20 }}>
            <ListItemIcon style={{ color: "#2c5886" }}>
              <Avatar fontSize="small" />
            </ListItemIcon>
            <a onClick={() => logout()}>
              {" "}
              {role["isAdmin"] == true ? (
                <h1 className="text-[#2c5886]">Admin</h1>
              ) : (
                <h1></h1>
              )}
            </a>
          </MenuItem>
        </Paper>
      );
    }
    if (profile.role["isParent"] == true) {
      return (
        <Paper
          sx={{ width: 320, maxWidth: "100%", backgroundColor: "#1890ff" }}
        >
          <MenuList>
            <MenuItem>
              <ListItemIcon>
                <BookOnline fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link style={{ color: "white" }} to="/add-parent">
                  Add School
                </Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCopy fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add Teacher</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentPaste fontSize="small" />
              </ListItemIcon>
              <ListItemText>Notification</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>logout</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      );
    }
    if (profile.role["isTeacher"] == true) {
      return (
        <Paper
          sx={{ width: 320, maxWidth: "100%", backgroundColor: "#1890ff" }}
        >
          <MenuList>
            <MenuItem>
              <ListItemIcon>
                <BookOnline fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link to="/add-parent">Add Parent</Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCopy fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add Teacher</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentPaste fontSize="small" />
              </ListItemIcon>
              <ListItemText>Notification</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      );
    }
  };

  useEffect(() => {
    if (profile == undefined) {
      navigate("/createrole");
    } else {
      if (profile.role["isAdmin"] == true) {
        navigate("/admin");
      } else if (profile.role["isParent"] == true) {
        navigate("/list-parent");
        //navigate("/createrole")
      } else if (profile.role["isTeacher"] == true) {
        navigate("/teacher");
      } else {
        navigate("/createrole");
      }
    }
  }, []);

  return (
    <Layout style={{ backgroundColor: "white" }}>
      <Navigation />
      <Layout className="bg-white">
        <Sider width={200} className="bg-[white] ">
          <SiderGenerator />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
          className="bg-white"
        >
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              backgroundColor: "white",
            }}
          >
            <Routes>
              <Route path="/admin" element={<AdminDash />} />
              <Route path="/teacher" element={<TeacherDash />} />
              <Route path="/parent" element={<ParentDash />} />
              <Route path="/add-parent" element={<AddParent />} />
              <Route path="/list-student" element={<AddStudnets />} />
              <Route path="/list-classes" element={<ListClasses />} />
              <Route path="/add-student" element={<CreateNewStudnet />} />
              <Route path="/add-class" element={<AddClass />} />
              <Route path="/list-teacher" element={<AddTeacher />} />
              <Route path="/add-teacher" element={<CreateNewTeacher />} />
              <Route path="/list-Course" element={<ListCourses />} />
              <Route path="/add-course" element={<CreateCrouse />} />
              <Route path="/createrole" element={<CreateRole />} />
              <Route path="/list-parent" element={<ParentProfile />} />
              <Route path="/view-course" element={<ViewCourse />} />
              <Route path="/update-course" element={<UpdateCourse />} />
              <Route path="/view-teacher" element={<TeacherView />} />
              <Route path="/update-teacher" element={<TeacherUpdate />} />
              <Route path="/view-class" element={<ViewClass />} />
              <Route path="/update-class" element={<UpdateClass />} />
              <Route path="/view-student" element={<ViewStudent />} />
              <Route path="/update-student" element={<UpdateStudent />} />
              <Route path="/announcment" element={<ListAnnouncment />} />
              <Route path="/attendance" element={<AttendanceList />} />
              <Route path="/view-attendance" element={<AttendanceView />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Layouts;
