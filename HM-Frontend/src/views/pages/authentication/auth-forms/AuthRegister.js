import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import style
import './AuthRegister.css';

import { TextField } from '@mui/material';
import React from 'react';
import { defaultCountries, FlagImage, parseCountry, usePhoneInput } from 'react-international-phone';

import { toast } from 'react-toastify';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography
} from '@mui/material';

// third party
import { Formik } from 'formik';

// project imports

import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { postApi } from 'views/services/api';
import { hotelSchema } from 'schema';
import { useNavigate } from 'react-router';
import { width } from '@mui/system';

// ===========================|| FIREBASE - REGISTER ||=========================== //
// Import statements...

const FirebaseRegister = ({ ...others }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          name: '',
          contact: '',
          address: '',
          role: 'HotelAdmin'
        }}
        validationSchema={hotelSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            // regular express syntax
            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            // check regex validation for password
            if (!passwordRegex.test(values.password)) {
              return toast.error(
                'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'
              );
            }

            console.log('vvv', values);
            const response = await postApi('api/hotel/register', values);
            if (response.status === 200) {
              toast.success('Successfully registered');
              resetForm();
              setTimeout(() => {
                navigate('/login');
              }, 400);
            }
            toast.error(response.response.data.message);
          } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {/* hotel name */}
            <FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-name-register">Hotel Name</InputLabel>
              <OutlinedInput
                id="outlined-adornment-name-register"
                type="text"
                value={values.name}
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
            </FormControl>

            {/* Address */}
            <FormControl fullWidth error={Boolean(touched.address && errors.address)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-address-register">Address</InputLabel>
              <OutlinedInput
                id="outlined-adornment-address-register"
                type="text"
                value={values.address}
                name="address"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.address && errors.address && <FormHelperText error>{errors.address}</FormHelperText>}
            </FormControl>

            {/* phone */}
            <FormControl fullWidth error={Boolean(touched.contact && errors.contact)}>
              <PhoneInput
                international
                defaultCountry="US"
                value={values.contact}
                onChange={(value) => handleChange({ target: { name: 'contact', value } })}
                className="custom-phone-input" // Apply a custom class
                inputClass="phone-custome-field"
              />
              {touched.contact && errors.contact && <FormHelperText error>{errors.contact}</FormHelperText>}
            </FormControl>

            {/* Email */}
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />

              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text--register">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            {/* Password */}
            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                label="Password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
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
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-register">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {/* Strength Indicator */}
            {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}

            {/* Submit Button */}
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign up
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseRegister;
