import { Container, Typography } from '@mui/material';
import Home from './home/home.jsx';
import Page from './page/page.jsx';

const Row = ({ children }) => (
  <Container /* gives you centered, responsive width */
    maxWidth='lg'
    disableGutters /* no extra side padding since you’re inside Page */
    sx={{ px: { xs: 2, sm: 3 } }} /* optional interior breathing room */
  >
    {children}
  </Container>
);

function LandingPage() {
  return (
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
  );
}

export default LandingPage;
