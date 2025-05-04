/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Grid, TextField, MenuItem } from '@mui/material';
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
import { inventorySchema } from 'schema';
import { useEffect } from 'react';

const departmentOptions = ['F&B', 'House Keeping', 'Kitchen', 'Laundary'];
const unitOfMeasureOptions = ['pieces', 'Kg'];

const AddLaundary = ({ open, handleClose }) => {
  const initialValues = {
    name: '',
    department: '',
    unitOfMeasure: '',
    totalQuantity: '',
    distributed: '',
    amount: ''
  };

  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);

  // add data part hgbnfhru
  // nfjgnfmkf
  const AddData = async (values) => {
    try {
      values.hotelId = JSON.parse(localStorage.getItem('hotelData')).hotelId;
      const dataToSend = {
        name: values.name,
        department: values.department,
        quantity: values.totalQuantity,
        unitOfMeasure: values.unitOfMeasure,
        amount: values.amount,
        distributed: values.distributed,
        hotelId: values.hotelId
      };
  
      console.log("Sending data:", dataToSend);
  
      let response = await postApi('api/inventory/add', dataToSend);
  
      console.log("Response received:", response); // Debugging log
  
      // Check for both 200 and 201 status codes
      if (response && (response.status === 200 || response.status === 201)) {
        formik.resetForm();
        toast.success('Inventory item added successfully');
      } else {
        console.error("Error response:", response);
        console.error("Full Error Response:", JSON.stringify(response, null, 2)); // Added debug log
        const errorMessage = response?.response?.data?.error || 'An unexpected error occurred';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Catch Block Error:", error);
      console.error("Full Error Response:", JSON.stringify(error, null, 2)); // Added debug log
  
      // Ensure a proper error message is displayed
      const errorMessage =
        error?.response?.data?.error || error?.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    }
  };
  
  

  

  const formik = useFormik({
    initialValues,
    validationSchema: inventorySchema,
    onSubmit: async (values) => {
      console.log("Form Submitted with values:", values); // Debugging log

      // Calculate remaining and totalAmount before sending the data
      values.remaining = values.totalQuantity - values.distributed;
      values.totalAmount = values.amount * values.totalQuantity;

      // Call AddData function to send the transformed data
      await AddData(values);
      handleClose();
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center' }}>
          Add New Laundry Item
        </Typography>
        <Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <form>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField id="name" name="name" label="Item Name" fullWidth value={formik.values.name} onChange={formik.handleChange} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} />
              </Grid>
              <Grid item xs={6}>
                <TextField select id="department" name="department" label="Department" fullWidth value={formik.values.department} onChange={formik.handleChange} error={formik.touched.department && Boolean(formik.errors.department)} helperText={formik.touched.department && formik.errors.department}>
                  {departmentOptions.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField select id="unitOfMeasure" name="unitOfMeasure" label="Unit Of Measure" fullWidth value={formik.values.unitOfMeasure} onChange={formik.handleChange} error={formik.touched.unitOfMeasure && Boolean(formik.errors.unitOfMeasure)} helperText={formik.touched.unitOfMeasure && formik.errors.unitOfMeasure}>
                  {unitOfMeasureOptions.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField id="totalQuantity" name="totalQuantity" label="Total Quantity" type="number" fullWidth value={formik.values.totalQuantity} onChange={formik.handleChange} error={formik.touched.totalQuantity && Boolean(formik.errors.totalQuantity)} helperText={formik.touched.totalQuantity && formik.errors.totalQuantity} />
              </Grid>
              <Grid item xs={6}>
                <TextField id="distributed" name="distributed" label="Distributed" type="number" fullWidth value={formik.values.distributed} onChange={formik.handleChange} error={formik.touched.distributed && Boolean(formik.errors.distributed)} helperText={formik.touched.distributed && formik.errors.distributed} />
              </Grid>
              <Grid item xs={6}>
                <TextField id="remaining" name="remaining" label="Remaining" type="number" fullWidth disabled value={formik.values.totalQuantity - formik.values.distributed} />
              </Grid>
              <Grid item xs={6}>
                <TextField id="amount" name="amount" label="Amount / Item" type="number" fullWidth value={formik.values.amount} onChange={formik.handleChange} error={formik.touched.amount && Boolean(formik.errors.amount)} helperText={formik.touched.amount && formik.errors.amount} />
              </Grid>
              <Grid item xs={6}>
                <TextField id="totalAmount" name="totalAmount" label="Total Amount" type="number" fullWidth disabled value={formik.values.amount * formik.values.totalQuantity} />
              </Grid>
            </Grid>
          </DialogContentText>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button onClick={formik.handleSubmit} variant="contained" sx={{ backgroundColor: Palette.info, '&:hover': { backgroundColor: Palette.infoDark } }}>
          Add Item
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLaundary;
