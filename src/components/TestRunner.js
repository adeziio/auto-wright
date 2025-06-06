'use client';
import { useState, useEffect } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

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

  // Helper to submit jobs and poll for results (for both UI and API)
  const runTestsWithQueue = async (testNames, extraBody = {}) => {
    if (!Array.isArray(testNames) || testNames.length === 0) return [];
    const runId = uuidv4(); // or use Date.now() for a simple numeric id
    // 1. Submit all jobs in one batch
    const res = await fetch('/api/queue/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testNames, runId, ...extraBody }),
    });
    const { ids: jobIds } = await res.json();

    // 2. Poll for all results
    const pollJob = async (id) => {
      while (true) {
        const res = await fetch(`/api/queue/result?id=${id}`);
        const data = await res.json();
        if (data.results || data.error) return data.results || [data];
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    };

    // Wait for all jobs to finish
    const resultsArr = await Promise.all(jobIds.map(pollJob));
    return resultsArr.flat();
  };

  // Run all UI tests using the worker queue
  const runUiTests = async () => {
    if (onStart) onStart();
    setLoading(true);
    handleMenuClose();
    try {
      const allResults = await runTestsWithQueue(uiTestNames, { headless });
      const timestamp = getTimestamp();
      if (onResults) onResults({ timestamp, results: allResults });
    } catch (error) {
      console.error('Error running UI tests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Run all API tests using the worker queue
  const runApiTests = async () => {
    if (onStart) onStart();
    setLoading(true);
    handleMenuClose();
    try {
      const allResults = await runTestsWithQueue(apiTestNames);
      const timestamp = getTimestamp();
      if (onResults) onResults({ timestamp, results: allResults });
    } catch (error) {
      console.error('Error running API tests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Run all UI and API tests using the worker queue
  const runAllTests = async () => {
    if (onStart) onStart();
    setLoading(true);
    handleMenuClose();
    try {
      const runId = uuidv4(); // Generate a single runId for this batch

      // Run UI jobs first, wait for all to be queued and finished
      const uiResults = await runTestsWithQueue(uiTestNames, { headless, runId });
      // Then run API jobs, wait for all to be queued and finished
      const apiResults = await runTestsWithQueue(apiTestNames, { runId });
      const allResults = [...uiResults, ...apiResults];
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
