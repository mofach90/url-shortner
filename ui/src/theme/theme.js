import { createTheme } from '@mui/material/styles';

// Shared options (fonts, borderRadius, etc.)
const base = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
};

export const themes = {
  light: createTheme({
    ...base,
    palette: { mode: 'light' },
  }),

  dark: createTheme({
    ...base,
    palette: { mode: 'dark' },
  }),
};
