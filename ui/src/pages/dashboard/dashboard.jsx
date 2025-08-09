import { Box, Button } from '@mui/material';
import Bar from '../home/bar.jsx';
import { fetchWithAuth } from '../../lib/apiClient.js';

const DashboardPage = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      sx={{ minHeight: '100vh', width: '100%' }}
    >
      {/* Header */}
      <Box component='header' sx={{ width: '100%' }}>
        <Bar />
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
      ></Box>
      <Button variant='contained'
        onClick={async () => {
          const res = await fetchWithAuth('/api/ping-secure');
          if (!res.ok) {
            const error = await res.json();
            console.error('Error:', error);
            return;
          }
          const data = await res.json();
          console.log('Response:', data);
        }}
      >Test api</Button>
    </Box>
  );
};

export default DashboardPage;
