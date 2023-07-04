import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { UserContext } from "./Context/UserContext";
import { useEffect, useState } from "react";
import { getUserId } from "./utils/Firebase";

import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Reserve from "./Pages/Reserve";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { SignUp } from "./Pages/SignUp";
import { SignIn } from "./Pages/SignIn";
import Test from "./Pages/Test";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TimelineIcon from "@mui/icons-material/Timeline";
import Person2Icon from "@mui/icons-material/Person2";

import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import { hover } from "@testing-library/user-event/dist/hover";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  increment,
  query,
  collection,
  limit,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const drawerWidth = 240;
const iconSize = 30;
const color = "#1e6cc7";

const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          "&:hover": {
            opacity: 0.6,
            background: "#eaeaea",
          },
        }),
      },
    },
  },
  palette: {
    primary: {
      // main: "#0052cc",
      // main: "#216163",
      // blue
      main: "#1e6cc7",
    },
    secondary: {
      main: "#edf2ff",
    },
    default: {
      main: "#d2d2d2",
    },
    grey: {
      main: "#808080",
    },
    // success: {
    //   main: ,
    // },
  },
});

const CustomListItemButton = styled(ListItemButton)(() => ({
  "&:hover": {
    backgroundColor: color,
  },
  // borderRadius: "10rem",
  // marginBottom: "1rem",
  // fontSize: "1rem",
  // padding: "0.8rem 14px",
  // textTransform: "none",
  // justifyContent: "flex-start",
  // paddingLeft: "25%",
  // gap: "0.5rem",
  // "&.MuiButton-contained": {
  //   fontWeight: "600",
  // },
}));

export function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("Reserve");
  const [prevTab, setPrevTab] = useState("");
  const [hoverTab, setHoverTab] = useState("");
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  let location = useLocation();
  location = location.pathname.slice(1);

  const drawer = (
    <div>
      <Toolbar />
      {/* HEADER */}
      <div className="flexrow" style={{ marginBottom: "1.5rem" }}>
        <img
          style={{
            borderRadius: "1rem",
            width: "4rem",
            height: "4rem",
            marginRight: "1.5rem",
            marginLeft: "1rem",
          }}
          src="https://i.pinimg.com/originals/26/20/8c/26208c54439dd5d89de0256177496258.gif"
        ></img>
        <h1
          style={{
            textAlign: "center",
          }}
        >
          LiServe
        </h1>
      </div>
      <Divider />
      <List
        onMouseLeave={() => {
          //use locaiton
          // console.log(location.pathname.slice(1));
          // alert(location);
          setCurrentTab(location);
        }}
        sx={{
          marginTop: "1.5rem",
          marginLeft: "1rem",
          marginRight: "1rem",
        }}
      >
        {["Reserve", "Dashboard", "Profile"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <CustomListItemButton
              onClick={() => {
                setCurrentTab(text);
                navigate("/" + text);
              }}
              onMouseOver={() => {
                setCurrentTab(text);
              }}
              sx={{
                padding: "0.5rem 1.5rem",
                marginBottom: "1rem",
                borderRadius: "10rem",
                backgroundColor: currentTab === text && "#1e6cc7",
                color: currentTab === text && "white",
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentTab === text && "white",
                  "&:hover": {
                    color: "white",
                  },
                }}
              >
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                {index === 0 && <EventAvailableIcon></EventAvailableIcon>}
                {index === 1 && <TimelineIcon></TimelineIcon>}
                {index === 2 && <Person2Icon></Person2Icon>}
              </ListItemIcon>
              <ListItemText
                primary={text}
                disableTypography={true}
                sx={{
                  color: currentTab === text && "white",
                  fontWeight: currentTab === text && 600 + " !important",
                }}
              />
            </CustomListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* HEADER component */}
      <AppBar
        position="fixed"
        sx={{
          display: { sm: "none" },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            LiServe
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

// export  ResponsiveDrawer;
function App() {
  const [id, setId] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function init() {
      //getUserID
      const tempId = await getUserId();
      setId(tempId);

      //getUserName
      const userRef = doc(db, "users", tempId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      setUserName(userData.firstName + userData.lastName);
    }
    init();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ id, userName }}>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />}>
                <Route path="/Reserve" element={<Reserve />}></Route>
                <Route path="/Dashboard" element={<Dashboard />}></Route>
                <Route path="/Profile" element={<Profile />}></Route>
                <Route path="/SignUp" element={<SignUp />}></Route>
                <Route path="/SignIn" element={<SignIn />}></Route>
                {/* <Route path="/Test" element={<Test />}></Route> */}
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
