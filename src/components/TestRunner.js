'use client';
import { useState, useEffect } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

export default function TestRunner({ onResults, onStart, headless }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uiTestNames, setUiTestNames] = useState([]);
  const [apiTestNames, setApiTestNames] = useState([]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getTimestamp = () => new Date().toISOString();

  // Run all UI tests in parallel
  const runUiTests = async () => {
    if (onStart) onStart();
    setLoading(true);
    handleMenuClose();
    try {
      const resultsArr = await Promise.all(
        uiTestNames.map(testName =>
          fetch('/api/ui-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ headless, testName }),
          }).then(res => res.json())
        )
      );
      const allResults = resultsArr.flatMap(r => r.results || []);
      const timestamp = getTimestamp();
      if (onResults) onResults({ timestamp, results: allResults });
    } catch (error) {
      console.error('Error running UI tests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Run all API tests in parallel
  const runApiTests = async () => {
    if (onStart) onStart();
    setLoading(true);
    handleMenuClose();
    try {
      const resultsArr = await Promise.all(
        apiTestNames.map(testName =>
          fetch('/api/api-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ testName }),
          }).then(res => res.json())
        )
      );
      const allResults = resultsArr.flatMap(r => r.results || []);
      const timestamp = getTimestamp();
      if (onResults) onResults({ timestamp, results: allResults });
    } catch (error) {
      console.error('Error running API tests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Run all UI and API tests in parallel
  const runAllTests = async () => {
    if (onStart) onStart();
    setLoading(true);
    handleMenuClose();
    try {
      const [uiResultsArr, apiResultsArr] = await Promise.all([
        Promise.all(
          uiTestNames.map(testName =>
            fetch('/api/ui-test', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ headless, testName }),
            }).then(res => res.json())
          )
        ),
        Promise.all(
          apiTestNames.map(testName =>
            fetch('/api/api-test', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ testName }),
            }).then(res => res.json())
          )
        ),
      ]);
      const allResults = [
        ...uiResultsArr.flatMap(r => r.results || []),
        ...apiResultsArr.flatMap(r => r.results || []),
      ];
      const timestamp = getTimestamp();
      if (onResults) onResults({ timestamp, results: allResults });
    } catch (error) {
      console.error('Error running all tests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/ui-test-list')
      .then(res => res.json())
      .then(data => setUiTestNames(data.testNames || []));
    fetch('/api/api-test-list')
      .then(res => res.json())
      .then(data => setApiTestNames(data.testNames || []));
  }, []);

  return (
    <>
      <Button
        onClick={handleMenuOpen}
        variant="contained"
        disabled={loading}
        sx={{
          width: "100%", maxWidth: 250,
          backgroundColor: loading ? 'grey.500' : 'primary.main',
          '&:hover': { backgroundColor: loading ? 'grey.500' : 'primary.dark' },
        }}
      >
        {loading ? 'Running...' : 'Run Tests'}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={runAllTests}>Run All Tests</MenuItem>
        <MenuItem onClick={runUiTests}>Run UI Tests</MenuItem>
        <MenuItem onClick={runApiTests}>Run API Tests</MenuItem>
      </Menu>
    </>
  );
}
