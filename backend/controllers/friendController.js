const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");

const sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const newRequest = new FriendRequest({ sender: req.user.id, receiver: receiverId });
    await newRequest.save();
    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friends");
    const recommendations = await User.find({
      _id: { $nin: [req.user.id, ...user.friends.map(friend => friend._id)] },
    }).limit(10);

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { sendRequest, getRecommendations };
