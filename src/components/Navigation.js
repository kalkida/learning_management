import { useSelector } from "react-redux";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Icon from "react-eva-icons";

export default function Dashboard({
  handleDrawerOpen,
  open,
  handleDrawerClose,
  theme,
  AppBar,
}) {
  return (
    <AppBar
      position="fixed"
      style={{
        backgroundColor: "#3b82f600",
        boxShadow: "none",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Toolbar className=" mt-2 ml-1">
        {open ? (
          <div className="flex flex-row">
            <IconButton
              onClick={handleDrawerClose}
              sx={{
                marginRight: 0,
                marginLeft: 0,
              }}
            >
              {theme.direction === "rtl" ? (
                <Icon
                  name="menu-outline"
                  fill="#667085"
                  size="large" // small, medium, large, xlarge
                  animation={{
                    type: "pulse", // zoom, pulse, shake, flip
                    hover: true,
                    infinite: false,
                  }}
                />
              ) : (
                <Icon
                  name="menu-outline"
                  fill="#667085"
                  size="large" // small, medium, large, xlarge
                  animation={{
                    type: "pulse", // zoom, pulse, shake, flip
                    hover: true,
                    infinite: false,
                  }}
                />
              )}
            </IconButton>

            <img
              src={require("../assets/logo1.png")}
              className="w-[98px] h-[37px] z-1"
            />
          </div>
        ) : (
          <IconButton
            color="default"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 0,
              marginLeft: 0,
              ...(open && { display: "none" }),
            }}
          >
            <Icon
              name="menu-outline"
              fill="#667085"
              size="large" // small, medium, large, xlarge
              animation={{
                type: "pulse", // zoom, pulse, shake, flip
                hover: true,
                infinite: false,
              }}
            />
          </IconButton>
        )}
      </Toolbar>
      <p className="text-center w-[90vw] text-[#344054] text-[24px] font-bold align-middle mt-4">
        Hello Admin
      </p>
    </AppBar>
  );
}
