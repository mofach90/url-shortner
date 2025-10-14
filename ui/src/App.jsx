import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage.jsx';
import DashboardPage from './pages/dashboard/dashboard.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx'; 

function App() {
  return (
    <BrowserRouter>
      {/* <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route
          path='/dashboard'
          element={<ProtectedRoute element={<DashboardPage />} />} 
        />
      </Routes> */}
    </BrowserRouter>
  );
}

export default App;
