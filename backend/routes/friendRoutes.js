// friendRoutes.js
const express = require("express");
const { sendRequest, getRecommendations } = require("../controllers/friendController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/send-request", authMiddleware, sendRequest);
router.get("/recommendations", authMiddleware, getRecommendations);

module.exports = router;