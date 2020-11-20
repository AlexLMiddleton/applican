import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import "./position-applicants.css";

const PositionApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/api/position-applicants/${id}`)
      .then(res => setApplicants(res.data));
  }, [submitted]);

  const toggleInterviewStatus = x => {
    axios.put(`/api/applicant-positions/cleared-for-interview/${id}`, {
      applicant_id: x
    });
    setSubmitted(!submitted);
  };

  console.log("applicants", applicants);

  return (
    <div>
      <h1>Applicants for Job #{id}</h1>
      <div className="applicantGrid">
        {applicants &&
          applicants.map(applicant => (
            <Paper
              className="position-applicant-wrapper"
              elevation={3}
              square
              key={applicant.id}
            >
              <Link to={`/applicant/${applicant.applicant_id}`}>
                <h1 key={applicant.applicant_id}>{applicant.full_name}</h1>
              </Link>
              <p>
                Status:{" "}
                {applicant.cleared_for_interview === 0 ? (
                  <span>Uncleared</span>
                ) : (
                  <span style={{ color: "green" }}>Cleared for Interview</span>
                )}
              </p>
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="primary"
                onClick={() => {
                  toggleInterviewStatus(applicant.applicant_id);
                }}
              >
                Toggle Interview Status
              </Button>
            </Paper>
          ))}
      </div>
    </div>
  );
};

export default PositionApplicants;
