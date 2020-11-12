import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ClosedFilledPositions = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    axios.get(`/api/positions/filled`).then(res => setPositions(res.data));
  }, []);

  console.log(positions);
  return (
    <div>
      <h1>Closed, Filled Positions</h1>
      {positions &&
        positions.map(position => (
          <div key={position.id}>
            <Link to={`/position/${position.id}`}>
              <h2>{position.title}</h2>
            </Link>
            <h4>{position.department}</h4>
            <h4>{position.closing_date.split("T")[0]}</h4>
            <Link to={`/position/applicants/${position.id}`}>
              View Applicants
            </Link>
            <hr />
          </div>
        ))}
    </div>
  );
};

export default ClosedFilledPositions;
