import ClearIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import { toast } from 'react-toastify';
import { postApi } from 'views/services/api';
import * as Yup from 'yup';

// Updated validation schema to include firstName, lastName, and email
const bookServiceSchema = Yup.object({
  userType: Yup.string().required('User type is required'),
  serviceId: Yup.string().required('Service is required'),
  // Guest user fields
  firstName: Yup.string().when('userType', {
    is: 'Guest',
    then: () => Yup.string().required('First name is required'),
    otherwise: () => Yup.string().notRequired()
  }),
  lastName: Yup.string().when('userType', {
    is: 'Guest',
    then: () => Yup.string().required('Last name is required'),
    otherwise: () => Yup.string().notRequired()
  }),
  email: Yup.string().when('userType', {
    is: 'Guest',
    then: () => Yup.string().email('Invalid email format').required('Email is required'),
    otherwise: () => Yup.string().email('Invalid email format').notRequired()
  }),
  phoneNumber: Yup.string().when('userType', {
    is: 'Guest',
    then: () => Yup.string().required('Phone number is required'),
    otherwise: () => Yup.string().notRequired()
  }),
  idCardType: Yup.string().when('userType', {
    is: 'Guest',
    then: () => Yup.string().required('ID card type is required'),
    otherwise: () => Yup.string().notRequired()
  }),
  idCardNumber: Yup.string().when(['userType', 'idCardType'], {
    is: (userType, idCardType) => userType === 'Guest',
    then: () => {
      let schema = Yup.string().required('Card number is required');
      // Additional validation for PAN card format
      return schema.test({
        name: 'cardNumberFormat',
        test: function (value) {
          const { idCardType } = this.parent;
          if (idCardType === 'PAN' && value) {
            return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value) || this.createError({ message: 'Invalid PAN card format' });
          }
          return true;
        }
      });
    },
    otherwise: () => Yup.string().notRequired()
  }),
  idFile: Yup.mixed().when('userType', {
    is: 'Guest',
    then: () => Yup.mixed().required('ID file (front) is required'),
    otherwise: () => Yup.mixed().notRequired()
  }),
  idFile2: Yup.mixed().notRequired(),
  address: Yup.string().when('userType', {
    is: 'Guest',
    then: () => Yup.string().required('Address is required'),
    otherwise: () => Yup.string().notRequired()
  }),
  // Room user fields
  roomNumber: Yup.number().when('userType', {
    is: 'Room',
    then: () => Yup.number().required('Room number is required'),
    otherwise: () => Yup.number().notRequired()
  }),
  serviceType: Yup.string().required('Service type is required'),
  // Common fields
  numberOfPersons: Yup.number().positive('must have positive number').required('Number of persons is required'),
  bookingDate: Yup.date().required('Date is required'),
  bookingTime: Yup.date().required('Time is required'),
  notes: Yup.string()
});

const userTypeOptions = ['Guest', 'Room'];
const idCardTypeOptions = ['PAN', 'Aadhar', 'Driving License', 'Passport', 'Voter ID'];

