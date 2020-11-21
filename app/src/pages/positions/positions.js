import React, { useState, useEffect } from "react";
import axios from "axios";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";

import PositionRow from "../../components/positions/positionRow";
import SearchPositionsInput from "../../components/search/searchPositionsInput";

import "./positions.css";

const Positions = () => {
  const [positionsFetched, setPositionsFetched] = useState([]);
  const [departmentsFetched, setDepartmentsFetched] = useState([]);
  const [departmentSelected, setDepartmentSelected] = useState([]);

  useEffect(() => {
    axios.get("/api/positions").then(res => setPositionsFetched(res.data));
    axios
      .get(`/api/positions/department_names`)
      .then(res => setDepartmentsFetched(res.data));
  }, []);

  const handleChange = event => {
    setDepartmentSelected([...departmentSelected, event.target.name]);
  };

  const submit = e => {
    e.preventDefault();
    axios
      .get(`/api/positions/filtered_positions`, { params: departmentSelected })
      .then(res => setPositionsFetched(res.data))
      .catch(err => console.log(err));
  };

  return (
    <div className="outermostPositionsContainer">
      <h1>Position Listing</h1>
      <SearchPositionsInput />
      <div className="outerPositionsContainer">
        <div className="positionFilterSidebar">
          <FormControl component="fieldset">
            <FormLabel component="legend">Filter by department(s):</FormLabel>
            <hr />
            <FormGroup>
              {departmentsFetched &&
                departmentsFetched.map((department, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        onChange={handleChange}
                        name={department.department}
                        color="primary"
                      />
                    }
                    label={department.department}
                  />
                ))}
            </FormGroup>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            size="large"
            color="primary"
            onClick={submit}
          >
            Search
          </Button>
        </div>
        <div className="innerPositionsContainer">
          {positionsFetched &&
            positionsFetched.map(position => (
              <PositionRow
                key={position.id}
                id={position.id}
                title={position.title}
                department={position.department}
                salary={position.salary}
                closing_date={position.closing_date.split("T")[0]}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Positions;
