import React from "react";
import { useSelector } from "react-redux";
import UserHomepage from "./userHomepage/homepage";
import TechnicianHomepage from "./technicianHomepage/homepage";
import VisitorHomepage from "./visitorHomepage/homepage";

const Homepage = () => {
  const userType = useSelector(state => state.users.userType);

  console.log(userType.level);
  return (
    <div>
      {userType.level == null ? (
        <VisitorHomepage />
      ) : userType.level === "user" ? (
        <UserHomepage />
      ) : (
        <TechnicianHomepage />
      )}
    </div>
  );
};

export default Homepage;
