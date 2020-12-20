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
positionsRouter.get(`/`, (req, res) => {
  const page = parseInt(req.query.page) * 5;
  let sql =
    "SELECT * FROM positions_main WHERE status = 'open' LIMIT 5 OFFSET ?";
  con.query(sql, [page], (err, result) => {
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
      req.body[0].title,
      req.body[0].department,
      req.body[0].closing_date,
      parseInt(req.body[0].salary)
    ];

    const tasks = req.body[1].map(task => Object.values(task));

    con.beginTransaction(function(err) {
      console.log("Transaction started...");
      if (err) {
        throw err;
      }
      con.query(
        `INSERT INTO positions_main (title, department, closing_date, salary) VALUES (?)`,
        [position],
        (error, result) => {
          if (error) {
            return con.rollback(function() {
              throw error;
            });
          }
          const userID = result.insertId;
          console.log("Tasks: ", tasks);
          const descriptionInfo = tasks.map(task => [userID, task[0], task[1]]);
          console.log("Description info: ", descriptionInfo);
          con.query(
            `INSERT INTO position_description (position, tasks, task_order) VALUES ?`,
            [descriptionInfo],
            (error, result) => {
              if (error) {
                return con.rollback(function() {
                  console.log("SQL Error: ", error.sql);
                  console.log(error.sqlMessage);
                  throw error;
                });
              }
              con.commit(function(error) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Success!");
                }
              });
            }
          );
        }
      );
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
  const filters = req.query.departmentSelected;
  const values = Object.values(filters);
  const page = parseInt(req.query.page) * 5;
  let sql = `SELECT * FROM positions_main WHERE department IN (?) and status = 'open' LIMIT 5 OFFSET ?;`;
  con.query(sql, [values, page], (error, result) => {
    if (error) {
      return res.send(error);
    } else {
      return res.json(result);
    }
  });
});

module.exports = positionsRouter;
