import { Box } from '@mui/material';
import Bar from './bar.jsx';


const DashboardPage = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      sx={{ minHeight: '100vh', width: '100%' }}
    >
      {/* Header */}
      <Box component='header' sx={{ width: '100%' }}>
        <Bar  />
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
      </Box>

    </Box>
  );
}

export default DashboardPage;
