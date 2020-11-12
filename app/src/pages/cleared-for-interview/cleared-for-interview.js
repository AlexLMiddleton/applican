import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ClearedForInteriew = () => {
  const [applicants, setApplicants] = useState([]);
  const [interview, setInterview] = useState({
    applicant_id: "",
    position_id: "",
    interview_time: ""
  });

  console.log(interview);

  const [removal, setRemoval] = useState({
    applicant_id: ""
  });

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/api/applicant-positions/cleared-for-interview/${id}`)
      .then(res => setApplicants(res.data));
  }, []);

  const submitRequest = () => {
    axios.post(`/api/applicant-positions/interview-request`, interview);
  };

  const removeClearance = () => {
    axios.put(`/api/applicant-positions/cleared-for-interview/${id}`, removal);
  };

  const clearForHire = applicantID => {
    axios.put(`/api/applicant-positions/cleared-for-hire/${id}`, {
      applicant_id: applicantID
    });
  };
  console.log(applicants);

  return (
    <div>
      <h1>Applicants Cleared for Interview</h1>
      {applicants &&
        applicants.map(applicant => (
          <div key={applicant.applicant_id}>
            <h2>{applicant.full_name}</h2>
            <p>
              {applicant.street_address}
              <br />
              {applicant.city}, {applicant.state} {applicant.zip}
            </p>
            <button
              onClick={() => {
                setRemoval({ applicant_id: applicant.applicant_id });
                removeClearance();
              }}
            >
              Remove Applicant from Cleared for Interview
            </button>
            <br />
            <label htmlFor="request">Request interview:</label>
            <br />
            <input
              id="request"
              name="request"
              type="datetime-local"
              onChange={e =>
                setInterview({
                  ...interview,
                  applicant_id: applicant.applicant_id,
                  position_id: applicant.position_id,
                  interview_time: e.target.value
                })
              }
            />
            <button onClick={submitRequest}>Send Request</button>
            <br />
            <button onClick={() => clearForHire(applicant.applicant_id)}>
              Clear for Hire
            </button>
            <hr />
          </div>
        ))}
    </div>
  );
};

export default ClearedForInteriew;
