import {
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

function MyLinksTable({ links, loading, onDelete }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLinks = links.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link.shortUrl?.toLowerCase().includes(query) ||
      link.longUrl?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!links.length) {
    return (
      <Typography
        variant='body1'
        color='text.secondary'
        align='center'
        sx={{ mt: 4 }}
      >
        You haven't shortened any links yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Search Field */}
      <TextField
        fullWidth
        variant='outlined'
        placeholder='Search by short URL or original URL...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          'mb': 2,
          '& .MuiOutlinedInput-root': {
            'borderRadius': 3,
            'boxShadow': '0 2px 8px rgba(0,0,0,0.1)',
            '& fieldset': {
              borderColor: '#FFD700',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: '#FFC700',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFD700',
              borderWidth: 2,
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.7)',
            },
          },
        }}
      />

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, overflow: 'hidden' }}
        elevation={3}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Short URL</b>
              </TableCell>
              <TableCell>
                <b>Original URL</b>
              </TableCell>
              <TableCell align='center'>
                <b>Clicks</b>
              </TableCell>
              <TableCell align='center'>
                <b>Created</b>
              </TableCell>
              <TableCell align='center'>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredLinks.length > 0 ? (
              filteredLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <Link
                      href={link.shortUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      underline='hover'
                    >
                      {link.shortUrl}
                    </Link>
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 300,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Typography variant='body2' color='text.secondary'>
                      {link.longUrl}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>{link.clicks ?? 0}</TableCell>
                  <TableCell align='center'>
                    {link.createdAt?.seconds
                      ? new Date(
                          link.createdAt.seconds * 1000,
                        ).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell align='center'>
                    <Button
                      variant='outlined'
                      color='error'
                      size='small'
                      onClick={() => onDelete(link.code)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ py: 2 }}
                  >
                    No links match your search.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MyLinksTable;
