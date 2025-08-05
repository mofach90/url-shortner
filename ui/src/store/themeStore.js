const STORAGE_KEY = 'color-mode';

const getInitialMode = () => {
  // 1) check localStorage
  const storedMode = localStorage.getItem(STORAGE_KEY);
  // 2) else check window.matchMedia('(prefers-color-scheme: dark)')
  if (storedMode) {
    return storedMode;
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  // 3) default to 'light'
  return 'light';
};
