import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useFormik } from 'formik';
import { employeeSchema } from 'schema';
import { FormLabel, FormControl, Input, FormHelperText, IconButton, InputAdornment } from '@mui/material';
import { postApi } from 'views/services/api';
import PropTypes from 'prop-types';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { toast } from 'react-toastify';
import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import style
import './staff.css';

const AddEmployee = ( props ) => {
  const { open, handleClose } = props;
  const [ showNewPassword, setShowNewPassword ] = useState( false );

  const initialValues = {
    employeeType: 'default',
    shift: 'default',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    idCardType: 'default',
    idcardNumber: '',
    address: '',
    idFile: null,
    idFile2: null,
    salary: '',
    role: 'Staff'
  };

  const AddData = async ( values ) => {
    try {
      // Create FormData object and append form fields
      const formData = new FormData();
      formData.append( 'firstName', values.firstName );
      formData.append( 'lastName', values.lastName );
      formData.append( 'email', values.email );
      formData.append( 'password', values.password );
      formData.append( 'phoneNumber', values.phoneNumber );
      formData.append( 'shift', values.shift );
      formData.append( 'hotelId', values.hotelId );
      formData.append( 'employeeType', values.employeeType );
      formData.append( 'idCardType', values.idCardType );
      formData.append( 'idcardNumber', values.idcardNumber );
      formData.append( 'address', values.address );
      formData.append( 'salary', values.salary );
      formData.append( 'idFile', values.idFile );
      formData.append( 'idFile2', values.idFile2 );
      formData.append( 'role', values.employeeType );

      // Make API call to add employee
      let response = await postApi( 'api/employee/add', formData );

      // Handle the response status
      if ( response.status === 200 ) {
        toast.success( 'Employee added successfully!' );
        formik.resetForm();
        handleClose();
      } else if ( response?.response?.status === 409 ) {
        toast.error( 'Employee already exists!' );
      } else {
        toast.error( 'An unexpected error occurred. Please try again.' );
      }
    } catch ( e ) {
      // Catch any errors and log for debugging
      console.error( 'Error adding employee:', e );
      toast.error( 'Failed to add employee. Please check your connection and try again.' );
    }
  };

  // Updated formik submission logic
  const formik = useFormik( {
    initialValues,
    validationSchema: employeeSchema,
    onSubmit: async ( values, { resetForm } ) => {
      // Check if idFile and idFile2 are not uploaded
      if ( !values.idFile ) {
        toast.error( 'Please upload the front side of the ID card.' );
        return;
      }
      if ( !values.idFile2 ) {
        toast.error( 'Please upload the back side of the ID card.' );
        return;
      }

      // Proceed with the submission if all validations pass
      values.hotelId = JSON.parse( localStorage.getItem( 'hotelData' ) ).hotelId;
      AddData( values, resetForm );
    }
  } );

  return (
    <div>
      <Dialog open={ open } aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={ {
            display: 'flex',
            justifyContent: 'space-between'
          } }
        >
          <Typography variant="h3" sx={ { display: 'flex', alignItems: 'center' } }>
            Add New Employee
          </Typography>
          <Typography>
            <Button onClick={ handleClose } style={ { color: 'red' } }>
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={ formik.handleSubmit } encType="multipart/form-data">
            <Grid container rowSpacing={ 3 } columnSpacing={ { xs: 0, sm: 5, md: 4 } }>
              <Grid item xs={ 12 } sm={ 4 } md={ 6 }>
                <FormControl fullWidth>
                  <Select
                    id="employeeType"
                    name="employeeType"
                    label=""
                    // size="small"
                    fullWidth
                    placeholder=""
                    value={ formik.values.employeeType }
                    onChange={ formik.handleChange }
                    error={ formik.touched.employeeType && Boolean( formik.errors.employeeType ) }
                  >
                    <MenuItem value="default" disabled>
                      Select Employee Type
                    </MenuItem>

                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="spa manager">Spa Manager</MenuItem>
                    <MenuItem value="cleaning">Cleaning</MenuItem>
                    <MenuItem value="reception">Reception</MenuItem>
                    <MenuItem value="cook">Cook</MenuItem>
                    <MenuItem value="waiter">Waiter</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={ 12 } sm={ 4 } md={ 6 }>
                <FormControl fullWidth>
                  <Select
                    id="shift"
                    name="shift"
                    label=""
                    // size="small"
                    fullWidth
                    value={ formik.values.shift }
                    onChange={ formik.handleChange }
                    error={ formik.touched.shift && Boolean( formik.errors.shift ) }
                  >
                    <MenuItem value="default" disabled>
                      Select Working Shift
                    </MenuItem>

                    <MenuItem value="Day-Shift 08:00 AM - 08:00 PM">( Day-Shift ) 08:00 AM - 08:00 PM </MenuItem>
                    <MenuItem value="Night-Shift 08:00 PM - 08:00 AM">( Night-Shift ) 08:00 PM - 08:00 AM </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  // size="small"
                  fullWidth
                  placeholder="Enter First Name"
                  value={ formik.values.firstName }
                  onChange={ formik.handleChange }
                  error={ formik.touched.firstName && Boolean( formik.errors.firstName ) }
                  helperText={ formik.touched.firstName && formik.errors.firstName }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <TextField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  // size="small"
                  fullWidth
                  placeholder="Enter Last Name"
                  value={ formik.values.lastName }
                  onChange={ formik.handleChange }
                  error={ formik.touched.lastName && Boolean( formik.errors.lastName ) }
                  helperText={ formik.touched.lastName && formik.errors.lastName }
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 }>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  // size="small"
                  fullWidth
                  placeholder="Enter Email"
                  value={ formik.values.email }
                  onChange={ formik.handleChange }
                  error={ formik.touched.email && Boolean( formik.errors.email ) }
                  helperText={ formik.touched.email && formik.errors.email }
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 }>
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  // size="small"
                  // type="password"
                  type={ showNewPassword ? 'text' : 'password' }
                  fullWidth
                  placeholder="Enter Password"
                  value={ formik.values.password }
                  onChange={ formik.handleChange }
                  error={ formik.touched.password && Boolean( formik.errors.password ) }
                  helperText={ formik.touched.password && formik.errors.password }
                  InputProps={ {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={ () => setShowNewPassword( !showNewPassword ) } edge="end">
                          { showNewPassword ? <Visibility /> : <VisibilityOff /> }
                        </IconButton>
                      </InputAdornment>
                    )
                  } }
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 12 } md={ 6 }>
                <Select
                  id="idCardType"
                  name="idCardType"
                  // size="small"
                  fullWidth
                  value={ formik.values.idCardType }
                  onChange={ formik.handleChange }
                  error={ formik.touched.idCardType && Boolean( formik.errors.idCardType ) }
                >
                  <MenuItem value="default" disabled>
                    Select Id Card Type
                  </MenuItem>
                  <MenuItem value="Aadharcard">Aadhar Card</MenuItem>
                  <MenuItem value="VoterIdCard">VoterId Card</MenuItem>
                  <MenuItem value="PanCard">Pan Card</MenuItem>
                  <MenuItem value="DrivingLicense">Driving License</MenuItem>
                </Select>
                <FormHelperText error={ formik.touched.idCardType && formik.errors.idCardType }>
                  { formik.touched.idCardType && formik.errors.idCardType }
                </FormHelperText>
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <TextField
                  id="idcardNumber"
                  name="idcardNumber"
                  label="ID Card Number"
                  // size="small"
                  type="text"
                  fullWidth
                  placeholder="Enter card number"
                  value={ formik.values.idcardNumber }
                  onChange={ formik.handleChange }
                  error={ formik.touched.idcardNumber && Boolean( formik.errors.idcardNumber ) }
                  helperText={ formik.touched.idcardNumber && formik.errors.idcardNumber }
                />
              </Grid>

              {/* <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Upload ID Card Front</FormLabel>
                <Input
                  id="idFile"
                  name="idFile"
                  type="file"
                  onChange={ ( event ) => formik.setFieldValue( 'idFile', event.currentTarget.files[ 0 ] ) }
                  error={ formik.touched.idFile && Boolean( formik.errors.idFile ) }
                  helperText={ formik.touched.idFile && formik.errors.idFile }
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Upload ID Card Back</FormLabel>
                <Input
                  id="idFile2"
                  name="idFile2"
                  type="file"
                  onChange={ ( event ) => formik.setFieldValue( 'idFile2', event.currentTarget.files[ 0 ] ) }
                  error={ formik.touched.idFile2 && Boolean( formik.errors.idFile2 ) }
                  helperText={ formik.touched.idFile2 && formik.errors.idFile2 }
                />
              </Grid> */}

              <Grid item xs={ 12 } sm={ 6 }>
                {/* Move FormLabel outside FormControl */ }
                <FormLabel htmlFor="idFile">Upload ID Card Front</FormLabel>

                {/* FormControl now only wraps the Input and FormHelperText */ }
                <FormControl fullWidth error={ formik.touched.idFile && Boolean( formik.errors.idFile ) }>
                  <Input
                    id="idFile" // Keep the id to link with htmlFor
                    name="idFile"
                    type="file"
                    onChange={ ( event ) => formik.setFieldValue( 'idFile', event.currentTarget.files[ 0 ] ) }
                  />
                  { formik.touched.idFile && formik.errors.idFile && (
                    <FormHelperText>{ formik.errors.idFile }</FormHelperText>
                  ) }
                </FormControl>
              </Grid>

              <Grid item xs={ 12 } sm={ 6 }>
                {/* Move FormLabel outside FormControl */ }
                <FormLabel htmlFor="idFile2">Upload ID Card Back</FormLabel>

                {/* FormControl now only wraps the Input and FormHelperText */ }
                <FormControl fullWidth error={ formik.touched.idFile2 && Boolean( formik.errors.idFile2 ) }>
                  <Input
                    id="idFile2" // Keep the id to link with htmlFor
                    name="idFile2"
                    type="file"
                    onChange={ ( event ) => formik.setFieldValue( 'idFile2', event.currentTarget.files[ 0 ] ) }
                  />
                  { formik.touched.idFile2 && formik.errors.idFile2 && (
                    <FormHelperText>{ formik.errors.idFile2 }</FormHelperText>
                  ) }
                </FormControl>
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                <TextField
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  // size="small"
                  type="number"
                  fullWidth
                  placeholder="Enter Phone Number"
                  value={formik.values.phoneNumber}
                  onChange={(e) => {
                    const phoneNumber = e.target.value.replace(/\D/g, '').sNlice(0, 10);
                    formik.setFieldValue(`phoneNumber`, phoneNumber);
                  }}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />
              </Grid> */}
              <Grid item xs={ 12 } sm={ 6 }>
                <TextField
                  id="address"
                  name="address"
                  label="Address"
                  // size="small"
                  fullWidth
                  placeholder="Enter Physical Address"
                  value={ formik.values.address }
                  onChange={ formik.handleChange }
                  error={ formik.touched.address && Boolean( formik.errors.address ) }
                  helperText={ formik.touched.address && formik.errors.address }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <TextField
                  id="salary"
                  name="salary"
                  label="Salary"
                  // size="small"
                  fullWidth
                  placeholder="Enter salary"
                  value={ formik.values.salary }
                  onChange={ formik.handleChange }
                  error={ formik.touched.salary && Boolean( formik.errors.salary ) }
                  helperText={ formik.touched.salary && formik.errors.salary }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Phone Number</FormLabel>
                <PhoneInput
                  international
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="custom-phone-input"
                  value={ formik.values.phoneNumber }
                  onChange={ ( value ) => formik.setFieldValue( 'phoneNumber', value ) } // Set phone number properly
                />
                { formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <span style={ { color: 'red', fontSize: '0.875rem' } }>{ formik.errors.phoneNumber }</span>
                ) }
              </Grid>

              {/* //-------------------------------------------------------------------- */ }
            </Grid>

            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Add Employee
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

AddEmployee.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddEmployee;
