import React, { useState } from "react";
import axios from "axios";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";

const Signup = () => {
  const [signup, setSignup] = useState({
    username: "",
    password: ""
  });

  const submit = e => {
    e.preventDefault();
    axios.post("/api/user/signup", signup);
  };
  return (
    <div className="wrapper">
      <div className="container">
        <h1>Signup Form</h1>
        <p>Please enter your new username and password below.</p>
        <form onSubmit={submit}>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            title="usernameField"
            name="username"
            value={signup.username}
            onChange={e => setSignup({ ...signup, username: e.target.value })}
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
            title="passwordField"
            name="password"
            value={signup.password}
            onChange={e => setSignup({ ...signup, password: e.target.value })}
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
            onClick={submit}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
