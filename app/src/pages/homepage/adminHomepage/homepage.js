import React from "react";
import { Link } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import ListAltSharpIcon from "@material-ui/icons/ListAltSharp";
import LibraryAddSharpIcon from "@material-ui/icons/LibraryAddSharp";
import PersonAddSharpIcon from "@material-ui/icons/PersonAddSharp";
import LockSharpIcon from "@material-ui/icons/LockSharp";

import "./homepage.css";

const AdminHomepage = () => {
  return (
    <div>
      <h1>Administrator Dashboard</h1>
      <div className="admin-homepage-options">
        <Link to="/positions">
          <Paper elevation={3} square>
            <ListAltSharpIcon color={"primary"} />
            <br />
            View Current Positions
          </Paper>
        </Link>
        <Link to="/new-position">
          <Paper elevation={3} square>
            <LibraryAddSharpIcon color={"primary"} />
            <br />
            Post New Position
          </Paper>
        </Link>
        <Link to="/positions/unfilled">
          <Paper elevation={3} square>
            <PersonAddSharpIcon color={"primary"} />
            <br />
            Screen Applicants
          </Paper>
        </Link>
        <Link to="/positions/filled">
          <Paper elevation={3} square>
            <LockSharpIcon color={"primary"} />
            <br />
            Review Closed Position Postings
          </Paper>
        </Link>
        <br />
        <Link to="/admin/users">
          <Paper elevation={3}>
            <LockSharpIcon color={"primary"} />
            <br />
            View All Users
          </Paper>
        </Link>
      </div>
    </div>
  );
};

export default AdminHomepage;
