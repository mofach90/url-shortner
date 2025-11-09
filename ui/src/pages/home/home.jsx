import { Box, alpha, useTheme } from '@mui/material';
import Bar from './bar.jsx';
import Footer from './footer.jsx';

const Home = ({
  appName,
  barProps,
  children,
  company,
  links,
  showRegisterBtn,
}) => {
  const theme = useTheme();

  return (
    <Box
      display='flex'
      flexDirection='column'
      sx={{ minHeight: '100vh', width: '100%' }}
    >
      {/* Header */}
      <Box
        component='header'
        sx={{
          width: '100%',
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.55,
          )} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
        }}
      >
        <Bar name={appName} showRegisterBtn={showRegisterBtn} {...barProps} />
      </Box>

      {/* Main content: grows to fill the middle */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          width: '100%',
          // optional: add responsive padding
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <Box
        component='footer'
        sx={{
          width: '100%',

          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.55,
          )} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
        }}
      >
        <Footer links={links} company={company} />
      </Box>
    </Box>
  );
};

export default Home;
