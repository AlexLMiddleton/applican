require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authenticateToken = require("./auth/authenticateToken");
const {
  authorizeAll,
  authorizeUser,
  authorizeTechnician,
  authorizeAdministrator
} = require("./auth/authorizeLevel");

const app = express();
const port = 3000;

app.use(express.json());

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  dateStrings: true
});

// Sign up as a new user
app.post("/api/signup", async (req, res) => {
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

// View list of users
app.get("/api/users", authenticateToken, authorizeAdministrator, (req, res) => {
  let sql = `SELECT * FROM users`;
  con.query(sql, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });
});

// View list of distinct user roles
app.get(
  "/api/user-roles",
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

// Alter a user's role
app.put("/api/users", authenticateToken, authorizeAdministrator, (req, res) => {
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

// Log in
app.post("/api/login", (req, res) => {
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

// Create a new applicant profile
app.post("/api/applicants", authenticateToken, authorizeUser, (req, res) => {
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

// Submit an application for a position
app.post(
  "/api/submit-application/:id",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const application = [req.user.id, req.params.id];
    let sql = `INSERT INTO applicant_positions (applicant_id, position_id) VALUES (?, ?)`;
    con.query(sql, application, (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send(result);
      }
    });
  }
);

// Get positions an applicant has applied for
app.get(
  "/api/applicant-positions/:id",
  authenticateToken,
  authorizeAll,
  (req, res) => {
    let applicant = req.user.id;
    let sql = `SELECT * FROM applicant_main 
    INNER JOIN applicant_positions ON applicant_main.id = applicant_positions.applicant_id 
    INNER JOIN positions_main ON applicant_positions.position_id = positions_main.id 
    LEFT JOIN interviews ON applicant_positions.applicant_id = interviews.applicant_id 
    AND applicant_positions.position_id = interviews.position_id 
    WHERE applicant_main.id = ?`;
    con.query(sql, applicant, (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json(result);
      }
    });
  }
);

// Get applicants who have been cleared for interview for a position
app.get(
  "/api/applicant-positions/cleared-for-interview/:id",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    const position = [req.params.id];
    let sql = `SELECT * FROM applicant_positions INNER JOIN applicant_main on applicant_main.id = applicant_positions.applicant_id INNER JOIN positions_main ON positions_main.id = applicant_positions.position_id WHERE position_id = ? AND applicant_positions.cleared_for_interview = 1`;
    con.query(sql, position, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  }
);

// Toggle applicant's cleared for interview status
app.put(
  "/api/applicant-positions/cleared-for-interview/:id",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    const clear = [req.body.applicant_id, req.params.id];
    console.log(clear);
    let sql = `UPDATE applicant_positions SET cleared_for_interview = !cleared_for_interview WHERE applicant_id = ? AND position_id = ?`;
    con.query(sql, clear, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send("User now cleared for interview.");
      }
    });
  }
);

// Toggle applicant's cleared for hire status
app.put(
  "/api/applicant-positions/cleared-for-hire/:id",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    const clear = [req.body.applicant_id, req.params.id];
    console.log(clear);
    let sql = `UPDATE applicant_positions SET cleared_for_hire = !cleared_for_hire WHERE applicant_id = ? AND position_id = ?`;
    con.query(sql, clear, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send("User now cleared for hire.");
      }
    });
  }
);

// Request interview date and time
app.post(
  "/api/applicant-positions/interview-request",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    const interview = [
      req.body.applicant_id,
      req.body.position_id,
      req.body.interview_time
    ];
    console.log(interview);
    let sql = `INSERT INTO interviews (applicant_id, position_id, interview_date) VALUES (?, ?, ?)`;
    con.query(sql, interview, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Interview requested with applicant.");
      }
    });
  }
);

// Accept interview request
app.put(
  "/api/applicant-positions/accept",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const interview = [
      req.body.accepted_id,
      req.body.applicant_id,
      req.body.position_id,
      req.body.interview_time
    ];
    console.log(interview);
    let sql = `UPDATE interviews SET accepted = (?) WHERE applicant_id = ? AND position_id = ? AND interview_date = ?`;
    con.query(sql, interview, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Interview accepted.");
      }
    });
  }
);

// Reject interview request
app.put(
  "/api/applicant-positions/reject",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const interview = [
      req.body.accepted_id,
      req.body.applicant_id,
      req.body.position_id,
      req.body.interview_time
    ];
    let sql = `UPDATE interviews SET accepted = (?) WHERE applicant_id = ? AND position_id = ? AND interview_date = ?`;
    con.query(sql, interview, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Interview rejected.");
      }
    });
  }
);

