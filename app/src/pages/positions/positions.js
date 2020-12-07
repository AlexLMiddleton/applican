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
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (departmentSelected.length === 0) {
      axios
        .get(`/api/positions?page=${page}`)
        .then(res => setPositionsFetched(res.data));
      axios
        .get(`/api/positions/department_names`)
        .then(res => setDepartmentsFetched(res.data));
    } else {
      axios
        .get(`/api/positions/filtered_positions`, {
          params: { departmentSelected, page }
        })
        .then(res => setPositionsFetched(res.data))
        .catch(err => console.log(err));
      axios
        .get(`/api/positions/department_names`)
        .then(res => setDepartmentsFetched(res.data));
    }
  }, [page]);

  const handleChange = event => {
    if (departmentSelected.indexOf(event.target.name) >= 0) {
      const department = departmentSelected.filter(
        dep => dep !== event.target.name
      );
      setDepartmentSelected(department);
    } else {
      setDepartmentSelected([...departmentSelected, event.target.name]);
    }
  };

  const changeDateFormat = closingDate => {
    const [yyyy, mm, dd] = closingDate.split(/-/g);
    return `${mm}/${dd}/${yyyy}`;
  };

  const submit = e => {
    e.preventDefault();
    if (departmentSelected.length === 0) {
      const departments = departmentsFetched.map(dept => dept.department);
      axios
        .get(`/api/positions/filtered_positions`, {
          params: departments
        })
        .then(res => setPositionsFetched(res.data))
        .catch(err => console.log(err));
    } else {
      axios
        .get(`/api/positions/filtered_positions`, {
          params: { departmentSelected, page }
        })
        .then(res => setPositionsFetched(res.data))
        .catch(err => console.log(err));
    }
  };

  const handleSearchInput = e => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (departmentSelected.length > 0 && !searchTerm) {
      axios
        .get(`/api/positions/filtered_positions`, {
          params: departmentSelected
        })
        .then(res => setPositionsFetched(res.data))
        .catch(err => console.log(err));
    } else {
      axios
        .get(`/api/search/positions?search=${searchTerm}`)
        .then(res => setPositionsFetched(res.data))
        .catch(err => console.log(err));
    }
  };

  console.log("Page number: ", page);

  return (
    <div className="outermostPositionsContainer">
      <h1>Position Listing</h1>
      <SearchPositionsInput
        onChange={handleSearchInput}
        onClick={handleSearchSubmit}
      />
      <div className="outerPositionsContainer">
        <div className="positionFilterSidebar">
          <FormControl component="fieldset">
            <FormLabel component="legend">Filter by department(s):</FormLabel>
            <hr />
            <FormGroup>
              {departmentsFetched.length > 0 ? (
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
                ))
              ) : (
                <h1>No departments fetched.</h1>
              )}
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
          {positionsFetched.length > 0 ? (
            positionsFetched.map(position => (
              <PositionRow
                key={position.id}
                id={position.id}
                title={position.title}
                department={position.department}
                salary={position.salary}
                closing_date={changeDateFormat(
                  position.closing_date.split("T")[0]
                )}
              />
            ))
          ) : (
            <>
              <h1>No results found.</h1>
            </>
          )}
          <br />
          {page > 0 ? (
            <>
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={() => setPage(page - 1)}
              >
                Previous Page
              </Button>
              <span> | </span>{" "}
            </>
          ) : (
            ""
          )}
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => setPage(page + 1)}
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Positions;
