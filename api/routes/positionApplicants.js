const express = require("express");
const positionApplicantsRouter = express();
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

// Get all applicants for a position
positionApplicantsRouter.get(
  "/:id",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    const position = [req.params.id];
    let sql = `SELECT applicant_positions.applicant_id, applicant_positions.position_id, applicant_main.street_address, applicant_main.city, applicant_main.full_name, applicant_main.state, applicant_main.zip, applicant_positions.cleared_for_interview FROM applicant_positions INNER JOIN positions_main ON positions_main.id = applicant_positions.position_id INNER JOIN applicant_main ON applicant_positions.applicant_id = applicant_main.id WHERE applicant_positions.position_id = ? AND positions_main.id = ? ORDER BY applicant_id`;
    con.query(sql, [position, position], (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json(result);
      }
    });
  }
);

module.exports = positionApplicantsRouter;
