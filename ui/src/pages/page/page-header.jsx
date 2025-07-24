/* Copyright (c) 2022 CLOUDPILOTS Software & Consulting GmbH */

import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, description }) => (
  <Box sx={{ mb: 2, mt: 1, display: 'inline-block' }}>
    <Typography variant='h4'>{title}</Typography>
    <Typography variant='subtitle1'>{description}</Typography>
  </Box>
);

export { PageHeader as default };
