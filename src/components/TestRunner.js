'use client';
import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

export default function TestRunner({ onResults, onStart }) {
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const runTests = async (type) => {
    if (onStart) onStart(); // Trigger loading state
    handleMenuClose(); // Close the dropdown menu
    try {
      const res = await fetch(`/api/${type}`, { method: 'POST' });
      const data = await res.json();
      if (onResults) onResults(data.results);
    } catch (error) {
      console.error(`Error running ${type} tests:`, error);
    }
  };

  const runAllTests = async () => {
    if (onStart) onStart(); // Trigger loading state
    handleMenuClose(); // Close the dropdown menu
    try {
      const uiRes = await fetch(`/api/playwright`, { method: 'POST' });
      const uiData = await uiRes.json();

      const apiRes = await fetch(`/api/api-tests`, { method: 'POST' });
      const apiData = await apiRes.json();

      if (onResults) onResults([...uiData.results, ...apiData.results]); // Combine results
    } catch (error) {
      console.error('Error running all tests:', error);
    }
  };

  return (
    <>
      <Button
        onClick={handleMenuOpen}
        variant="contained"
        sx={{
          width: "100%", maxWidth: 250,
          backgroundColor: 'primary.main',
          '&:hover': { backgroundColor: 'primary.dark' },
        }}
      >
        Run Tests
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={runAllTests}>Run All Tests</MenuItem>
        <MenuItem onClick={() => runTests('playwright')}>Run UI Tests</MenuItem>
        <MenuItem onClick={() => runTests('api-tests')}>Run API Tests</MenuItem>
      </Menu>
    </>
  );
}
