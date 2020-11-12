import React, { useState, useEffect } from "react";
import axios from "axios";

import "./users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [adjustment, setAdjustment] = useState({
    id: "",
    level: ""
  });

  useEffect(() => {
    axios.get("/api/users").then(res => setUsers(res.data));
    axios.get("/api/user-roles").then(res => setRoles(res.data));
  }, []);

  const submitLevel = () => {
    axios.put(`/api/users`, adjustment);
  };

  console.log(adjustment);
  return (
    <div>
      <h1>Users:</h1>
      {users &&
        users.map(user => (
          <div key={user.id}>
            <h2>{user.username}</h2>
            <div>
              Current level: <b>{user.level}</b>
              <br />
              <select
                name="level"
                id="level"
                onChange={e =>
                  setAdjustment({
                    ...adjustment,
                    id: user.id,
                    level: e.target.value
                  })
                }
              >
                {roles &&
                  roles.map(role => (
                    <option key={role.level}>{role.level}</option>
                  ))}
              </select>
              <button onClick={submitLevel}>Change</button>
            </div>
            <hr />
          </div>
        ))}
    </div>
  );
};

export default Users;
