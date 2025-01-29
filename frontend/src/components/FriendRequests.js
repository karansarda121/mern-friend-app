import React, { useEffect, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import API from "../api";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);

  // Fetch pending friend requests when the component mounts
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("api/friends/pending-requests");
        setRequests(res.data.requests); // Assuming the response has a 'requests' field
      } catch (err) {
        console.error("Error fetching friend requests:", err.response?.data?.message || err.message);
      }
    };
    fetchRequests();
  }, []);

  // Handle accepting or rejecting a friend request
  const handleAction = async (requestId, action) => {
    try {
      await API.post("api/friends/manage-request", { requestId, action });
      setRequests(requests.filter((req) => req._id !== requestId)); // Remove the request from the list after action
    } catch (err) {
      console.error("Error handling friend request action:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Pending Friend Requests
      </Typography>
      {requests.length === 0 ? (
        <Typography>No pending requests</Typography>
      ) : (
        requests.map((req) => (
          <Box key={req._id} sx={{ marginBottom: 2, padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="body1">{req.sender.username}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAction(req._id, "accept")}
              sx={{ marginRight: 1 }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleAction(req._id, "reject")}
            >
              Reject
            </Button>
          </Box>
        ))
      )}
    </div>
  );
};

export default FriendRequests;
