import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

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
    axios.get("/api/users/roles").then(res => setRoles(res.data));
  }, []);

  const submitLevel = () => {
    axios.put(`/api/users`, adjustment);
  };
  console.log("Users", users);
  console.log("Roles", roles);
  console.log("Adjustment", adjustment);
  return (
    <div>
      <h1>Users:</h1>
      <div className="user-info-wrapper">
        {users &&
          users.map((user, index) => (
            <Paper
              className="user-info-paper"
              elevation={3}
              square
              key={user.id}
            >
              <h2>{user.username}</h2>
              <hr style={{ width: "70%", textAlign: "center" }} />
              <br />
              <div>
                Current permission level: <b>{user.level}</b>
                <br />
                <br />
                <br />
                <FormControl variant="outlined" style={{ minWidth: "35%" }}>
                  <InputLabel id="demo-simple-select-outlined-label">
                    Level
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    name="level"
                    id="level"
                    value={user[index].level}
                    label="Level"
                    onChange={e =>
                      setAdjustment({
                        ...adjustment,
                        id: user.id,
                        level: e.target.value
                      })
                    }
                  >
                    {roles &&
                      roles.map((role, index) => (
                        <MenuItem key={index}>{role.level}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <br />
                <br />
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={submitLevel}
                >
                  Change
                </Button>
              </div>
              <br />
            </Paper>
          ))}
      </div>
    </div>
  );
};

export default Users;
