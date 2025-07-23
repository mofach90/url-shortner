import { Grid } from '@mui/material';

import Bar from './bar.js';
import Footer from './footer.js';

const Home = ({
  appName,
  barProps,
  children,
  company,
  links,
  showRegisterBtn,
}) => {
  return (
    <Grid
      alignItems='center'
      sx={{ minHeight: '100%' }}
      container
      direction='column'
      justifyContent='space-between'
    >
      <Grid item xs={12} container>
        <Bar name={appName} showRegisterBtn={showRegisterBtn} {...barProps} />
      </Grid>
      <Grid item xs={12} container>
        {children}
      </Grid>
      <Footer links={links} company={company} />
    </Grid>
  );
};

export { Home as default };
