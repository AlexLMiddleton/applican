import React, { useState, useEffect } from "react";
import { fetchApplicants } from "../../actions/applicantsActions";
import { useSelector, useDispatch } from "react-redux";
import SearchApplicantsInput from "../../components/search/searchApplicantsInput";
import ApplicantRow from "../../components/applicants/applicantRow";

import "./applicants.css";

const Applicants = () => {
  const [applicantsFetched, setApplicantsFetched] = useState(false);
  const applicants = useSelector(state => state.applicants.applicants[0]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchApplicants());
  }, []);

  return (
    <div className="container">
      <h1>Applicant Listing</h1>
      <SearchApplicantsInput />
      {applicants &&
        applicants.map(applicant => (
          <ApplicantRow
            key={applicant.id}
            id={applicant.id}
            full_name={applicant.full_name}
            street_address={applicant.street_address}
            city={applicant.city}
            state={applicant.state}
            zip={applicant.zip}
          />
        ))}
    </div>
  );
};

export default Applicants;
