import { Refresh } from '@mui/icons-material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Link2,
  MousePointerClick,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchAiSummary, fetchAnalyticsSummary } from '../lib/urlService.js';

export default function AnalyticsOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');
  const theme = useTheme();
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const handleAccordionChange = async (event, isExpanded) => {
    setAccordionOpen(isExpanded);

    if (isExpanded && !aiSummary) {
      setLoadingSummary(true);
      setSummaryError(null);
      try {
        const summary = await fetchAiSummary();
        setAiSummary(summary);
      } catch (err) {
        console.error('AI Summary fetch failed:', err);
        setSummaryError('Failed to generate summary. Please try again.');
      } finally {
        setLoadingSummary(false);
      }
    }
  };

  async function loadData() {
    try {
      const result = await fetchAnalyticsSummary();
      setData(result);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        py={10}
      >
        <Box position='relative'>
          <CircularProgress size={60} thickness={4} />
        </Box>
        <Typography
          variant='body1'
          color='text.secondary'
          mt={3}
          fontWeight={500}
        >
          Loading analytics...
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box textAlign='center' py={10}>
        <Activity
          size={64}
          style={{ color: theme.palette.text.disabled, margin: '0 auto 16px' }}
        />
        <Typography variant='h6' color='text.secondary' gutterBottom>
          No analytics data available yet.
        </Typography>
        <Typography variant='body2' color='text.disabled' mt={1}>
          Create some short links to start tracking!
        </Typography>
      </Box>
    );
  }

  // Calculate additional metrics
  const avgClicksPerLink =
    data.totalLinks > 0 ? (data.totalClicks / data.totalLinks).toFixed(1) : 0;

  // Calculate trend
  const recentDays = data.clicksPerDay.slice(-7);
  const olderDays = data.clicksPerDay.slice(-14, -7);
  const recentTotal = recentDays.reduce((sum, d) => sum + d.count, 0);
  const olderTotal = olderDays.reduce((sum, d) => sum + d.count, 0);
  const trendPercentage =
    olderTotal > 0
      ? (((recentTotal - olderTotal) / olderTotal) * 100).toFixed(1)
      : 0;
  const isPositiveTrend = trendPercentage >= 0;

  // Calculate best performing day
  const bestDay =
    data.clicksPerDay.length > 0
      ? data.clicksPerDay.reduce(
          (max, curr) => (curr.count > max.count ? curr : max),
          data.clicksPerDay[0],
        )
      : null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={4} sx={{ p: 2 }}>
          <Typography variant='body2' fontWeight={600} gutterBottom>
            {new Date(payload[0].payload.day).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Typography>
          <Typography variant='h6' color='primary' fontWeight={700}>
            {payload[0].value} clicks
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ maxWidth: 2500, p: 5 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant='h4' fontWeight={700} gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Monitor your link performance and engagement metrics
        </Typography>
      </Box>

      {/* Main Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {/* Total Links */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              'color': 'white',
              'transition': 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='flex-start'
                mb={2}
              >
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Link2 size={24} />
                </Box>
                <Box textAlign='right'>
                  <Typography
                    variant='body2'
                    sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 0.5 }}
                  >
                    Total Links
                  </Typography>
                  <Typography variant='h3' fontWeight={700}>
                    {data.totalLinks}
                  </Typography>
                </Box>
              </Stack>
              <Stack
                direction='row'
                alignItems='center'
                spacing={1}
                sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                <Activity size={16} />
                <Typography variant='body2'>Active short links</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Clicks */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              'background': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              'color': 'white',
              'transition': 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='flex-start'
                mb={2}
              >
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <MousePointerClick size={24} />
                </Box>
                <Box textAlign='right'>
                  <Typography
                    variant='body2'
                    sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 0.5 }}
                  >
                    Total Clicks
                  </Typography>
                  <Typography variant='h3' fontWeight={700}>
                    {data.totalClicks.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
              <Stack
                direction='row'
                alignItems='center'
                spacing={1}
                sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                <Chip
                  icon={
                    isPositiveTrend ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )
                  }
                  label={`${Math.abs(trendPercentage)}%`}
                  size='small'
                  sx={{
                    bgcolor: isPositiveTrend
                      ? 'rgba(76, 175, 80, 0.3)'
                      : 'rgba(244, 67, 54, 0.3)',
                    color: 'white',
                    fontWeight: 700,
                    height: 24,
                  }}
                />
                <Typography variant='body2'>vs last week</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Clicks */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              'background': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              'color': 'white',
              'transition': 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='flex-start'
                mb={2}
              >
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Target size={24} />
                </Box>
                <Box textAlign='right'>
                  <Typography
                    variant='body2'
                    sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 0.5 }}
                  >
                    Avg per Link
                  </Typography>
                  <Typography variant='h3' fontWeight={700}>
                    {avgClicksPerLink}
                  </Typography>
                </Box>
              </Stack>
              <Stack
                direction='row'
                alignItems='center'
                spacing={1}
                sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                <TrendingUp size={16} />
                <Typography variant='body2'>Click rate</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Most Clicked */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              'background': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              'color': 'white',
              'transition': 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
              'width': '200px',
            }}
          >
            <CardContent>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='flex-start'
                mb={2}
              >
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <BarChart3 size={24} />
                </Box>
                <Box textAlign='right'>
                  <Typography
                    variant='body2'
                    sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 0.5 }}
                  >
                    Top Link
                  </Typography>
                  <Typography variant='h3' fontWeight={700}>
                    {data.mostClicked ? data.mostClicked.clicks : '—'}
                  </Typography>
                </Box>
              </Stack>

              {data.mostClicked ? (
                <Link
                  href={data.mostClicked.shortUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  sx={{
                    'display': 'flex',
                    'alignItems': 'center',
                    'gap': 1,
                    'color': 'rgba(255, 255, 255, 0.9)',
                    'textDecoration': 'none',
                    '&:hover': { color: 'white' },
                  }}
                >
                  <Typography
                    variant='body2'
                    fontFamily='monospace'
                    fontWeight={600}
                    noWrap
                  >
                    {data.mostClicked.code}
                  </Typography>
                  <ArrowUpRight size={16} />
                </Link>
              ) : (
                <Typography
                  variant='body2'
                  sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  No data yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Insights */}
      {bestDay && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction='row' spacing={2} alignItems='center' mb={3}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 2,
                    }}
                  >
                    <Calendar size={24} color={theme.palette.primary.main} />
                  </Box>
                  <Box>
                    <Typography variant='h6' fontWeight={600}>
                      Best Performing Day
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Highest engagement recorded
                    </Typography>
                  </Box>
                </Stack>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='flex-end'
                >
                  <Box>
                    <Typography variant='h3' fontWeight={700}>
                      {bestDay.count}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' mt={0.5}>
                      clicks
                    </Typography>
                  </Box>
                  <Box textAlign='right'>
                    <Typography variant='h6' color='primary' fontWeight={600}>
                      {new Date(bestDay.day).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {new Date(bestDay.day).toLocaleDateString('en-US', {
                        weekday: 'long',
                      })}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction='row' spacing={2} alignItems='center' mb={3}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      borderRadius: 2,
                    }}
                  >
                    <Activity size={24} color={theme.palette.secondary.main} />
                  </Box>
                  <Box>
                    <Typography variant='h6' fontWeight={600}>
                      Recent Activity
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Last 7 days performance
                    </Typography>
                  </Box>
                </Stack>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='flex-end'
                >
                  <Box>
                    <Typography variant='h3' fontWeight={700}>
                      {recentTotal}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' mt={0.5}>
                      total clicks
                    </Typography>
                  </Box>
                  <Chip
                    icon={
                      isPositiveTrend ? (
                        <ArrowUpRight size={20} />
                      ) : (
                        <ArrowDownRight size={20} />
                      )
                    }
                    label={`${Math.abs(trendPercentage)}%`}
                    color={isPositiveTrend ? 'success' : 'error'}
                    sx={{
                      height: 40,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      px: 1,
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Accordion expanded={accordionOpen} onChange={handleAccordionChange}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' fontWeight={600}>
            💡 AI-Generated Insights
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          {loadingSummary ? (
            <Box display='flex' alignItems='center' gap={1}>
              <CircularProgress size={20} />
              <Typography>Analyzing your data with Gemini…</Typography>
            </Box>
          ) : summaryError ? (
            <Typography color='error'>{summaryError}</Typography>
          ) : aiSummary ? (
            <Typography
              sx={{
                whiteSpace: 'pre-line',
                fontSize: '1rem',
                lineHeight: 1.6,
              }}
            >
              {aiSummary}
            </Typography>
          ) : (
            <Button
              variant='outlined'
              onClick={() => handleAccordionChange(null, true)}
            >
              Generate Summary
            </Button>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Chart Section */}
      <Card>
        <CardContent>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            mb={3}
            flexWrap='wrap'
            gap={2}
          >
            <Box>
              <Typography variant='h6' fontWeight={600} gutterBottom>
                Click Activity
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Track your daily engagement over time
              </Typography>
            </Box>
            <ButtonGroup variant='contained' size='small'>
              <Button
                onClick={() => setChartType('bar')}
                variant={chartType === 'bar' ? 'contained' : 'outlined'}
              >
                Bar
              </Button>
              <Button
                onClick={() => setChartType('line')}
                variant={chartType === 'line' ? 'contained' : 'outlined'}
              >
                Line
              </Button>
              <Button
                onClick={() => setChartType('area')}
                variant={chartType === 'area' ? 'contained' : 'outlined'}
              >
                Area
              </Button>
              <Button
                onClick={loadData}
                sx={{ ml: 2, backgroundColor: 'greenyellow' }}
                variant='contained'
                size='small'
                startIcon={<Refresh />}
              >
                Refresh
              </Button>
            </ButtonGroup>
          </Stack>

          {data.clicksPerDay.length ? (
            <Box sx={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width='100%' height='100%'>
                {chartType === 'bar' ? (
                  <BarChart data={data.clicksPerDay}>
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
                      stroke={theme.palette.text.secondary}
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey='count'
                      fill={theme.palette.primary.main}
                      radius={[8, 8, 0, 0]}
                      animationDuration={1000}
                    />
                  </BarChart>
                ) : chartType === 'line' ? (
                  <LineChart data={data.clicksPerDay}>
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
                      stroke={theme.palette.text.secondary}
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type='monotone'
                      dataKey='count'
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      dot={{ fill: theme.palette.primary.main, r: 5 }}
                      activeDot={{ r: 7 }}
                      animationDuration={1000}
                    />
                  </LineChart>
                ) : (
                  <AreaChart data={data.clicksPerDay}>
                    <defs>
                      <linearGradient
                        id='colorGradient'
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
                      stroke={theme.palette.text.secondary}
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type='monotone'
                      dataKey='count'
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      fill='url(#colorGradient)'
                      animationDuration={1000}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: alpha(theme.palette.action.hover, 0.3),
                borderRadius: 2,
              }}
            >
              <BarChart3
                size={64}
                style={{
                  color: theme.palette.text.disabled,
                  margin: '0 auto 16px',
                }}
              />
              <Typography
                variant='body1'
                color='text.secondary'
                fontWeight={500}
              >
                No click data available yet
              </Typography>
              <Typography variant='body2' color='text.disabled' mt={1}>
                Data will appear here once your links start getting clicks
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
