import { FormHelperText, FormLabel, Input } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from 'react-toastify';
import { customerSchema } from 'schema';
import { getApi, postApi } from 'views/services/api';
import './Customer.css';

const AddCustomer = (props) => {
  const [hotelName, setHotelName] = useState([]);
  const { open, handleClose } = props;

  const user = JSON.parse(localStorage.getItem('hotelData'));

  useEffect(() => {
    const allHotel = async () => {
      const response = await getApi('api/hotel/viewallhotels');
      console.log(response.data);
      setHotelName(response?.data);
    };
    allHotel();
  }, []);

  //function for getting all the rooms

  const initialValues = {
    phoneNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    idCardType: 'default',
    idcardNumber: '',
    address: '',
    idFile: null,
    idFile2: null
  };

  const role = JSON.parse(localStorage.getItem('hotelData')).role;
  console.log(role, 'this is the role in add customer');
  const AddData = async (values, resetForm) => {
    try {
      role !== 'admin' && (values.hotelId = user.hotelId);

      console.log('this is id what i want ', values.hotelId);
      const formData = new FormData();
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('hotelId', values.hotelId);
      formData.append('email', values.email);
      formData.append('idCardType', values.idCardType);
      formData.append('idcardNumber', values.idcardNumber);
      formData.append('address', values.address);
      formData.append('idFile', values.idFile);
      formData.append('idFile2', values.idFile2);

      let response = await postApi('api/customer/add', formData);

      console.log(formData, 'this is for form data customer');
      if (response.status === 200) {
        toast.success('Customer Added Successfully');
        handleClose();
        resetForm();
      } else {
        toast.error(response?.response?.data?.error);
      }
    } catch (e) {
      toast.error(e.response.data.error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: customerSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      AddData(values, resetForm);
    }
  });

  return (
    <div>
      <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6">Add Customer</Typography>
          <Typography>
            <Button onClick={handleClose} style={{ color: 'red' }}>
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <>
              {/* //------------------------- Customer Information______________________________________ */}

              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 2 }}>
                <Grid item xs={12} sm={6}>
                  <FormLabel>First Name</FormLabel>
                  <TextField
                    id="firstName"
                    name="firstName"
                    size="small"
                    fullWidth
                    placeholder="Enter First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel>Last Name</FormLabel>
                  <TextField
                    id="lastName"
                    name="lastName"
                    size="small"
                    fullWidth
                    placeholder="Enter Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel>Email</FormLabel>
                  <TextField
                    id="email"
                    name="email"
                    size="small"
                    fullWidth
                    value={formik.values.email}
                    placeholder="Enter Email"
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel>Address</FormLabel>
                  <TextField
                    id="address"
                    name="address"
                    size="small"
                    fullWidth
                    placeholder="Enter Physical Address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <FormLabel>Id card Type</FormLabel>
                  <Select
                    id="idCardType"
                    name="idCardType"
                    size="small"
                    fullWidth
                    value={formik.values.idCardType}
                    onChange={formik.handleChange}
                    error={formik.touched.idCardType && Boolean(formik.errors.idCardType)}
                  >
                    <MenuItem value="default" disabled>
                      Select Id Card Type
                    </MenuItem>
                    <MenuItem value="Aadharcard">Aadhar Card</MenuItem>
                    <MenuItem value="VoterIdCard">VoterId Card</MenuItem>
                    <MenuItem value="PanCard">Pan Card</MenuItem>
                    <MenuItem value="DrivingLicense">Driving License</MenuItem>
                  </Select>
                  <FormHelperText error={formik.touched.idCardType && formik.errors.idCardType}>
                    {formik.touched.idCardType && formik.errors.idCardType}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel>Id Card Number</FormLabel>
                  <TextField
                    id="idcardNumber"
                    name="idcardNumber"
                    size="small"
                    type="text"
                    fullWidth
                    placeholder="Enter card number"
                    value={formik.values.idcardNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.idcardNumber && Boolean(formik.errors.idcardNumber)}
                    helperText={formik.touched.idcardNumber && formik.errors.idcardNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel>Upload ID Card Front</FormLabel>
                  <Input
                    id="idFile"
                    name="idFile"
                    type="file"
                    onChange={(event) => formik.setFieldValue('idFile', event.currentTarget.files[0])}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel>Upload ID Card Back</FormLabel>
                  <Input
                    id="idFile2"
                    name="idFile2"
                    type="file"
                    onChange={(event) => formik.setFieldValue('idFile2', event.currentTarget.files[0])}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel>Phone Number</FormLabel>
                  <PhoneInput
                    international
                    defaultCountry="US"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="custom-phone-input"
                    value={formik.values.phoneNumber}
                    onChange={(value) => formik.setFieldValue('phoneNumber', value)} // Set phone number properly
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <span style={{ color: 'red', fontSize: '0.875rem' }}>{formik.errors.phoneNumber}</span>
                  )}
                </Grid>

                {role === 'admin' && (
                  <Grid item xs={12} sm={12} md={6}>
                    <FormLabel>Hotel Name</FormLabel>
                    <Select
                      id="hotelId"
                      name="hotelId"
                      size="small"
                      fullWidth
                      value={formik.values.hotelId || 'default'}
                      onChange={formik.handleChange}
                      // error={formik.touched.idCardType && Boolean(formik.errors.idCardType)}
                    >
                      <MenuItem value="default" disabled>
                        Select Hotel Name
                      </MenuItem>

                      {hotelName?.map((item, index) => (
                        <MenuItem key={index} value={`${item.hotelId}`}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.hotelId && formik.errors.hotelId && (
                      <span style={{ color: 'red', fontSize: '0.875rem' }}>{'Hotel Name is required'}</span>
                    )}
                  </Grid>
                )}
              </Grid>
            </>

            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Add Customer
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
AddCustomer.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
export default AddCustomer;
