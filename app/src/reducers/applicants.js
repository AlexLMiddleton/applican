import {
  FETCH_APPLICANTS,
  FETCH_APPLICANT
} from "../actions/applicantsActions";

const initState = {
  applicants: [],
  applicant: {}
};

const applicants = (state = initState, action) => {
  switch (action.type) {
    case FETCH_APPLICANTS:
      return { ...state, applicants: [...state.applicants, action.payload] };
    case FETCH_APPLICANT:
      return { ...state, applicant: action.payload };
    default:
      return state;
  }
};

export default applicants;
