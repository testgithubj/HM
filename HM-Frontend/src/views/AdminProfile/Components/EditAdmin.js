import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormLabel, Grid, TextField } from '@mui/material';
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
import PropTypes from 'prop-types';
import { userSchema } from 'schema';

const EditAdmin = (props) => {
  const { open, handleClose, data } = props;

  const initialValues = {
    username: data?.username || '',
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    phoneNumber: data?.phoneNumber || ''
  };

  const updateAdmin = async (values) => {
    try {
      let response = await patchApi(`api/user/edit`, values);
      if (response.status === 200) {
        toast.success('Admin updated successfully');
        handleClose();
      } else {
        toast.error('cannot update admin');
      }
    } catch (e) {
      console.log(e);
      toast.error('cannot update admin');
    }
  };
  const formik = useFormik({
    initialValues,
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      updateAdmin(values, resetForm);
    }
  });
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
          <Typography variant="h6">Edit Admin</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ width: '100%', minWidth: '600px' }}>
          <form>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              {/* username  */}
              <Grid item xs={12} sm={12} md={6} sx={{ marginTop: '10px' }}>
                <FormLabel>Email</FormLabel>
                <TextField
                  id="username"
                  name="username"
                  size="small"
                  fullWidth
                  disabled
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>
              {/* First Name */}
              <Grid item xs={12} sm={12} md={6} sx={{ marginTop: '10px' }}>
                <FormLabel>First Name</FormLabel>
                <TextField
                  id="firstName"
                  name="firstName"
                  size="small"
                  fullWidth
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </Grid>
              {/* First Name */}
              <Grid item xs={12} sm={12} md={6} sx={{ marginTop: '10px' }}>
                <FormLabel>Last Name</FormLabel>
                <TextField
                  id="lastName"
                  name="lastName"
                  size="small"
                  fullWidth
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>

              {/* phone number  */}
              <Grid item xs={12} sm={12} md={12} sx={{ marginTop: '10px' }}>
                <Grid item xs={6} sm={6} md={6} sx={{ marginTop: '10px' }}>
                  <FormLabel>Phone Number</FormLabel>
                  <TextField
                    id="phoneNumber"
                    name="phoneNumber"
                    label=""
                    type="number"
                    size="small"
                    fullWidth
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  />
                </Grid>
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

EditAdmin.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};
export default EditAdmin;
