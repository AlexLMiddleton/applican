import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Homepage from "./pages/homepage/homepage";
import Header from "./components/header/header";
import Applicants from "./pages/applicants/applicants";
import Applicant from "./pages/applicant/applicant";
import Positions from "./pages/positions/positions";
import Position from "./pages/position/position";
import CreateApplicant from "./pages/applicant/createApplicant";
import CreatePosition from "./pages/position/createPosition";
import EditApplicant from "./pages/applicant/editApplicant";
import EditPosition from "./pages/position/editPosition";
import SearchPositions from "./pages/search/positionsSearchResults";
import SearchApplicants from "./pages/search/applicantsSearchResults";
import PositionApplicants from "./pages/position-applicants/position-applicants";
import ApplicantPositions from "./pages/applicant-positions/applicant-positions";
import Signup from "./pages/signup/signup";
import Login from "./pages/login/login";
import Users from "./pages/users/users";
import ClosedUnfilledPositions from "./pages/positions/closed-unfilled-positions";
import ClosedFilledPositions from "./pages/positions/closed-filled-positions";
import ClearedForInterview from "./pages/cleared-for-interview/cleared-for-interview";

import {
  UserRoute,
  TechnicianRoute,
  AdminRoute
} from "./components/routing/routing";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />

        {/* All visitors */}
        <Route exact path="/" component={Homepage} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route exact path="/positions" component={Positions} />
        <Route exact path="/position/:id" component={Position} />
        <Route
          path="/applicant/search/:searchTerm"
          component={SearchApplicants}
        />
        <Route
          path="/position/search/:searchTerm"
          component={SearchPositions}
        />

        {/* User routes */}
        <UserRoute exact path="/new-application" component={CreateApplicant} />
        <UserRoute path="/applicant/edit/:id" component={EditApplicant} />
        <UserRoute
          path="/applicant/positions/:id"
          component={ApplicantPositions}
        />

        {/* Technician Routes */}
        <TechnicianRoute path="/applicants" component={Applicants} />
        <TechnicianRoute exact path="/applicant/:id" component={Applicant} />
        <TechnicianRoute
          exact
          path="/new-position"
          component={CreatePosition}
        />
        <TechnicianRoute path="/position/edit/:id" component={EditPosition} />
        <TechnicianRoute
          path="/positions/unfilled"
          component={ClosedUnfilledPositions}
        />
        <TechnicianRoute
          path="/positions/filled"
          component={ClosedFilledPositions}
        />
        <TechnicianRoute
          path="/position/cleared-for-interview/:id"
          component={ClearedForInterview}
        />
        <TechnicianRoute
          path="/position/applicants/:id"
          component={PositionApplicants}
        />

        {/* Administrator Routes */}
        <AdminRoute path="/admin/users" component={Users} />
      </Router>
    </div>
  );
}

export default App;
