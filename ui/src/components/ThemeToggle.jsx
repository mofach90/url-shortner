import { IconButton }   from '@mui/material';
import Brightness4Icon  from '@mui/icons-material/Brightness4';
import Brightness7Icon  from '@mui/icons-material/Brightness7';
import useThemeStore    from '../store/themeStore';

export default function ThemeToggle() {
  const { mode, toggleMode } = useThemeStore();
  return (
    <IconButton onClick={toggleMode} color="inherit">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
