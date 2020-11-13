import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const CreateApplicant = () => {
  const [user, setUser] = useState({
    full_name: "",
    street_address: "",
    city: "",
    state: "",
    zip: ""
  });
  const [education, setEducation] = useState([
    {
      university: "",
      degree: "",
      major: "",
      graduated: ""
    }
  ]);

  const history = useHistory();

  const handleChangeInput = (index, event) => {
    const values = [...education];
    values[index][event.target.name] = event.target.value;
    setEducation(values);
  };

  const addEducationFields = () => {
    setEducation([
      ...education,
      {
        university: "",
        degree: "",
        major: "",
        graduated: ""
      }
    ]);
  };

  const submit = e => {
    e.preventDefault();
    axios.all([
      axios.post("/api/applicants", user, {
        withCredentials: true
      }),
      axios.post("/api/applicants/education", education, {
        withCredentials: true
      })
    ]);
  };

  console.log("Education: ", education);

  return (
    <div>
      <div className="container">
        <h1>Create an AppliCAN Profile</h1>
        <form onSubmit={submit}>
          <TextField
            variant="outlined"
            id="outlined-basic"
            label="Full name"
            id="nameField"
            type="text"
            name="user[full_name]"
            value={user.full_name}
            style={{ width: "80%" }}
            onChange={e => setUser({ ...user, full_name: e.target.value })}
          />
          <br />
          <br />
          <TextField
            variant="outlined"
            id="outlined-basic"
            label="Street address"
            id="streetAddressField"
            type="text"
            name="user[street_address]"
            value={user.street_address}
            style={{ width: "80%" }}
            onChange={e => setUser({ ...user, street_address: e.target.value })}
          />
          <br />
          <br />
          <TextField
            variant="outlined"
            id="outlined-basic"
            label="City"
            id="cityField"
            type="text"
            name="user[city]"
            value={user.city}
            style={{ width: "80%" }}
            onChange={e => setUser({ ...user, city: e.target.value })}
          />
          <br />
          <br />
          <TextField
            variant="outlined"
            id="outlined-basic"
            label="State"
            id="stateField"
            type="text"
            name="user[state]"
            value={user.state}
            style={{ width: "80%" }}
            onChange={e => setUser({ ...user, state: e.target.value })}
          />
          <br />
          <br />
          <TextField
            variant="outlined"
            id="outlined-basic"
            label="ZIP Code"
            id="zipField"
            type="text"
            name="user[zip]"
            value={user.zip}
            style={{ width: "80%" }}
            onChange={e => setUser({ ...user, zip: e.target.value })}
          />
          <br />
          <br />
          <hr />
          {education.map((ed, index) => (
            <div key={index}>
              <h2>Education Entry #{index + 1}</h2>
              <TextField
                variant="outlined"
                label="School name"
                id="universityField"
                type="text"
                name="university"
                value={ed.university}
                style={{ width: "80%" }}
                onChange={event => handleChangeInput(index, event)}
              />
              <br />
              <br />
              <FormControl variant="outlined" style={{ width: "80%" }}>
                <InputLabel id="highest-degree-completed-field">
                  Education level
                </InputLabel>
                <Select
                  variant="outlined"
                  labelId="highest-degree-completed-field"
                  label="Education level"
                  id="degreeField"
                  type="text"
                  name="degree"
                  value={ed.degree}
                  onChange={event => handleChangeInput(index, event)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="High School Diploma">
                    <em>High School Diploma</em>
                  </MenuItem>
                  <MenuItem value="Some College">
                    <em>Some College</em>
                  </MenuItem>
                  <MenuItem value="Associates">
                    <em>Associates</em>
                  </MenuItem>
                  <MenuItem value="Bachelors">
                    <em>Bachelors</em>
                  </MenuItem>
                  <MenuItem value="Masters">
                    <em>Masters</em>
                  </MenuItem>
                  <MenuItem value="Specialist">
                    <em>Specialist</em>
                  </MenuItem>
                  <MenuItem value="Doctorate">
                    <em>Doctorate</em>
                  </MenuItem>
                </Select>
              </FormControl>
              <br />
              <br />
              <TextField
                variant="outlined"
                label="Major"
                id="majorField"
                type="text"
                name="major"
                value={ed.major}
                style={{ width: "80%" }}
                onChange={event => handleChangeInput(index, event)}
              />
              <br />
              <br />
              <TextField
                variant="outlined"
                label="Graduation date"
                id="graduatedField"
                type="date"
                name="graduated"
                value={ed.graduated}
                style={{ width: "80%" }}
                InputLabelProps={{ shrink: true }}
                onChange={event => handleChangeInput(index, event)}
              />
              <br />
              <br />
              <hr />
            </div>
          ))}
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => addEducationFields()}
          >
            Add Another Education Entry
          </Button>
          <hr />
          <Button
            type="submit"
            variant="contained"
            size="small"
            color="primary"
            onClick={submit}
          >
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateApplicant;
