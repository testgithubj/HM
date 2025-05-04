import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormControl, FormLabel, Grid, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import Palette from '../../../ui-component/ThemePalette';
import { patchApi } from 'views/services/api';
import { hotelSchema } from 'schema';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import PropTypes from 'prop-types';
import { parse } from 'date-fns';
import { useState } from 'react';
import { useEffect } from 'react';

const EditHotel = (props) => {
  const { open, handleClose, data } = props;
  console.log('data ==>', data);

  const [initialValues, setInitialValues] = useState({
    email: data?.email || '',
    password: data?.password || '',
    name: data?.name || '',
    contact: data?.contact || '',
    address: data?.address || '',
    gstNumber: data?.gstNumber || '',
    foodgstpercentage: data?.foodgstpercentage || '',
    roomgstpercentage: data?.roomgstpercentage || '',
    mapurl: data?.mapurl || '',
    websiteURL: data?.websiteURL || '',
    googleReviewURL: data?.googleReviewURL || '',
    checkInTime: data?.checkInTime ? parse(data.checkInTime, 'hh:mm aa', new Date()) : '',
    checkOutTime: data?.checkOutTime ? parse(data.checkOutTime, 'hh:mm aa', new Date()) : ''
  });

  useEffect(() => {
    setInitialValues((prevValues) => ({
      ...prevValues,
      email: data?.email || '',
      password: data?.password || '',
      name: data?.name || '',
      contact: data?.contact || '',
      address: data?.address || '',
      gstNumber: data?.gstNumber || '',
      foodgstpercentage: data?.foodgstpercentage || '',
      roomgstpercentage: data?.roomgstpercentage || '',
      mapurl: data?.mapurl || '',
      websiteURL: data?.websiteURL || '',
      googleReviewURL: data?.googleReviewURL || '',
      checkInTime: data?.checkInTime ? parse(data.checkInTime, 'hh:mm aa', new Date()) : '',
      checkOutTime: data?.checkOutTime ? parse(data.checkOutTime, 'hh:mm aa', new Date()) : ''
    }));
  }, [data]);

  const updateAdmin = async (values) => {
    console.log('updateAdmin values =====>', values);

    try {
      values.checkInTime = formik.values?.checkInTime?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      values.checkOutTime = formik.values?.checkOutTime?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === 'hotelImage' && values.hotelImage) {
          formData.append('hotelImage', values.hotelImage);
        } else {
          formData.append(key, values[key]);
        }
      });

      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      console.log('Api hit ==>', `api/hotel/edit/${data?._id}`);

      let response = await patchApi(`api/hotel/edit/${data?._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        toast.success('Hotel updated successfully');
        handleClose();
        window.location.reload();
        // resetForm();
      } else {
        toast.error('cannot update hotel');
      }
    } catch (e) {
      console.log(e);
      toast.error('cannot update hotel');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: hotelSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      console.log('on Submit ==>', values);
      updateAdmin(values, resetForm);
    }
  });

  const handleCheckInTimeChange = (value) => {
    formik.setFieldValue('checkInTime', value);
  };

  const handleCheckOutTimeChange = (value) => {
    formik.setFieldValue('checkOutTime', value);
  };

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   console.log('file ======>', file);

  //   if (file) {
  //     const img = new Image();
  //     console.log('img ==>', img);

  //     img.onload = () => {
  //       if (img.width > 178 || img.height > 40) {
  //         toast.error('Image width must be 178 pixels or less and height must be 40 pixels or less.');
  //       } else {
  //         toast.success('Image is valid size');
  //         formik.setFieldValue('hotelImage', file);
  //       }
  //     };
  //     img.src = URL.createObjectURL(file);
  //   }
  // };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log('file ======>', file);
  
    if (file) {
      formik.setFieldValue('hotelImage', file);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6">Edit Hotel Profile</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ width: '100%', minWidth: '600px' }}>
          <form>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              {/* Email  */}
              <Grid item xs={12} sm={12} md={6} sx={{ marginTop: '10px' }}>
                <FormLabel>Email</FormLabel>
                <TextField
                  id="email"
                  name="email"
                  size="small"
                  fullWidth
                  disabled
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              {/* First Name */}
              <Grid item xs={12} sm={12} md={6} sx={{ marginTop: '10px' }}>
                <FormLabel>Name</FormLabel>
                <TextField
                  id="name"
                  name="name"
                  size="small"
                  fullWidth
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>

              {/* phone number  */}
              <Grid item xs={12} sm={12} md={12} sx={{ marginTop: '10px' }}>
                <Grid item xs={6} sm={6} md={6} sx={{ marginTop: '10px' }}>
                  <FormLabel>Phone Number</FormLabel>
                  <TextField
                    id="contact"
                    name="contact"
                    label=""
                    type="number"
                    size="small"
                    fullWidth
                    value={formik.values.contact}
                    onChange={formik.handleChange}
                    error={formik.touched.contact && Boolean(formik.errors.contact)}
                    helperText={formik.touched.contact && formik.errors.contact}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} sx={{ marginTop: '10px' }}>
                <FormLabel>Address</FormLabel>
                <TextField
                  id="address"
                  name="address"
                  label=""
                  type="text"
                  size="small"
                  fullWidth
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
              <Grid container spacing={2}>
                {/* GST Number */}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth sx={{ marginTop: '10px' }}>
                    <FormLabel>GST Number</FormLabel>
                    <TextField
                      id="gstNumber"
                      name="gstNumber"
                      label=""
                      type="text"
                      placeholder="Enter GST Number"
                      size="small"
                      fullWidth
                      value={formik.values.gstNumber}
                      onChange={formik.handleChange}
                      error={formik.touched.gstNumber && Boolean(formik.errors.gstNumber)}
                      helperText={formik.touched.gstNumber && formik.errors.gstNumber}
                    />
                  </FormControl>
                </Grid>
                {/* GST % on Food */}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth sx={{ marginTop: '10px' }}>
                    <FormLabel>GST % on Food</FormLabel>
                    <TextField
                      id="foodgstpercentage"
                      name="foodgstpercentage"
                      placeholder="in %"
                      label=""
                      type="number"
                      size="small"
                      fullWidth
                      value={formik.values.foodgstpercentage}
                      onChange={formik.handleChange}
                      error={formik.touched.foodgstpercentage && Boolean(formik.errors.foodgstpercentage)}
                      helperText={formik.touched.foodgstpercentage && formik.errors.foodgstpercentage}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} sx={{ marginTop: '10px' }}>
                  <FormLabel>GST % on Room</FormLabel>
                  <TextField
                    id="roomgstpercentage"
                    name="roomgstpercentage"
                    label=""
                    placeholder="in %"
                    type="number"
                    size="small"
                    fullWidth
                    value={formik.values.roomgstpercentage}
                    onChange={formik.handleChange}
                    error={formik.touched.roomgstpercentage && Boolean(formik.errors.roomgstpercentage)}
                    helperText={formik.touched.roomgstpercentage && formik.errors.roomgstpercentage}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel>Check-In Time</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      id="checkInTime"
                      name="checkInTime"
                      value={formik.values.checkInTime}
                      onChange={handleCheckInTimeChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel>Check-Out Time</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      id="checkOutTime"
                      name="checkOutTime"
                      value={formik.values.checkOutTime}
                      onChange={handleCheckOutTimeChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} sx={{ marginTop: '10px' }}>
                <FormLabel>Google Map URL</FormLabel>
                <TextField
                  id="mapurl"
                  name="mapurl"
                  label=""
                  placeholder="Enter Google Map URL"
                  type="text"
                  size="small"
                  fullWidth
                  value={formik.values.mapurl}
                  onChange={formik.handleChange}
                  error={formik.touched.mapurl && Boolean(formik.errors.mapurl)}
                  helperText={formik.touched.mapurl && formik.errors.mapurl}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} sx={{ marginTop: '10px' }}>
                <FormLabel>Website URL</FormLabel>
                <TextField
                  id="websiteURL"
                  name="websiteURL"
                  label=""
                  placeholder="Enter Website URL"
                  type="text"
                  size="small"
                  fullWidth
                  value={formik.values.websiteURL}
                  onChange={formik.handleChange}
                  error={formik.touched.websiteURL && Boolean(formik.errors.websiteURL)}
                  helperText={formik.touched.websiteURL && formik.errors.websiteURL}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} sx={{ marginTop: '10px' }}>
                <FormLabel>Google Review URL</FormLabel>
                <TextField
                  id="googleReviewURL"
                  name="googleReviewURL"
                  label=""
                  placeholder="Google Review URL"
                  type="text"
                  size="small"
                  fullWidth
                  value={formik.values.googleReviewURL}
                  onChange={formik.handleChange}
                  error={formik.touched.googleReviewURL && Boolean(formik.errors.googleReviewURL)}
                  helperText={formik.touched.googleReviewURL && formik.errors.googleReviewURL}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} sx={{ marginTop: '10px' }}>
                <FormLabel>Select Hotel Image (For the best appearance, please select an image with a width of 178 pixels or less and a height of 40 pixels or less.)</FormLabel>
                <input
                  id="hotelImage"
                  name="hotelImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'block' }}
                />
                {formik.touched.hotelImage && formik.errors.hotelImage && <div style={{ color: 'red' }}>{formik.errors.hotelImage}</div>}
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" style={{ backgroundColor: Palette.info, color: '#fff' }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

EditHotel.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.array
};

export default EditHotel;
