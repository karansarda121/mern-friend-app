import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Chip } from "@mui/material";
import API from "../api";

const InitialUsers = ({ setlist }) => {
  const [initialUsers, setInitialUsers] = useState([]);
  
  useEffect(() => {
    const fetchInitialUsers = async () => {
      try {
        const res = await API.get("api/friends/initial-users"); // Adjust the API endpoint as per your backend
        setInitialUsers(res.data); // Assuming API returns the user list
      } catch (err) {
        console.error("Error fetching initial users:", err.response?.data?.message || err.message);
      }
    };

    fetchInitialUsers();
  }, []);

  const handleSearch = (user) => {
    setlist([user]); // Pass the selected user to the search result in parent
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Initial Users
      </Typography>
      
      <Grid container spacing={3}>
        {initialUsers.length > 0 ? (
          initialUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {user.username}
                  </Typography>
                  {/* Assuming hobbies is an array */}
                  {user.interests && user.interests.length > 0 ? (
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Hobbies:
                      </Typography>
                      {user.interests.map((hobby, index) => (
                        <Chip key={index} label={hobby} sx={{ marginRight: 1, marginTop: 1 }} />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No hobbies available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" sx={{ gridColumn: "span 12" }}>
            No users found.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default InitialUsers;
