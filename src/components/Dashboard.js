import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Results from './Results'; // Import the new Results component

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

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
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', flexDirection: 'column', alignItems: 'center' }}>
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

      {/* Results */}
      <Results groupedFilteredResults={groupedFilteredResults} />
    </Box>
  );
}
