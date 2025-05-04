/* eslint-disable react/prop-types */
import ClearIcon from '@mui/icons-material/Clear';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getApi, postApi } from 'views/services/api';
import Palette from '../../../ui-component/ThemePalette';

const AddLaundaryDialog = (props) => {
  const { open, handleClose, reservationData } = props;
  const [roomData, setRoomData] = useState([]);
  const hotel = JSON.parse(localStorage.getItem('hotelData') || '{}');

  // Fetch room data
  const fetchRoomData = async () => {
    if (!hotel?.hotelId) return;
    try {
      const response = await getApi(`api/room/viewallrooms/${hotel.hotelId}`);
      setRoomData(response?.data || []);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [hotel?.hotelId]);

  const bookingRoomData = Array.isArray(roomData)
    ? roomData.filter((room) => room?.bookingStatus === 'active' || room?.bookingStatus === 'check-in')
    : [];

  const formik = useFormik({
    initialValues: {
      roomNo: '',
      name: '',
      quantity: '',
      amount: ''
    },
    // validationSchema: laundarySchema,
    onSubmit: async (values) => {
      await AddData(values);
      handleClose();
    }
  });

  // Set roomNo from reservationData when it changes
  useEffect(() => {
    if (reservationData?.roomNo) {
      formik.setFieldValue('roomNo', reservationData.roomNo);
    }
  }, [reservationData?.roomNo]);

  const AddData = async (values) => {
    try {
      values.hotelId = hotel.hotelId;
      const response = await postApi('api/laundary/add', values);

      if (response.status === 200) {
        formik.resetForm();
        toast.success('Laundry item added successfully');
      } else {
        toast.error(response.response.data.error);
      }
    } catch (e) {
      toast.error('Failed to add laundry item');
    }
  };

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
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      label="Room No"
                      id="roomNo"
                      name="roomNo"
                      value={formik.values.roomNo || ''}
                      InputProps={{
                        readOnly: true
                      }}
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <TextField
                    id="totalAmount"
                    name="totalAmount"
                    label="Total Amount"
                    type="number"
                    fullWidth
                    disabled
                    value={
                      formik.values.amount && formik.values.quantity ? Number(formik.values.amount) * Number(formik.values.quantity) : 0
                    }
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
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddLaundaryDialog;
