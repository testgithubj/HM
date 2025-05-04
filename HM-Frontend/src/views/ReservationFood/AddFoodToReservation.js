import { FormLabel, Input } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { restaurantSchema } from 'schema';
import { postApi } from 'views/services/api';

const AddItems = (props) => {
  const { open, handleClose } = props;
  const initialValues = {
    itemName: '',
    itemImage: null,
    amount: ''
  };

  const AddData = async (values, resetForm) => {
    try {
      const formData = new FormData();
      formData.append('itemName', values.itemName);
      formData.append('itemImage', values.itemImage);
      formData.append('amount', values.amount);
      formData.append('hotelId', values.hotelId);

      let response = await postApi('api/restaurant/add', formData);
      if (response.status === 200) {
        toast.success('Item Added successfully');
        handleClose();
        resetForm();
      } else {
        toast.error('Cannot add item');
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      toast.error('Cannot add item');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: restaurantSchema,
    onSubmit: async (values, { resetForm }) => {
      values.hotelId = JSON.parse(localStorage.getItem('hotelData'))._id;
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
          <Typography variant="h6">Add New Item</Typography>
          <Typography>
            <Button onClick={handleClose} style={{ color: 'red' }}>
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6}>
                <FormLabel>Item Name</FormLabel>
                <TextField
                  id="itemName"
                  name="itemName"
                  size="small"
                  fullWidth
                  placeholder="Enter Item Name"
                  value={formik.values.itemName}
                  onChange={formik.handleChange}
                  error={formik.touched.itemName && Boolean(formik.errors.itemName)}
                  helperText={formik.touched.itemName && formik.errors.itemName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Upload Item Image</FormLabel>
                <Input
                  id="itemImage"
                  name="itemImage"
                  type="file"
                  onChange={(event) => formik.setFieldValue('itemImage', event.currentTarget.files[0])}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Amount</FormLabel>
                <TextField
                  id="amount"
                  name="amount"
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="in $"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                />
              </Grid>
              {/* //-------------------------------------------------------------------- */}
            </Grid>

            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Add Item
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
AddItems.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddItems;
