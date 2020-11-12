import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const EditPosition = () => {
  const { id } = useParams();
  const [position, setPosition] = useState([]);

  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/position/${id}`)
      .then(res => setPosition(res.data))
      .then(setLoading(false));
  }, [setPosition]);

  const submit = e => {
    e.preventDefault();
    axios.put(`/api/position/${id}`, position[0]);
  };

  const handleChange = e => {
    setPosition([{ ...position[0], [e.target.name]: e.target.value }]);
  };

  const deletePosition = e => {
    e.preventDefault();
    axios.delete(`/api/position/${id}`);
  };

  return (
    <div className="wrapper">
      <div className="container">
        <h1>Edit Position Posting</h1>
        <p>Enter your posting changes below.</p>
        {!loading &&
          position.map(pos => (
            <div key={pos.id}>
              <form onSubmit={submit}>
                <TextField
                  id="outlined-basic"
                  label="Position title"
                  variant="outlined"
                  type="text"
                  name="title"
                  value={pos.title}
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
                  value={pos.department}
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
                  value={pos.salary}
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
                  defaultValue={pos.closing_date.split("T")[0]}
                  style={{ width: "80%" }}
                  onChange={handleChange}
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
          ))}
      </div>
    </div>
  );
};

export default EditPosition;
