const express = require("express");
const searchRouter = express.Router();
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

// Search for positions containing a term
searchRouter.get("/positions", (req, res) => {
  let sql = `SELECT * FROM positions_main WHERE title LIKE ?`;
  con.query(sql, ["%" + req.query.search + "%"], (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
});

// Search for applicants containing a term
searchRouter.get("/applicants", authenticateToken, (req, res) => {
  let sql = `SELECT * FROM applicant_main WHERE full_name LIKE ?`;
  con.query(sql, ["%" + req.query.search + "%"], (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
});

module.exports = searchRouter;
