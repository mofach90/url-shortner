import { Grid, Typography } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './pages/home/home.jsx';
import Page from './pages/page/page.jsx';

const Row = ({ children }) => (
  <Grid container spacing={1} justifyContent='center'>
    <Grid item xs={12} md={10} lg={8}>
      {children}
    </Grid>
  </Grid>
);

function App() {
  return (
    <BrowserRouter>
        <Home appName={'URL Shortner'}>
          <Page>
            <Row>
              <Typography variant='h3' gutterBottom>
                GDG Url Shortner
              </Typography>
              <Typography variant='body1' gutterBottom>
                Google Developer Group
              </Typography>
            </Row>
          </Page>
        </Home>
    </BrowserRouter>
  );
}

export default App;
