import { combineReducers } from "redux";

import applicants from "./applicants";
import positions from "./positions";
import users from "./users";

const rootReducer = combineReducers({
  applicants,
  positions,
  users
});

export default rootReducer;
