import {
  AppBar,
  Box,
  Button,
  styled,
  Toolbar,
  toolbarClasses,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Link = styled(RouterLink)({
  textDecoration: 'none',
});

const Bar = ({ name, showRegisterBtn, logoProps }) => {
  // const navigate = useNavigate();

  return (
    <AppBar position='static' color='transparent' elevation={0}>
      <Toolbar
        sx={{
          [`&.${toolbarClasses.root}`]: {
            pl: 2,
            pr: 2,
          },
        }}
      >
        <Box
          sx={{ cursor: 'pointer' }}
          onClick={null}
          // onClick={() => navigate('/')}
          flexDirection='row'
          display='flex'
          alignItems='center'
          role='button'
        >
          {/* <Logo
            style={{
              height: 40,
              minWidth: 40,
              marginRight: 8,
            }}
            {...logoProps}
          /> */}
          {name && (
            <Typography variant='h5' noWrap sx={{ ml: 1, mr: 0.5 }}>
              {name}
            </Typography>
          )}
        </Box>
        <Box flexGrow={1} />
        {showRegisterBtn && (
          <Link to='/register'>
            <Box mr={1}>
              <Button variant='outlined' color='primary'>
                Register
              </Button>
            </Box>
          </Link>
        )}
        <Link to='/login'>
          <Button variant='outlined' color='primary'>
            Login
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export { Bar as default };
