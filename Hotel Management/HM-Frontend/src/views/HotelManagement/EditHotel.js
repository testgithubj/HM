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
import { FormLabel, FormControl, Input, FormHelperText } from '@mui/material';
import { patchApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useState } from 'react';
import { Upload } from '@mui/icons-material';
import PropTypes from 'prop-types';

const EditHotel = ({ open, handleClose, data }) => {
  const initialValues = {
    name: data?.name || '',
    email: data?.email || '',
    contact: data?.contact || '',
    address: data?.address || ''
  };

  const handleSubmit = async (values) => {
    try {
      const response = await patchApi(`api/hotel/edit/${data?._id}`, values);
      if (response.status === 200) {
        toast.success('Hotel Modified successfully');
        handleClose();
      } else {
        toast.error('Cannot modify Hotel');
      }
    } catch (e) {
      console.log(e);
      toast.error('Cannot modify Hotel');
    }
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: handleSubmit
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Hotel</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact"
                name="contact"
                value={formik.values.contact}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditHotel.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object
};

export default EditHotel;
