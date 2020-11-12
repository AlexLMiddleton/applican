import React, { useState, useEffect } from "react";
import { fetchApplicant } from "../../actions/applicantsActions";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./applicant.css";
import axios from "axios";

const Applicant = props => {
  const [applicantFetched, setApplicantFetched] = useState(false);
  const applicant = useSelector(state => state.applicants.applicant[0]);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchApplicant(id));
  }, []);

  const history = useHistory();

  const deleteApplicant = () => {
    try {
      axios.delete(`/api/applicant/${id}`).then(history.push("/applicants"));
    } catch {
      console.write("Delete failed!");
    }
  };

  return (
    <div className="container">
      {applicant && (
        <div key={applicant.id} className="applicant-container">
          <h1>{applicant.full_name}</h1>
          <h3>{applicant.street_address}</h3>
          <h3>
            {applicant.city}, {applicant.state} {applicant.zip}
          </h3>
          <button onClick={deleteApplicant}>Delete Applicant</button>
        </div>
      )}
    </div>
  );
};

export default Applicant;
