
const express = require("express");
const { 
  sendRequest, 
  getRecommendations, 
  getInitialUsers, 
  manageRequest, 
  getFriends, 
unfriend,
getPendingRequests,
  searchUsers
} = require("../controllers/friendController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send-request", authMiddleware, sendRequest);
router.get("/recommendations", authMiddleware, getRecommendations);
router.get("/initial-users", authMiddleware, getInitialUsers);
router.post("/manage-request", authMiddleware, manageRequest);
router.get("/getfriends", authMiddleware, getFriends);
router.post("/unfriend", authMiddleware, unfriend);
router.get("/pending-requests", authMiddleware, getPendingRequests);
router.get("/search", authMiddleware, searchUsers);


module.exports = router;



