import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Avatar, List, ListItem, ListItemText } from "@mui/material";
import API from "../api";

const FriendRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await API.get("api/friends/recommendations");
        setRecommendations(res.data);
      } catch (err) {
        console.error("Error fetching recommendations:", err.response?.data?.message || err.message);
      }
    };

    fetchRecommendations();
  }, []);

  const handleSendRequest = async (receiverId) => {
    try {
      await API.post("api/friends/send-request", { receiverId });
      alert("Friend request sent!");
      setRecommendations((prevRecommendations) =>
        prevRecommendations.filter((user) => user._id !== receiverId)
      );
    } catch (err) {
        alert("Already sent the Request")
      console.error("Error sending friend request:", err.response?.data?.message || err.message);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Recommended Friends
      </Typography>

      {recommendations.length > 0 ? (
        <List>
          {recommendations.map((user) => (
            <ListItem key={user._id} sx={{ borderBottom: "1px solid #ddd", padding: 2 }}>
              <Avatar sx={{ marginRight: 2 }}>{user.username[0]}</Avatar>
              <ListItemText
                primary={user.username}
                secondary={`Mutual Friends: ${user.mutualFriendsCount || 0}`}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleSendRequest(user._id)}
              >
                Send Request
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="textSecondary" sx={{ textAlign: "center" }}>
          No recommendations available.
        </Typography>
      )}
    </Box>
  );
};

export default FriendRecommendations;
