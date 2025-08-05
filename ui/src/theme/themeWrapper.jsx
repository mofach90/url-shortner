import { CssBaseline, ThemeProvider } from '@mui/material';
import useThemeStore from '../store/themeStore.js';
import { themes } from './theme.js';

const ThemeWrapper = ({ children }) => {
  const mode = useThemeStore((s) => s.mode);
  return (
    <ThemeProvider theme={themes[mode]}>
      <CssBaseline /> {/* resets body background & typography */}
      {children}
    </ThemeProvider>
  );
}
export default ThemeWrapper;
