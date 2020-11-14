const express = require("express");
const submitApplicationRouter = express();
const con = require("../connection/connection");

const authenticateToken = require("../auth/authenticateToken");
const {
  authorizeAll,
  authorizeUser,
  authorizeTechnician,
  authorizeAdministrator
} = require("../auth/authorizeLevel");

// Submit an application for a position
submitApplicationRouter.post(
  "/api/submit-application/:id",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const application = [req.user.id, req.params.id];
    let sql = `INSERT INTO applicant_positions (applicant_id, position_id) VALUES (?, ?)`;
    con.query(sql, application, (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send(result);
      }
    });
  }
);

module.exports = submitApplicationRouter;
