import { useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

export default function Dashboard() {
  const user = useSelector((state) => state.user.value);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "white" }}>
      <AppBar
        position="static"
        elevation={0}
        style={{
          width: "10vw",
          backgroundColor: "white",
        }}
      >
        <Toolbar style={{ backgroundColor: "white" }}>
          <img
            src={require("../assets/logo1.png")}
            className="w-[104px] h-[42px]"
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
