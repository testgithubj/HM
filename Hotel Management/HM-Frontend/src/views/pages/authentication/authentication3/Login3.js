import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthLogin from '../auth-forms/AuthLogin';
import leftimglog from '../../../../assets/images/login/4433552_2367417.jpg';

const Login = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Left Image Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <Box
            component="img"
            src={leftimglog}
            alt="login"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Grid>
        
        {/* Right Form Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: { xs: 3, sm: 6, md: 8, lg: 10 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Stack spacing={4} sx={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
              <Stack spacing={2}>
                <Typography variant="h1" sx={{ fontSize: '2.5rem', fontWeight: 700, color: theme.palette.primary.main }}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Please sign in to continue  your account.
                </Typography>
              </Stack>

              <AuthLogin />

              <Divider sx={{ my: 3 }} />

              {/* <Typography component={Link} to="/register" variant="body1" sx={{ textAlign: 'center', textDecoration: 'none' }}>
                Don&apos;t have an account? <Box component="span" sx={{ color: theme.palette.primary.main }}>Sign up</Box>
              </Typography> */}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
