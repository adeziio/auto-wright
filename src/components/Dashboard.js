import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Header from './Header';
import Results from './Results';
import Statistics from './Statistics';

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const isMobile = useMediaQuery('(max-width:600px)');

  // Fetch and poll results from /api/results
  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch('/api/results');
      const data = await res.json();
      setResults(data);
    };
    fetchResults();
    const interval = setInterval(fetchResults, 3000);
    return () => clearInterval(interval);
  }, []);

  // Apply filters to the results
  const filteredResults = results.map((run) => ({
    ...run,
    results: run.results.filter((result) => {
      const matchesType = filterType === 'All' || result.type === filterType;
      const matchesStatus =
        filterStatus === 'All' ||
        (filterStatus === 'Pass' ? result.pass === true : filterStatus === 'Fail' ? result.pass === false : true);
      const matchesSearch =
        searchQuery === '' ||
        Object.values(result).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesType && matchesStatus && matchesSearch;
    }),
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'visible' }}>
      {/* Header */}
      <Header
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setResults={setResults}
      />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          overflow: 'auto',
        }}
      >
        {/* Conditionally render Statistics */}
        {!isMobile && (
          <Box
            sx={{
              width: '20%',
              height: '90vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRight: results?.length > 0 ? '1px solid #ccc' : '',
              padding: 2,
              boxSizing: 'border-box',
            }}
          >
            <Statistics groupedFilteredResults={filteredResults} />
          </Box>
        )}

        {/* Results on the right */}
        <Box
          sx={{
            width: isMobile ? '100%' : '80%',
            height: '90vh',
            overflowY: 'auto',
            padding: 2,
          }}
        >
          <Results groupedResultsByTimestamp={filteredResults} />
        </Box>
      </Box>
    </Box>
  );
}
