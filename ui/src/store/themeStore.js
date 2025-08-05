import { create } from 'zustand';


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
const useThemeStore = create((set) => ({
  mode: getInitialMode(),          // 'light' or 'dark'
  setMode: (m) => {
    localStorage.setItem(STORAGE_KEY, m);
    set({ mode: m });
  },
  toggleMode: () => set((s) => {
    const next = s.mode === 'light' ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, next);
    return { mode: next };
  }),
}));

export default useThemeStore;