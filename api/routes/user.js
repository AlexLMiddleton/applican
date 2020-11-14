const express = require("express");
const userRouter = express.Router();
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

// Sign up as a new user
userRouter.post("/signup", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    let sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    con.query(sql, [req.body.username, hashed], (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        res.send("User created");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// Log in
userRouter.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let sql = `SELECT * FROM users WHERE username = ?`;
  con.query(sql, username, async (req, result) => {
    const match = await bcrypt.compare(password, result[0].password);
    if (match) {
      const user = { id: result[0].id, username, level: result[0].level };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.cookie("accessToken", accessToken, {
        maxAge: 3600000,
        httpOnly: true
      });
      res.cookie(
        "SPAToken",
        { id: result[0].id, level: result[0].level },
        { maxAge: 3600000 }
      );
      res.send(accessToken);
    } else {
      res.status(404).send("The username or password you entered is invalid");
    }
  });
});

module.exports = userRouter;
