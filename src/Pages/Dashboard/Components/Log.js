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
import { getUserId, getUserName } from "../../../utils/Firebase";
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
import { db } from "../../../firebase";

export function Log() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ message: "message" }]);
  const [title, setTitle] = useState("");
  const [ID, setID] = useState("");
  const [name, setName] = useState("");
  let width = window.innerWidth;
  let height = window.innerHeight;
  // console.log(message);

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
    }
    init();
  }, []);

  //get messages
  useEffect(() => {
    async function getMessage() {
      const q = query(
        collection(db, "messages"),
        // limit(40),
        limit(5),
        orderBy("timeStamp", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let tempMessage = [];
        querySnapshot.forEach((doc) => {
          tempMessage.push(doc.data());
        });
        setMessages(tempMessage);
      });
    }
    getMessage();
  }, []);

  async function handleSubmit() {
    alert("Announcement sent!");
    const res = await addDoc(collection(db, "messages"), {
      timeStamp: serverTimestamp(),
      from: name,
      message: message,
      title: title,
    });
    setMessage("");
    setTitle("");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // padding: width * 0.025,
        // height: "100vh",
        maxWidth: "25vw",
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
            <ListItem alignItems="flex-start">
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
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
      <div
        style={{
          fontWeight: "500",
          color: "#5A5A5A",
          fontSize: "1.4rem",
          marginTop: "2vh",
          marginBottom: "1vh",
          textAlign: "start",
        }}
      >
        Message Students
      </div>
      <Box sx={{ alignSelf: "flex-end", width: "100%" }}>
        <TextField
          sx={{ marginBottom: "1rem" }}
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          id="outlined-basic"
          label="Title"
          placeholder="Title"
          variant="outlined"
          //   multiline
          fullWidth
          //   maxRows={4}
        />
        <TextField
          id="outlined-basic"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          label="Message"
          placeholder="Write the message for students here."
          variant="outlined"
          multiline
          fullWidth
          rows={4}
        />
        <Button
          sx={{ marginTop: "2rem", marginBottom: "2rem", width: "75%" }}
          variant="contained"
          onClick={handleSubmit}
        >
          Send
        </Button>
      </Box>
    </div>
  );
}
