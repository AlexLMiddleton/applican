const authorizeAll = (req, res, next) => {
  console.log("req.params.id ", req.params.id);
  console.log("req.user.level ", req.user.level);
  if (
    (req.user.id == req.params.id && req.user.level === "user") ||
    req.user.level === "technician" ||
    req.user.level === "administrator"
  ) {
    next();
  } else {
    console.log("User has wrong access level");
  }
};

const authorizeUser = (req, res, next) => {
  if (req.user.id && req.user.level === "user") {
    next();
  } else {
    console.log("User ID not found, or insufficient privileges.");
  }
};

const authorizeTechnician = (req, res, next) => {
  if (req.user.level === "technician" || req.user.level === "administrator") {
    next();
  } else {
    console.log("Insufficient access privileges for this route.");
  }
};

const authorizeAdministrator = (req, res, next) => {
  if (req.user.level === "administrator") {
    next();
  } else {
    console.log("Insufficient access privileges for this route.");
  }
};

exports.authorizeAll = authorizeAll;
exports.authorizeUser = authorizeUser;
exports.authorizeTechnician = authorizeTechnician;
exports.authorizeAdministrator = authorizeAdministrator;
