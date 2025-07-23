import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './pages/home/home.jsx';

function App() {
  return (
    <BrowserRouter>
      <Home appName={'URL Shortner'} showRegisterBtn={true} />z
    </BrowserRouter>
  );
}

export default App;
