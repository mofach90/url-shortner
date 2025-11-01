import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import DevicesIcon from '@mui/icons-material/Devices';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function AnalyticsDialog({ open, onClose, data, link }) {
  const theme = useTheme();

  if (!data) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth='md'
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.05,
            )} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          },
        }}
      >
        <DialogContent sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={48} />
          <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
            Loading analytics...
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  const counts = data.clicks.reduce((acc, c) => {
    if (!c.timestamp) return acc;
    const day = new Date(c.timestamp).toISOString().slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(counts)
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));

  // Calculate some stats
  const avgClicksPerDay =
    chartData.length > 0 ? (data.total / chartData.length).toFixed(1) : 0;

  const peakDay =
    chartData.length > 0
      ? chartData.reduce(
          (max, curr) => (curr.count > max.count ? curr : max),
          chartData[0],
        )
      : null;

  const recentClicks = data.clicks.slice(0, 5);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      Paper={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.85,
          )} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          position: 'relative',
        }}
      >
        <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1 }}>
          <TrendingUpIcon color='primary' />
          <Typography variant='h5' fontWeight={600}>
            Analytics Dashboard
          </Typography>
        </Stack>
        <Stack direction='row' alignItems='center' spacing={1}>
          <Typography variant='body2' color='text.secondary'>
            Short link:
          </Typography>
          <Chip
            label={link?.code}
            size='small'
            color='primary'
            variant='outlined'
            sx={{ fontWeight: 600, fontFamily: 'monospace' }}
          />
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{
            'position': 'absolute',
            'right': 12,
            'top': 12,
            'bgcolor': alpha(theme.palette.background.paper, 0.8),
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: 'error.main',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {/* Stats Cards */}
        <Stack direction='row' spacing={2} sx={{ mb: 3 }}>
          <Card
            sx={{
              flex: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Total Clicks
              </Typography>
              <Typography variant='h3' fontWeight={700} color='primary'>
                {data.total}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              bgcolor: alpha(theme.palette.success.main, 0.08),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Avg. Per Day
              </Typography>
              <Typography variant='h3' fontWeight={700} color='success.main'>
                {avgClicksPerDay}
              </Typography>
            </CardContent>
          </Card>

          {peakDay && (
            <Card
              sx={{
                flex: 1,
                bgcolor: alpha(theme.palette.warning.main, 0.08),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              }}
            >
              <CardContent>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Peak Day
                </Typography>
                <Typography variant='h3' fontWeight={700} color='warning.main'>
                  {peakDay.count}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {new Date(peakDay.day).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Stack>

        {/* Chart Section */}
        <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <CardContent>
            <Typography variant='h6' gutterBottom fontWeight={600}>
              Click Trend
            </Typography>
            {chartData.length > 0 ? (
              <Box sx={{ width: '100%', height: 280, mt: 2 }}>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id='colorCount'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset='95%'
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke={alpha(theme.palette.divider, 0.5)}
                    />
                    <XAxis
                      dataKey='day'
                      tickFormatter={(d) =>
                        new Date(d).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      }
                      stroke={theme.palette.text.secondary}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      allowDecimals={false}
                      stroke={theme.palette.text.secondary}
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '8px',
                        boxShadow: theme.shadows[4],
                      }}
                      labelFormatter={(d) =>
                        new Date(d).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })
                      }
                    />
                    <Area
                      type='monotone'
                      dataKey='count'
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      fill='url(#colorCount)'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  bgcolor: alpha(theme.palette.action.hover, 0.3),
                  borderRadius: 2,
                  mt: 2,
                }}
              >
                <TrendingUpIcon
                  sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}
                />
                <Typography color='text.secondary'>
                  No clicks recorded yet. Share your link to start tracking!
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Stack
              direction='row'
              alignItems='center'
              spacing={1}
              sx={{ mb: 2 }}
            >
              <AccessTimeIcon fontSize='small' color='action' />
              <Typography variant='h6' fontWeight={600}>
                Recent Activity
              </Typography>
              <Chip
                label='Live'
                size='small'
                color='success'
                sx={{
                  'ml': 'auto',
                  'height': 20,
                  'fontSize': '0.7rem',
                  'animation': 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.6 },
                  },
                }}
              />
            </Stack>

            {recentClicks.length > 0 ? (
              <Stack spacing={1.5}>
                {recentClicks.map((c) => (
                  <Box
                    key={c.id}
                    sx={{
                      'p': 2,
                      'bgcolor': alpha(theme.palette.action.hover, 0.3),
                      'borderRadius': 1.5,
                      'borderLeft': `3px solid ${theme.palette.primary.main}`,
                      'transition': 'all 0.2s',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.action.hover, 0.5),
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Stack
                      direction='row'
                      alignItems='center'
                      spacing={1}
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant='body2' fontWeight={600}>
                        {new Date(c.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: 'text.disabled',
                        }}
                      />
                      <Typography variant='caption' color='text.secondary'>
                        {Math.floor(
                          (Date.now() - new Date(c.timestamp)) / 60000,
                        )}
                        m ago
                      </Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={0.5}>
                      <DevicesIcon
                        sx={{ fontSize: 14, color: 'text.secondary' }}
                      />
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.userAgent?.slice(0, 80)}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ textAlign: 'center', py: 3 }}
              >
                No recent activity
              </Typography>
            )}

            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ display: 'block', mt: 2, textAlign: 'center' }}
            >
              Updates automatically every 5 seconds
            </Typography>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
export default AnalyticsDialog;
