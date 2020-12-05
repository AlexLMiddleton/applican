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
  let sql =
    "SELECT * FROM position_description WHERE position=? ORDER BY task_order";
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
    position = parseInt(req.params.id);
    const tasks = req.body;
    tasks.filter(task => task.tasks && task.task_order);
    const tasksArray = tasks.map(task => [
      position,
      task.tasks,
      task.task_order
    ]);
    let sql = `INSERT IGNORE INTO position_description (position, tasks, task_order) VALUES ? ON DUPLICATE KEY UPDATE position = VALUES(position), tasks = VALUES(tasks), task_order = VALUES(task_order)`;
    con.query(sql, [tasksArray], (err, result) => {
      if (err) {
        console.log(err.sql);
        return res.send(err);
      } else {
        return res.json(result);
      }
    });
  }
);

positionRouter.delete("/description/:position_id/:task_id", (req, res) => {
  const position = [
    parseInt(req.params.position_id),
    parseInt(req.params.task_id)
  ];
  let sql =
    "DELETE FROM position_description WHERE position = ? AND task_order = ?";
  con.query(sql, position, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
});

module.exports = positionRouter;
