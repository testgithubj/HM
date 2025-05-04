/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Grid, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { postApi } from 'views/services/api';
import { toast } from 'react-toastify';
import Palette from '../../ui-component/ThemePalette';
import { complaintSchema } from 'schema';
import { useNavigate } from 'react-router';

const AddComplaint = (props) => {
  const { open, handleClose } = props;
  const navigate = useNavigate();
  const initialValues = {
    type: '',
    description: ''
  };

  const AddData = async (values) => {
    try {
      // setIsLoding(true);
      values.hotelId = JSON.parse(localStorage.getItem('hotelData')).hotelId;
      let response = await postApi('api/complaint/add', values);

      if (response.status === 200) {
        formik.resetForm();
        toast.success('Complaint Registered successfully');
        navigate('/dashboard/complaint');
      } else {
        toast.error(response.response.data.error);
      }
    } catch (e) {
      toast.error(response.data.error);
    } finally {
      // setIsLoding(false);
    }
  };
  const formik = useFormik({
    initialValues,
    validationSchema: complaintSchema,
    onSubmit: async (values) => {
      AddData(values);
      handleClose();
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
          <Typography variant="h6">Add New Complaint</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={12}>
                  <TextField
                    id="type"
                    name="type"
                    label="Complaint Type"
                    fullWidth
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    helperText={formik.touched.type && formik.errors.type}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <TextField
                    id="description"
                    name="description"
                    label="Description"
                    fullWidth
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button
            onClick={formik.handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: Palette.info,
              '&:hover': { backgroundColor: Palette.infoDark }
            }}
          >
            Add Complaint
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddComplaint;
