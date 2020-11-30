const express = require("express");
const positionRouter = express();
const con = require("../connection/connection");

const authenticateToken = require("../auth/authenticateToken");
const {
  authorizeAll,
  authorizeUser,
  authorizeTechnician,
  authorizeAdministrator
} = require("../auth/authorizeLevel");

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

// Get a position description for a given position
positionRouter.get("/description/:id", (req, res) => {
  position = [req.params.id];
  let sql = "SELECT * FROM position_description WHERE position=?";
  con.query(sql, position, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
});

// Insert or Update a position description for a given position
positionRouter.put(
  "/description/:id",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    position = [req.params.id];
    const tasks = req.body;
    const tasksArray = tasks.map(task => [position, Object.values(task)]);
    console.log(tasksArray);
    let sql = `INSERT INTO position_description (position, tasks) VALUES ? ON DUPLICATE KEY UPDATE position = VALUES(position), tasks = VALUES(tasks)`;
    con.query(sql, [tasksArray], (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json(result);
      }
    });
  }
);

// Update an applicant's education
// applicantsRouter.put(
//   "/education",
//   authenticateToken,
//   authorizeUser,
//   (req, res) => {
//     const education = req.body;
//     const educationArray = education.map(ed => Object.values(ed));
//     let sql = `INSERT INTO applicant_education (id, applicant_id, university, degree, major, graduated) VALUES ? ON DUPLICATE KEY UPDATE id = VALUES(id), applicant_id = VALUES(applicant_id), university = VALUES(university), degree = VALUES(degree), major = VALUES(major), graduated = VALUES(graduated)`;
//     con.query(sql, [educationArray], (err, result) => {
//       if (err) {
//         return res.send(err);
//       } else {
//         return res.send("Educational experience(s) added!");
//       }
//     });
//   }
// );

module.exports = positionRouter;
