import {
  FETCH_POSITIONS,
  FETCH_POSITION,
  FETCH_POSITION_DESCRIPTION
} from "../actions/positionsActions";

const initState = {
  positions: [],
  position: {},
  position_desc: []
};

const positions = (state = initState, action) => {
  switch (action.type) {
    case FETCH_POSITIONS:
      return { ...state, positions: [...state.positions, action.payload] };
    case FETCH_POSITION:
      return { ...state, position: action.payload };
    case FETCH_POSITION_DESCRIPTION:
      return { ...state, position_desc: [action.payload] };
    default:
      return state;
  }
};

export default positions;
