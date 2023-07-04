import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "./SideBar.css";
import { width } from "@mui/system";
import { useContext } from "react";
import { TabContext } from "../Context/TabContext";
import { styled } from "@mui/material/styles";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TimelineIcon from "@mui/icons-material/Timeline";
import Person2Icon from "@mui/icons-material/Person2";

import { useNavigate } from "react-router-dom";

// overrides the style of MUI "Button" component
const Tab = styled(Button)(() => ({
  borderRadius: "10rem",
  marginBottom: "1rem",
  fontSize: "1rem",
  padding: "0.8rem 14px",
  textTransform: "none",
  justifyContent: "flex-start",
  paddingLeft: "25%",
  gap: "0.5rem",
  "&.MuiButton-contained": {
    fontWeight: "600",
  },
}));

export default function SideBar() {
  const tabData = useContext(TabContext);
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerWidth;
  const iconSize = "1.6rem";
  const navigate = useNavigate();

  function handleClick(e) {
    // alert(e.target.innerText);
    tabData.setCurrentTab(e.target.innerText);
    navigate("/" + e.target.innerText.toLowerCase());
    // navigation
  }
  return (
    <>
      <div
        className="flexcol"
        style={{
          width: windowWidth * 0.125,
          marginLeft: windowWidth * 0.025,
          marginRight: windowWidth * 0.025,
        }}
        // style={{ width: "10%", margin: "0 auto" }}
        // style={{ margin: "0 auto" }}
      >
        <div className="flexrow">
          <img
            style={{
              borderRadius: "1rem",
              width: "4rem",
              height: "4rem",
              marginRight: "1rem",
            }}
            src="https://i.pinimg.com/originals/26/20/8c/26208c54439dd5d89de0256177496258.gif"
          ></img>
          <h1
            style={{
              textAlign: "center",
              marginTop: "5rem",
              marginBottom: "5rem",
            }}
          >
            LiServe
          </h1>
        </div>
        <Tab
          onClick={handleClick}
          variant={tabData.currentTab === "Reserve" ? "contained" : "text"}
          startIcon={
            <EventAvailableIcon sx={{ width: iconSize, height: iconSize }} />
          }
        >
          Reserve
        </Tab>
        <Tab
          onClick={handleClick}
          variant={tabData.currentTab === "Dashboard" ? "contained" : "text"}
          startIcon={
            <TimelineIcon sx={{ width: iconSize, height: iconSize }} />
          }
        >
          Dashboard
        </Tab>
        <Tab
          onClick={handleClick}
          variant={tabData.currentTab === "Profile" ? "contained" : "text"}
          startIcon={<Person2Icon sx={{ width: iconSize, height: iconSize }} />}
        >
          Profile
        </Tab>
      </div>
      {/* <Link to="/signup">signup</Link>
      <Link to="/signin">SignIn</Link> */}
    </>
  );
}
