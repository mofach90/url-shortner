import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './pages/home/home.jsx';

function App() {
  return (
    <BrowserRouter>
      <Home appName={'URL Shortner'} showRegisterBtn={true}>
        <h1>Welcome to the URL Shortner App</h1>
        <p>Shorten your URLs easily and quickly!</p>
        <p>Explore the features and enjoy the simplicity of URL shortening.</p>
        <p>Get started by registering or logging in.</p>  
      </Home>
    </BrowserRouter>
  );
}

export default App;
