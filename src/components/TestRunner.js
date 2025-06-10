'use client';
import { useState, useEffect } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

export default function TestRunner({ onResults, onStart, headless }) {
  const [anchorEl, setAnchorEl] = useState(null);
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
    const runId = extraBody.runId || uuidv4();
    const queued = extraBody.queued || Date.now();
    // 1. Submit all jobs in one batch
    const res = await fetch('/api/queue/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testNames, runId, queued, ...extraBody }),
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
    handleMenuClose();
    try {
      const queued = Date.now();
      const allResults = await runTestsWithQueue(uiTestNames, { headless, type: 'UI', queued });
      const finished = Date.now();
      if (onResults) onResults({ queued, timestamp: finished, results: allResults });
    } catch (error) {
      console.error('Error running UI tests:', error);
    }
  };

  // Run all API tests using the worker queue
  const runApiTests = async () => {
    if (onStart) onStart();
    handleMenuClose();
    try {
      const queued = Date.now();
      const allResults = await runTestsWithQueue(apiTestNames, { type: 'API', queued });
      const finished = Date.now();
      if (onResults) onResults({ queued, timestamp: finished, results: allResults });
    } catch (error) {
      console.error('Error running API tests:', error);
    }
  };

  // Run all UI and API tests using the worker queue
  const runAllTests = async () => {
    if (onStart) onStart();
    handleMenuClose();
    try {
      const runId = uuidv4();
      const queued = Date.now();

      // Pass runId and queued to both batches
      const uiResults = await runTestsWithQueue(uiTestNames, { headless, runId, queued, type: 'UI' });
      const apiResults = await runTestsWithQueue(apiTestNames, { runId, queued, type: 'API' });
      const allResults = [...uiResults, ...apiResults];
      const finished = Date.now();
      if (onResults) onResults({ queued, timestamp: finished, results: allResults });
    } catch (error) {
      console.error('Error running all tests:', error);
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
        sx={{
          width: "100%", maxWidth: 250,
          backgroundColor: 'primary.main',
          '&:hover': { backgroundColor: 'primary.dark' },
        }}
      >
        Run Tests
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={runAllTests}>All Tests</MenuItem>
        <MenuItem
          onClick={runUiTests}
          sx={{ pl: 4 }}
        >
          All UI Tests
        </MenuItem>
        {uiTestNames.map((testName, idx) => (
          <MenuItem
            key={`ui-${testName}`}
            onClick={async () => {
              handleMenuClose();
              const queued = Date.now();
              const allResults = await runTestsWithQueue([testName], { headless, type: 'UI', queued });
              const finished = Date.now();
              if (onResults) onResults({ queued, timestamp: finished, results: allResults });
            }}
            sx={{ pl: 8 }} // Further indent for individual UI tests
          >
            {testName}
          </MenuItem>
        ))}
        <MenuItem
          onClick={runApiTests}
          sx={{ pl: 4 }}
        >
          All API Tests
        </MenuItem>
        {apiTestNames.map((testName, idx) => (
          <MenuItem
            key={`api-${testName}`}
            onClick={async () => {
              handleMenuClose();
              const queued = Date.now();
              const allResults = await runTestsWithQueue([testName], { type: 'API', queued });
              const finished = Date.now();
              if (onResults) onResults({ queued, timestamp: finished, results: allResults });
            }}
            sx={{ pl: 8 }} // Further indent for individual API tests
          >
            {testName}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
