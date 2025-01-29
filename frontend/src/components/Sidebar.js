// components/Sidebar.js
import React, { useState } from "react";
import { Paper, Typography, Box, Modal } from "@mui/material";
import InitialUsers from "./InitialUsers";
import FriendRecommendations from "./FriendRecommendations";

const Sidebar = () => {
  const [showInitialUsers, setShowInitialUsers] = useState(false);
  const [showFriendRecommendations, setShowFriendRecommendations] = useState(false);

  return (
    <Box sx={{ width: 250, padding: 2 }}>
      {/* Initial Users Section */}
      <Paper
        elevation={3}
        sx={{ padding: 1.5, cursor: "pointer", marginBottom: 1 }}
        onClick={() => setShowInitialUsers(true)}
      >
        <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
          Initial Users
        </Typography>
      </Paper>

      {/* Friend Recommendations Section */}
      <Paper
        elevation={3}
        sx={{ padding: 1.5, cursor: "pointer" }}
        onClick={() => setShowFriendRecommendations(true)}
      >
        <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
          Friend Recommendations
        </Typography>
      </Paper>

      {/* Modal for Initial Users */}
      <Modal open={showInitialUsers} onClose={() => setShowInitialUsers(false)}>
        <Box sx={{ padding: 2, maxWidth: 400, margin: "auto", bgcolor: "white" }}>
          <InitialUsers />
        </Box>
      </Modal>

      {/* Modal for Friend Recommendations */}
      <Modal open={showFriendRecommendations} onClose={() => setShowFriendRecommendations(false)}>
        <Box sx={{ padding: 2, maxWidth: 400, margin: "auto", bgcolor: "white" }}>
          <FriendRecommendations />
        </Box>
      </Modal>
    </Box>
  );
};

export default Sidebar;
