import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LinkIcon from '@mui/icons-material/Link';
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { forwardRef, useEffect, useState } from 'react';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

function EditLinkDialog({ open, onClose, onSave, link, loading }) {
  const theme = useTheme();
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    setNewUrl(link?.longUrl || '');
  }, [link]);

  const handleSave = () => {
    if (newUrl.trim()) onSave(newUrl);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={loading ? undefined : onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.9)
              : theme.palette.background.paper,
          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 20px 60px ${alpha('#000', 0.5)}`
              : `0 20px 60px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1.5 }}>
        <Box display='flex' alignItems='center' gap={1}>
          <LinkIcon color='primary' />
          <Typography variant='h5' fontWeight={700}>
            Edit Shortened Link
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Update the destination URL for your shortened link below.
        </Typography>

        <TextField
          label='New destination URL'
          fullWidth
          variant='outlined'
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          disabled={loading}
          placeholder='https://example.com/updated-url'
          sx={{
            '& .MuiOutlinedInput-root': {
              'borderRadius': 2.5,
              '& fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.4),
              },
              '&:hover fieldset': { borderColor: theme.palette.primary.main },
              '&.Mui-focused fieldset': {
                borderWidth: 2,
                boxShadow: `0 0 0 4px ${alpha(
                  theme.palette.primary.main,
                  0.1,
                )}`,
              },
            },
          }}
        />

        {link && (
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mt: 2, fontStyle: 'italic' }}
          >
            Current short link:{' '}
            <Box
              component='span'
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                wordBreak: 'break-all',
              }}
            >
              {link.shortUrl}
            </Box>
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading} size='large'>
          Cancel
        </Button>
        <Button
          variant='contained'
          size='large'
          color='primary'
          onClick={handleSave}
          disabled={loading || !newUrl.trim()}
          startIcon={
            loading ? (
              <CircularProgress size={18} color='inherit' />
            ) : (
              <AutoAwesomeIcon />
            )
          }
          sx={{
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
          }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditLinkDialog;
