import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './firabaseInit.js';
import './index.css';
import ThemeWrapper  from './theme/themeWrapper.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeWrapper>
      <App />
    </ThemeWrapper>
  </StrictMode>,
);
