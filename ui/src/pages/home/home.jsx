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
      sx={{ minHeight: '100vh', backgroundColor: '#a37b7bff', minWidth: '100vw'}}
      container
      direction='column'
      justifyContent='space-between'
    >
      <Grid item xs={12} container sx={{ backgroundColor: '#2c9754ff' , minWidth: '100vw'}}>
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
