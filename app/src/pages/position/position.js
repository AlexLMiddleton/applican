import React from "react";
import { useSelector } from "react-redux";
import UserPosition from "./user/position";
import TechnicianPosition from "./technician/position";

const Position = () => {
  const userType = useSelector(state => state.users.userType);
  console.log("userType: ", userType);
  return (
    <div>
      {userType.level == null || userType.level === "user" ? (
        <UserPosition />
      ) : (
        <TechnicianPosition />
      )}
    </div>
  );
};

export default Position;
