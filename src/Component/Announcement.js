import * as React from "react";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { useTheme } from "@emotion/react";
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

export function Announcement({ setUnreadCount, unreadCount, handleNotiClick }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ message: "message" }]);
  const [read, setRead] = useState([]); // read messages
  // const [unreadCount, setUnreadCount] = useState(messages.length - read.length);
  const [ID, setID] = useState("");
  const [name, setName] = useState("");
  let width = window.innerWidth;
  const theme = useTheme();

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
    }
    init();
  }, []);

  //get messages
  useEffect(() => {
    async function getMessage() {
      const q = query(
        collection(db, "messages"),
        // limit(40),
        // limit(5),
        orderBy("timeStamp", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let tempMessage = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.id = doc.id;
          tempMessage.push(data);
          // if (!read.includes(data.id)) {
          //   tempMessage.push(data);
          // }
        });
        setMessages(tempMessage);
      });
    }
    getMessage();
  }, []);

  async function handleClick(el) {
    let tempRead = [...read];
    if (!read.includes(el.id)) {
      tempRead.push(el.id);
      // locally delete read messages
      setRead(tempRead);
      const docRef = doc(db, "users", ID);

      // update to server
      await updateDoc(docRef, {
        readMessages: tempRead,
      });
      // setUnreadCount(unreadCount - 1);
      handleNotiClick(unreadCount - 1);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",

        // height: "100vh",
        maxWidth: width * 0.3,
      }}
    >
      <List
        sx={{
          flex: 1,
          width: "100%",

          bgcolor: "background.paper",
        }}
      >
        {messages.map((el, i) => (
          <>
            <ListItem
              key={i}
              onClick={() => {
                handleClick(el);
              }}
              alignItems="flex-start"
              style={{
                // borderLeft: `4px solid ${
                //   el.isRead ? "transparent" : theme.palette.primary.main
                // }`,
                borderLeft: `4px solid ${
                  read.includes(el.id)
                    ? "transparent"
                    : theme.palette.primary.main
                }`,
                // borderLeft: `4px solid ` + theme.palette.primary.main,
                marginBottom: "1vh",
                // backgroundColor: "#e6f0ff",
                // backgroundColor: el.isRead ? "transparent" : "#e6f0ff",
              }}
            >
              <ListItemAvatar>
                <Avatar alt={el.from} src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary={el.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    ></Typography>

                    {el.message}
                  </React.Fragment>
                }
              />
            </ListItem>
            {/* <Divider variant="inset" component="li" width="15vw" /> */}
          </>
        ))}
      </List>
    </div>
  );
}
