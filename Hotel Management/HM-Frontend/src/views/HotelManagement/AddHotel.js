import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { hotelSchema } from 'schema';
import { FormLabel } from '@mui/material';
import { postApi } from 'views/services/api';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import style

const AddHotel = (props) => {
  const { open, handleClose } = props;
  const initialValues = {
    email: '',
    password: '',
    name: '',
    contact: '',
    address: '',
    role: 'HotelAdmin'
  };

  const AddHotel = async (values, resetForm) => {
    console.log("on AddHotel ==================>",values);
    try {
      const response = await postApi('api/hotel/register', values);

      console.log("response is  here ==================>",response);

      if (response.status === 200)
      toast.success('Successfully registered');
      resetForm();
      setTimeout(() => {
        handleClose();
      }, 200);
    } catch (err) {
      console.log(err);
      toast.success('Something Went Wrong!!');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: hotelSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log("on submit pr values are set for hotel regi ==>",values);
      values.email = values.email.toLowerCase(); 
      console.log("on submit pr values are set for hotel regi ==>", values);
      AddHotel(values, resetForm);
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
          <Typography variant="h6">Add New Hotel</Typography>
          <Typography>
            <Button onClick={handleClose} style={{ color: 'red' }}>
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6}>
                <FormLabel>Email</FormLabel>
                <TextField
                  id="email"
                  name="email"
                  size="small"
                  fullWidth
                  placeholder="Enter Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabel>Password</FormLabel>
                <TextField
                  id="password"
                  name="password"
                  type="text"
                  size="small"
                  fullWidth
                  placeholder="Enter password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Name</FormLabel>
                <TextField
                  id="name"
                  name="name"
                  size="small"
                  fullWidth
                  placeholder="Enter Hotel Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <FormLabel>Phone Number</FormLabel>
              <PhoneInput
                international
                placeholder="Enter phone number"
                defaultCountry="US"
                id="contact"
                name="contact"
                className="custom-phone-input"
                value={formik.values.contact}
                onChange={(value) => formik.setFieldValue('contact', value)}
              />
              {formik.touched.contact && formik.errors.contact && (
                <span style={{ color: 'red', fontSize: '0.875rem' }}>
                  {formik.errors.contact}
                </span>
              )}
            
                {/* <TextField
                  id="contact"
                  name="contact"
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="Enter Phone Number"
                  value={formik.values.contact}
                  onChange={formik.handleChange}
                  error={formik.touched.contact && Boolean(formik.errors.contact)}
                  helperText={formik.touched.contact && formik.errors.contact}
                /> */}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabel>Address</FormLabel>
                <TextField
                  id="address"
                  name="address"
                  size="small"
                  fullWidth
                  placeholder="Enter Physical address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>

              {/* //-------------------------------------------------------------------- */}
            </Grid>

            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Add Hotel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

AddHotel.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
export default AddHotel;
