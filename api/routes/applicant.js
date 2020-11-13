const express = require("express");
const applicantRouter = express.Router();
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

// Get a specific applicant by their ID
applicantRouter.get("/:id", authenticateToken, authorizeAll, (req, res) => {
  let applicant = req.params.id;
  let sql = `SELECT * FROM users LEFT JOIN applicant_education ON applicant_education.applicant_id = users.id LEFT JOIN applicant_main ON users.id = applicant_main.id WHERE users.id=?`;
  con.query(sql, applicant, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
});

// Update an applicant
applicantRouter.put("/:id", authenticateToken, authorizeUser, (req, res) => {
  const applicant = [
    req.body.full_name,
    req.body.street_address,
    req.body.city,
    req.body.state,
    req.body.zip,
    req.user.id
  ];
  let sql = `UPDATE applicant_main SET full_name = ?, street_address = ?, city = ?, state = ?, zip = ? WHERE id = ?`;
  con.query(sql, applicant, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(result);
    }
  });
});

// Delete an applicant
applicantRouter.delete("/:id", authenticateToken, authorizeUser, (req, res) => {
  const applicant = [req.params.id];
  let sql = `DELETE FROM applicant_main WHERE id = ?`;
  con.query(sql, applicant, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send("Applicant deleted!");
    }
  });
});

module.exports = applicantRouter;
