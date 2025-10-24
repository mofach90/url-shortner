import {
  Box,
  CircularProgress,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function MyLinksTable({ links, loading }) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!links.length) {
    return (
      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ mt: 4 }}
      >
        You haven’t shortened any links yet.
      </Typography>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ mt: 4, borderRadius: 3, overflow: "hidden" }}
      elevation={3}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Short URL</b></TableCell>
            <TableCell><b>Original URL</b></TableCell>
            <TableCell align="center"><b>Clicks</b></TableCell>
            <TableCell align="center"><b>Created</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell>
                <Link
                  href={link.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  {link.shortUrl}
                </Link>
              </TableCell>
              <TableCell
                sx={{
                  maxWidth: 300,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {link.longUrl}
                </Typography>
              </TableCell>
              <TableCell align="center">{link.clicks ?? 0}</TableCell>
              <TableCell align="center">
                {link.createdAt?.seconds
                  ? new Date(link.createdAt.seconds * 1000).toLocaleDateString()
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MyLinksTable;
