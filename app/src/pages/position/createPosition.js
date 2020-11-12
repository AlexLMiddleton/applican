import React, { useState } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const CreatePosition = () => {
  const [position, setPosition] = useState({
    title: "",
    department: "",
    salary: "",
    closing_date: ""
  });

  const submit = e => {
    e.preventDefault();
    axios.post("/api/positions", position);
  };

  return (
    <div className="wrapper">
      <div className="container">
        <h1>Create a New Job Posting</h1>
        <p>Enter new position information below.</p>
        <form onSubmit={submit}>
          <TextField
            id="outlined-basic"
            label="Position title"
            variant="outlined"
            type="text"
            name="position[title]"
            value={position.title}
            style={{ width: "80%" }}
            onChange={e => setPosition({ ...position, title: e.target.value })}
          />
          <br />
          <br />
          <TextField
            id="outlined-basic"
            label="Department"
            variant="outlined"
            type="text"
            name="position[department]"
            value={position.department}
            style={{ width: "80%" }}
            onChange={e =>
              setPosition({ ...position, department: e.target.value })
            }
          />
          <br />
          <br />
          <TextField
            id="outlined-basic"
            label="Salary"
            variant="outlined"
            type="text"
            name="position[salary]"
            value={position.salary}
            style={{ width: "80%" }}
            onChange={e => setPosition({ ...position, salary: e.target.value })}
          />
          <br />
          <br />
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Closing date"
            type="date"
            name="position[closing_date]"
            value={position.closing_date}
            style={{ width: "80%" }}
            InputLabelProps={{ shrink: true }}
            onChange={e =>
              setPosition({ ...position, closing_date: e.target.value })
            }
          />
          <br />
          <Button
            type="submit"
            variant="contained"
            size="small"
            color="primary"
            onClick={submit}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePosition;
