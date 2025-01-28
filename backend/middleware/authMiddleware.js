const JWT = require("jsonwebtoken");



// Authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      console.log("No token provided");
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Split the Authorization header and get the token
    const token = authHeader.split(" ")[1]; // Bearer <token>

    // If there's no token, deny access
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify the token using JWT_SECRET
    const decoded = JWT.verify(token, process.env.JWT_SECRET); // Decode the token

    // Attach decoded user info to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;

module.exports = authMiddleware;
