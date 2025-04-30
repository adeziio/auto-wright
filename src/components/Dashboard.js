import React, { useState } from 'react';
import { Card, CardContent, Box, List, Accordion, AccordionSummary, AccordionDetails, Typography, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from './Header';

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

      <Card sx={{ m: 2, width: '80%' }}>
        <CardContent>
          {/* Display Results */}
          {Object.entries(groupedFilteredResults).map(([type, typeResults], typeIdx) => (
            <Box key={typeIdx} sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, textAlign: 'left' }}>
                {type === 'UI' ? 'UI Tests' : 'API Tests'}
              </Typography>
              <List>
                {Object.entries(
                  typeResults.reduce((acc, result) => {
                    acc[result.test] = acc[result.test] || [];
                    acc[result.test].push(result);
                    return acc;
                  }, {})
                ).map(([testName, testResults], idx) => (
                  <Accordion key={idx}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                        {testName} ({testResults.length})
                      </Typography>
                      <Typography
                        variant="body2"
                        color={testResults.some(result => !result.pass) ? 'error.main' : 'success.main'}
                        sx={{ marginRight: 2 }}
                      >
                        {testResults.some(result => !result.pass) ? '❌ Fail' : '✅ Pass'}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {testResults.map((result, subIdx) => (
                          <ListItem key={subIdx} divider>
                            <ListItemText
                              primary={
                                <Typography variant="body2" component="span" color={result.pass ? 'success.main' : 'error.main'}>
                                  Result: {result.pass ? '✅ Pass' : '❌ Fail'}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Typography variant="body2" component="span" sx={{ display: 'block', mt: 1 }}>
                                    <strong>Expected:</strong>
                                  </Typography>
                                  <Typography variant="body2" component="span" sx={{ display: 'block', ml: 2 }}>
                                    {result.expected}
                                  </Typography>
                                  <Typography variant="body2" component="span" sx={{ display: 'block', mt: 1 }}>
                                    <strong>Actual:</strong>
                                  </Typography>
                                  <Typography variant="body2" component="span" sx={{ display: 'block', ml: 2 }}>
                                    {result.actual}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </List>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
