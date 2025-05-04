import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormHelperText, FormLabel, Grid, MenuItem, Select, TextField } from '@mui/material';
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
import { laundarySchema } from 'schema';

const EditLaundary = (props) => {
  const { open, handleClose, data } = props;
  console.log('data for edit ==>', data);

  const initialValues = {
    roomNo: data?.roomNo,
    name: data?.name,
    quantity: data?.quantity,
    amount: data?.amount,
    status: data?.status
  };

  const AddData = async (values) => {
    try {
      console.log('api hit for login ==>', `api/laundary/edit/${data._id}`);

      let response = await patchApi(`api/laundary/edit/${data._id}`, values);
      console.log('edit response =>', response);

      if (response.status === 200) {
        formik.resetForm();
        toast.success('Laundary Updated successfully');
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
    validationSchema: laundarySchema,
    enableReinitialize: true,
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
          <Typography variant="h6">Edit Laundary</Typography>
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
                    id="roomNo"
                    name="roomNo"
                    label="room No"
                    type="number"
                    fullWidth
                    value={formik.values.roomNo}
                    onChange={formik.handleChange}
                    error={formik.touched.roomNo && Boolean(formik.errors.roomNo)}
                    helperText={formik.touched.roomNo && formik.errors.roomNo}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
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
                <Grid item xs={12} sm={6} md={12}>
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
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
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
                <Grid item xs={12} sm={6} md={12}>
                  <TextField
                    id="totalAmount"
                    name="totalAmount"
                    label="Total Amount"
                    type="number"
                    fullWidth
                    disabled
                    value={formik.values.amount * formik.values.quantity}
                  />
                </Grid>
                {/* //room type  */}
                {/* <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Laundary Status</FormLabel>
                  <Select
                    id="status"
                    name="status"
                    size="small"
                    placeholder="select status"
                    fullWidth
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                  >
                    <MenuItem value="default" disabled>
                      Select Status
                    </MenuItem>
                    <MenuItem value="true">Recieved</MenuItem>
                    <MenuItem value="false">Pending</MenuItem>
                  </Select>
                  <FormHelperText error={formik.touched.status && formik.errors.status}>
                    {formik.touched.status && formik.errors.status}
                  </FormHelperText>
                </Grid> */}
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
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditLaundary;
