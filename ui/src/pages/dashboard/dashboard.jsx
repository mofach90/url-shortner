import { Box, Button } from '@mui/material';
import Bar from '../home/bar.jsx';
import useAuthStore from "../../store/authStore.js";

const DashboardPage = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      sx={{ minHeight: '100vh', width: '100%' }}
    >
      <Box component='header' sx={{ width: '100%' }}>
        <Bar />
      </Box>

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3, md: 4 },
        }}
      ></Box>
      <Button
        variant='contained'
        onClick={async () => {
          // const res = await fetchWithAuth('http://127.0.0.1:5001/mo-url-shortner/us-central1/api/ping-secure'); use this for local testing with emulator
          // const res = await fetchWithAuth('http://127.0.0.1:5001/mo-url-shortner/us-central1/api/ping-secure');
          const { idToken } = useAuthStore.getState();
          const res = await fetch("http://127.0.0.1:5001/mo-url-shortner/us-central1/api/shorten", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}` ,
            },
            body: JSON.stringify({ longUrl: "https://www.google.com" }),
          });
          if (!res.ok) {
            const error = await res.json();
            console.error('Error:', error);
            return;
          }
          const data = await res.json();
          console.log('Response:', data);
        }}
      >
        Test api
      </Button>
    </Box>
  );
};

export default DashboardPage;
