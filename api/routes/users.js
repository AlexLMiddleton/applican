const express = require("express");
const usersRouter = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
