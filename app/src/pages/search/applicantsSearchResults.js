import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import "./searchResults.css";

const SearchApplicants = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const { searchTerm } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/search/applicants?search=${searchTerm}`)
      .then(res => setResults(...results, res.data))
      .then(setLoading(false));
  }, []);

  console.log(results);

  return (
    <div>
      {results &&
        results.map(result => (
          <Link to={`/applicant/${result.id}`}>
            <div key={result.id}>
              <h1>{result.full_name}</h1>
              <h3>{result.street_address}</h3>
              <h3>
                {result.city}, {result.state} {result.zip}
              </h3>
              <hr />
            </div>
          </Link>
        ))}
    </div>
  );
};

export default SearchApplicants;
