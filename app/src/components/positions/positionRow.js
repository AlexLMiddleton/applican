import React from "react";
import { Link } from "react-router-dom";

import Paper from "@material-ui/core/Paper";

import "./positionRow.css";

const PositionRow = props => {
  return (
    <div className="positionRowContainer">
      <Paper elevation={3} key={props.id} className="positionRowItem">
        <Link to={`/position/${props.id}`}>
          <h1>{props.title}</h1>
        </Link>
        <p>Department: {props.department}</p>
        <p>
          Salary:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
          }).format(props.salary)}
        </p>
        <p>Job closes: {props.closing_date}</p>
      </Paper>
    </div>
  );
};

export default PositionRow;
