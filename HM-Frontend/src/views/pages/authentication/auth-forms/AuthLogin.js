import { useState } from 'react';
import { postApi } from 'views/services/api';
import { toast } from 'react-toastify';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ============================|| FIREBASE - LOGIN ||============================ //

import menuItem from 'menu-items';





const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState();
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };



  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12} container alignItems="center" justifyContent="center"></Grid>
      </Grid>

      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, e) => {
          console.log("values for login  ==> ", values);

          try {
            const response = await postApi(values.email === 'admin@gmail.com' ? 'api/user/login' : 'api/hotel/login', values);
            console.log("response ===>", response);
            setUserData(response.data.user);
            console.log("userData after setUserData =====>", response.data.user);

            if (response.status === 200) {
              toast.success('Logged In successfully');
              localStorage.setItem('token', response.data.token);
              const role = response.data.user.role;

              if (role === 'admin') {
                localStorage.setItem('hotelData', JSON.stringify(response.data.user));
                localStorage.setItem('defaultUrl', JSON.stringify('/'));
                window.location.replace('/');
              } else if (role === 'HotelAdmin') {
                localStorage.setItem('hotelData', JSON.stringify(response.data.user));
                localStorage.setItem('defaultUrl', JSON.stringify('/'));

                window.location.replace('/');
              } else {

                localStorage.setItem('hotelData', JSON.stringify(response.data.user));
                const matchedItems = (menuItem?.items[0]?.children || [])
                  .filter(item => response?.data?.user?.permissions?.some(permission => item?.title === permission))
                  .sort((a, b) => menuItem?.items[0]?.children.indexOf(a) - menuItem?.items[0]?.children.indexOf(b));

                localStorage.setItem('defaultUrl', JSON.stringify(`${matchedItems[0]?.url}`));

                window.location.replace(`${matchedItems[0]?.url}`);
              }
            } else {
              toast.error(response.response.data.error);
            }

            // if (response.status === 200) {
            //   toast.success('Logged In successfully');
            //   localStorage.setItem('token', response.data.token);
            //   if (values.email === 'admin@gmail.com') {
            //     localStorage.setItem('user', JSON.stringify(response.data.user));
            //     window.location.replace('/dashboard/admindashboard');
            //   } else {
            //     localStorage.setItem('hotelData', JSON.stringify(response.data.user));
            //     window.location.replace('/dashboard/app');
            //     console.log("response =====>",response);
            //   }
            // } else {
            //   toast.error(response.response.data.error);
            // }
          } catch (error) {
            toast.error(error.response.response.data.error);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel sx={{ backgroundColor: 'transparent' }} htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
