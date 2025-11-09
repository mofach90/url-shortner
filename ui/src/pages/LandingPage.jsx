import { Container, Typography, Box } from '@mui/material';
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
        <Row sx={{ width: '100%', height: '100%' }}>
          <Box
            sx={{
              'width': '100%',
              'height': 350,
              'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              'borderRadius': 4,
              'p': { xs: 4, sm: 6 },
              'textAlign': 'center',
              'boxShadow': '0 10px 40px rgba(102, 126, 234, 0.3)',
              'position': 'relative',
              'overflow': 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb)',
                borderRadius: 4,
                zIndex: -1,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::before': {
                opacity: 1,
              },
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.3s ease',
              },
            }}
          >
            <Typography
              variant='h3'
              gutterBottom
              sx={{
                color: 'white',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              GDG Url Shortener
            </Typography>
            <Typography
              variant='body1'
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.1rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Google Developer Group
            </Typography>
          </Box>
        </Row>
      </Page>
    </Home>
  );
}

export default LandingPage;
