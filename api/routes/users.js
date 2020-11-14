const express = require("express");
const usersRouter = express.Router();
const con = require("../connection/connection");

const authenticateToken = require("../auth/authenticateToken");
const {
  authorizeAll,
  authorizeUser,
  authorizeTechnician,
  authorizeAdministrator
} = require("../auth/authorizeLevel");

// View list of distinct user roles
usersRouter.get(
  "/roles",
  authenticateToken,
  authorizeAdministrator,
  (req, res) => {
    let sql = `SELECT DISTINCT level FROM users`;
    con.query(sql, (err, roles) => {
      if (err) {
        res.send(err);
      } else {
        res.json(roles);
      }
    });
  }
);

// View list of users
usersRouter.get("/", authenticateToken, authorizeAdministrator, (req, res) => {
  let sql = `SELECT * FROM users`;
  con.query(sql, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });
});

// Alter a user's role
usersRouter.put("/", authenticateToken, authorizeAdministrator, (req, res) => {
  let adjustment = [req.body.level, req.body.id];
  let sql = `UPDATE users SET level = ? WHERE id = ?`;
  con.query(sql, adjustment, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send("User access level updated!");
    }
  });
});

module.exports = usersRouter;
