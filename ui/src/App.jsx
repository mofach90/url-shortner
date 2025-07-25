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
      {/* <div
        className='App'
        style={{ height: '100%', backgroundColor: '#2c9754ff' }}
      > */}
        <Home appName={'URL Shortner'} showRegisterBtn={true}>
          <Page>
            <Row>
              <Typography variant='h3' gutterBottom>
                Developer App
              </Typography>
              <Typography variant='body1' gutterBottom>
                hello world
              </Typography>
            </Row>
          </Page>
        </Home>
      {/* </div> */}
    </BrowserRouter>
  );
}

export default App;
