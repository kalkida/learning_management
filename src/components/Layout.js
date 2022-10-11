import { useSelector, useDispatch } from "react-redux";
import { userAction } from "../redux/user";
import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";

//////////////Styles///////////////////////
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
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
          className="sm:absolute md:relative"
          variant="permanent"
          open={open}
        >
          <DrawerHeader />
          <List className="sm:invisible md:visible ">
            {[
              {
                text: 'Home',
                Icon: <FontAwesomeIcon
                  icon={faHome}
                  className="text-xl  text-[#2c5886] font-serif"
                />,
                link: "/admin"
              },
              {
                text: 'Message',
                Icon: <FontAwesomeIcon
                  icon={faMessage}
                  className="text-xl text-[#2c5886] font-serif"
                />,
                link: "/message"
              }
              , {
                text: 'Announcment',
                Icon: <FontAwesomeIcon  
                  icon={faMicrophone}
                  className="text-xl  text-[#2c5886] font-serif"
                />,
                link: "/announcment"
              },
              {
                text: 'Course',
                Icon: <FontAwesomeIcon
                  icon={faBook}
                  className="text-xl  text-[#2c5886] font-serif"
                />,
                link: "/list-course"
              }, {
                text: 'Classes',
                Icon: <FontAwesomeIcon
                  icon={faCity}
                  className="text-xl text-[#2c5886] font-serif"
                />,
                link: "/list-classes"
              }, {
                text: 'Teacher',
                Icon: <FontAwesomeIcon
                  icon={faFeather}
                  className="text-xl  text-[#2c5886] font-serif"
                />,
                link: "/list-teacher"
              },
              {
                text: 'Student',
                Icon: <FontAwesomeIcon
                  icon={faGraduationCap}
                  className="text-xl  text-[#2c5886] font-serif" 
                />,
                link: "/list-student"
              },
              {
                text: 'Attendance',
                Icon: <FontAwesomeIcon
                  icon={faCalendar}
                  className="text-xl text-[#2c5886] font-serif"
                />,
                link: "/attendance"
              },
              {
                text: 'Schedule',
                Icon: <FontAwesomeIcon
                  icon={faCalendar}
                  className="text-xl  text-[#2c5886] font-s erif"
                />,
                link: "/schedule"
              }
            ].map((item, index) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block" }}
              >
                <Link to={item.link}>
                  <ListItemButton
                    sx={{
                      ":hover": {
                        backgroundColor: "#FCF0E8",
                      },
                      color: "#2c5886",
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
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
              sx={{ display: "block" }}
            >
              <Divider />
              <a onClick={() => logout()}>
                <ListItemButton
                  sx={{
                    ":hover": {
                      backgroundColor: "#FCF0E8",
                    },
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
                      primary="Admin"
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
    <Layout className="bg-[#E8E8E8] min-h-[100vh]">
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
          className="bg-[#E8E8E8]"
        >
          <DrawerHeader />
          <Content className="bg-[#E8E8E8] h-[auto]">
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
