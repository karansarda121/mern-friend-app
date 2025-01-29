// import React, { useState } from "react";
// import { Grid, Container, Paper, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress } from "@mui/material";
// import SearchBar from "../components/SearchBar";
// import FriendRequests from "../components/FriendRequests";
// import FriendsList from "../components/FriendsList";
// import FriendRecommendations from "../components/FriendRecommendations";
// import API from "../api"; // Your API utility for backend communication
// import InitialUsers from "../components/InitialUsers"; // Import InitialUsers component

// const Dashboard = () => {
//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null); // Store selected user details
//   const [openModal, setOpenModal] = useState(false); // Control modal visibility
//     const [loading, setLoading] = useState(false); // Handle loading state for sending request
//     const [list, setlist] = useState([]); // Store friend requests

//   // Open Modal function
//   const handleOpenModal = (user) => {
//     setSelectedUser(user); // Set selected user data
//     setOpenModal(true); // Open the modal
//   };

//   // Close Modal function
//   const handleCloseModal = () => {
//     setSelectedUser(null); // Clear selected user data
//     setOpenModal(false); // Close modal
//   };

//   // Send Friend Request function
//   const handleSendFriendRequest = async () => {
//     if (!selectedUser) return;

//     setLoading(true); // Start loading
//     try {
//       const res = await API.post("api/friends/send-request", { receiverId: selectedUser._id }); // Replace with your API endpoint
//       console.log(res.data); // Handle success (e.g., show success message)
//       setLoading(false); // Stop loading
//       handleCloseModal(); // Close the modal after sending request
//     } catch (err) {
//       setLoading(false); // Stop loading if there's an error
//       console.error("Error sending friend request:", err.response?.data?.message || err.message);
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ paddingTop: 5 }}>
//       <Typography variant="h3" gutterBottom>
//         Dashboard
//       </Typography>

//       <Grid container spacing={4}>
//         {/* Search Bar Section */}
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ padding: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Search Users
//             </Typography>
//             <SearchBar setResults={setSearchResults} />
//           </Paper>
//               </Grid>
//                {/* Search Results Section */}
//         <Grid item xs={12}>
//           <Paper elevation={3} sx={{ padding: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Search Results
//             </Typography>
//             <Box>
//               {searchResults.length ? (
//                 <ul>
//                   {searchResults.map((result) => (
//                     <li key={result._id}>
//                       <Button variant="outlined" onClick={() => handleOpenModal(result)}>
//                         {result.username}
//                       </Button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <Typography variant="body2">No results found</Typography>
//               )}
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>


//                {/* Initial Users Section */}
//         <Grid item xs={12}>
//           <InitialUsers setlist={setlist} />
//         </Grid>
              

//         {/* Friend Requests Section */}
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ padding: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Friend Requests
//             </Typography>
//             <FriendRequests />
//           </Paper>
//         </Grid>

//         {/* Friends List Section */}
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ padding: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Your Friends
//             </Typography>
//             <FriendsList />
//           </Paper>
//         </Grid>

//         {/* Friend Recommendations Section */}
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ padding: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Friend Recommendations
//             </Typography>
//             <FriendRecommendations />
//           </Paper>
//         </Grid>

       
//       {/* Modal to Show User Info */}
//       <Dialog open={openModal} onClose={handleCloseModal}>
//         <DialogTitle>Send Friend Request</DialogTitle>
//         <DialogContent>
//           {/* Display User Info */}
//           <Typography variant="h6" gutterBottom>
//             {selectedUser?.username}
//           </Typography>
//           <Typography variant="body1" gutterBottom>
//             {/* Display any additional user details */}
//             {selectedUser?.bio || "No bio available"}
//           </Typography>

//           {/* Send Friend Request Button */}
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSendFriendRequest}
//             disabled={loading} // Disable while loading
//             sx={{ marginTop: 2 }}
//           >
//             {loading ? "Sending..." : "Send Friend Request"}
//           </Button>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseModal} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default Dashboard;



import React, { useState } from "react";
import {
  Grid,
  Container,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Modal,
} from "@mui/material";
import SearchBar from "../components/SearchBar";
import FriendRequests from "../components/FriendRequests";
import FriendsList from "../components/FriendsList";
import FriendRecommendations from "../components/FriendRecommendations";
import API from "../api"; // Your API utility for backend communication
import InitialUsers from "../components/InitialUsers"; // Import InitialUsers component

