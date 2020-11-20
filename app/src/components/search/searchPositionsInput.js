import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const SearchPositionsInput = props => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <form>
        <TextField
          id="outlined-basic"
          label="Search position titles"
          variant="outlined"
          name="search"
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: "25%" }}
        />
        <Link to={`/position/search/${searchTerm}`}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            color="primary"
            style={{ marginTop: ".5%", marginLeft: ".5%" }}
          >
            Submit
          </Button>
        </Link>
      </form>
    </div>
  );
};

export default SearchPositionsInput;
