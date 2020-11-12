import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PositionRow from "../../components/positions/positionRow";
import { fetchPositions } from "../../actions/positionsActions";
import SearchPositionsInput from "../../components/search/searchPositionsInput";

import "./positions.css";

const Positions = () => {
  const [positionsFetched, setPositionsFetched] = useState(false);
  const positions = useSelector(state => state.positions.positions[0]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPositions());
  }, []);

  return (
    <div className="positionsContainer">
      <h1>Position Listing</h1>
      <SearchPositionsInput />
      {positions &&
        positions.map(position => (
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
  );
};

export default Positions;
