const express = require("express");
const applicantsRouter = express.Router();
const con = require("../connection/connection");

const authenticateToken = require("../auth/authenticateToken");
const {
  authorizeAll,
  authorizeUser,
  authorizeTechnician,
  authorizeAdministrator
} = require("../auth/authorizeLevel");

// Get all applicant profiles
applicantsRouter.get(
  "/",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    let sql = "SELECT * FROM applicant_main";
    con.query(sql, (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json(result);
      }
    });
  }
);

// Create a new applicant profile
applicantsRouter.post("/", authenticateToken, authorizeUser, (req, res) => {
  const applicant = [
    req.user.id,
    req.body.full_name,
    req.body.street_address,
    req.body.city,
    req.body.state,
    req.body.zip
  ];

  let sql = `INSERT INTO applicant_main (id, full_name, street_address, city, state, zip) VALUES (?, ?, ?, ?, ?, ?)`;
  con.query(sql, applicant, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(result);
    }
  });
});

// Add applicant's education to database
applicantsRouter.post(
  "/education",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const education = req.body;
    const educationID = education.map(ed =>
      Object.assign(ed, { applicant_id: req.user.id })
    );
    const educationArray = educationID.map(ed => Object.values(ed));
    let sql = `INSERT INTO applicant_education (university, degree, major, graduated, applicant_id) VALUES ?`;
    con.query(sql, [educationArray], (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send("Educational experience(s) added!");
      }
    });
  }
);

// Get applicant's education from database
applicantsRouter.get(
  "/education",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const userId = req.user.id;
    let sql = `SELECT * FROM applicant_education WHERE applicant_id = ?`;
    con.query(sql, userId, (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        console.log(result);
        return res.send(result);
      }
    });
  }
);

// Update an applicant's education
applicantsRouter.put(
  "/education",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const education = req.body;
    const educationArray = education.map(ed => Object.values(ed));
    let sql = `INSERT INTO applicant_education (id, applicant_id, university, degree, major, graduated) VALUES ? ON DUPLICATE KEY UPDATE id = VALUES(id), applicant_id = VALUES(applicant_id), university = VALUES(university), degree = VALUES(degree), major = VALUES(major), graduated = VALUES(graduated)`;
    con.query(sql, [educationArray], (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send("Educational experience(s) added!");
      }
    });
  }
);

// Delete an applicant's education
applicantsRouter.delete(
  "/education/:id",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const education = req.params.id;
    let sql = `DELETE FROM applicant_education WHERE id = ?`;
    con.query(sql, education, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        return res.send("Education entry deleted.");
      }
    });
  }
);

module.exports = applicantsRouter;
