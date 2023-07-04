import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

const theme = {
  background: "#f5f8fb",
  fontFamily: "Helvetica Neue",
  headerBgColor: "#1e6cc7",
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor: "#1e6cc7",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#4a4a4a",
};

const steps = [
  {
    id: "1",
    message: "Hello! What is your name?",
    trigger: "2",
  },
  {
    id: "2",
    user: true,
    trigger: "3",
  },
  {
    id: "3",
    message: "Hi {previousValue}, nice to meet you! How can I help you?",
    // end: true,
    trigger: "4",
  },
  {
    id: "1",
    message: "What number I am thinking?",
    trigger: "2",
  },
  {
    id: "4",
    options: [
      { value: 1, label: "Option 1", trigger: "5" },
      { value: 2, label: "Option 2", trigger: "5" },
      { value: 3, label: "Option 3", trigger: "5" },
    ],
  },
  {
    end: true,
    id: "5",
    options: [
      { value: 1, label: "Option 4", trigger: "4" },
      { value: 2, label: "Option 5", trigger: "3" },
      { value: 3, label: "Option 6", trigger: "3" },
    ],
  },
];

export default function LiServeBot() {
  return (
    <ThemeProvider theme={theme}>
      <ChatBot floating={true} steps={steps} botDelay={500} userDelay={500} />
    </ThemeProvider>
  );
}
