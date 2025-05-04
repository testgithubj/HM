/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { getApi, postApi } from 'views/services/api';
import { toast } from 'react-toastify';
import Palette from '../../ui-component/ThemePalette';
import { laundarySchema } from 'schema';
import { useState } from 'react';
import { useEffect } from 'react';

const AddLaundary = (props) => {
  const { open, handleClose } = props;
  const [roomData, setRoomData] = useState([]);
  // Retrieve hotel data safely
  const hotel = JSON.parse(localStorage.getItem('hotelData') || '{}'); // Prevents null parsing errors

  // Fetch room data
  const fetchRoomData = async () => {
    if (!hotel?.hotelId) return; // Ensure hotelId exists before fetching
    try {
      const response = await getApi(`api/room/viewallrooms/${hotel.hotelId}`);
      setRoomData(response?.data || []); // Ensure data is set to an array
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [hotel?.hotelId]); // Re-run when `hotelId` changes

  // Ensure roomData is an array before filtering
  const bookingRoomData = Array.isArray(roomData)
    ? roomData.filter((room) => room?.bookingStatus === 'active' || room?.bookingStatus === 'check-in')
    : [];

  const initialValues = {
    roomNo: '',
    name: '',
    quantity: '',
    amount: ''
  };

  const AddData = async (values) => {
    try {
      // setIsLoding(true);
      values.hotelId = JSON.parse(localStorage.getItem('hotelData')).hotelId;

      console.log(values, 'this is for values');
      let response = await postApi('api/laundary/add', values);

      if (response.status === 200) {
        formik.resetForm();
        toast.success('Laundary added successfully');
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
    onSubmit: async (values) => {
      await AddData(values);
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
                <Grid item xs={12} sm={6} md={12}>
                  <FormControl fullWidth error={formik.touched.roomNo && Boolean(formik.errors.roomNo)}>
                    <InputLabel id="roomNo-label">Room No</InputLabel>
                    <Select
                      labelId="roomNo-label"
                      id="roomNo"
                      name="roomNo"
                      value={formik.values.roomNo}
                      onChange={formik.handleChange}
                      displayEmpty
                    >
                      {bookingRoomData && bookingRoomData.length > 0 ? (
                        bookingRoomData.map((room) => (
                          <MenuItem key={room._id} value={room.roomNo}>
                            {room.roomNo}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No rooms available</MenuItem>
                      )}
                    </Select>
                    {formik.touched.roomNo && formik.errors.roomNo && <FormHelperText>{formik.errors.roomNo}</FormHelperText>}
                  </FormControl>
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

export default AddLaundary;
