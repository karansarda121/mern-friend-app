import React, { useEffect, useState } from "react";
import { Button, Box, Paper, Typography, List, ListItem, ListItemText } from "@mui/material";
import API from "../api";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await API.get("api/friends/getfriends");
        setFriends(res.data);
      } catch (err) {
        console.error("Error fetching friends:", err.response?.data?.message || err.message);
      }
    };
    fetchFriends();
  });

  const handleUnfriend = async (friendId) => {
    try {
      await API.post("api/friends/unfriend", { friendId });
      setFriends(friends.filter((friend) => friend._id !== friendId));
    } catch (err) {
      console.error("Error unfriending:", err.response?.data?.message || err.message);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Your Friends
      </Typography>
      
      {/* Friend List Container */}
      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <ListItem key={friend._id} sx={{ marginBottom: 2, borderBottom: '1px solid #ddd' }}>
                <ListItemText primary={friend.username} />
                {/* Unfriend Button */}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleUnfriend(friend._id)}
                >
                  Unfriend
                </Button>
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              You have no friends yet.
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default FriendsList;
