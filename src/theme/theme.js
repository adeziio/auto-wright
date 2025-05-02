import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // Light mode palette
        background: {
          default: '#F8F9FB', // Light gray background
          paper: '#ffffff',  // White for cards and paper components
        },
        text: {
          primary: '#000000', // Black text
          secondary: '#555555', // Gray text
        },
      }
      : {
        // Dark mode palette
        background: {
          default: '#121212', // Dark gray background
          paper: '#1e1e1e',  // Slightly lighter gray for cards and paper
        },
        text: {
          primary: '#ffffff', // White text
          secondary: '#aaaaaa', // Light gray text
        },
      }),
  },
  statusColors: {
    pass: {
      background: 'rgba(75, 192, 192, 0.6)', // Green for pass
      hover: 'rgba(75, 192, 192, 0.8)', // Darker green on hover
    },
    fail: {
      background: 'rgba(255, 99, 132, 0.6)', // Red for fail
      hover: 'rgba(255, 99, 132, 0.8)', // Darker red on hover
    },
  },
});

export const lightTheme = createTheme(getDesignTokens('light'));
export const darkTheme = createTheme(getDesignTokens('dark'));