const express = require("express");
const applicantPositionsRouter = express();
const con = require("../connection/connection");

const authenticateToken = require("../auth/authenticateToken");
const {
  authorizeAll,
  authorizeUser,
  authorizeTechnician,
  authorizeAdministrator
} = require("../auth/authorizeLevel");

// Get positions an applicant has applied for
applicantPositionsRouter.get(
  "/:id",
  authenticateToken,
  authorizeAll,
  (req, res) => {
    let applicant = req.user.id;
    let sql = `SELECT * FROM applicant_main 
      INNER JOIN applicant_positions ON applicant_main.id = applicant_positions.applicant_id 
      INNER JOIN positions_main ON applicant_positions.position_id = positions_main.id 
      LEFT JOIN interviews ON applicant_positions.applicant_id = interviews.applicant_id 
      AND applicant_positions.position_id = interviews.position_id 
      WHERE applicant_main.id = ?`;
    con.query(sql, applicant, (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json(result);
      }
    });
  }
);

// Get applicants who have been cleared for interview for a position
applicantPositionsRouter.get(
  "/cleared-for-interview/:id",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    const position = [req.params.id];
    let sql = `SELECT * FROM applicant_positions INNER JOIN applicant_main on applicant_main.id = applicant_positions.applicant_id INNER JOIN positions_main ON positions_main.id = applicant_positions.position_id WHERE position_id = ? AND applicant_positions.cleared_for_interview = 1`;
    con.query(sql, position, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  }
);

// Toggle applicant's cleared for interview status
applicantPositionsRouter.put(
  "/cleared-for-interview/:id",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    const clear = [req.body.applicant_id, req.params.id];
    console.log(clear);
    let sql = `UPDATE applicant_positions SET cleared_for_interview = !cleared_for_interview WHERE applicant_id = ? AND position_id = ?`;
    con.query(sql, clear, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send("User now cleared for interview.");
      }
    });
  }
);

// Toggle applicant's cleared for hire status
applicantPositionsRouter.put(
  "/cleared-for-hire/:id",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    const clear = [req.body.applicant_id, req.params.id];
    console.log(clear);
    let sql = `UPDATE applicant_positions SET cleared_for_hire = !cleared_for_hire WHERE applicant_id = ? AND position_id = ?`;
    con.query(sql, clear, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send("User now cleared for hire.");
      }
    });
  }
);

// Request interview date and time
applicantPositionsRouter.post(
  "/interview-request",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    const interview = [
      req.body.applicant_id,
      req.body.position_id,
      req.body.interview_time
    ];
    console.log(interview);
    let sql = `INSERT INTO interviews (applicant_id, position_id, interview_date) VALUES (?, ?, ?)`;
    con.query(sql, interview, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Interview requested with applicant.");
      }
    });
  }
);

// Accept interview request
applicantPositionsRouter.put(
  "/accept",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const interview = [
      req.body.accepted_id,
      req.body.applicant_id,
      req.body.position_id,
      req.body.interview_time
    ];
    console.log(interview);
    let sql = `UPDATE interviews SET accepted = (?) WHERE applicant_id = ? AND position_id = ? AND interview_date = ?`;
    con.query(sql, interview, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Interview accepted.");
      }
    });
  }
);

// Reject interview request
applicantPositionsRouter.put(
  "/reject",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const interview = [
      req.body.accepted_id,
      req.body.applicant_id,
      req.body.position_id,
      req.body.interview_time
    ];
    let sql = `UPDATE interviews SET accepted = (?) WHERE applicant_id = ? AND position_id = ? AND interview_date = ?`;
    con.query(sql, interview, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Interview rejected.");
      }
    });
  }
);

module.exports = applicantPositionsRouter;
