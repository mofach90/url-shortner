import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function AnalyticsDialog({ open, onClose, data, link }) {
  if (!data) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
        <DialogContent sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress />
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>
        Analytics for <b>{link?.code}</b>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ minHeight: 350 }}>
        <Typography variant='h6' gutterBottom>
          Total Clicks: {data.total}
        </Typography>

        {chartData.length > 0 ? (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='day'
                  tickFormatter={(d) => new Date(d).toLocaleDateString()} 
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='count'
                  stroke='#1976d2'
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Typography color='text.secondary' sx={{ mt: 4 }}>
            No clicks recorded yet.
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant='subtitle1' gutterBottom>
          Recent Clicks
        </Typography>
        {data.clicks.slice(0, 5).map((c) => (
          <Typography
            key={c.id}
            variant='body2'
            sx={{ mb: 0.5, color: 'text.secondary' }}
          >
            {new Date(c.timestamp).toLocaleString()} —{' '}
            {c.userAgent?.slice(0, 60)}...
          </Typography>
        ))}
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ display: 'block', mb: 1 }}
        >
          Live updating every 5s
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default AnalyticsDialog;
