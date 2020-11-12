import { USER_LEVEL } from "../actions/userActions";

const initState = {
  userType: {}
};

const users = (state = initState, action) => {
  switch (action.type) {
    case USER_LEVEL:
      return { ...state, userType: action.payload };
    default:
      return state;
  }
};

export default users;
