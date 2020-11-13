const express = require("express");
const positionRouter = express();
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

// Get a specific position by its ID
positionRouter.get("/:id", (req, res) => {
  const position = [req.params.id];
  let sql = `SELECT * FROM positions_main WHERE id=?`;
  con.query(sql, position, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
});

// Update a position
positionRouter.put("/:id", (req, res) => {
  const position = [
    req.body.title,
    req.body.department,
    req.body.salary,
    req.body.closing_date,
    req.params.id
  ];
  let sql = `UPDATE positions_main SET title = ?, department = ?, salary = ?, closing_date = ? WHERE id = ?`;
  con.query(sql, position, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send("Position updated.");
    }
  });
});

// Close a position
positionRouter.put(
  "/delete/:id",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    const position = [req.params.id];
    let sql = `UPDATE positions_main SET status = 'closed' WHERE id = ?`;
    con.query(sql, position, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Position closed.");
      }
    });
  }
);

// Delete a position
positionRouter.delete("/:id", (req, res) => {
  let position = req.params.id;
  let sql = "DELETE FROM positions_main WHERE id = ?";
  con.query(sql, position, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send("Position deleted!");
    }
  });
});

module.exports = positionRouter;
