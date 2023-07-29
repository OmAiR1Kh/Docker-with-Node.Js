const jwt = require("jsonwebtoken");
const token = (user) => {
  return jwt.sign({ payload: user }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
module.exports = token;
