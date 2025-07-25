import { Grid } from '@mui/material';
import Bar from './bar.jsx'

import Footer from './footer.jsx';

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
      sx={{ height: '100%', backgroundColor: '#f2b3b3ff' }}
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
