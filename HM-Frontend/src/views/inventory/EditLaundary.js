/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Grid, MenuItem, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { patchApi } from 'views/services/api';
import { toast } from 'react-toastify';
import Palette from '../../ui-component/ThemePalette';
import { inventorySchema } from 'schema';

const departmentOptions = ['F&B', 'House Keeping', 'Kitchen', 'Laundry'];
const unitOfMeasureOptions = ['pieces', 'Kg'];

const EditLaundary = (props) => {
  const { open, handleClose, data } = props;

  const initialValues = {
    name: data?.name || '',
    department: data?.department || '',
    unitOfMeasure: data?.unitOfMeasure || '',
    totalQuantity: data?.quantity || '',
    distributed: data?.distributed || '',
    amount: data?.amount || ''
  };

  const AddData = async (values) => {
    try {
      console.log("api hit for update =>", `api/inventory/edit/${data._id}`);
      
      let response = await patchApi(`api/inventory/edit/${data._id}`, values);
      console.log("edit response =>", response);

      if (response.status === 200) {
        formik.resetForm();
        toast.success('Laundry Updated successfully');
      } else {
        toast.error(response.response.data.error);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: inventorySchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // Calculate remaining and totalAmount before sending the data
      values.remaining = values.totalQuantity - values.distributed;
      values.totalAmount = values.amount * values.totalQuantity;

      AddData(values);
      handleClose();
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Edit Laundry Item</Typography>
        <Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <form>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  id="name"
                  name="name"
                  label="Item Name"
                  fullWidth
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  id="department"
                  name="department"
                  label="Department"
                  fullWidth
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  error={formik.touched.department && Boolean(formik.errors.department)}
                  helperText={formik.touched.department && formik.errors.department}
                >
                  {departmentOptions.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  id="unitOfMeasure"
                  name="unitOfMeasure"
                  label="Unit Of Measure"
                  fullWidth
                  value={formik.values.unitOfMeasure}
                  onChange={formik.handleChange}
                  error={formik.touched.unitOfMeasure && Boolean(formik.errors.unitOfMeasure)}
                  helperText={formik.touched.unitOfMeasure && formik.errors.unitOfMeasure}
                >
                  {unitOfMeasureOptions.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="totalQuantity"
                  name="totalQuantity"
                  label="Total Quantity"
                  type="number"
                  fullWidth
                  value={formik.values.totalQuantity}
                  onChange={formik.handleChange}
                  error={formik.touched.totalQuantity && Boolean(formik.errors.totalQuantity)}
                  helperText={formik.touched.totalQuantity && formik.errors.totalQuantity}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="distributed"
                  name="distributed"
                  label="Distributed"
                  type="number"
                  fullWidth
                  value={formik.values.distributed}
                  onChange={formik.handleChange}
                  error={formik.touched.distributed && Boolean(formik.errors.distributed)}
                  helperText={formik.touched.distributed && formik.errors.distributed}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="remaining"
                  name="remaining"
                  label="Remaining"
                  type="number"
                  fullWidth
                  disabled
                  value={formik.values.totalQuantity - formik.values.distributed}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="amount"
                  name="amount"
                  label="Amount / Item"
                  type="number"
                  fullWidth
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="totalAmount"
                  name="totalAmount"
                  label="Total Amount"
                  type="number"
                  fullWidth
                  disabled
                  value={formik.values.amount * formik.values.totalQuantity}
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
          Update Item
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLaundary;
