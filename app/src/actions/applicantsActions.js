import axios from "axios";

export const FETCH_APPLICANTS = "FETCH_APPLICANTS";
export const FETCH_APPLICANT = "FETCH_APPLICANT";
// export const POST_APPLICANT = "POST_APPLICANT";

export const fetchApplicants = () => async (dispatch, getState) => {
  const res = await axios.get("/api/applicants");

  dispatch({
    type: FETCH_APPLICANTS,
    payload: res.data
  });
};

export const fetchApplicant = id => async (dispatch, getState) => {
  const res = await axios.get(`/api/applicant/${id}`);

  dispatch({
    type: FETCH_APPLICANT,
    payload: res.data
  });
};

// export const postApplicant = () => async (dispatch, getState) => {
//   const res = await axios.post(``);
//   dispatch({
//     type: POST_APPLICANT,
//     payload: res.data
//   });
// };
