import React from "react";
import { Link } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import ListAltSharpIcon from "@material-ui/icons/ListAltSharp";
import LibraryAddSharpIcon from "@material-ui/icons/LibraryAddSharp";
import PersonAddSharpIcon from "@material-ui/icons/PersonAddSharp";
import LockSharpIcon from "@material-ui/icons/LockSharp";

import "./homepage.css";

const TechnicianHomepage = () => {
  return (
    <div>
      <h2>Technician Dashboard</h2>
      <div className="homepage-options">
        <Link to="/positions">
          <Paper elevation={3}>
            <ListAltSharpIcon color={"primary"} />
            <br />
            View Current Positions
          </Paper>
        </Link>
        <Link to="/new-position">
          <Paper elevation={3}>
            <LibraryAddSharpIcon color={"primary"} />
            <br />
            Post New Position
          </Paper>
        </Link>
        <Link to="/positions/unfilled">
          <Paper elevation={3}>
            <PersonAddSharpIcon color={"primary"} />
            <br />
            Screen Applicants
          </Paper>
        </Link>
        <Link to="/positions/filled">
          <Paper elevation={3}>
            <LockSharpIcon color={"primary"} />
            <br />
            Review Closed Position Postings
          </Paper>
        </Link>
      </div>
    </div>
  );
};

export default TechnicianHomepage;
