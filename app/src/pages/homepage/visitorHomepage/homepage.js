import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import Paper from "@material-ui/core/Paper";
import ListAltSharpIcon from "@material-ui/icons/ListAltSharp";
import LockOpenSharpIcon from "@material-ui/icons/LockOpenSharp";
import CreateSharpIcon from "@material-ui/icons/CreateSharp";

import "./homepage.css";

const VisitorHomepage = () => {
  const [user, setUser] = useState([]);

  const userType = useSelector(state => state.users.userType);

  useEffect(() => {
    axios
      .get(`/api/applicant/${userType.id}`)
      .then(res => setUser(res.data[0]))
      .catch(err => console.log(err));
  }, []);

  console.log("userType", userType);

  console.log("user", user);

  return (
    <div>
      <h1>Welcome to AppliCAN ...</h1>
      <h2>... the user-friendly applicant tracking system</h2>
      <div className="visitor-homepage-options">
        <Link to="/positions">
          <Paper elevation={3} square>
            <ListAltSharpIcon color={"primary"} />
            <br />
            View All Open Positions
          </Paper>
        </Link>
        <Link to={`/login`}>
          <Paper elevation={3} square>
            <LockOpenSharpIcon color={"primary"} />
            <br />
            Log In
          </Paper>
        </Link>
        <Link to={`/signup`}>
          <Paper elevation={3} square>
            <CreateSharpIcon color={"primary"} />
            <br />
            Sign Up
          </Paper>
        </Link>
      </div>
    </div>
  );
};

export default VisitorHomepage;
