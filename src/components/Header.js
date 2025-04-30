'use client';
import { AppBar, Toolbar, Typography, IconButton, Grid, FormControl, InputLabel, Select, MenuItem, TextField, Box, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorScheme } from '../theme/ThemeProvider';
import TestRunner from './TestRunner'; // Import the TestRunner component
import { useState } from 'react';

export default function Header({ filterType, setFilterType, filterStatus, setFilterStatus, searchQuery, setSearchQuery, setResults }) {
  const theme = useTheme();
  const { toggleMode } = useColorScheme();
  const [loading, setLoading] = useState(false); // State to track loading

  const handleRunTests = (results) => {
    setResults(results); // Pass results to the parent
    setLoading(false); // Hide the progress bar after results are set
  };

  const startLoading = () => {
    setLoading(true); // Show the progress bar
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: theme.palette.background.paper, // Use background color from theme.js
        color: theme.palette.text.primary, // Use text color from theme.js
      }}
    >
      <Toolbar>
        <Grid container alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          {/* Title */}
          <Grid item>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Auto-Wright
            </Typography>
          </Grid>

          {/* Right-Side Components */}
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Filters */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="UI">UI</MenuItem>
                  <MenuItem value="API">API</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Pass">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>✅</Typography>
                      <Typography>Pass</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="Fail">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>❌</Typography>
                      <Typography>Fail</Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
              />

              {/* Run Tests Button */}
              <TestRunner
                onResults={(results) => {
                  handleRunTests(results);
                }}
                onStart={startLoading} // Trigger loading when tests start
              />

              {/* Theme Toggle */}
              <IconButton color="inherit" onClick={toggleMode}>
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>

      {/* Linear Progress Bar */}
      {loading && <LinearProgress sx={{ width: '100%' }} />}
    </AppBar>
  );
}
