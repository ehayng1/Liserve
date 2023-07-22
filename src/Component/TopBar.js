import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@emotion/react";
import Divider from "@mui/material/Divider";
import { useNavigate, Outlet } from "react-router-dom";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Check from "@mui/icons-material/Check";
import { Announcement } from "./Announcement";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { useEffect, useState } from "react";
import { getUserId } from "../utils/Firebase";
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
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const ProfileMenu = styled(Paper)(() => ({
  square: false,
  width: "10vw",
  borderRadius: "1rem",
}));

export default function TopBar() {
  const { id, userName } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorAlarm, setAnchorAlarm] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([{ message: "message" }]);
  const [read, setRead] = useState([]); // read messages
  const [unreadCount, setUnreadCount] = useState(0);
  const [ID, setID] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    async function init() {
      //getUserID
      const tempId = await getUserId();
      setID(tempId);

      //getUserName
      const userRef = doc(db, "users", tempId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      setName(userData.firstName + userData.lastName);

      // get readMessages
      let tempRead = [];
      async function getReadMessages() {
        const ReadRef = doc(db, "users", tempId);

        const docSnap = await getDoc(ReadRef);
        if (docSnap.data().readMessages) {
          tempRead = docSnap.data().readMessages;
        }
      }
      await getReadMessages();
      setRead(tempRead);

      //get messages
      let tempMessage = [];
      async function getMessage() {
        const q = query(
          collection(db, "messages"),
          // limit(40),
          // limit(5),
          orderBy("timeStamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.id = doc.id;
          tempMessage.push(data);
        });
      }
      await getMessage();
      setMessages(tempMessage);
      setUnreadCount(tempMessage.length - tempRead.length);

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;

          setIsAdmin(uid === "TRN2C65DS2ZSmjDpfI8n7kpYEZL2");
          // ? setIsAdmin(userData.isAdmin)
          // : setIsAdmin(userData.isAdmin);
        } else {
          // User is signed out
          // ...
        }
      });
    }
    init();
  }, []);

  const isMenuOpen = Boolean(anchorEl);
  const isAlarmOpen = Boolean(anchorAlarm);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleNotiClick = (unreadCount) => {
    setUnreadCount(unreadCount);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAlarmMenuOpen = (event) => {
    setAnchorAlarm(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleAlarmClose = () => {
    setAnchorAlarm(null);
    // ???
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <ProfileMenu elevation={0}>
      <Menu
        anchorEl={anchorEl}
        PaperProps={{
          style: {
            width: "10vw",
            borderRadius: "1rem",
            minWidth: "150px",
          },
        }}
        // anchorOrigin={{
        //   vertical: "top",
        //   horizontal: "right",
        // }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem
          style={{ marginBottom: "0.5rem" }}
          onClick={() => {
            navigate("/SignUp");
            handleMenuClose();
          }}
        >
          Sign Up
        </MenuItem>
        <MenuItem
          style={{ marginBottom: "0.5rem" }}
          onClick={() => {
            navigate("/SignIn");
            handleMenuClose();
          }}
        >
          Log In
        </MenuItem>
        <Divider></Divider>
        <MenuItem
          style={{ marginBottom: "0.5rem" }}
          onClick={() => {
            navigate("/Reserve");
            handleMenuClose();
          }}
        >
          Reservation
        </MenuItem>
        {console.log(isAdmin)}
        {isAdmin && (
          <MenuItem
            style={{ marginBottom: "0.5rem" }}
            onClick={() => {
              navigate("/Dashboard");
              handleMenuClose();
            }}
          >
            Dashboard
          </MenuItem>
        )}
        {/* // test tab */}
        {/* <MenuItem
          style={{ marginBottom: "0.5rem" }}
          onClick={() => {
            navigate("/Test");
            handleMenuClose();
          }}
        >
          Test
        </MenuItem> */}
      </Menu>
    </ProfileMenu>
  );

  const alarmMenu = (
    <Paper sx={{ width: 450, borderRadius: "10px" }}>
      <Menu
        PaperProps={{
          style: {
            minWidth: "250px",
            maxHeight: "50vh",
            width: "25vw",
            borderRadius: "0.5rem",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={isAlarmOpen}
        anchorEl={anchorAlarm}
        onClose={handleAlarmClose}
      >
        <Announcement
          unreadCount={unreadCount}
          setUnreadCount={setUnreadCount}
          handleNotiClick={handleNotiClick}
        ></Announcement>
      </Menu>
    </Paper>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem onClick={handleAlarmMenuOpen}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={unreadCount} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem> */}
      <MenuItem>
        <IconButton
          size="large"
          // aria-label="show 17 new notifications"
          color="grey"
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="grey"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  const theme = useTheme();

  return (
    <>
      <Box sx={{ flexGrow: 1, marginTop: "2vh", marginBottom: "2vh" }}>
        <AppBar
          position="static"
          elevation={0}
          color="transparent"
          sx={{ boxShadow: "0px" }}
        >
          <Toolbar
            disableGutters={true}
            sx={{
              "& .MuiToolbar-root": { padding: "0px" },
            }}
          >
            <img
              onClick={() => {
                navigate("/Reserve");
              }}
              style={{
                cursor: "pointer",
                borderRadius: "1rem",
                width: "4rem",
                height: "4rem",
                marginRight: "0.5rem",
                //   marginLeft: "1rem",
              }}
              src="https://i.pinimg.com/originals/26/20/8c/26208c54439dd5d89de0256177496258.gif"
            ></img>
            <Typography
              onClick={() => {
                navigate("/Reserve");
              }}
              variant="h6"
              noWrap
              component="div"
              sx={{
                cursor: "pointer",
                display: { xs: "none", sm: "block" },
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: "1.5rem",
              }}
            >
              LiServe
            </Typography>
            {/* <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
      />
    </Search> */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: "1vw" }}>
              {/* <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                sx={{ color: theme.palette.grey.main }}
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon fontSize="5rem" />
                </Badge>
              </IconButton> */}
              <IconButton
                size="large"
                // aria-label="show 17 new notifications"
                color="inherit"
                onClick={handleAlarmMenuOpen}
                sx={{ color: theme.palette.grey.main }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon fontSize="5rem" />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ color: theme.palette.grey.main }}
              >
                <AccountCircle fontSize="7rem" />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                sx={{ color: theme.palette.grey.main }}
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        {alarmMenu}
      </Box>
    </>
  );
}
