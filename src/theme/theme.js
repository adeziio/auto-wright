import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // Light mode palette
        background: {
          default: '#f5f5f5', // Light gray background
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
});

export const lightTheme = createTheme(getDesignTokens('light'));
export const darkTheme = createTheme(getDesignTokens('dark'));