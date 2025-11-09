import { Box, Grid } from '@mui/material';
import PageHeader from './page-header.jsx';

const Page = ({
  children,
  containerProps,
  title,
  description,
  isLoading = false,
  Icon,
}) => (
  <Grid
    container
    alignItems='flex-start'
    {...containerProps}
    sx={{ flexGrow: 1, width: '100%', m: 0 }}
  >
    {(title || description) && (
      <Grid item xs={12}>
        {Icon && (
          <Box mr={2} sx={{ display: 'inline-block' }}>
            <Icon />
          </Box>
        )}
        <PageHeader title={title} description={description} />
      </Grid>
    )}

    <Grid sx={{height:'100%', width:'100%'}} item xs={12}>
      {isLoading}
      <Box hidden={isLoading} sx={{height:'100%', width:'100%'}}>{children}</Box>
    </Grid>
  </Grid>
);

export { Page as default };