const Dashboard = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user details
  const [openModal, setOpenModal] = useState(false); // Control modal visibility
  const [loading, setLoading] = useState(false); // Handle loading state for sending request
  const [list, setList] = useState([]); // Store friend requests

  // States to control visibility of sections
  const [showInitialUsers, setShowInitialUsers] = useState(false);
  const [showFriendRecommendations, setShowFriendRecommendations] = useState(false);

  // Open Modal function
  const handleOpenModal = (user) => {
    setSelectedUser(user); // Set selected user data
    setOpenModal(true); // Open the modal
    setSearchResults([]);
  };

  // Close Modal function
  const handleCloseModal = () => {
    setSelectedUser(null); // Clear selected user data
    setOpenModal(false); // Close modal
  };

  // Send Friend Request function
  const handleSendFriendRequest = async () => {
    if (!selectedUser) return;

    setLoading(true); // Start loading
    try {
      const res = await API.post("api/friends/send-request", { receiverId: selectedUser._id }); // Replace with your API endpoint
      console.log(res.data); // Handle success (e.g., show success message)
      setLoading(false); // Stop loading
      handleCloseModal(); // Close the modal after sending request
    } catch (err) {
        setLoading(false);
      alert("Already sent the Request")  // Stop loading if there's an error
      console.error("Error sending friend request:", err.response?.data?.message || err.message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 2 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
          </Typography>
          
          <Grid container spacing={4} alignItems="center">
  {/* Search Bar Section */}
  <Grid item xs={12} md={6}>
    <Paper elevation={3} sx={{ padding: 1.5, marginBottom: 4 }}>
      <Typography variant="h6" gutterBottom>
        Search Users
      </Typography>
      <SearchBar setResults={setSearchResults} />
    </Paper>
  </Grid>

  {/* Search Results Section - Aligned to the Right with Margin */}
  {searchResults.length > 0 && (
    <Grid item xs={12} md={4}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Search Results
        </Typography>
        <Box>
          {searchResults.length>0 ? (
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {searchResults.map((result) => (
                <li key={result._id} style={{ marginBottom: 6 }}>
                  <Button variant="outlined" onClick={() => handleOpenModal(result)}>
                    {result.username}
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2">No results found</Typography>
          )}
        </Box>
      </Paper>
    </Grid>
  )}
</Grid>



      {/* Fixed Sections: Initial Users & Friend Recommendations */}
      <Box
        sx={{
          position: "fixed",
          top: 32,
          right: 25,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Initial Users Section with Dropdown */}
       <Paper
  elevation={3}
  sx={{
    padding: 1.5,
    cursor: "pointer",
    marginBottom: 1,
    marginTop: 10, // Add margin from the top
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    }, backgroundColor: "rgba(19, 21, 184, 0.05)", // Light blue transparent background
    borderRadius: 2, // Optional: Rounds the corners for better aesthetics
  }}
  onClick={() => setShowInitialUsers(true)}
>
  <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
    Initial Users
  </Typography>
</Paper>


        {/* Friend Recommendations Section with Dropdown */}
        <Paper
          elevation={3}
          sx={{
            padding: 1.5,
            cursor: "pointer",
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }, backgroundColor: "rgba(19, 21, 184, 0.05)", // Light blue transparent background
    borderRadius: 2, // Optional: Rounds the corners for better aesthetics
          }}
          onClick={() => setShowFriendRecommendations(true)}
        >
          <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
            Friend Recommendations
          </Typography>
        </Paper>
      </Box>

      {/* Modal-like dropdown for Initial Users */}
      <Modal
        open={showInitialUsers}
        onClose={() => setShowInitialUsers(false)}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            maxWidth: 400,
            width: "100%",
            overflowY: "auto", // Make the modal scrollable if content overflows
            maxHeight: "80vh", // Max height for the modal
          }}
        >
          <InitialUsers setList={setList} />
        </Box>
      </Modal>

      {/* Modal-like dropdown for Friend Recommendations */}
      <Modal
        open={showFriendRecommendations}
        onClose={() => setShowFriendRecommendations(false)}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            maxWidth: 400,
            width: "100%",
            overflowY: "auto", // Make the modal scrollable if content overflows
            maxHeight: "80vh", // Max height for the modal
          }}
        >
          <FriendRecommendations />
        </Box>
      </Modal>

      {/* Friend Requests Section */}
      <Grid container item xs={12} spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2, height: 300, overflow: "auto" }}>
            <Typography variant="h6" gutterBottom>
              Friend Requests
            </Typography>
            <FriendRequests />
          </Paper>
        </Grid>

        {/* Friends List Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2, height: 300, overflow: "auto" }}>
            <Typography variant="h6" gutterBottom>
              Your Friends
            </Typography>
            <FriendsList />
          </Paper>
        </Grid>
      </Grid>

      {/* Modal to Show User Info */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Send Friend Request</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          {/* Display User Info */}
          <Typography variant="h6" gutterBottom>
            {selectedUser?.username}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {selectedUser?.bio || "No bio available"}
          </Typography>

          {/* Send Friend Request Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendFriendRequest}
            disabled={loading} // Disable while loading
            sx={{ marginTop: 2 }}
            fullWidth
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send Friend Request"}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;