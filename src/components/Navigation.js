import { useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

export default function Dashboard() {
  const user = useSelector((state) => state.user.value);
  const role = useSelector((state) => state.user.profile.role);
  console.log(role);
  const current = JSON.parse(user);
  //
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "white" }}>
      <AppBar
        position="static"
        style={{
          backgroundColor: "white",
        }}
      >
        <Toolbar style={{ backgroundColor: "#F2F4F7" }}>
          <img
            src={require("../assets/logo1.png")}
            style={{
              width: 130,
              paddingLeft: "0%",
              paddingRight: "0%",
              marginRight: 100,
              marginLeft: -10,
            }}
          />
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Laba
          </Typography> */}
          {/* <Button color="secondary">{profile.role}</Button> */}
          <Button color="inherit" style={{ color: "black" }}>
            {role["isAdmin"] == true ? current.user.email : current.phoneNumber}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
