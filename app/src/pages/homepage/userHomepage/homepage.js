import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import Paper from "@material-ui/core/Paper";
import ListAltSharpIcon from "@material-ui/icons/ListAltSharp";
import BuildSharpIcon from "@material-ui/icons/BuildSharp";
import AddSharpIcon from "@material-ui/icons/AddSharp";
import NetworkCheckSharpIcon from "@material-ui/icons/NetworkCheckSharp";

import "./homepage.css";

const UserHomepage = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  const userType = useSelector(state => state.users.userType);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/applicant/${userType.id}`)
      .then(res => setUser(res.data[0]))
      .then(setLoading(false))
      .catch(err => console.log(err));
  }, [loading]);

  console.log("userType", userType);

  console.log("user", user);

  return (
    <div>
      <h1>AppliCAN</h1>
      {!loading ? (
        <div className="homepage-options">
          <Link to="/positions">
            <Paper elevation={3}>
              <ListAltSharpIcon color={"primary"} />
              <br />
              View All Open Positions
            </Paper>
          </Link>
          <Link to={`/applicant/positions/${userType.id}`}>
            <Paper elevation={3}>
              <NetworkCheckSharpIcon color={"primary"} />
              <br />
              View Application Status
            </Paper>
          </Link>
          {user.id ? (
            <Link to={`/applicant/edit/${userType.id}`}>
              <Paper elevation={3}>
                <BuildSharpIcon color={"primary"} />
                <br />
                Update Application
              </Paper>
            </Link>
          ) : (
            <Link to={`/new-application`}>
              <Paper elevation={3}>
                <AddSharpIcon color={"primary"} />
                <br />
                Create a New Application
              </Paper>
            </Link>
          )}
        </div>
      ) : (
        <div>
          <h1>Still loading...</h1>
        </div>
      )}
    </div>
  );
};

export default UserHomepage;
