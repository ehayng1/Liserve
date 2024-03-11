import React, { useEffect, useState } from "react";

// import { TabContext } from "../Context/UserContext";
import { useNavigate, Outlet } from "react-router-dom";
// import "./Home.css";
import { ResponsiveDrawer } from "../App";
import TopBar from "../Component/TopBar";
import Divider from "@mui/material/Divider";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";

export default function Home() {
  const [name, setName] = useState("");
  const { ID, userName } = useContext(UserContext);
  // console.log(ID);
  // alert(ID);
  const windowWidth = window.innerWidth;
  // const tabData = useContext(TabContext);
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/Reserve");
  }, []);

  return (
    // with sideBar
    // <div style={{ display: "flex", flexDirection: "row" }}>
    //   <ResponsiveDrawer></ResponsiveDrawer>
    //   <Outlet />
    // </div>

    // with TopBar
    <>
      <div style={{ marginLeft: "5vh", marginRight: "5vh" }}>
        <TopBar></TopBar>
      </div>
      <Divider></Divider>
      {/* <div style={{ marginLeft: "5vh", marginRight: "5vh", marginTop: "0vh" }}> */}
      <div
        style={{
          // marginLeft: "10%",
          // marginRight: "10%",
          marginTop: "0vh",
          marginBottom: "5vh",
        }}
      >
        <Outlet />
      </div>
    </>
  );
}
