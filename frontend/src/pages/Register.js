import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper, Chip, Box, Snackbar, Alert } from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "", hobbies: [] });
  const [hobbyInput, setHobbyInput] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to backend
      await API.post("api/auth/register", formData);
      setSnackbarMessage("Signup successful! Please log in.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleAddHobby = () => {
    if (hobbyInput.trim() && !formData.hobbies.includes(hobbyInput.trim())) {
      setFormData({ ...formData, hobbies: [...formData.hobbies, hobbyInput.trim()] });
      setHobbyInput("");
    }
  };

  const handleRemoveHobby = (hobbyToRemove) => {
    setFormData({ ...formData, hobbies: formData.hobbies.filter((hobby) => hobby !== hobbyToRemove) });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Enter a hobby"
              variant="outlined"
              value={hobbyInput}
              onChange={(e) => setHobbyInput(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddHobby} sx={{ mt: 1 }}>
              Add Hobby
            </Button>
          </Box>

          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {formData.hobbies.map((hobby, index) => (
              <Chip key={index} label={hobby} onDelete={() => handleRemoveHobby(hobby)} />
            ))}
          </Box>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Register
          </Button>
        </form>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Button onClick={() => navigate("/login")}>Login</Button>
          </Typography>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
