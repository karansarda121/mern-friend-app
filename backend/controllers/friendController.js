const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");

const sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;

    // Prevent sending request to yourself
    if (req.user.id === receiverId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

    // Check if the receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    // Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: req.user.id,
      receiver: receiverId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    // Check if they are already friends
    const sender = await User.findById(req.user.id);
    if (sender.friends.includes(receiverId)) {
      return res.status(400).json({ message: "User is already your friend." });
    }

    // Create and save the new friend request
    const newRequest = new FriendRequest({
      sender: req.user.id,
      receiver: receiverId,
    });
    await newRequest.save();

    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getPendingRequests = async (req, res) => {
  try {
    // Find all pending friend requests for the logged-in user
    const requests = await FriendRequest.find({ receiver: req.user.id, status: "pending" })
      .populate("sender", "username") // Populate the sender's username
      .select("sender createdAt"); // Only include the sender and createdAt fields

    // Check if there are no pending requests
    if (!requests || requests.length === 0) {
      return res.status(200).json({ message: "No pending friend requests.", requests: [] });
    }

    // Respond with the pending requests
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching pending requests:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
};


//getrecommendation
const getRecommendations = async (req, res) => {
  try {
    // Fetch the logged-in user and their friends
    const user = await User.findById(req.user.id).populate("friends", "_id username interests");

    // Fetch all users excluding the logged-in user and their current friends
    const potentialFriends = await User.find({
      _id: { $nin: [req.user.id, ...user.friends.map((friend) => friend._id)] },
    }).select("username interests friends");

    // Calculate recommendations
    const recommendations = potentialFriends.map((potentialFriend) => {
      // Find mutual friends
      const mutualFriends = potentialFriend.friends.filter((friendId) =>
        user.friends.some((friend) => friend._id.toString() === friendId.toString())
      );

      // Find common interests
      const commonInterests = user.interests?.filter((interest) =>
        potentialFriend.interests.includes(interest)
      );

      // Calculate score (mutual friends are weighted higher than common interests)
      const score = mutualFriends.length * 2 + (commonInterests?.length || 0);

      // Return recommendation data
      return {
        _id: potentialFriend._id,
        username: potentialFriend.username,
        mutualFriendsCount: mutualFriends.length,
        commonInterestsCount: commonInterests?.length || 0,
        interests: potentialFriend.interests,
        score,
      };
    });

    // Filter recommendations with a score of 1 or above and sort by score in descending order
    const filteredRecommendations = recommendations
      .filter((recommendation) => recommendation.score >= 1)
      .sort((a, b) => b.score - a.score);

    // Limit recommendations to 10
    const limitedRecommendations = filteredRecommendations.slice(0, 10);

    // Respond with the recommendations
    res.status(200).json(limitedRecommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Get Initial Users
const getInitialUsers = async (req, res) => {
  try {
    // Fetch the logged-in user and their friends
    const user = await User.findById(req.user.id).select("friends");
    const friends = user.friends.map((friendId) => friendId.toString());

    // Fetch all users excluding the logged-in user and their friends
    const users = await User.find({
      _id: { $ne: req.user.id, $nin: friends }, // Exclude logged-in user and friends
    }).select("_id username"); // Select only necessary fields

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching initial users:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Accept/Reject Friend Requests
const manageRequest = async (req, res) => {
  const { requestId, action } = req.body; // "accept" or "reject"
  try {
    // Fetch the friend request
    const request = await FriendRequest.findById(requestId).populate("sender receiver");
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Accept request
    if (action === "accept") {
      const sender = await User.findById(request.sender._id);
      const receiver = await User.findById(request.receiver._id);

      if (!sender || !receiver) {
        return res.status(404).json({ message: "Sender or receiver not found" });
      }

      // Add each other as friends
      sender.friends.push(receiver._id);
      receiver.friends.push(sender._id);

      // Save updated sender and receiver
      await sender.save();
      await receiver.save();

      // Delete the friend request
      await request.deleteOne();

      return res.status(200).json({ message: "Friend request accepted" });

    } else if (action === "reject") {
      // Reject request: simply delete it
      await request.deleteOne();
      return res.status(200).json({ message: "Friend request rejected" });

    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Error managing friend request:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// Get Friends List
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friends", "username");
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Unfriend
const unfriend = async (req, res) => {
  const { friendId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(friendId);

    if (!user || !friend) return res.status(404).json({ message: "User not found" });

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== user._id.toString());

    await user.save();
    await friend.save();
    res.status(200).json({ message: "Unfriended successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query; // The search query sent from the frontend
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }

    // Find users whose username contains the search query, excluding the logged-in user
    const users = await User.find({
      username: { $regex: query, $options: "i" }, // Case-insensitive search
      _id: { $ne: req.user.id }, // Exclude logged-in user
    }).select("username interests");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
    getInitialUsers, manageRequest, getFriends, unfriend, sendRequest,
    getRecommendations, getPendingRequests, searchUsers
};



