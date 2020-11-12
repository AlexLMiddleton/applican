import React from "react";
import { Link } from "react-router-dom";

import "./styles.css";

const ApplicantRow = props => {
  return (
    <div key={props.id} className="container">
      <Link to={`/applicant/${props.id}`}>
        <h1>{props.full_name}</h1>
        <h3>{props.street_address}</h3>
        <h3>
          {props.city}, {props.state} {props.zip}
        </h3>
      </Link>
    </div>
  );
};

export default ApplicantRow;
