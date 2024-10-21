import React, { useState } from "react";
import Field from "./Field";
import useStyles from "./styles";
import styles from "./Login.module.css";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { signup, signin } from "../../actions/auth";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useSnackbar } from "react-simple-snackbar";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  profilePicture: "",
  bio: "",
};

const Login = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar] = useSnackbar();
  const user = JSON.parse(localStorage.getItem("profile"));

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (isSignup) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        openSnackbar("Please fill all required fields"); // Show warning
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        openSnackbar("Passwords do not match"); // Show warning if passwords don't match
        return;
      }
    } else {
      if (!formData.email || !formData.password) {
        openSnackbar("Please fill all required fields"); // Show warning
        return;
      }
    }

    try {
      // Dispatch sign in or sign up actions
      if (isSignup) {
        await dispatch(signup(formData, openSnackbar));
      } else {
        await dispatch(signin(formData, openSnackbar));
      }

      // After successful authentication, redirect to dashboard
      history.push("/dashboard");
    } catch (error) {
      console.error(error);
      openSnackbar(
        "Authentication failed. Please check your details and try again."
      );
    }
  };

  const switchMode = () => {
    setIsSignup((prevState) => !prevState);
  };

  if (user) {
    history.push("/dashboard");
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={2}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignup ? "Sign up" : "Sign in"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Field
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Field
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Field
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Field
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignup && (
              <Field
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>
          <div className={styles.buttons}>
            <div>
              <button className={styles.submitBtn} type="submit">
                {isSignup ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
          <Link to="forgot">
            <p
              style={{
                textAlign: "center",
                color: "#1d7dd6",
                marginTop: "20px",
              }}
            >
              Forgotten Password?
            </p>
          </Link>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
