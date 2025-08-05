// src/theme/ThemeWrapper.jsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import { themes }          from './themes';
import useThemeStore       from '../store/themeStore.js';

export default function ThemeWrapper({ children }) {
  const mode = useThemeStore((s) => s.mode);
  return (
    <ThemeProvider theme={themes[mode]}>
      <CssBaseline />   {/* resets body background & typography */}
      {children}
    </ThemeProvider>
  );
}
