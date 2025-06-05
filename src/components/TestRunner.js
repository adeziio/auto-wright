'use client';
import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

export default function TestRunner({ onResults, onStart, headless }) { // Accept headless as a prop
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu
  const [loading, setLoading] = useState(false); // State to track if tests are running

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const getTimestamp = () => {
    return new Date().toISOString(); // Generate a timestamp in ISO format
  };

  const runTests = async (type) => {
    if (onStart) onStart(); // Trigger loading state
    setLoading(true); // Disable the button
    handleMenuClose(); // Close the dropdown menu
    try {
      const isPlaywright = type === 'playwright';
      const res = await fetch(`/api/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: isPlaywright ? JSON.stringify({ headless }) : undefined, // Only send headless for playwright
      });
      const data = await res.json();
      const timestamp = getTimestamp(); // Generate a timestamp
      if (onResults) onResults({ timestamp, results: data.results }); // Pass timestamp and results
    } catch (error) {
      console.error(`Error running ${type} tests:`, error);
    } finally {
      setLoading(false); // Re-enable the button after tests complete
    }
  };

  const runAllTests = async () => {
    if (onStart) onStart(); // Trigger loading state
    setLoading(true); // Disable the button
    handleMenuClose(); // Close the dropdown menu
    try {
      const uiRes = await fetch(`/api/playwright`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headless }), // Only playwright needs headless
      });
      const uiData = await uiRes.json();

      const apiRes = await fetch(`/api/api-tests`, { method: 'POST' });
      const apiData = await apiRes.json();

      const timestamp = getTimestamp(); // Generate a timestamp
      if (onResults) onResults({ timestamp, results: [...uiData.results, ...apiData.results] }); // Pass timestamp and combined results
    } catch (error) {
      console.error('Error running all tests:', error);
    } finally {
      setLoading(false); // Re-enable the button after tests complete
    }
  };

  return (
    <>
      <Button
        onClick={handleMenuOpen}
        variant="contained"
        disabled={loading} // Disable the button when loading
        sx={{
          width: "100%", maxWidth: 250,
          backgroundColor: loading ? 'grey.500' : 'primary.main', // Change color when disabled
          '&:hover': { backgroundColor: loading ? 'grey.500' : 'primary.dark' },
        }}
      >
        {loading ? 'Running...' : 'Run Tests'} {/* Show "Running..." when loading */}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={runAllTests}>Run All Tests</MenuItem>
        <MenuItem onClick={() => runTests('playwright')}>Run UI Tests</MenuItem>
        <MenuItem onClick={() => runTests('api-tests')}>Run API Tests</MenuItem>
      </Menu>
    </>
  );
}
