import React, { useState } from "react";
import { Link } from "react-router-dom";

const SearchApplicantsInput = props => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <form>
        <input name="search" onChange={e => setSearchTerm(e.target.value)} />
        <Link to={`/applicant/search/${searchTerm}`}>Search</Link>
      </form>
    </div>
  );
};

export default SearchApplicantsInput;
