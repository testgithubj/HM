import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from 'react-toastify';
import { staffSchema } from 'schema/staffSchema';
import { postApi } from 'views/services/api';
import './style/staff.css';
import { styled } from '@mui/material/styles';

const AddEmployee = ( { open, handleClose } ) => {
  const [ isSubmitting, setIsSubmitting ] = useState( false );

  const initialValues = {
    employeeType: 'default',
    customEmployeeType: '',
    shift: 'default',
    splitShift: 'default',
    customShiftStart: '',
    customShiftEnd: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    idCardType: 'default',
    idcardNumber: '',
    address: '',
    idFile: null,
    idFile2: null,
    salary: '',
    role: 'Staff'
  };

  const HighlightedMenuItem = styled( MenuItem )( ( { theme } ) => ( {
    color: '#1C2DF4'
  } ) );

  // Helper function to convert 24-hour time to 12-hour format with AM/PM
  const convertTo12HourFormat = ( time24 ) => {
    if ( !time24 ) return '';

    const [ hours, minutes ] = time24.split( ':' );
    let period = 'AM';
    let hours12 = parseInt( hours, 10 );

    if ( hours12 >= 12 ) {
      period = 'PM';
      if ( hours12 > 12 ) {
        hours12 -= 12;
      }
    }

    // Convert hour '0' to '12' for 12 AM
    if ( hours12 === 0 ) {
      hours12 = 12;
    }

    return `${ hours12.toString().padStart( 2, '0' ) }:${ minutes } ${ period }`;
  };

  const handleAddEmployee = async ( values, { resetForm } ) => {
    try {
      setIsSubmitting( true );

      // Check for required uploads
      if ( !values.idFile ) {
        toast.error( 'Please upload the front side of the ID card.' );
        setIsSubmitting( false );
        return;
      }

      if ( !values.idFile2 ) {
        toast.error( 'Please upload the back side of the ID card.' );
        setIsSubmitting( false );
        return;
      }

      // Handle custom fields
      if ( values.employeeType === 'custom' && values.customEmployeeType ) {
        values.employeeType = values.customEmployeeType;
      }

      // Format shift data consistently
      if ( values.shift === 'custom' && values.customShiftStart && values.customShiftEnd ) {
        const startTime12 = convertTo12HourFormat( values.customShiftStart );
        const endTime12 = convertTo12HourFormat( values.customShiftEnd );
        values.shift = `${ startTime12 } - ${ endTime12 }`;
      }

      // Add hotel ID to submission data
      values.hotelId = JSON.parse( localStorage.getItem( 'hotelData' ) ).hotelId;

      // Create form data for submission
      const formData = new FormData();
      formData.append( 'firstName', values.firstName );
      formData.append( 'lastName', values.lastName );
      formData.append( 'email', values.email );
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

      const response = await postApi( 'api/spaStaff/add', formData );

      if ( response.status === 200 ) {
        toast.success( 'Employee added successfully!' );
        resetForm();
        handleClose();
      } else if ( response?.response?.status === 409 ) {
        toast.error( 'Employee already exists!' );
      } else {
        toast.error( 'An unexpected error occurred. Please try again.' );
      }
    } catch ( error ) {
      console.error( 'Error adding employee:', error );
      toast.error( 'Failed to add employee. Please check your connection and try again.' );
    } finally {
      setIsSubmitting( false );
    }
  };

  const formik = useFormik( {
    initialValues,
    validationSchema: staffSchema,
    onSubmit: handleAddEmployee
  } );

  const handleCancel = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <Dialog
      open={ open }
      maxWidth="md"
      fullWidth
      aria-labelledby="add-employee-dialog-title"
      aria-describedby="add-employee-dialog-description"
    >
      <DialogTitle id="add-employee-dialog-title" sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
        <Typography variant="h3">Add New Spa Staff</Typography>
        <Button onClick={ handleCancel } color="error">
          Cancel
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={ formik.handleSubmit } encType="multipart/form-data">
          <Grid container spacing={ 3 }>
            {/* Employee Type Selection */ }
            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth error={ formik.touched.employeeType && Boolean( formik.errors.employeeType ) }>
                <Select
                  id="employeeType"
                  name="employeeType"
                  value={ formik.values.employeeType }
                  onChange={ ( e ) => {
                    formik.setFieldValue( 'employeeType', e.target.value );
                    if ( e.target.value !== 'custom' ) {
                      formik.setFieldValue( 'customEmployeeType', '' );
                    }
                  } }
                >
                  <MenuItem value="default" disabled>
                    Select Employee Type
                  </MenuItem>
                  <MenuItem value="facial specialist">Facial Specialist</MenuItem>
                  <MenuItem value="spa manager">Spa Manager</MenuItem>
                  <MenuItem value="receptionist">Receptionist</MenuItem>
                  <MenuItem value="housekeeping staff">Housekeeping Staff</MenuItem>
                  <MenuItem value="hair stylist">Hair Stylist</MenuItem>
                  <MenuItem value="nail technician">Nail Technician</MenuItem>
                  <MenuItem value="body treatment specialist">Body Treatment Specialist</MenuItem>
                  <MenuItem value="makeup artist">Makeup Artist</MenuItem>
                  <MenuItem value="aromatherapist">Aromatherapist</MenuItem>
                  <MenuItem value="physiotherapist">Physiotherapist</MenuItem>
                  <MenuItem value="skin care consultant">Skin Care Consultant</MenuItem>
                  <MenuItem value="yoga instructor">Yoga Instructor</MenuItem>
                  <MenuItem value="wellness coach">Wellness Coach</MenuItem>
                  <MenuItem value="towel attendant">Towel Attendant</MenuItem>
                  <MenuItem value="hydrotherapy specialist">Hydrotherapy Specialist</MenuItem>
                  <MenuItem value="ayurvedic therapist">Ayurvedic Therapist</MenuItem>
                  <MenuItem value="acupuncturist">Acupuncturist</MenuItem>
                  <MenuItem value="general maintenance staff">General Maintenance Staff</MenuItem>
                  <MenuItem value="inventory manager">Inventory Manager</MenuItem>
                  <HighlightedMenuItem value="custom">Other (Write Manually)</HighlightedMenuItem>
                </Select>
                { formik.touched.employeeType && formik.errors.employeeType && <FormHelperText>{ formik.errors.employeeType }</FormHelperText> }
              </FormControl>
            </Grid>

            {/* Custom Employee Type */ }
            { formik.values.employeeType === 'custom' && (
              <Grid item xs={ 12 } sm={ 6 }>
                <FormControl fullWidth>
                  <FormLabel htmlFor="customEmployeeType">Custom Employee Type</FormLabel>
                  <TextField
                    id="customEmployeeType"
                    name="customEmployeeType"
                    placeholder="Enter custom employee type"
                    value={ formik.values.customEmployeeType }
                    onChange={ formik.handleChange }
                    error={ formik.touched.customEmployeeType && Boolean( formik.errors.customEmployeeType ) }
                    helperText={ formik.touched.customEmployeeType && formik.errors.customEmployeeType }
                  />
                </FormControl>
              </Grid>
            ) }

            {/* Working Shift - Improved */ }
            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth error={ formik.touched.shift && Boolean( formik.errors.shift ) }>
                <Select
                  id="shift"
                  name="shift"
                  value={ formik.values.shift }
                  onChange={ ( e ) => {
                    formik.setFieldValue( 'shift', e.target.value );
                    if ( e.target.value !== 'custom' ) {
                      formik.setFieldValue( 'customShiftStart', '' );
                      formik.setFieldValue( 'customShiftEnd', '' );
                    }
                    if ( e.target.value !== 'split' ) {
                      formik.setFieldValue( 'splitShift', 'default' );
                    }
                  } }
                >
                  <MenuItem value="default" disabled>
                    Select Working Shift
                  </MenuItem>
                  <MenuItem value="09:00 AM - 06:00 PM">09:00 AM - 06:00 PM</MenuItem>
                  <MenuItem value="06:00 PM - 12:00 AM">06:00 PM - 12:00 AM</MenuItem>
                  <MenuItem value="12:00 AM - 09:00 PM">12:00 AM - 09:00 PM</MenuItem>
                  <HighlightedMenuItem value="custom">Other (Write Manually)</HighlightedMenuItem>
                </Select>
                { formik.touched.shift && formik.errors.shift && <FormHelperText>{ formik.errors.shift }</FormHelperText> }
              </FormControl>
            </Grid>

            {/* Custom Shift */ }
            { formik.values.shift === 'custom' && (
              <Grid container item xs={ 12 } sm={ 6 } spacing={ 2 }>
                <Grid item xs={ 6 }>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="customShiftStart">Start Time</FormLabel>
                    <TextField
                      id="customShiftStart"
                      name="customShiftStart"
                      type="time"
                      value={ formik.values.customShiftStart }
                      onChange={ formik.handleChange }
                      InputLabelProps={ { shrink: true } }
                      inputProps={ { step: 300 } }
                      error={ formik.touched.customShiftStart && Boolean( formik.errors.customShiftStart ) }
                      helperText={ formik.touched.customShiftStart && formik.errors.customShiftStart }
                    />
                    { formik.values.customShiftStart && (
                      <FormHelperText>{ `Will be saved as: ${ convertTo12HourFormat( formik.values.customShiftStart ) }` }</FormHelperText>
                    ) }
                  </FormControl>
                </Grid>
                <Grid item xs={ 6 }>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="customShiftEnd">End Time</FormLabel>
                    <TextField
                      id="customShiftEnd"
                      name="customShiftEnd"
                      type="time"
                      value={ formik.values.customShiftEnd }
                      onChange={ formik.handleChange }
                      InputLabelProps={ { shrink: true } }
                      inputProps={ { step: 300 } }
                      error={ formik.touched.customShiftEnd && Boolean( formik.errors.customShiftEnd ) }
                      helperText={ formik.touched.customShiftEnd && formik.errors.customShiftEnd }
                    />
                    { formik.values.customShiftEnd && (
                      <FormHelperText>{ `Will be saved as: ${ convertTo12HourFormat( formik.values.customShiftEnd ) }` }</FormHelperText>
                    ) }
                  </FormControl>
                </Grid>
              </Grid>
            ) }

            {/* Personal Information */ }
            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth>
                <TextField
                  id="firstName"
                  name="firstName"
                  placeholder="Enter First Name"
                  value={ formik.values.firstName }
                  onChange={ formik.handleChange }
                  error={ formik.touched.firstName && Boolean( formik.errors.firstName ) }
                  helperText={ formik.touched.firstName && formik.errors.firstName }
                />
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth>
                <TextField
                  id="lastName"
                  name="lastName"
                  placeholder="Enter Last Name"
                  value={ formik.values.lastName }
                  onChange={ formik.handleChange }
                  error={ formik.touched.lastName && Boolean( formik.errors.lastName ) }
                  helperText={ formik.touched.lastName && formik.errors.lastName }
                />
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth>
                <TextField
                  id="email"
                  name="email"
                  placeholder="Enter Email"
                  value={ formik.values.email }
                  onChange={ formik.handleChange }
                  error={ formik.touched.email && Boolean( formik.errors.email ) }
                  helperText={ formik.touched.email && formik.errors.email }
                />
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth>
                <PhoneInput
                  international
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="custom-phone-input"
                  value={ formik.values.phoneNumber }
                  onChange={ ( value ) => formik.setFieldValue( 'phoneNumber', value ) }
                />
                { formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <FormHelperText error>{ formik.errors.phoneNumber }</FormHelperText>
                ) }
              </FormControl>
            </Grid>

            {/* ID Information */ }
            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth error={ formik.touched.idCardType && Boolean( formik.errors.idCardType ) }>
                <Select id="idCardType" name="idCardType" value={ formik.values.idCardType } onChange={ formik.handleChange }>
                  <MenuItem value="default" disabled>
                    Select ID Card Type
                  </MenuItem>
                  <MenuItem value="Aadharcard">Aadhar Card</MenuItem>
                  <MenuItem value="VoterIdCard">VoterId Card</MenuItem>
                  <MenuItem value="PanCard">Pan Card</MenuItem>
                  <MenuItem value="DrivingLicense">Driving License</MenuItem>
                </Select>
                { formik.touched.idCardType && formik.errors.idCardType && <FormHelperText>{ formik.errors.idCardType }</FormHelperText> }
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth>
                <TextField
                  id="idcardNumber"
                  name="idcardNumber"
                  placeholder="Enter card number"
                  value={ formik.values.idcardNumber }
                  onChange={ formik.handleChange }
                  error={ formik.touched.idcardNumber && Boolean( formik.errors.idcardNumber ) }
                  helperText={ formik.touched.idcardNumber && formik.errors.idcardNumber }
                />
              </FormControl>
            </Grid>

            {/* File Uploads */ }
            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth>
                <FormLabel htmlFor="idFile">Upload ID Card Front</FormLabel>
                <Input
                  id="idFile"
                  name="idFile"
                  type="file"
                  inputProps={ { accept: 'image/*,.pdf' } }
                  onChange={ ( event ) => formik.setFieldValue( 'idFile', event.currentTarget.files[ 0 ] ) }
                />
                { formik.touched.idFile && formik.errors.idFile && <FormHelperText error>{ formik.errors.idFile }</FormHelperText> }
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth>
                <FormLabel htmlFor="idFile2">Upload ID Card Back</FormLabel>
                <Input
                  id="idFile2"
                  name="idFile2"
                  type="file"
                  inputProps={ { accept: 'image/*,.pdf' } }
                  onChange={ ( event ) => formik.setFieldValue( 'idFile2', event.currentTarget.files[ 0 ] ) }
                />
                { formik.touched.idFile2 && formik.errors.idFile2 && <FormHelperText error>{ formik.errors.idFile2 }</FormHelperText> }
              </FormControl>
            </Grid>

            {/* Additional Information */ }
            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth>
                <TextField
                  id="address"
                  name="address"
                  placeholder="Enter Physical Address"
                  value={ formik.values.address }
                  onChange={ formik.handleChange }
                  error={ formik.touched.address && Boolean( formik.errors.address ) }
                  helperText={ formik.touched.address && formik.errors.address }
                />
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth>
                <TextField
                  id="salary"
                  name="salary"
                  placeholder="Enter Salary"
                  value={ formik.values.salary }
                  onChange={ formik.handleChange }
                  error={ formik.touched.salary && Boolean( formik.errors.salary ) }
                  helperText={ formik.touched.salary && formik.errors.salary }
                  InputProps={ { startAdornment: '$' } }
                />
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={ { px: 3, py: 2 } }>
        <Button onClick={ handleCancel } color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={ formik.handleSubmit } variant="contained" color="primary" disabled={ isSubmitting }>
          { isSubmitting ? 'Adding...' : 'Add Employee' }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddEmployee.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddEmployee;
