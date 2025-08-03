import { BrowserRouter } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );
}

export default App;
