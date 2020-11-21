require("dotenv").config();
const express = require("express");

const applicantRouter = require("./routes/applicant.js");
const applicantsRouter = require("./routes/applicants.js");
const applicantPositionsRouter = require("./routes/applicantPositions.js");
const positionsRouter = require("./routes/positions.js");
const positionRouter = require("./routes/position.js");
const positionApplicantsRouter = require("./routes/positionApplicants.js");
const submitApplicationRouter = require("./routes/submitApplication.js");
const searchRouter = require("./routes/search.js");
const userRouter = require("./routes/user.js");
const usersRouter = require("./routes/users.js");

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/applicants", applicantsRouter);
app.use("/api/applicant-positions", applicantPositionsRouter);
app.use("/api/applicant", applicantRouter);
app.use("/api/positions", positionsRouter);
app.use("/api/position", positionRouter);
app.use("/api/position-applicants", positionApplicantsRouter);
app.use("/api/search", searchRouter);
app.use("/api/submit-application", submitApplicationRouter);
app.use("/api/user", userRouter);
app.use("/api/users", usersRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
