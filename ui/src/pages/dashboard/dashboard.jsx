import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Fade,
  IconButton,
  Link,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { createShortUrl } from "../../lib/urlService.js";
import Bar from "../home/bar.jsx";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const DashboardPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [copied, setCopied] = useState(false);

  const showToast = (message, severity = "info") =>
    setToast({ open: true, message, severity });

  const handleShorten = async () => {
    if (!longUrl.trim()) {
      showToast("Please enter a valid URL", "warning");
      return;
    }
    setResult(null);
    setLoading(true);
    try {
      const data = await createShortUrl(longUrl);
      setResult(data);
      showToast("Short URL created successfully!", "success");
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Box display="flex" flexDirection="column" sx={{ minHeight: "100vh" }}>
      <Bar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          px: { xs: 2, sm: 4 },
          py: { xs: 4, sm: 6 },
          backgroundColor: "background.default",
        }}
      >
        <Card
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 600,
            p: 3,
            borderRadius: 4,
          }}
        >
          <CardContent>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Shorten your link
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Paste a long URL below and get a short, shareable link instantly.
            </Typography>

            <Stack direction="row" spacing={2} mb={2}>
              <TextField
                label="Enter a long URL"
                variant="outlined"
                fullWidth
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                disabled={loading}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleShorten}
                disabled={loading || !longUrl}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : "Shorten"}
              </Button>
            </Stack>

            <Fade in={Boolean(result)}>
              <Box>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="subtitle1" fontWeight={500}>
                    Short URL:
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 1 }}
                >
                  <Link
                    href={result?.shortUrl}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    variant="h6"
                  >
                    {result?.shortUrl}
                  </Link>
                  <Tooltip title={copied ? "Copied!" : "Copy"}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleCopy(result.shortUrl)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Fade>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;
