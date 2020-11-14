import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserLevel } from "../../actions/userActions";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";

import "./login.css";

const Login = () => {
  const [login, setLogin] = useState({
    username: "",
    password: ""
  });
  const userType = useSelector(state => state.users.userType);

  const history = useHistory();
  const dispatch = useDispatch();

  const submit = e => {
    e.preventDefault();
    axios
      .post("/api/user/login", {
        username: login.username,
        password: login.password
      })
      .then(() => dispatch(setUserLevel()))
      .then(() => {
        history.push("/");
      });
  };

  return (
    <div className="wrapper">
      <div className="container">
        <h1>Login Form</h1>
        <p>Please enter your username and password below.</p>
        <form onSubmit={submit}>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            name="username"
            value={login.username}
            onChange={e => setLogin({ ...login, username: e.target.value })}
            style={{ width: "80%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              )
            }}
          />
          <br />
          <br />
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            name="password"
            value={login.password}
            onChange={e => setLogin({ ...login, password: e.target.value })}
            style={{ width: "80%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              )
            }}
          />
          <br />
          <Button
            type="submit"
            variant="contained"
            size="small"
            color="primary"
            onSubmit={submit}
          >
            Submit
          </Button>
        </form>
        <Link id="forgot-password" to="/forgot-password">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
