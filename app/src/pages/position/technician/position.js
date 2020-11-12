import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import Button from "@material-ui/core/Button";

import {
  fetchPosition,
  fetchPositionDescription
} from "../../../actions/positionsActions";
import axios from "axios";

const TechnicianPosition = () => {
  const position = useSelector(state => state.positions.position[0]);
  const position_desc = useSelector(state => state.positions.position_desc[0]);
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosition(id));
    dispatch(fetchPositionDescription(id));
  }, []);

  const closePosition = () => {
    axios
      .put(`/api/position/delete/${id}`)
      .then(() => history.push("/positions"));
  };

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      {position && (
        <>
          <h1>{position.title}</h1>
          <h3>Department: {position.department}</h3>
          <h3>
            Salary:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD"
            }).format(position.salary)}
          </h3>
        </>
      )}
      <hr />
      <h3>Description:</h3>
      <p style={{ textAlign: "left", marginLeft: "10%" }}>
        {position_desc &&
          position_desc.map(desc => <li key={uuidv4()}>{desc.tasks}</li>)}
      </p>
      {position && position.status === "open" ? (
        <div>
          <Button
            variant="contained"
            size="small"
            color="primary"
            style={{ width: "20%" }}
          >
            <Link to={`/position/edit/${id}`} style={{ color: "white" }}>
              Edit Position
            </Link>
          </Button>
          <hr />
          <Button
            variant="contained"
            size="small"
            color="secondary"
            style={{ width: "20%" }}
            onClick={closePosition}
          >
            Close Position
          </Button>
        </div>
      ) : (
        <div>
          <p>Position closed</p>
        </div>
      )}
    </div>
  );
};

export default TechnicianPosition;