const BookService = ({ open, serviceText, serviceType, handleClose, serviceData }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  console.log(serviceType, 'this is service type');

  const initialValues = {
    userType: 'Guest',
    serviceId: serviceData?._id || '',
    serviceName: serviceData?.name || '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    idCardType: 'PAN',
    idCardNumber: '',
    idFile: null,
    idFile2: null,
    roomNumber: '',
    serviceType,
    numberOfPersons: 1,
    bookingDate: new Date(),
    bookingTime: new Date(),
    price: serviceData?.price || 0,
    duration: serviceData?.duration || 0,
    totalAmount: serviceData?.price || 0,
    notes: '',
    status: 'Pending',
    address: ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema: bookServiceSchema,
    onSubmit: async (values) => {
      await addServiceBooking(values);
    }
  });

  useEffect(() => {
    if (open) {
      // Reset form with new initial values that include serviceData
      formik.resetForm({
        values: {
          ...initialValues,
          serviceId: serviceData?._id || '',
          serviceName: serviceData?.name || '',
          price: serviceData?.price || 0,
          duration: serviceData?.duration || 0,
          totalAmount: serviceData?.price || 0,
          serviceType: serviceType || ''
        }
      });
    }
  }, [open, serviceData]);

  // Update form values when serviceData changes
  useEffect(() => {
    if (serviceData) {
      formik.setFieldValue('serviceId', serviceData._id || '');
      formik.setFieldValue('serviceName', serviceData.name || '');
      formik.setFieldValue('price', serviceData.price || 0);
      formik.setFieldValue('duration', serviceData.duration || 0);
      formik.setFieldValue('totalAmount', serviceData.price || 0);
      formik.setFieldValue('serviceType', serviceType || '');
    }
  }, [serviceData]);

  // Calculate total amount whenever number of persons or price changes
  useEffect(() => {
    const price = Number(formik.values.price) || 0;
    const persons = Number(formik.values.numberOfPersons) || 1;
    const total = price * persons;
    formik.setFieldValue('totalAmount', total);
  }, [formik.values.numberOfPersons, formik.values.price]);

  const addServiceBooking = async (values) => {
    try {
      setLoading(true);
      const hotelData = JSON.parse(localStorage.getItem('hotelData'));

      // Create FormData object to properly handle file uploads
      const formData = new FormData();

      // Append all regular fields
      formData.append('userType', values.userType);
      formData.append('serviceId', values.serviceId);
      formData.append('serviceName', values.serviceName);
      formData.append('numberOfPersons', values.numberOfPersons);
      formData.append('notes', values.notes);
      formData.append('status', values.status);
      formData.append('price', values.price);
      formData.append('duration', values.duration);
      formData.append('totalAmount', values.totalAmount);
      formData.append('hotelId', hotelData?.hotelId);
      formData.append('serviceType', serviceType);

      // Create and append the combined booking date/time
      const bookingDateTime = new Date(
        values.bookingDate.getFullYear(),
        values.bookingDate.getMonth(),
        values.bookingDate.getDate(),
        values.bookingTime.getHours(),
        values.bookingTime.getMinutes()
      );
      formData.append('bookingDateTime', bookingDateTime.toISOString());

      // Append user type specific fields
      if (values.userType === 'Guest') {
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('email', values.email);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('idCardType', values.idCardType);
        formData.append('idCardNumber', values.idCardNumber);
        formData.append('address', values.address);

        // Append file fields if they exist
        if (values.idFile) {
          formData.append('idFile', values.idFile);
        }
        if (values.idFile2) {
          formData.append('idFile2', values.idFile2);
        }
      } else if (values.userType === 'Room') {
        formData.append('roomNumber', values.roomNumber);
      }

      console.log('Sending form data for spa service booking', formData);

      const response = await postApi('api/spa/service-booking/add', formData);

      if (response && (response.status === 200 || response.status === 201)) {
        formik.resetForm();
        toast.success('Spa service booked successfully');
        handleClose();
      } else {
        const errorMessage = response?.response?.data?.error || 'Failed to book service';
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error?.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formik.values.userType === 'Guest') {
      formik.setFieldValue('roomNumber', '');
    } else if (formik.values.userType === 'Room') {
      formik.setFieldValue('firstName', '');
      formik.setFieldValue('lastName', '');
      formik.setFieldValue('email', '');
      formik.setFieldValue('idCardType', '');
      formik.setFieldValue('idCardNumber', '');
      formik.setFieldValue('phoneNumber', '');
      formik.setFieldValue('address', '');
      formik.setFieldValue('idFile', null);
      formik.setFieldValue('idFile2', null);
    }
  }, [formik.values.userType]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="book-service-dialog-title"
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1.5,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle
        id="book-service-dialog-title"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
          {serviceText}
        </Typography>
        <ClearIcon onClick={handleClose} sx={{ cursor: 'pointer', color: 'white' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  id="userType"
                  name="userType"
                  label="User Type"
                  fullWidth
                  value={formik.values.userType}
                  onChange={formik.handleChange}
                  error={formik.touched.userType && Boolean(formik.errors.userType)}
                  helperText={formik.touched.userType && formik.errors.userType}
                  size="small"
                >
                  {userTypeOptions.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  id="serviceName"
                  name="serviceName"
                  label="Service"
                  fullWidth
                  value={formik.values.serviceName}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </Grid>

              {formik.values.userType === 'Guest' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      fullWidth
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                      helperText={formik.touched.firstName && formik.errors.firstName}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      fullWidth
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                      helperText={formik.touched.lastName && formik.errors.lastName}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="email"
                      name="email"
                      label="Email"
                      fullWidth
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <PhoneInput
                        international
                        placeholder="Enter phone number"
                        defaultCountry="US"
                        id="phoneNumber"
                        name="phoneNumber"
                        className="custom-phone-input"
                        value={formik.values.phoneNumber}
                        onChange={(value) => formik.setFieldValue('phoneNumber', value)}
                      />
                      {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                        <FormHelperText error>{formik.errors.phoneNumber}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      id="idCardType"
                      name="idCardType"
                      label="ID Card Type"
                      fullWidth
                      value={formik.values.idCardType}
                      onChange={formik.handleChange}
                      error={formik.touched.idCardType && Boolean(formik.errors.idCardType)}
                      helperText={formik.touched.idCardType && formik.errors.idCardType}
                      size="small"
                    >
                      <MenuItem value="Aadharcard">Aadhar Card</MenuItem>
                      <MenuItem value="VoterIdCard">VoterId Card</MenuItem>
                      <MenuItem value="PanCard">Pan Card</MenuItem>
                      <MenuItem value="DrivingLicense">Driving License</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="idCardNumber"
                      name="idCardNumber"
                      label={`${formik.values.idCardType} Number`}
                      fullWidth
                      value={formik.values.idCardNumber}
                      onChange={(e) =>
                        formik.setFieldValue(
                          'idCardNumber',
                          formik.values.idCardType === 'PAN' ? e.target.value.toUpperCase() : e.target.value
                        )
                      }
                      error={formik.touched.idCardNumber && Boolean(formik.errors.idCardNumber)}
                      helperText={formik.touched.idCardNumber && formik.errors.idCardNumber}
                      placeholder={formik.values.idCardType === 'PAN' ? 'ABCDE1234F' : ''}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel component="legend">Upload ID Card Front</FormLabel>
                    <input
                      type="file"
                      id="idFile"
                      name="idFile"
                      onChange={(event) => formik.setFieldValue('idFile', event.currentTarget.files[0])}
                    />
                    {formik.touched.idFile && formik.errors.idFile && (
                      <Typography color="error" variant="caption">
                        {formik.errors.idFile}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormLabel component="legend">Upload ID Card Back</FormLabel>
                    <input
                      type="file"
                      id="idFile2"
                      name="idFile2"
                      onChange={(event) => formik.setFieldValue('idFile2', event.currentTarget.files[0])}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="address"
                      name="address"
                      label="Address"
                      fullWidth
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      error={formik.touched.address && Boolean(formik.errors.address)}
                      helperText={formik.touched.address && formik.errors.address}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="numberOfPersons"
                      name="numberOfPersons"
                      label="Number of Persons"
                      fullWidth
                      type="number"
                      value={formik.values.numberOfPersons}
                      onChange={formik.handleChange}
                      error={formik.touched.numberOfPersons && Boolean(formik.errors.numberOfPersons)}
                      helperText={formik.touched.numberOfPersons && formik.errors.numberOfPersons}
                      size="small"
                      InputProps={{
                        inputProps: { min: 1 },
                        onWheel: (e) => {
                          e.target.blur();
                        }
                      }}
                    />
                  </Grid>
                </>
              )}

              {formik.values.userType === 'Room' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="roomNumber"
                      name="roomNumber"
                      label="Room Number"
                      fullWidth
                      type="number"
                      value={formik.values.roomNumber}
                      onChange={formik.handleChange}
                      error={formik.touched.roomNumber && Boolean(formik.errors.roomNumber)}
                      helperText={formik.touched.roomNumber && formik.errors.roomNumber}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="numberOfPersons"
                      name="numberOfPersons"
                      label="Number of Persons"
                      fullWidth
                      type="number"
                      value={formik.values.numberOfPersons}
                      onChange={formik.handleChange}
                      error={formik.touched.numberOfPersons && Boolean(formik.errors.numberOfPersons)}
                      helperText={formik.touched.numberOfPersons && formik.errors.numberOfPersons}
                      size="small"
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Booking Date"
                    value={formik.values.bookingDate}
                    onChange={(value) => formik.setFieldValue('bookingDate', value)}
                    minDate={new Date()} // This prevents selecting dates before today
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: formik.touched.bookingDate && Boolean(formik.errors.bookingDate),
                        helperText: formik.touched.bookingDate && formik.errors.bookingDate
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Booking Time"
                    value={formik.values.bookingTime}
                    onChange={(value) => formik.setFieldValue('bookingTime', value)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: formik.touched.bookingTime && Boolean(formik.errors.bookingTime),
                        helperText: formik.touched.bookingTime && formik.errors.bookingTime
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  id="price"
                  name="price"
                  label="Price Per Person"
                  fullWidth
                  value={formik.values.price}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  id="totalAmount"
                  name="totalAmount"
                  label="Total Amount"
                  fullWidth
                  value={formik.values.totalAmount}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}></Typography>
                  }}
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  id="duration"
                  name="duration"
                  label="Duration (minutes)"
                  fullWidth
                  value={formik.values.duration}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  id="status"
                  name="status"
                  label="Status"
                  fullWidth
                  value="Pending"
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="notes"
                  name="notes"
                  label="Notes"
                  multiline
                  rows={3}
                  fullWidth
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  error={formik.touched.notes && Boolean(formik.errors.notes)}
                  helperText={formik.touched.notes && formik.errors.notes}
                  size="small"
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            borderRadius: 1,
            px: 3
          }}
        >
          {loading ? 'Booking...' : 'Book'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookService;
