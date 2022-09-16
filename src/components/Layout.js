import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import BookOnline from "@mui/icons-material/BookOnline";
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

const { Header, Content, Sider } = Layout;

const Layouts = () => {
  const navigate = useNavigate();
  const profile = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(userAction.logout());
  };
  const SiderGenerator = () => {
    if (profile.role["isAdmin"] == true) {
      const currentURL = window.location.pathname;
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
                <Link
                  style={{
                    color: currentURL === "/list-student" ? "white" : "black",
                  }}
                  to="/list-student"
                >
                  Student
                </Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCopy fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link
                  style={{
                    color: currentURL === "/list-teacher" ? "white" : "black",
                  }}
                  to="/list-teacher"
                >
                  Teacher
                </Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentPaste fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link
                  style={{
                    color: currentURL === "/list-Course" ? "white" : "black",
                  }}
                  to="/list-Course"
                >
                  Courses
                </Link>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentPaste fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link
                  style={{
                    color: currentURL === "/list-classes" ? "white" : "black",
                  }}
                  to="/list-classes"
                >
                  Classes
                </Link>
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
              <a onClick={() => logout()}>Logout</a>
            </MenuItem>
          </MenuList>
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
    if (profile.role["isAdmin"] == true) {
      navigate("/admin");
    } else if (profile.role["isParent"] == true) {
      navigate("/parent");
    } else if (profile.role["isTeacher"] == true) {
      navigate("/teacher");
    }
  }, []);

  return (
    <Layout>
      <Navigation />
      <Layout>
        <Sider width={200} className="site-layout-background">
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
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Layouts;
