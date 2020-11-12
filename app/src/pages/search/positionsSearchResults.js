import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import "./searchResults.css";

const SearchPositions = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const { searchTerm } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/xyz?search=${searchTerm}`)
      .then(res => setResults(...results, res.data))
      .then(setLoading(false));
  }, []);

  return (
    <div>
      {results &&
        results.map(result => (
          <Link to={`/position/${result.id}`}>
            <div key={result.id}>
              <h1>{result.title}</h1>
              <h3>{result.department}</h3>
              <h3>{result.salary}</h3>
              <hr />
            </div>
          </Link>
        ))}
    </div>
  );
};

export default SearchPositions;
