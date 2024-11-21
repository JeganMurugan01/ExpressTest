const jwt = require("jsonwebtoken");
require("dotenv").config();
function authenticateToken(req, res, next) {
  const token = req.header("authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }
  const finailtoken = token.split(" ")[1];
  try {
    const decoded = jwt.verify(finailtoken, process.env.KEY);
    req.user = decoded;
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token." });
  }
}

module.exports = { authenticateToken };
