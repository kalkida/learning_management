import { useSelector, useDispatch } from "react-redux";
import { userAction } from "../redux/user";
import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";

//////////////Styles///////////////////////
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import BookOnline from "@mui/icons-material/BookOnline";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from "@mui/icons-material/Cloud";
import Icon from "react-eva-icons";
import { Avatar, Breadcrumb, Layout, Menu } from "antd";

//////////// Route Components /////////////////
import ListAnnouncment from "./subComponents/ListAnnouncment";
import AdminDash from "./subComponents/AdminDash";
import TeacherDash from "./subComponents/TeacherDash";
import ParentDash from "./subComponents/ParentDash";
import Navigation from "./Navigation";
import AddParent from "./subComponents/AddParent";
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
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Layouts = () => {
  const navigate = useNavigate();
  const profile = useSelector((state) => state.user.profile);
  const user = useSelector((state) => state.user.value);
  const role = useSelector((state) => state.user.profile.role);
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const current = JSON.parse(user);
  console.log(current);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(userAction.logout());
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const SiderGenerator = () => {
    if (profile == undefined || profile == "undefined") {
      return (
        <Paper sx={{ maxWidth: "100%", backgroundColor: "white" }}>
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
        <Drawer
          className="sm:absolute  md:relative "
          variant="permanent"
          open={open}
        >
          <DrawerHeader />
          <List className="sm:invisible md:visible ">
            {[
              {
                text: (
                  <p className="text-[#344054] font-[500] text-[16px] text-left pt-1">
                    Home
                  </p>
                ),
                Icon: (
                  <Icon
                    name="home-outline"
                    fill="#667085"
                    size="large" // small, medium, large, xlarge
                    animation={{
                      type: "pulse", // zoom, pulse, shake, flip
                      hover: true,
                      infinite: false,
                    }}
                  />
                ),
                link: "/admin",
              },
              {
                text: (
                  <p className="text-[#344054] font-[500] text-[16px] text-left pt-1">
                    Message
                  </p>
                ),
                Icon: (
                  <Icon
                    name="message-square-outline"
                    fill="#667085"
                    size="large" // small, medium, large, xlarge
                    animation={{
                      type: "pulse", // zoom, pulse, shake, flip
                      hover: true,
                      infinite: false,
                    }}
                  />
                ),
                link: "/message",
              },
              {
                text: (
                  <p className="text-[#344054]  font-[500] text-[16px] text-left pt-1">
                    Announcment
                  </p>
                ),
                Icon: (
                  <Icon
                    name="volume-up-outline"
                    fill="#667085"
                    size="large" // small, medium, large, xlarge
                    animation={{
                      type: "pulse", // zoom, pulse, shake, flip
                      hover: true,
                      infinite: false,
                    }}
                  />
                ),
                link: "/announcment",
              },
              {
                text: (
                  <p className="text-[#344054]  font-[500] text-[16px] text-left pt-1">
                    Course
                  </p>
                ),
                Icon: (
                  <Icon
                    name="book-outline"
                    fill="#667085"
                    size="large" // small, medium, large, xlarge
                    animation={{
                      type: "pulse", // zoom, pulse, shake, flip
                      hover: true,
                      infinite: false,
                    }}
                  />
                ),
                link: "/list-course",
              },
              {
                text: (
                  <p className="text-[#344054]  font-[500] text-[16px] text-left pt-1">
                    Classes
                  </p>
                ),
                Icon: (
                  <Icon
                    name="pie-chart-outline"
                    fill="#667085"
                    size="large" // small, medium, large, xlarge
                    animation={{
                      type: "pulse", // zoom, pulse, shake, flip
                      hover: true,
                      infinite: false,
                    }}
                  />
                ),
                link: "/list-classes",
              },
              {
                text: (
                  <p className="text-[#344054]  font-[500] text-[16px] text-left pt-1">
                    Teacher
                  </p>
                ),
                Icon: (
                  <Icon
                    name="person-outline"
                    fill="#667085"
                    size="large" // small, medium, large, xlarge
                    animation={{
                      type: "pulse", // zoom, pulse, shake, flip
                      hover: true,
                      infinite: false,
                    }}
                  />
                ),
                link: "/list-teacher",
              },
              {
                text: (
                  <p className="text-[#344054]  font-[500] text-[16px] text-left pt-1">
                    Students
                  </p>
                ),
                Icon: (
                  <Icon
                    name="people-outline"
                    fill="#667085"
                    size="large" // small, medium, large, xlarge
                    animation={{
                      type: "pulse", // zoom, pulse, shake, flip
                      hover: true,
                      infinite: false,
                    }}
                  />
                ),
                link: "/list-student",
              },
              {
                text: (
                  <p className="text-[#344054] font-[500] text-[16px] text-left pt-1">
                    Attendance
                  </p>
                ),
                Icon: (
                  <Icon
                    name="smiling-face-outline"
                    fill="#667085"
                    size="large" // small, medium, large, xlarge
                    animation={{
                      type: "pulse", // zoom, pulse, shake, flip
                      hover: true,
                      infinite: false,
                    }}
                  />
                ),
                link: "/attendance",
              },
              // {
              //   text: "Schedule",
              //   Icon: (
              //     <FontAwesomeIcon
              //       icon={faCalendar}
              //       className="text-xl  text-[#2c5886]"
              //       style={{
              //         fontFamily: "Plus Jakarta Sans",
              //         fontSize: 16,
              //         fontWeight: "500",
              //       }}
              //     />
              //   ),
              //   link: "/schedule",
              // },
            ].map((item, index) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{
                  display: "block",
                  paddingLeft: 2,
                  borderRadius: 5,
                  paddingRight: 2,
                }}
              >
                <Link to={item.link}>
                  <ListItemButton
                    sx={{
                      ":hover": {
                        backgroundColor: "#FCF0E8",
                      },
                      ":active": {
                        backgroundColor: "#FCF0E8",
                      },
                      color: "#2c5886",
                      minHeight: 48,
                      borderRadius: 2,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 0,
                        justifyContent: "center",
                      }}
                    >
                      {item.Icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}

            <ListItem
              style={{ position: "fixed", bottom: 0, width: open ? 234 : 65 }}
              disablePadding
              sx={{
                display: "block",
                paddingLeft: 2,
                borderRadius: 5,
                paddingRight: 2,
              }}
            >
              <a onClick={() => logout()}>
                <ListItemButton
                  sx={{
                    ":hover": {
                      backgroundColor: "#FCF0E8",
                    },
                    borderRadius: 2,

                    color: "#2c5886",
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    // px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar style={{ padding: "none" }} fontSize="small" />
                  </ListItemIcon>
                  {role["isAdmin"] == true ? (
                    <ListItemText
                      primary={
                        <p className="text-[#344054] text-[16px] text-left pt-1">
                          Admin
                        </p>
                      }
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  ) : (
                    <h1></h1>
                  )}
                </ListItemButton>
              </a>
            </ListItem>
          </List>
        </Drawer>
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
    <Layout className="bg-[#F9FAFB] min-h-[100vh]">
      <Box sx={{ display: "flex", width: "100%" }}>
        <Navigation
          handleDrawerOpen={handleDrawerOpen}
          open={open}
          handleDrawerClose={handleDrawerClose}
          theme={theme}
          AppBar={AppBar}
        />
        <SiderGenerator />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
          className="bg-[#F9FAFB]"
        >
          <DrawerHeader />
          <Content className="bg-[#F9FAFB] h-[auto]">
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
        </Box>
      </Box>
    </Layout>
  );
};

export default Layouts;
