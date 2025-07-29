import { Grid, Typography } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './pages/home/home.jsx';
import Page from './pages/page/page.jsx';
import { Container } from '@mui/material';

const Row = ({ children }) => (
  <Container            /* gives you centered, responsive width */
    maxWidth="lg"       
    disableGutters      /* no extra side padding since you’re inside Page */
    sx={{ px: { xs: 2, sm: 3 } }}  /* optional interior breathing room */
  >
    {children}
  </Container>
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
