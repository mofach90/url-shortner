import { Box, Grid, Link, styled, Typography } from '@mui/material';
import footers from './footers.json';

const Copyright = ({ company = 'GDG Berlin' }) => (
  <Typography variant='body2' color='textSecondary' align='center'>
    {'Copyright © '}
    <Link color='inherit' href='/'>
      {company}
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);

const FooterContainer = styled(Box)`
  width: 100vw;
  & a {
    text-decoration: none;
  }
`;

const Footer = ({ company, links }) => (
  <FooterContainer>
    <Grid item container justifyContent='space-evenly' alignItems='flex-end'>
      {footers.map(({ id, title, menu }) => (
        <Grid item xs={12} sm={6} md={4} key={title}>
          <Typography
            variant='h6'
            color='textPrimary'
            gutterBottom
            align='center'
          >
            {title}
          </Typography>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              textAlign: 'center',
            }}
          >
            {menu.map(({ title: menuTitle, link }) => (
              <li key={`link-${link}`}>
                <Link
                  href={links?.[id] ?? link}
                  variant='subtitle1'
                  color='textSecondary'
                >
                  {menuTitle}
                </Link>
              </li>
            ))}
          </ul>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Box mt={1} mb={2}>
          <Copyright company={company} />
        </Box>
      </Grid>
    </Grid>
  </FooterContainer>
);

export { Footer as default };
