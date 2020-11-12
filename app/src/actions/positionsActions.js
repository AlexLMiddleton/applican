import axios from "axios";

export const FETCH_POSITIONS = "FETCH_POSITIONS";
export const FETCH_POSITION = "FETCH_POSITION";
export const FETCH_POSITION_DESCRIPTION = "FETCH_POSITION_DESCRIPTION";

export const fetchPositions = () => async (dispatch, getState) => {
  const res = await axios.get("/api/positions");

  dispatch({
    type: FETCH_POSITIONS,
    payload: res.data
  });
};

export const fetchPosition = id => async (dispatch, getState) => {
  const res = await axios.get(`/api/position/${id}`);

  dispatch({
    type: FETCH_POSITION,
    payload: res.data
  });
};

export const fetchPositionDescription = id => async (dispatch, getState) => {
  const res = await axios.get(`/api/position_desc/${id}`);

  dispatch({
    type: FETCH_POSITION_DESCRIPTION,
    payload: res.data
  });
};
