"use client"
import { useEffect, useState } from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Paper, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Brightness4, Brightness7 } from '@mui/icons-material';

export default function Home() {
  const [mode, setMode] = useState('light');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('themeMode');
    if (stored) setMode(stored);
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  const runTests = async () => {
    setLoading(true);
    const res = await fetch('/api/run-test', { method: 'POST' });
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Auto-Wright Dashboard
          </Typography>
          <IconButton color="inherit" onClick={toggleMode}>
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Run Tests</Typography>
          <Button variant="contained" onClick={runTests} disabled={loading}>
            {loading ? 'Running...' : 'Run Tests'}
          </Button>
        </Paper>

        {results.length > 0 && (
          <Paper sx={{ mt: 4, p: 3 }}>
            <Typography variant="h6" gutterBottom>Results</Typography>
            <List>
              {results.map((r, i) => (
                <ListItem key={i} sx={{ bgcolor: r.pass ? 'success.light' : 'error.light', mb: 1 }}>
                  <ListItemText
                    primary={`${r.test} — ${r.pass ? '✅ Passed' : '❌ Failed'}`}
                    secondary={`Expected: ${r.expected} | Actual: ${r.actual}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
}
