import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// FIREBASE IMPORTS
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getUserId } from "../utils/Firebase";

const auth = getAuth();

const theme = createTheme();

export function SignUp() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    grade: "",
    sex: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signUpUser = () => {
    if (values.email == "") {
      //  setEmailError("Please enter an email.");
      //  alert(emailError);
      alert("Please enter an email.");
      return;
    } else if (values.name == "") {
      //  setNameError("Please enter your name.");
      //  alert(nameError);
      alert("Please enter your name.");
      return;
    } else if (values.password == "") {
      //  setPasswordError("Please enter a password.");
      //  alert(passwordError);
      alert("Please enter a password.");
      return;
    } else if (values.confirmPassword == "") {
      //  setConfirmPasswordError("Please confirm your password.");
      //  alert(confirmPasswordError);
      alert("Please confirm your password.");
      return;
    } else if (values.password != values.confirmPassword) {
      //  setConfirmPasswordError("Password does not match.");
      //  alert(confirmPasswordError);
      alert("Password does not match.");
      return;
    }

    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        console.log("The user account is created.");
        const id = await getUserId();
        const uniqueId = id;
        console.log("ID: ", uniqueId);
        await setDoc(doc(db, "users", uniqueId), {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          grade: values.grade,
          sex: values.sex,
          reserveCount: 0,
          seatReserved: "",
        });
        navigate("/signup");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "auth/email-already-in-use") {
          // Toast.show({
          //   type: "error",
          //   text1: "Email is already used.",
          // });
          alert("Email is already used.");
        } else if (errorCode == "auth/invalid-email") {
          // Toast.show({
          //   type: "error",
          //   text1: "Email format is not correct.",
          // });
          alert("Email format is not correct.");
        } else if (errorCode == "auth/invalid-email") {
          // Toast.show({
          //   type: "error",
          //   text1: "Email format is not correct.",
          // });
          alert("Email format is not correct.");
        } else if (errorCode == "auth/weak-password") {
          // Toast.show({
          //   type: "error",
          //   text1: "Password is too weak.",
          // });
          alert("Password is too weak.");
        }
        // setLoading(false);
      });
  };
  console.log(values);

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });
  // console.log(e.target);
  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      // values.firstName !== "admin" &&
      //   setValues({ ...values, isAdmin: true });
      await signUpUser(values);
      // alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      setError(error.message);
      alert(error.message);
    }
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get("email"),
  //     password: data.get("password"),
  //   });
  // };

  return (
    <div style={{ display: "flex", flexDirection: "row", margin: "0 auto" }}>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSignUp}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                value={values.firstName}
                onChange={handleChange}
                required
                fullWidth
                id="firstName"
                label="Full Name"
                name="firstName"
                autoComplete=""
                autoFocus
              />
              <FormControl sx={{ mt: 2 }} fullWidth>
                <InputLabel id="demo-simple-select-label">Grade</InputLabel>
                <Select
                  sx={{ textAlign: "left" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-label"
                  value={values.grade}
                  label="Grade"
                  name="grade"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Grade 10</MenuItem>
                  <MenuItem value={11}>Grade 11</MenuItem>
                  <MenuItem value={12}>Grade 12</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ mt: 2 }} fullWidth>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  sx={{ textAlign: "left" }}
                  labelId="demo-simple-select-label"
                  id="Sex"
                  value={values.sex}
                  label="Sex"
                  name="sex"
                  onChange={handleChange}
                >
                  <MenuItem value={"M"}>Male</MenuItem>
                  <MenuItem value={"F"}>Female</MenuItem>
                </Select>
              </FormControl>
              <TextField
                value={values.email}
                onChange={handleChange}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                value={values.password}
                onChange={handleChange}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <TextField
                value={values.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="confirmPassword"
              />
              {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign up
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    {/* Forgot password? */}
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    //   href="#"
                    variant="body2"
                    onClick={() => {
                      navigate("/signin");
                    }}
                  >
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/ehayng1/">
        LiServe
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
