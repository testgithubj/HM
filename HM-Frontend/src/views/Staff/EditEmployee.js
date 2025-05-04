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
import { FormLabel, FormControl, Input, FormHelperText } from '@mui/material';
import { patchApi } from 'views/services/api';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import style
import './staff.css';

import { employeeSchemaForEdit } from 'schema/employeeSchema';

const EditEmployee = ( props ) => {
  const { open, handleClose, employeeData } = props;

  // console.log('employeeData', employeeData);
  const [ currentIdFile, setCurrentIdFile ] = useState( null );
  const [ currentIdFile2, setCurrentIdFile2 ] = useState( null );

  const initialValues = {
    employeeType: employeeData?.employeeType || 'default',
    shift: employeeData?.shift || 'default',
    phoneNumber: employeeData?.phoneNumber,
    firstName: employeeData?.firstName,
    lastName: employeeData?.lastName,
    idCardType: employeeData?.idCardType || 'default',
    idcardNumber: employeeData?.idcardNumber,
    address: employeeData?.address,
    salary: employeeData?.salary,
    idFile: employeeData?.idFile ? employeeData.idFile.split( '/' ).pop() : '',
    idFile2: employeeData?.idFile2 ? employeeData.idFile2.split( '/' ).pop() : ''
  };

  const updatedData = async ( values ) => {
    console.log( 'values  -------==>', values );
    try {
      const formData = new FormData();
      formData.append( 'firstName', values.firstName );
      formData.append( 'lastName', values.lastName );
      formData.append( 'phoneNumber', values.phoneNumber );
      formData.append( 'shift', values.shift );
      formData.append( 'employeeType', values.employeeType );
      formData.append( 'idCardType', values.idCardType );
      formData.append( 'idcardNumber', values.idcardNumber );
      formData.append( 'address', values.address );
      formData.append( 'salary', values.salary );
      formData.append( 'idFile', currentIdFile );
      formData.append( 'idFile2', currentIdFile2 );

      console.log( 'ff', formData );

      let response = await patchApi( `api/employee/editemployee/${ employeeData?._id }`, formData );
      console.log( 'ree', response );
      if ( response.status === 200 ) {
        toast.success( 'Employee Modified successfully' );
        handleClose();
      } else {
        toast.error( 'Cannot modify Employee' );
      }
    } catch ( e ) {
      toast.error( 'Cannot modify Employee' );
    }
  };

  // formik
  const formik = useFormik( {

    enableReinitialize: true, // Allow reinitialization when initialValues change
    initialValues,
    onSubmit: async ( values, { resetForm } ) => {
      console.log( 'Formik Values:', values );
      console.log( 'Formik Errors:', formik.errors ); // Debug validation errors
      updatedData( values, resetForm );
    }
  } );

  const handleFileChange = ( field, event ) => {
    const file = event.currentTarget.files[ 0 ];
    formik.setFieldValue( field, file.name );
    if ( field === 'idFile' ) setCurrentIdFile( file );
    if ( field === 'idFile2' ) setCurrentIdFile2( file );
    console.log( 'file ==>', file );
  };

  return (
    <Dialog open={ open } aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
      <DialogTitle id="scroll-dialog-title" style={ { display: 'flex', justifyContent: 'space-between' } }>
        <Typography variant="h6">Edit Employee</Typography>
        <Button onClick={ handleClose } style={ { color: 'red' } }>
          Cancel
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        {/* <form onSubmit={formik.handleSubmit} encType="multipart/form-data"> */ }
        <form onSubmit={ formik.handleSubmit } encType="multipart/form-data">
          <Grid container rowSpacing={ 3 } columnSpacing={ { xs: 0, sm: 5, md: 4 } }>
            {/* Form Fields */ }
            <Grid item xs={ 12 } sm={ 4 } md={ 6 }>
              <FormControl fullWidth>
                <FormLabel>Employee Type</FormLabel>
                <Select
                  id="employeeType"
                  name="employeeType"
                  size="small"
                  fullWidth
                  value={ formik.values.employeeType }
                  onChange={ formik.handleChange }
                  error={ formik.touched.employeeType && Boolean( formik.errors.employeeType ) }
                >
                  <MenuItem value="default" disabled>
                    Select Employee Type
                  </MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="cleaning">Cleaning</MenuItem>
                  <MenuItem value="reception">Reception</MenuItem>
                  <MenuItem value="cook">Cook</MenuItem>
                  <MenuItem value="waiter">Waiter</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 4 } md={ 6 }>
              <FormControl fullWidth>
                <FormLabel>Working Shift</FormLabel>
                <Select
                  id="shift"
                  name="shift"
                  label=""
                  size="small"
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
              <FormLabel>First Name</FormLabel>
              <TextField
                id="firstName"
                name="firstName"
                size="small"
                fullWidth
                placeholder="Enter First Name"
                value={ formik.values.firstName }
                onChange={ formik.handleChange }
                error={ formik.touched.firstName && Boolean( formik.errors.firstName ) }
                helperText={ formik.touched.firstName && formik.errors.firstName }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <FormLabel>Last Name</FormLabel>
              <TextField
                id="lastName"
                name="lastName"
                size="small"
                fullWidth
                placeholder="Enter Last Name"
                value={ formik.values.lastName }
                onChange={ formik.handleChange }
                error={ formik.touched.lastName && Boolean( formik.errors.lastName ) }
                helperText={ formik.touched.lastName && formik.errors.lastName }
              />
            </Grid>

            <Grid item xs={ 12 } sm={ 12 } md={ 6 }>
              <FormLabel>Id card Type</FormLabel>
              <Select
                id="idCardType"
                name="idCardType"
                size="small"
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
              <FormLabel>Id Card Number</FormLabel>
              <TextField
                id="idcardNumber"
                name="idcardNumber"
                size="small"
                type="text"
                fullWidth
                placeholder="Enter card number"
                value={ formik.values.idcardNumber }
                onChange={ formik.handleChange }
                error={ formik.touched.idcardNumber && Boolean( formik.errors.idcardNumber ) }
                helperText={ formik.touched.idcardNumber && formik.errors.idcardNumber }
              />
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormLabel>Upload ID Card Front</FormLabel>
              <Input id="idFile" name="idFile" type="file" onChange={ ( event ) => handleFileChange( 'idFile', event ) } accept="image/*" />
              { formik.values.idFile && <Typography variant="body2">File: { formik.values.idFile }</Typography> }
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormLabel>Upload ID Card Back</FormLabel>
              <Input id="idFile2" name="idFile2" type="file" onChange={ ( event ) => handleFileChange( 'idFile2', event ) } accept="image/*" />
              { formik.values.idFile2 && <Typography variant="body2">File: { formik.values.idFile2 }</Typography> }
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormLabel>Address</FormLabel>
              <TextField
                id="address"
                name="address"
                size="small"
                fullWidth
                placeholder="Enter Physical Address"
                value={ formik.values.address }
                onChange={ formik.handleChange }
                error={ formik.touched.address && Boolean( formik.errors.address ) }
                helperText={ formik.touched.address && formik.errors.address }
              />
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormLabel>Salary</FormLabel>
              <TextField
                id="salary"
                name="salary"
                size="small"
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
          </Grid>

          <DialogActions>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditEmployee.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  employeeData: PropTypes.object
};

export default EditEmployee;
