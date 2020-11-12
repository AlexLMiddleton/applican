import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import "./header.css";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    textAlign: "left"
  }
}));

const Header = () => {
  const classes = useStyles();

  const userType = useSelector(state => state.users.userType);
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link className="headerLink" to="/">
              AppliCAN
            </Link>
          </Typography>
          {userType.level === undefined ? (
            <Button color="inherit">
              <Link className="headerLink" to="/login">
                Login
              </Link>
            </Button>
          ) : (
            <p>Welcome, {userType.level}!</p>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
