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
import { customerSchema } from 'schema';
import { FormHelperText, FormLabel, Input } from '@mui/material';
import { patchApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useEffect } from 'react';
import { Upload } from '@mui/icons-material';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import style
import './Customer.css';

const EditCustomer = ( props ) => {
  const { open, handleClose, data } = props;
  const [ show, setShow ] = useState( false );
  const [ showIdFile2, setshowIdFile2 ] = useState( false );

  console.log( 'customer data is : ', data );

  //function for getting all the rooms

  const initialValues = {
    phoneNumber: data?.phoneNumber,
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
    idCardType: data?.idCardType || 'default',
    idcardNumber: data?.idcardNumber,
    address: data?.address,
    idFile: null,
    idFile2: null
  };

  const EditData = async ( values, resetForm ) => {
    try {
      const formData = new FormData();
      formData.append( 'firstName', values.firstName );
      formData.append( 'lastName', values.lastName );
      formData.append( 'phoneNumber', values.phoneNumber );
      formData.append( 'email', values.email );
      formData.append( 'idCardType', values.idCardType );
      formData.append( 'idcardNumber', values.idcardNumber );
      formData.append( 'address', values.address );
      formData.append( 'idFile', values.idFile );
      formData.append( 'idFile2', values.idFile2 );

      let response = await patchApi( `api/customer/editcustomer/${ data?._id }`, formData );
      console.log( response );
      if ( response.status === 200 ) {
        toast.success( 'Customer Modified Successfully' );
        resetForm();
        setShow( false );
        setshowIdFile2( false );
        handleClose();
      } else {
        toast.error( response?.response?.data?.error );
      }
    } catch ( e ) {
      toast.error( e.response.data.error );
    }
  };

  const formik = useFormik( {
    initialValues,
    validationSchema: customerSchema,
    enableReinitialize: true,
    onSubmit: async ( values, { resetForm } ) => {
      EditData( values, resetForm );
    }
  } );

  const showFile = () => {
    setShow( true );
  };
  const showFile2 = () => {
    setshowIdFile2( true );
  };
  useEffect( () => {
    formik.setFieldValue( 'idFile', data?.idFile || null );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data ] );
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
          <Typography variant="h6">Edit Customer</Typography>
          <Typography>
            <Button onClick={ handleClose } style={ { color: 'red' } }>
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={ formik.handleSubmit } encType="multipart/form-data">
            <>
              {/* //------------------------- Customer Information______________________________________ */ }

              <Grid container rowSpacing={ 3 } columnSpacing={ { xs: 0, sm: 2 } }>
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
                <Grid item xs={ 12 } sm={ 6 }>
                  <FormLabel>Email</FormLabel>
                  <TextField
                    id="email"
                    name="email"
                    size="small"
                    fullWidth
                    value={ formik.values.email }
                    placeholder="Enter Email"
                    onChange={ formik.handleChange }
                    error={ formik.touched.email && Boolean( formik.errors.email ) }
                    helperText={ formik.touched.email && formik.errors.email }
                  />
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

                { show ? (
                  <Grid item xs={ 12 } sm={ 6 }>
                    <FormLabel>Upload New ID card File Front</FormLabel>
                    <Input
                      id="idFile"
                      name="idFile"
                      type="file"
                      onChange={ ( event ) => formik.setFieldValue( 'idFile', event.currentTarget.files[ 0 ] ) }
                    />
                  </Grid>
                ) : (
                  <Grid item xs={ 12 } sm={ 6 }>
                    <Button variant="contained" startIcon={ <Upload icon="eva:plus-fill" /> } onClick={ () => showFile() }>
                      Change Front Id Proof Document
                    </Button>
                  </Grid>
                ) }
                { showIdFile2 ? (
                  <Grid item xs={ 12 } sm={ 6 }>
                    <FormLabel>Upload New ID card File Back </FormLabel>
                    <Input
                      id="idFile2"
                      name="idFile2"
                      type="file"
                      onChange={ ( event ) => formik.setFieldValue( 'idFile2', event.currentTarget.files[ 0 ] ) }
                    />
                  </Grid>
                ) : (
                  <Grid item xs={ 12 } sm={ 6 }>
                    <Button variant="contained" startIcon={ <Upload icon="eva:plus-fill" /> } onClick={ () => showFile2() }>
                      Change Back Id Proof Document
                    </Button>
                  </Grid>
                ) }

                <Grid item xs={ 12 } sm={ 6 }>
                  <FormLabel>Phone Number</FormLabel>
                  <PhoneInput
                    international
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
            </>

            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

EditCustomer.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};
export default EditCustomer;
