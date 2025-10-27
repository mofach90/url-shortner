import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Fade,
  IconButton,
  Link,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmDialog from '../../components/confirmationDialog.jsx';
import MyLinksTable from '../../components/MyLinksTable.jsx';
import { API_BASE_URL, fetchWithAuth } from '../../lib/fetchWithAuth.js';
import { createShortUrl, deleteLink, updateLink } from '../../lib/urlService.js';
import Bar from '../home/bar.jsx';
import EditLinkDialog from '../../components/EditLinkDialog.jsx';

async function handleFetchLinks() {
  try {
    const data = await fetchWithAuth(`${API_BASE_URL}/links/D42r1vV`);
    console.log('Fetched links:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

const DashboardPage = () => {
  const theme = useTheme();
  const [longUrl, setLongUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(false);
  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [activeView, setActiveView] = useState('shorten');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    code: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editDialog, setEditDialog] = useState({
    open: false,
    link: null,
  });
  const [editLoading, setEditLoading] = useState(false);

  function handleEditRequest(link) {
    setEditDialog({ open: true, link });
  }

  async function handleSaveEdit(newUrl) {
    setEditLoading(true);
    try {
      // TODO: call backend later
      console.log('Saving new URL:', newUrl);
      const updated = await updateLink(editDialog.link.code, newUrl);
      console.log('Update response:', updated);
      if (updated.ok) {
        setLinks((prev) =>
          prev.map((l) =>
            l.code === editDialog.link.code ? { ...l, longUrl: newUrl } : l,
          ),
        );
        showToast('Link updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update link', 'error');
    } finally {
      setEditLoading(false);
      setEditDialog({ open: false, link: null });
    }
  }

  function handleRequestDelete(code) {
    setDeleteDialog({ open: true, code });
  }

  async function confirmDelete() {
    const code = deleteDialog.code;
    setDeleteLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await deleteLink(code);
      showToast('Link deleted successfully', 'success');
      setLinks((prev) => prev.filter((l) => l.code !== code));
    } catch (err) {
      showToast(err.message || 'Failed to delete link', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteDialog({ open: false, code: null });
    }
  }

  useEffect(() => {
    async function loadLinks() {
      try {
        const data = await fetchWithAuth(`${API_BASE_URL}/links`);
        setLinks(data.links || []);
      } catch (err) {
        console.error('Failed to load links:', err);
      } finally {
        setLoadingLinks(false);
      }
    }
    loadLinks();
  }, [activeView]);

  const showToast = (message, severity = 'info') =>
    setToast({ open: true, message, severity });

  const handleShorten = async () => {
    if (!longUrl.trim()) {
      showToast('Please enter a valid URL', 'warning');
      return;
    }
    setResult(null);
    setLoading(true);
    setCopied(false);
    try {
      const data = await createShortUrl(longUrl);
      setResult(data);
      showToast('Short URL created successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && longUrl && !loading) {
      handleShorten();
    }
  };

  const features = [
    { icon: <SpeedIcon />, text: 'Lightning Fast' },
    { icon: <SecurityIcon />, text: 'Secure & Reliable' },
    { icon: <TrendingUpIcon />, text: 'Track Analytics' },
  ];

  return (
    <Box
      display='flex'
      flexDirection='column'
      sx={{
        minHeight: '100vh',
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(
                theme.palette.primary.dark,
                0.2,
              )} 0%, ${alpha(theme.palette.secondary.dark, 0.2)} 100%)`
            : `linear-gradient(135deg, ${alpha(
                theme.palette.primary.light,
                0.1,
              )} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
      }}
    >
      <Bar />

      <Container
        maxWidth='lg'
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: { xs: 4, sm: 6, md: 8 },
        }}
      >
        {/* Hero Section */}
        <Fade in timeout={600}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box
              sx={{
                'display': 'inline-flex',
                'alignItems': 'center',
                'justifyContent': 'center',
                'width': { xs: 70, sm: 90 },
                'height': { xs: 70, sm: 90 },
                'borderRadius': '50%',
                'background': `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                'boxShadow': `0 8px 32px ${alpha(
                  theme.palette.primary.main,
                  0.4,
                )}`,
                'mb': 3,
                'animation': 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
              }}
            >
              <LinkIcon sx={{ fontSize: { xs: 35, sm: 45 }, color: 'white' }} />
            </Box>

            <Typography
              variant='h2'
              sx={{
                fontWeight: 800,
                mb: 1.5,
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Shorten Your Links
            </Typography>

            <Typography
              variant='h6'
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
                mb: 4,
                fontSize: { xs: '1rem', sm: '1.15rem' },
              }}
            >
              Transform long URLs into short, shareable links with powerful
              analytics and tracking
            </Typography>

            {/* Feature Pills */}
            <Stack
              direction='row'
              spacing={2}
              justifyContent='center'
              flexWrap='wrap'
              gap={1.5}
            >
              {features.map((feature, idx) => (
                <Fade in timeout={800 + idx * 200} key={idx}>
                  <Paper
                    elevation={0}
                    sx={{
                      px: 2.5,
                      py: 1,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.2,
                      )}`,
                    }}
                  >
                    <Box sx={{ color: 'primary.main', display: 'flex' }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant='body2'
                      fontWeight={600}
                      color='text.primary'
                    >
                      {feature.text}
                    </Typography>
                  </Paper>
                </Fade>
              ))}
            </Stack>
          </Box>
        </Fade>

        {activeView === 'shorten' && (
          <Fade in timeout={1000}>
            <Card
              elevation={theme.palette.mode === 'dark' ? 8 : 4}
              sx={{
                maxWidth: 700,
                mx: 'auto',
                width: '100%',
                borderRadius: 4,
                overflow: 'visible',
                background:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? `0 20px 60px ${alpha('#000', 0.5)}`
                    : `0 20px 60px ${alpha(theme.palette.primary.main, 0.15)}`,
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                <Stack spacing={3}>
                  {/* Input Section */}
                  <Box>
                    <TextField
                      label='Enter your long URL'
                      variant='outlined'
                      fullWidth
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      disabled={loading}
                      placeholder='https://example.com/very/long/url/that/needs/shortening'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          'borderRadius': 2.5,
                          'fontSize': '1.05rem',
                          'transition': 'all 0.3s ease',
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 2,
                          },
                          '&.Mui-focused fieldset': {
                            borderWidth: 2,
                            boxShadow: `0 0 0 4px ${alpha(
                              theme.palette.primary.main,
                              0.1,
                            )}`,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          fontWeight: 600,
                        },
                      }}
                      InputProps={{
                        endAdornment: focused && (
                          <Fade in>
                            <Typography
                              variant='caption'
                              sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                mr: 1,
                              }}
                            >
                              Press Enter ↵
                            </Typography>
                          </Fade>
                        ),
                      }}
                    />
                  </Box>

                  {/* Action Button */}
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleShorten}
                    disabled={loading || !longUrl.trim()}
                    size='large'
                    fullWidth
                    startIcon={loading ? null : <AutoAwesomeIcon />}
                    sx={{
                      'py': 1.75,
                      'fontSize': '1.1rem',
                      'fontWeight': 700,
                      'textTransform': 'none',
                      'borderRadius': 2.5,
                      'background': `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      'boxShadow': `0 8px 24px ${alpha(
                        theme.palette.primary.main,
                        0.4,
                      )}`,
                      'position': 'relative',
                      'overflow': 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(90deg, transparent, ${alpha(
                          '#fff',
                          0.3,
                        )}, transparent)`,
                        transition: 'left 0.5s',
                      },
                      '&:hover': {
                        'boxShadow': `0 12px 32px ${alpha(
                          theme.palette.primary.main,
                          0.5,
                        )}`,
                        'transform': 'translateY(-2px)',
                        '&::before': {
                          left: '100%',
                        },
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      '&:disabled': {
                        background: theme.palette.action.disabledBackground,
                        boxShadow: 'none',
                      },
                      'transition': 'all 0.3s ease',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={26} sx={{ color: 'white' }} />
                    ) : (
                      'Shorten URL'
                    )}
                  </Button>

                  {/* Result Section */}
                  {result && (
                    <Fade in timeout={500}>
                      <Paper
                        elevation={0}
                        sx={{
                          'p': 3,
                          'borderRadius': 3,
                          'background':
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.success.dark, 0.15)
                              : alpha(theme.palette.success.light, 0.1),
                          'border': `2px solid ${alpha(
                            theme.palette.success.main,
                            0.3,
                          )}`,
                          'position': 'relative',
                          'overflow': 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                          },
                        }}
                      >
                        <Stack spacing={2.5}>
                          {/* Success Header */}
                          <Stack
                            direction='row'
                            alignItems='center'
                            spacing={1.5}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                backgroundColor: alpha(
                                  theme.palette.success.main,
                                  0.2,
                                ),
                              }}
                            >
                              <CheckCircleIcon
                                sx={{
                                  color: 'success.main',
                                  fontSize: 22,
                                }}
                              />
                            </Box>
                            <Typography
                              variant='h6'
                              fontWeight={700}
                              color='text.primary'
                            >
                              Your Short URL is Ready!
                            </Typography>
                          </Stack>

                          <Divider sx={{ opacity: 0.6 }} />

                          {/* URL Display */}
                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: 2,
                              backgroundColor:
                                theme.palette.mode === 'dark'
                                  ? alpha('#000', 0.2)
                                  : alpha('#fff', 0.6),
                              border: `1px solid ${alpha(
                                theme.palette.divider,
                                0.2,
                              )}`,
                            }}
                          >
                            <Stack
                              direction='row'
                              alignItems='center'
                              spacing={2}
                              flexWrap='wrap'
                            >
                              <Link
                                href={result.shortUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                sx={{
                                  'flex': 1,
                                  'minWidth': 200,
                                  'fontSize': '1.15rem',
                                  'fontWeight': 600,
                                  'color': 'primary.main',
                                  'textDecoration': 'none',
                                  'wordBreak': 'break-all',
                                  'transition': 'all 0.2s ease',
                                  '&:hover': {
                                    color: 'secondary.main',
                                    textDecoration: 'underline',
                                  },
                                }}
                              >
                                {result.shortUrl}
                              </Link>
                              <Tooltip
                                title={copied ? 'Copied!' : 'Copy to clipboard'}
                                arrow
                              >
                                <IconButton
                                  onClick={() => handleCopy(result.shortUrl)}
                                  sx={{
                                    'backgroundColor': copied
                                      ? alpha(theme.palette.success.main, 0.2)
                                      : alpha(theme.palette.primary.main, 0.1),
                                    'color': copied
                                      ? 'success.main'
                                      : 'primary.main',
                                    'transition': 'all 0.3s ease',
                                    '&:hover': {
                                      backgroundColor: copied
                                        ? alpha(theme.palette.success.main, 0.3)
                                        : alpha(
                                            theme.palette.primary.main,
                                            0.2,
                                          ),
                                      transform: 'scale(1.1)',
                                    },
                                  }}
                                >
                                  {copied ? (
                                    <CheckCircleIcon />
                                  ) : (
                                    <ContentCopyIcon />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Box>

                          {/* Info Text */}
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{ textAlign: 'center', fontStyle: 'italic' }}
                          >
                            Click the link to test it or copy to share anywhere
                          </Typography>
                        </Stack>
                      </Paper>
                    </Fade>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Fade>
        )}

        {activeView === 'list' && (
          <Fade in timeout={400}>
            <Box>
              <MyLinksTable
                links={links}
                loading={loadingLinks}
                onEdit={handleEditRequest}
                onDelete={handleRequestDelete}
              />
            </Box>
          </Fade>
        )}

        <Box display='flex' justifyContent='center' mt={4} mb={2} gap={2}>
          <Button
            variant={activeView === 'shorten' ? 'contained' : 'outlined'}
            onClick={() => setActiveView('shorten')}
          >
            Shorten URL
          </Button>
          <Button
            variant={activeView === 'list' ? 'contained' : 'outlined'}
            onClick={() => setActiveView('list')}
          >
            My Links
          </Button>
        </Box>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant='filled'
          elevation={6}
          sx={{
            width: '100%',
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <Button
        variant='outlined'
        sx={{ mb: '10rem' }}
        onClick={handleFetchLinks}
      >
        Test Fetch Links
      </Button>
      <ConfirmDialog
        open={deleteDialog.open}
        title='Delete Link'
        message='Are you sure you want to delete this shortened URL? This action cannot be undone.'
        onCancel={() => setDeleteDialog({ open: false, code: null })}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
      <EditLinkDialog
        open={editDialog.open}
        link={editDialog.link}
        onClose={() => setEditDialog({ open: false, link: null })}
        onSave={handleSaveEdit}
        loading={editLoading}
      />
    </Box>
  );
};

export default DashboardPage;
