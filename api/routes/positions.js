const express = require("express");
const positionsRouter = express();
const con = require("../connection/connection");

const authenticateToken = require("../auth/authenticateToken");
const {
  authorizeAll,
  authorizeUser,
  authorizeTechnician,
  authorizeAdministrator
} = require("../auth/authorizeLevel");

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

// Get department names with open positions
positionsRouter.get("/department_names", (req, res) => {
  let sql = `SELECT DISTINCT department FROM positions_main WHERE status='open' ORDER BY department`;
  con.query(sql, (error, result) => {
    if (error) {
      return res.send(error);
    } else {
      return res.json(result);
    }
  });
});

// Get jobs in user-specified departments
positionsRouter.get("/filtered_positions", (req, res) => {
  const filters = req.query;
  const values = Object.values(filters);
  let sql = `SELECT * FROM positions_main WHERE department IN (?) and status = 'open';`;
  con.query(sql, [values], (error, result) => {
    if (error) {
      return res.send(error);
    } else {
      return res.json(result);
    }
  });
});

module.exports = positionsRouter;
