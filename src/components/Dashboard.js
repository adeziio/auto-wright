import React, { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Header from './Header';
import Results from './Results';
import Statistics from './Statistics'; // Import the Statistics component

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Detect if the screen size is mobile (e.g., less than 600px)
  const isMobile = useMediaQuery('(max-width:600px)');

  const filteredResults = results.filter((result) => {
    const matchesType = filterType === 'All' || result.type === filterType;
    const matchesStatus = filterStatus === 'All' || (filterStatus === 'Pass' ? result.pass : !result.pass);

    const matchesSearch =
      searchQuery === '' ||
      Object.values(result).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      (searchQuery.toLowerCase() === 'pass' && result.pass) ||
      (searchQuery.toLowerCase() === 'fail' && !result.pass);

    return matchesType && matchesStatus && matchesSearch;
  });

  const groupedFilteredResults = filteredResults.reduce((acc, result) => {
    acc[result.type] = acc[result.type] || [];
    acc[result.type].push(result);
    return acc;
  }, {});

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
              width: '20%', // 20% of the screen width
              height: '90vh', // Fixed height based on 90% of the viewport height
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRight: results?.length > 0 ? '1px solid #ccc' : '', // Optional: Add a border for separation
              padding: 2,
              boxSizing: 'border-box', // Ensure padding doesn't affect layout
            }}
          >
            <Statistics groupedFilteredResults={groupedFilteredResults} />
          </Box>
        )}

        {/* Results on the right */}
        <Box
          sx={{
            width: isMobile ? '100%' : '80%', // Full width in mobile mode, 80% otherwise
            height: '90vh', // Height of the viewport
            overflowY: 'auto', // Add scrolling if content overflows
            padding: 2,
          }}
        >
          <Results groupedFilteredResults={groupedFilteredResults} />
        </Box>
      </Box>
    </Box>
  );
}
