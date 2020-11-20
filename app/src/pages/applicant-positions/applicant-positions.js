import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import "./applicant-positions.css";

const ApplicantPositions = () => {
  const [positions, setPositions] = useState([]);
  const [acceptInterviewToggle, setAcceptInterviewToggle] = useState(false);
  const [rejectInterviewToggle, setRejectInterviewToggle] = useState(false);
  const { id } = useParams();

  const acceptInterview = interview => {
    axios
      .put(`/api/applicant-positions/accept`, interview)
      .then(setAcceptInterviewToggle(interview => !interview));
  };

  const rejectInterview = interview => {
    axios
      .put(`/api/applicant-positions/reject`, interview)
      .then(setRejectInterviewToggle(interview => !interview));
  };

  useEffect(() => {
    axios
      .get(`/api/applicant-positions/${id}`)
      .then(res => setPositions(res.data));
  }, [rejectInterviewToggle, acceptInterviewToggle]);

  return (
    <div>
      <h1>Positions Applied For:</h1>
      <div className="position-container">
        {positions &&
          positions.map(pos => (
            <div key={pos.id}>
              <Paper elevation={3} square>
                <Link to={`/position/${pos.position_id}`}>
                  <h1>{pos.title}</h1>
                </Link>
                <h3>{pos.department}</h3>
                <p>Job Posting Status: {pos.status}</p>
                <div>
                  Application Status:{" "}
                  {pos.cleared_for_interview === 1 && pos.interview_date ? (
                    <>
                      <span style={{ color: "green" }}>cleared</span>
                      <br />
                      <hr />
                      <div className="interview-container">
                        Interview date and time: {pos.interview_date}
                        <br />
                        <ButtonGroup>
                          <Button
                            onClick={() =>
                              acceptInterview({
                                accepted_id: 1,
                                applicant_id: pos.applicant_id,
                                position_id: pos.position_id,
                                interview_time: pos.interview_date
                              })
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() =>
                              rejectInterview({
                                accepted_id: 0,
                                applicant_id: pos.applicant_id,
                                position_id: pos.position_id,
                                interview_time: pos.interview_date
                              })
                            }
                          >
                            Reject
                          </Button>
                        </ButtonGroup>
                        <br />
                        Current interview status:{" "}
                        {pos.accepted === 1 ? (
                          <span style={{ color: "green" }}>Accepted</span>
                        ) : (
                          <span>Rejected</span>
                        )}
                      </div>
                    </>
                  ) : pos.cleared_for_interview === 1 &&
                    pos.interview_date == null ? (
                    <span style={{ color: "blue" }}>
                      cleared, awaiting interview scheduling
                    </span>
                  ) : pos.status === "open" ? (
                    <span>position still open</span>
                  ) : (
                    <span>declined</span>
                  )}
                </div>
              </Paper>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ApplicantPositions;
