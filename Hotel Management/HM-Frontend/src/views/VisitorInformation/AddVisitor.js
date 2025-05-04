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
import { postApi } from 'views/services/api';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import moment from 'moment';

const AddVisitor = (props) => {
  const { open, handleClose } = props;

  const hotelData = JSON.parse(localStorage.getItem('hotelData'));

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
    visitTime: ''
  };

  const AddData = async (values, resetForm) => {
    try {
      const currentTime = moment().format('h:mm A');
      values.visitTime = currentTime;

      values.hotelId = hotelData._id;
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
      formData.append('visitTime', values.visitTime);

      let response = await postApi('api/visitors/add', formData);
      if (response.status === 200) {
        toast.success('Visitor Added Successfully');
        handleClose();
        resetForm();
      } else {
        toast.error(response?.response?.data?.error);
      }
    } catch (e) {
      console.log(e);
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
          <Typography variant="h6">Add Visitor</Typography>
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
                  <FormLabel>Phone Number</FormLabel>
                  <TextField
                    id="phoneNumber"
                    name="phoneNumber"
                    size="small"
                    type="string"
                    fullWidth
                    placeholder="Enter Phone Number"
                    value={formik.values.phoneNumber}
                    onChange={(e) => {
                      const phoneNumber = e.target.value.replace(/\D/g, '');

                      const truncatedPhoneNumber = phoneNumber.substring(0, 10);

                      formik.setFieldValue('phoneNumber', truncatedPhoneNumber);
                    }}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  />
                </Grid>
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
                  <FormLabel>Upload ID Card File</FormLabel>
                  <Input
                    id="idFile"
                    name="idFile"
                    type="file"
                    onChange={(event) => formik.setFieldValue('idFile', event.currentTarget.files[0])}
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
              </Grid>
            </>

            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Add Visitor
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
AddVisitor.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
export default AddVisitor;
