import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

// import Homepage from "../../pages/homepage/userHomepage/homepage";
// import TechnicianHomepage from "../../pages/homepage/technicianHomepage/homepage";

export const UserRoute = ({ component: Component, ...rest }) => {
  const userType = useSelector(state => state.users.userType);
  return (
    <Route
      {...rest}
      render={props =>
        userType.level === "user" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export const TechnicianRoute = ({ component: Component, ...rest }) => {
  const userType = useSelector(state => state.users.userType);
  return (
    <Route
      {...rest}
      render={props =>
        userType.level === "technician" ||
        userType.level === "administrator" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export const AdminRoute = ({ component: Component, ...rest }) => {
  const userType = useSelector(state => state.users.userType);
  return (
    <Route
      {...rest}
      render={props =>
        userType.level === "administrator" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};