// Search for applicants containing a term
app.get("/api/yyz", authenticateToken, (req, res) => {
  let sql = `SELECT * FROM applicant_main WHERE full_name LIKE ?`;
  con.query(sql, ["%" + req.query.search + "%"], (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
});

// Get a specific applicant by their ID
app.get("/api/applicant/:id", authenticateToken, authorizeAll, (req, res) => {
  let applicant = req.params.id;
  let sql = `SELECT * FROM users LEFT JOIN applicant_education ON applicant_education.applicant_id = users.id LEFT JOIN applicant_main ON users.id = applicant_main.id WHERE users.id=?`;
  con.query(sql, applicant, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
});

// Update an applicant
app.put("/api/applicant/:id", authenticateToken, authorizeUser, (req, res) => {
  const applicant = [
    req.body.full_name,
    req.body.street_address,
    req.body.city,
    req.body.state,
    req.body.zip,
    req.user.id
  ];
  let sql = `UPDATE applicant_main SET full_name = ?, street_address = ?, city = ?, state = ?, zip = ? WHERE id = ?`;
  con.query(sql, applicant, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(result);
    }
  });
});

// Add applicant's education to database
app.post(
  "/api/applicants/education",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const education = req.body;
    const educationID = education.map(ed =>
      Object.assign(ed, { applicant_id: req.user.id })
    );
    const educationArray = educationID.map(ed => Object.values(ed));
    console.log(educationArray);
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
app.get(
  "/api/applicants/education",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const userId = req.user.id;
    console.log(userId);
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
app.put(
  "/api/applicants/education",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const education = req.body;
    // const educationMap = education.map(ed => ({
    //   applicant_id: ed.applicant_id,
    //   university: ed.university,
    //   degree: ed.degree,
    //   major: ed.major,
    //   graduated: ed.graduated,
    //   id: ed.id
    // }));

    const educationArray = education.map(ed => Object.values(ed));
    // let sql = `UPDATE applicant_education SET applicant_id = ?, university = ?, degree = ?, major = ?, graduated = ? WHERE id = ?`;
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
app.delete(
  "/api/applicants/education/:id",
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

// Delete an applicant
app.delete(
  "/api/applicant/:id",
  authenticateToken,
  authorizeUser,
  (req, res) => {
    const applicant = [req.params.id];
    let sql = `DELETE FROM applicant_main WHERE id = ?`;
    con.query(sql, applicant, (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send("Applicant deleted!");
      }
    });
  }
);

// List all applicants
app.get(
  "/api/applicants",
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

// Create new position
app.post(
  "/api/positions",
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

// Get all applicants for a position
app.get(
  "/api/position-applicants/:id",
  authenticateToken,
  authorizeTechnician,
  (req, res) => {
    const position = [req.params.id];
    let sql = `SELECT applicant_positions.applicant_id, applicant_positions.position_id, applicant_main.street_address, applicant_main.city, applicant_main.full_name, applicant_main.state, applicant_main.zip, applicant_positions.cleared_for_interview FROM applicant_positions INNER JOIN positions_main ON positions_main.id = applicant_positions.position_id INNER JOIN applicant_main ON applicant_positions.applicant_id = applicant_main.id WHERE applicant_positions.position_id = ? AND positions_main.id = ? ORDER BY applicant_id`;
    con.query(sql, [position, position], (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json(result);
      }
    });
  }
);

// Get a specific position by its ID
app.get("/api/position/:id", (req, res) => {
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

// Search for positions containing a term
app.get("/api/xyz", (req, res) => {
  let sql = `SELECT * FROM positions_main WHERE title LIKE ?`;
  con.query(sql, ["%" + req.query.search + "%"], (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
});

// Update a position
app.put("/api/position/:id", (req, res) => {
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
app.put(
  "/api/position/delete/:id",
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
app.delete("/api/position/:id", (req, res) => {
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

// List all positions
app.get("/api/positions", (req, res) => {
  let sql = "SELECT * FROM positions_main WHERE status = 'open'";
  con.query(sql, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
});

// Get a position description for a given position
app.get("/api/position_desc/:id", (req, res) => {
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

// Get closed, but unfilled positions
app.get(
  "/api/positions/unfilled",
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
app.get(
  "/api/positions/filled",
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
