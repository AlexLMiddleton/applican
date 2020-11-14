const express = require("express");
const submitApplicationRouter = express();
const mysql = require("mysql");

const authenticateToken = require("../auth/authenticateToken");
const {
  authorizeAll,
  authorizeUser,
  authorizeTechnician,
  authorizeAdministrator
} = require("../auth/authorizeLevel");

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  dateStrings: true
});

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
