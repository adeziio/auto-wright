'use client';
import { AppBar, Toolbar, Typography, IconButton, Grid, FormControl, InputLabel, Select, MenuItem, TextField, Box, LinearProgress, Menu, MenuItem as MobileMenuItem, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import { useColorScheme } from '../theme/ThemeProvider';
import TestRunner from './TestRunner'; // Import the TestRunner component
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Header({ filterType, setFilterType, filterStatus, setFilterStatus, searchQuery, setSearchQuery, setResults }) {
  const theme = useTheme();
  const { toggleMode } = useColorScheme();
  const [loading, setLoading] = useState(false); // State to track loading
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null); // State for mobile menu
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile view

  const handleRunTests = (results) => {
    setResults(results); // Pass results to the parent
    setLoading(false); // Hide the progress bar after results are set
  };

  const startLoading = () => {
    setLoading(true); // Show the progress bar
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
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
            {isMobile ? (
              <>
                {/* Mobile Menu Button */}
                <IconButton color="inherit" onClick={handleMobileMenuOpen}>
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={mobileMenuAnchor}
                  open={Boolean(mobileMenuAnchor)}
                  onClose={handleMobileMenuClose}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // Center items in the menu
                    padding: 2, // Add padding for better spacing
                  }}
                >
                  {/* Filters */}
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }} // Center the label
                  >
                    Filters
                  </Typography>

                  <MobileMenuItem disableGutters>
                    <FormControl size="small" sx={{ width: '100%', maxWidth: 250, mb: 2 }}>
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
                  </MobileMenuItem>
                  <MobileMenuItem disableGutters>
                    <FormControl size="small" sx={{ width: '100%', maxWidth: 250, mb: 2 }}>
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
                  </MobileMenuItem>
                  <MobileMenuItem disableGutters>
                    <TextField
                      label="Search"
                      variant="outlined"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      size="small"
                      sx={{ width: '100%', maxWidth: 250, mb: 2 }}
                    />
                  </MobileMenuItem>

                  {/* Actions */}
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 2, mb: 1, fontWeight: 'bold', textAlign: 'center' }} // Center the label
                  >
                    Actions
                  </Typography>
                  <MobileMenuItem disableGutters>
                    {/* Run Tests Button */}
                    <TestRunner
                      onResults={(results) => {
                        handleRunTests(results);
                      }}
                      onStart={startLoading} // Trigger loading when tests start
                    />
                  </MobileMenuItem>
                  <MobileMenuItem disableGutters>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: 250 }}>
                      <IconButton color="inherit" onClick={toggleMode}>
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                      </IconButton>
                    </Box>
                  </MobileMenuItem>
                </Menu>
              </>
            ) : (
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
                  fullWidth
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
            )}
          </Grid>
        </Grid>
      </Toolbar>

      {/* Linear Progress Bar */}
      {loading && <LinearProgress sx={{ width: '100%' }} />}
    </AppBar>
  );
}
