import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import BookOnline from "@mui/icons-material/BookOnline";
import {
  HomeOutlined,
  MessageOutlined,
  SoundOutlined,
  CopyOutlined,
  PicRightOutlined,
  HeatMapOutlined,
  UsergroupDeleteOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from "@mui/icons-material/Cloud";
import { Breadcrumb, Layout, Menu } from "antd";
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
import ViewCourse from './modals/courses/view';
import UpdateCourse from './modals/courses/update';
import TeacherView from "./modals/teacher/view";
import TeacherUpdate from "./modals/teacher/update";
import ViewClass from "./modals/classes/view";
import UpdateClass from "./modals/classes/update";

const { Header, Content, Sider } = Layout;

const Layouts = () => {
  const navigate = useNavigate();
  const profile = useSelector((state) => state.user.profile);
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
        <Paper sx={{ width: 320, maxWidth: "100%", backgroundColor: "white" }}>
          <MenuList style={{ borderBottomWidth: 0 }}>
            <MenuItem>
              <ListItemIcon>
                <HomeOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link
                  style={{
                    fontWeight: "bold",
                    color: currentURL === "/admin" ? "#E7752B" : "black",
                  }}
                  to="/admin"
                >
                  Home
                </Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <MessageOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link
                  style={{
                    fontWeight: "bold",

                    color: currentURL === "/message" ? "#E7752B" : "black",
                  }}
                  to="/message"
                >
                  Messages
                </Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <SoundOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link
                  style={{
                    fontWeight: "bold",

                    color: currentURL === "/announcment" ? "#E7752B" : "black",
                  }}
                  to="/announcment"
                >
                  Announcement
                </Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <CopyOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link
                  style={{
                    fontWeight: "bold",

                    color: currentURL === "/list-Course" ? "#E7752B" : "black",
                  }}
                  to="/list-Course"
                >
                  Courses
                </Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <PicRightOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link
                  style={{
                    fontWeight: "bold",

                    color: currentURL === "/list-classes" ? "#E7752B" : "black",
                  }}
                  to="/list-classes"
                >
                  Classes
                </Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <HeatMapOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link
                  style={{
                    fontWeight: "bold",

                    color: currentURL === "/list-teacher" ? "#E7752B" : "black",
                  }}
                  to="/list-teacher"
                >
                  Teacher
                </Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <UsergroupDeleteOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link
                  style={{
                    fontWeight: "bold",

                    color: currentURL === "/list-student" ? "#E7752B" : "black",
                  }}
                  to="/list-student"
                >
                  Student
                </Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ClockCircleOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link
                  style={{
                    fontWeight: "bold",

                    color: currentURL === "/attendance" ? "#E7752B" : "black",
                  }}
                  to="/attendance"
                >
                  Attendance
                </Link>
              </ListItemText>
            </MenuItem>

            <MenuItem>
              <ListItemIcon>
                <CalendarOutlined fontSize="small" />
              </ListItemIcon>
              <Link
                style={{
                  fontWeight: "bold",

                  color: currentURL === "/schedule" ? "#E7752B" : "black",
                }}
                to="/schedule"
              >
                Schedule
              </Link>
            </MenuItem>
          </MenuList>
          <MenuItem style={{ bottom: 0, position: "fixed" }}>
            <ListItemIcon>
              <Cloud fontSize="small" />
            </ListItemIcon>
            <a onClick={() => logout()}>Logout</a>
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
              <ListItemText>Logout</ListItemText>
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
    <Layout>
      <Navigation />
      <Layout>
        <Sider width={200} className="bg-[white]">
          <SiderGenerator />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
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


            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Layouts;
