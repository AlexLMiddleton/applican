const express = require("express");
const positionsRouter = express();
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

// List all positions
positionsRouter.get("/", (req, res) => {
  let sql = "SELECT * FROM positions_main WHERE status = 'open'";
  con.query(sql, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
});

// Get closed, but unfilled positions
positionsRouter.get(
  "/unfilled",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    let sql = `SELECT * FROM positions_main WHERE status = 'closed' AND filled = 0`;
    con.query(sql, (err, positions) => {
      if (err) {
        res.send(err);
      } else {
        res.send(positions);
      }
    });
  }
);

// Get closed, filled positions
positionsRouter.get(
  "/filled",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    let sql = `SELECT * FROM positions_main WHERE status = 'closed' AND filled = 1`;
    con.query(sql, (err, positions) => {
      if (err) {
        res.send(err);
      } else {
        res.send(positions);
      }
    });
  }
);

// Create new position
positionsRouter.post(
  "/",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    const position = [
      req.body.title,
      req.body.department,
      req.body.closing_date,
      parseInt(req.body.salary)
    ];
    console.log(position);
    let sql =
      "INSERT INTO positions_main (title, department, closing_date, salary) VALUES (?, ?, ?, ?)";
    con.query(sql, position, (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send("New position added!");
      }
    });
  }
);

module.exports = positionsRouter;
