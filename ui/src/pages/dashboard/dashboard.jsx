import { useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress, Link } from "@mui/material";
import Bar from "../home/bar.jsx";
import { createShortUrl } from "../../lib/urlService.js";

const DashboardPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleShorten = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await createShortUrl(longUrl);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" sx={{ minHeight: "100vh", width: "100%" }}>
      <Box component="header" sx={{ width: "100%" }}>
        <Bar />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" gutterBottom>
          Shorten your URL
        </Typography>

        <Box display="flex" gap={2} alignItems="center" sx={{ mt: 2, mb: 2 }}>
          <TextField
            label="Enter a long URL"
            variant="outlined"
            fullWidth
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleShorten}
            disabled={loading || !longUrl}
          >
            {loading ? <CircularProgress size={24} /> : "Shorten"}
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        {result && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">✅ Short URL created:</Typography>
            <Link href={result.shortUrl} target="_blank" rel="noopener">
              {result.shortUrl}
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;





/*import { Box, Button } from '@mui/material';
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

export default DashboardPage; */
