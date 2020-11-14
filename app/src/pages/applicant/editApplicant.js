import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const EditApplicant = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    full_name: "",
    street_address: "",
    city: "",
    state: "",
    zip: ""
  });
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSubmitted(false);
    axios.all([
      axios.get(`/api/applicant/${id}`).then(res => setUser(res.data[0])),
      axios
        .get(`/api/applicants/education`)
        .then(res => setEducation(res.data))
        .then(setLoading(false))
    ]);
  }, [submitted]);

  const editedPosts = education.filter(
    ed => ed.id && ed.university && ed.degree
  );
  const addedPosts = education.filter(
    ed => !ed.id && ed.university && ed.degree
  );
  const incompletePosts = education.filter(ed => !ed.university || !ed.degree);

  const submit = e => {
    e.preventDefault();
    axios.all([
      axios.put("/api/applicants", user, {
        withCredentials: true
      }),
      axios.put("/api/applicants/education", editedPosts, {
        withCredentials: true
      }),
      axios.post("/api/applicants/education", addedPosts, {
        withCredentials: true
      })
    ]);
    setOpen(true);
    setSubmitted(true);
  };

  const handleChangeInput = (index, event) => {
    const values = [...education];
    values[index][event.target.name] = event.target.value;
    setEducation(values);
  };

  const handleClose = () => {
    setOpen(false);
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

  const deleteApplicant = () => {
    try {
      axios.delete(`/api/applicant/${id}`);
    } catch {
      console.log("Delete failed!");
    }
  };

  const deleteEducation = education_id => {
    try {
      axios
        .delete(`/api/applicants/education/${education_id}`)
        .then(setSubmitted(true));
    } catch {
      console.log("Education entry delete failed!");
    }
  };

  return (
    <div>
      <div className="container">
        <h1>Edit Profile</h1>
        <p>
          Once complete, click "Update Application" near the bottom of the form.
        </p>
        {!loading ? (
          <form onSubmit={submit}>
            <TextField
              variant="outlined"
              id="outlined-basic"
              label="Full name"
              type="text"
              name="full_name"
              value={user.full_name}
              onChange={handleChangeInput}
              style={{ width: "80%" }}
            />
            <br />
            <br />
            <TextField
              variant="outlined"
              id="outlined-basic"
              label="Street address"
              type="text"
              name="street_address"
              value={user.street_address}
              onChange={handleChangeInput}
              style={{ width: "80%" }}
            />
            <br />
            <br />
            <TextField
              variant="outlined"
              id="outlined-basic"
              label="city"
              type="text"
              name="city"
              value={user.city}
              onChange={handleChangeInput}
              style={{ width: "80%" }}
            />
            <br />
            <br />
            <TextField
              variant="outlined"
              id="outlined-basic"
              label="state"
              type="text"
              name="state"
              value={user.state}
              onChange={handleChangeInput}
              style={{ width: "80%" }}
            />
            <br />
            <br />
            <TextField
              variant="outlined"
              id="outlined-basic"
              label="zip"
              type="text"
              name="zip"
              value={user.zip}
              onChange={handleChangeInput}
              style={{ width: "80%" }}
            />
            <br />
            <br />
            <hr />
            {education.map((ed, index) => (
              <div key={index}>
                <h2>Education Entry #{index + 1}</h2>
                {ed.id ? (
                  <>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => deleteEducation(ed.id)}
                      style={{ width: "20%" }}
                    >
                      delete
                    </Button>
                    <br />
                    <br />
                  </>
                ) : (
                  ""
                )}
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
              onClick={submit}
              variant="contained"
              size="small"
              color="primary"
            >
              Update Application
            </Button>
          </form>
        ) : (
          <h1>Loading...</h1>
        )}
        <hr />
        <Button
          onClick={deleteApplicant}
          variant="contained"
          size="small"
          color="secondary"
        >
          Delete Application
        </Button>
      </div>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {incompletePosts.length > 0
              ? "There was a problem with your request"
              : "Application update submitted"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {incompletePosts.length > 0
                ? "One or more of your education entries was incomplete and could not be added.  All entries must contain a school name and degree level."
                : "Your changes have been submitted."}
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button onClick={handleClose} color="primary" variant="outlined">
              Acknowledge
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default EditApplicant;
