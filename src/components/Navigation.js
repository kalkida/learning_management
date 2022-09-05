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

  const current = JSON.parse(user);
  //
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          ></IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Laba
          </Typography>
          {/* <Button color="secondary">{profile.role}</Button> */}
          <Button color="inherit">
            Wellcome{" "}
            {role["isAdmin"] == true ? current.user.email : current.phoneNumber}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
