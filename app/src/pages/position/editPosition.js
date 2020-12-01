import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const EditPosition = () => {
  const { id } = useParams();
  const [position, setPosition] = useState({});
  const [task, setTask] = useState([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    axios.all([
      axios.get(`/api/position/${id}`).then(res => setPosition(res.data[0])),
      axios
        .get(`/api/position/description/${id}`)
        .then(res => setTask(res.data))
        .then(setLoading(false))
    ]);
  }, [setPosition]);

  const handleTaskChangeInput = (index, event) => {
    if (
      !position.title ||
      !position.department ||
      !position.salary ||
      !position.closing_date
    ) {
      alert(
        "You must complete the position information section before continuing"
      );
    } else {
      const values = [...task];
      values[index][event.target.name] = event.target.value;
      setTask(values);
    }
  };

  const addTaskFields = e => {
    e.preventDefault();
    setTask([
      ...task,
      {
        description: ""
      }
    ]);
  };

  console.log("Tasks ", task);

  const submit = e => {
    e.preventDefault();
    axios.all([
      axios.put(`/api/position/${id}`, position),
      axios.put(`/api/position/description/${id}`, task)
    ]);
  };

  const handleChange = e => {
    setPosition({ ...position, [e.target.name]: e.target.value });
  };

  const deletePosition = e => {
    e.preventDefault();
    axios.delete(`/api/position/${id}`);
  };

  console.log("Position", position);

  return (
    <div className="createPositionWrapper">
      <div className="container">
        <h1>Edit Position Posting</h1>
        <p>Enter your posting changes below.</p>
        {!loading ? (
          <div key={position.id}>
            <form onSubmit={submit}>
              <TextField
                id="outlined-basic"
                label="Position title"
                variant="outlined"
                type="text"
                name="title"
                value={position.title}
                style={{ width: "80%" }}
                onChange={handleChange}
              />
              <br />
              <br />
              <TextField
                id="outlined-basic"
                label="Department"
                variant="outlined"
                type="text"
                name="department"
                value={position.department}
                style={{ width: "80%" }}
                onChange={handleChange}
              />
              <br />
              <br />
              <TextField
                id="outlined-basic"
                label="Salary"
                variant="outlined"
                type="text"
                name="salary"
                value={position.salary}
                style={{ width: "80%" }}
                onChange={handleChange}
              />
              <br />
              <br />
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Closing date"
                type="date"
                name="closing_date"
                defaultValue={position.closing_date}
                style={{ width: "80%" }}
                onChange={handleChange}
              />
              <br />
              <br />
              <hr />
              <h2>Job Description Items:</h2>
              {task &&
                task.map((t, index) => (
                  <div key={index}>
                    <br />
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      label="Item"
                      type="text"
                      name="tasks"
                      value={t.tasks}
                      style={{ width: "80%" }}
                      onChange={event => handleTaskChangeInput(index, event)}
                    />
                    <br />
                    <br />
                    <hr />
                  </div>
                ))}
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="secondary"
                onClick={addTaskFields}
              >
                Add New Task
              </Button>
              <hr />
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="primary"
                onClick={submit}
              >
                Submit
              </Button>
              <hr />
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="secondary"
                onClick={deletePosition}
              >
                Delete
              </Button>
            </form>
          </div>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
};

export default EditPosition;
