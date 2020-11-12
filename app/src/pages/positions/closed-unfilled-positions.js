import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import "./positions.css";

const ClosedUnfilledPositions = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    axios.get(`/api/positions/unfilled`).then(res => setPositions(res.data));
  }, []);

  return (
    <div>
      <h1>Closed, Unfilled Positions</h1>
      <div className="position-container">
        {positions &&
          positions.map(position => (
            <div key={position.id}>
              <Paper elevation={3}>
                <Link to={`/position/${position.id}`}>
                  <h2>{position.title}</h2>
                </Link>
                <h4>{position.department}</h4>
                <h4>{position.closing_date.split("T")[0]}</h4>
                <div className="applicant-buttons">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    style={{ width: "40%" }}
                  >
                    <Link to={`/position/applicants/${position.id}`}>
                      View All Applicants
                    </Link>
                  </Button>{" "}
                  |{" "}
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    style={{ width: "40%" }}
                  >
                    <Link to={`/position/cleared-for-interview/${position.id}`}>
                      View Cleared Applicants
                    </Link>
                  </Button>
                </div>
              </Paper>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ClosedUnfilledPositions;
