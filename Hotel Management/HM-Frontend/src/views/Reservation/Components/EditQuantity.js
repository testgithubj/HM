import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router';
import { patchApi } from 'views/services/api';
import PropTypes from 'prop-types';

const EditQuantity = (props) => {
  const params = useParams();
  const reservationId = params.id;
  const { open, handleClose, data } = props;
  const initialValues = {
    quantity: data?.quantity
  };

  const updateQuantity = async (values) => {
    try {
      await patchApi(`api/reservation/updatefoodquantity/${reservationId}`, values);

      toast.success('Quantity updated successfully');
      handleClose();
    } catch (e) {
      toast.error('cannot update quantity');
    }
  };
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      values.foodId = data?.id;
      updateQuantity(values, resetForm);
    }
  });

  return (
    <Dialog open={open} fullWidth aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Edit Food Data</Typography>
        <Button onClick={handleClose} style={{ color: 'red' }}>
          Cancel
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          {/* Quantity Field */}
          <TextField
            id="quantity"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            value={formik.values.quantity}
            onChange={formik.handleChange}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
          />

          <DialogActions>
            <Button type="submit" variant="contained" color="primary">
              Update Quantity
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditQuantity.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired
};
export default EditQuantity;
