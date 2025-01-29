import React, { useState } from "react";
import { TextField, Button, Box, CircularProgress, Snackbar } from "@mui/material";
import API from "../api";

const SearchBar = ({ setResults }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;  // If query is empty, don't search
    setLoading(true); // Show loading indicator
    setErrorMessage(""); // Clear previous error message

    try {
      const res = await API.get(`api/friends/search?query=${query}`);
      setResults(res.data);  // Set search results
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
      console.error(err.response?.data?.message || err);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400, margin: "0 auto" }}>
      <TextField
        label="Search users"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading} // Disable button when loading
        >
          {loading ? <CircularProgress size={24} color="secondary" /> : "Search"}
        </Button>
      </Box>

      {/* Show error message in case of failure */}
      {errorMessage && (
        <Snackbar
          open={Boolean(errorMessage)}
          autoHideDuration={6000}
          onClose={() => setErrorMessage("")}
          message={errorMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      )}
    </Box>
  );
};

export default SearchBar;
