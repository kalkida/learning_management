import { useSelector } from "react-redux";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Dashboard({
  handleDrawerOpen,
  open,
  handleDrawerClose,
  theme,
  AppBar,
}) {
  const user = useSelector((state) => state.user.value);

  return (
    <AppBar
      position="fixed"
      style={{ backgroundColor: "#3b82f600", boxShadow: "none" }}
    >
      <Toolbar>
        {open ? (
          <>
            <img
              src={require("../assets/logo1.png")}
              className="w-[104px] h-[42px]"
            />
            <IconButton
              onClick={handleDrawerClose}
              sx={{
                marginRight: 5,
                marginLeft: 5,
              }}
            >
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </>
        ) : (
          <IconButton
            color="default"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              marginLeft: -1,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
