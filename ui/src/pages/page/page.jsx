
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
    justifyContent='flex-start'
    alignItems='flex-start'
    {...containerProps}
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

    <Grid item xs={12}>
      {isLoading}
      <Box hidden={isLoading}>{children}</Box>
    </Grid>
  </Grid>
);

export { Page as default };
