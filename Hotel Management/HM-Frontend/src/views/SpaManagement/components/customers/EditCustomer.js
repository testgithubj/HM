import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { isAfter, parseISO, startOfDay } from 'date-fns';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import { toast } from 'react-toastify';
import { getApi, patchApi } from 'views/services/api';
import * as Yup from 'yup'; // Make sure to import Yup

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
          if (idCardType === 'PAN Card' && value) {
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
  bookingDate: Yup.date()
    .required('Date is required')
    .test('is-future-date', 'Booking date must be today or a future date', function (value) {
      return !value || isAfter(startOfDay(value), startOfDay(new Date())) || value.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
    }),
  bookingTime: Yup.date().required('Time is required'),
  notes: Yup.string()
});


         

const idCardTypes = ['PanCard', 'Aadhar Card', 'Driving License', 'Passport', 'Voter ID'];
const userTypes = ['Room', 'Guest'];

const EditSpaCustomer = ({ open, handleClose, customerData, updateCustomer }) => {
  console.log('customerData for edit', customerData);

  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState = {
    _id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    address: '',
    idCardType: '',
    idCardNumber: '', // Note: Schema uses idcardNumber (lowercase 'c')
    serviceOrPackage: 'Service', // Default to service
    serviceId: '',
    serviceName: '', // Added to match schema
    packageId: '',
    paymentStatus: 'Pending',
    bookingDate: null,
    bookingTime: null,
    userType: '',
    numberOfPersons: 1,
    price: 0,
    duration: 0,
    status: 'Pending', // Added to match schema
    notes: '',
    totalAmount: 0 // Added totalAmount field
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const fetchServicesAndPackages = async () => {
      try {
        const servicesResponse = await getApi('api/spa/services');

        console.log('servicesResponse', servicesResponse);
        setServices(servicesResponse.data);

        const packagesResponse = await getApi('api/spa/packages');
        console.log('packageResponse', packagesResponse);

        setPackages(packagesResponse.data);
      } catch (error) {
        console.error('Error fetching services/packages:', error);
        toast.error('Failed to load services/packages');
      }
    };
    fetchServicesAndPackages();

    if (open && customerData) {
      fetchServicesAndPackages();
      let bookingDate = customerData.bookingDateTime;
      let bookingTime = customerData.bookingDateTime;

      if (bookingDate && typeof bookingDate === 'string') {
        try {
          bookingDate = parseISO(bookingDate);
          if (isNaN(bookingDate.getTime())) bookingDate = new Date(customerData.bookingDateTime);
        } catch (e) {
          bookingDate = new Date();
        }
      } else if (!(bookingDate instanceof Date)) {
        bookingDate = new Date();
      }

      if (bookingTime && typeof bookingTime === 'string') {
        try {
          bookingTime = parseISO(bookingTime);
          if (isNaN(bookingTime.getTime())) bookingTime = new Date(customerData.bookingDateTime);
        } catch (e) {
          bookingTime = new Date();
        }
      } else if (!(bookingTime instanceof Date)) {
        bookingTime = new Date();
      }

      // Determine service or package based on serviceType
      let serviceOrPackage = customerData.serviceType || 'Service';

      // Calculate totalAmount based on price and numberOfPersons
      const price = customerData.price || 0;
      const numberOfPersons = customerData.numberOfPersons || 1;
      const totalAmount = price * numberOfPersons;

      setFormData({
        ...customerData,
        firstName: customerData.firstName || '',
        lastName: customerData.lastName || '',
        // Map idcardNumber to idCardNumber for frontend consistency
        idCardNumber: customerData.idcardNumber || '',
        bookingDate: bookingDate instanceof Date && !isNaN(bookingDate) ? bookingDate : null,
        bookingTime: bookingTime instanceof Date && !isNaN(bookingTime) ? bookingTime : null,
        userType: customerData.userType || '',
        numberOfPersons: customerData.numberOfPersons || 1,
        serviceOrPackage: serviceOrPackage,
        serviceId: customerData.serviceId?._id || customerData.serviceId || '',
        price: customerData.price || 0,
        duration: customerData.duration || 0,
        status: customerData.status || 'Pending',
        notes: customerData.notes || '',
        totalAmount: customerData.totalAmount || totalAmount // Use existing totalAmount or calculate it
      });
      setFormErrors({});
    } else if (!open) {
      setFormData(initialFormState);
      setFormErrors({});
    }
  }, [open, customerData]);

  // Calculate totalAmount whenever numberOfPersons or price changes
  useEffect(() => {
    const totalAmount = formData.numberOfPersons * formData.price;
    setFormData((prevData) => ({
      ...prevData,
      totalAmount: totalAmount
    }));
  }, [formData.numberOfPersons, formData.price]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      // If changing serviceOrPackage, reset the other selection
      if (name === 'serviceOrPackage') {
        if (value === 'Service') {
          newData.packageId = '';
        } else if (value === 'Package') {
          newData.serviceId = '';
          newData.duration = 0;
        }
      }

      // If changing numberOfPersons, recalculate totalAmount
      if (name === 'numberOfPersons') {
        newData.totalAmount = newData.price * value;
      }

      console.log(`Changed ${name} to ${value}`, newData);
      return newData;
    });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  // New function to handle phone number changes
  const handlePhoneChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      phoneNumber: value
    }));
    if (formErrors.phoneNumber) {
      setFormErrors({ ...formErrors, phoneNumber: '' });
    }
  };

  const handleDateChange = (name, date) => {
    const newDate = date instanceof Date && !isNaN(date) ? date : null;

    // For bookingDate, validate it's not in the past
    if (name === 'bookingDate' && newDate) {
      const today = startOfDay(new Date());
      const selectedDate = startOfDay(newDate);

      if (isAfter(today, selectedDate)) {
        setFormErrors({ ...formErrors, bookingDate: 'Booking date must be today or a future date' });
        return;
      }
    }

    setFormData({ ...formData, [name]: newDate });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    const selectedService = services.find((s) => s._id === serviceId);
    const price = selectedService?.price || 0;
    const totalAmount = price * formData.numberOfPersons;

    setFormData({
      ...formData,
      serviceId: serviceId,
      serviceName: selectedService?.name || '', // Add service name
      packageId: '',
      price: price,
      duration: selectedService?.duration || 0,
      totalAmount: totalAmount // Update totalAmount based on new price
    });
  };

  const handlePackageChange = (e) => {
    const packageId = e.target.value;

    console.log('packageId', packageId);
    const selectedPackage = packages.find((p) => p._id === packageId);
    const price = selectedPackage?.price || 0;
    const totalAmount = price * formData.numberOfPersons;

    setFormData({
      ...formData,
      serviceId: packageId,
      serviceName: selectedPackage?.name || '', // Add package name as service name
      price: price,
      duration: 0,
      totalAmount: totalAmount // Update totalAmount based on new price
    });
  };

  const validateForm = () => {
    const errors = {};

    // Basic validation for required fields
    if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!formData.phoneNumber?.trim()) errors.phoneNumber = 'Phone number is required';
    if (!formData.email?.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) errors.email = 'Email is invalid';
    if (!formData.address?.trim()) errors.address = 'Address is required';
    if (!formData.idCardNumber?.trim()) errors.idCardNumber = 'ID Card Number is required';

    // ID card type specific validation
    if (formData.idCardType === 'PAN Card' && formData.idCardNumber) {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.idCardNumber)) {
        errors.idCardNumber = 'Invalid PAN card format (e.g., ABCDE1234F)';
      }
    }

    // Booking date and time validation
    if (!formData.bookingDate) {
      errors.bookingDate = 'Booking date is required';
    } else {
      // Check if booking date is in the past
      const today = startOfDay(new Date());
      const selectedDate = startOfDay(formData.bookingDate);

      if (isAfter(today, selectedDate)) {
        errors.bookingDate = 'Booking date must be today or a future date';
      }
    }

    if (!formData.bookingTime) {
      errors.bookingTime = 'Booking time is required';
    }

    if (!formData.userType?.trim()) errors.userType = 'Guest type is required';
    if (!formData.numberOfPersons || formData.numberOfPersons < 1) {
      errors.numberOfPersons = 'Number of persons must be at least 1';
    }

    // Service or package validation
    if (formData.serviceOrPackage === 'Service' && !formData.serviceId) {
      errors.serviceId = 'Please select a service';
    } else if (formData.serviceOrPackage === 'Package' && !formData.serviceId) {
      errors.serviceId = 'Please select a package';
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      // Format the data for the backend
      console.log(formData.serviceId, 'this is before update');
      const dataToSubmit = {
        _id: formData._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        idCardType: formData.idCardType,
        idCardNumber: formData.idCardNumber, // This will be mapped to idcardNumber in the backend
        serviceOrPackage: formData.serviceOrPackage,
        // Set the right ID based on service or package
        serviceId: formData.serviceId,
        serviceType: formData.serviceOrPackage,
        numberOfPersons: formData.numberOfPersons,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        price: formData.price,
        duration: formData.serviceOrPackage === 'Service' ? formData.duration : 0,
        status: formData.status,
        notes: formData.notes || '',
        userType: formData.userType,
        totalAmount: formData.totalAmount // Include totalAmount in submission
      };

      // Make the API call
      console.log(dataToSubmit, 'this is the data to submit');
      const response = await patchApi('api/spa/spaCustomerUpdate', dataToSubmit);

      if (response.status === 200) {
        toast.success('Customer updated successfully');
        // Call the parent's updateCustomer function if provided
        if (typeof updateCustomer === 'function') {
          updateCustomer(response.data);
        }
        handleClose();
      } else {
        toast.error(response.message || 'Failed to update customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('An error occurred while updating customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  // Calculate today's date for date picker min date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth aria-labelledby="edit-customer-dialog-title">
      <DialogTitle id="edit-customer-dialog-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit Customer</Typography>
          <IconButton onClick={handleCancel} size="small" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {formData._id ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleInputChange}
                margin="dense"
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleInputChange}
                margin="dense"
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense" error={!!formErrors.phoneNumber}>
                <PhoneInput
                  international
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="custom-phone-input"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  inputStyle={{ width: '100%' }}
                />
                {formErrors.phoneNumber && <FormHelperText error>{formErrors.phoneNumber}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                margin="dense"
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" required>
                <InputLabel id="edit-user-type-label">Guest Type</InputLabel>
                <Select
                  labelId="edit-user-type-label"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  label="Guest Type"
                  error={!!formErrors.userType}
                >
                  {userTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.userType && <FormHelperText error>{formErrors.userType}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="service-or-package-label">Booking Type</InputLabel>
                <Select
                  labelId="service-or-package-label"
                  name="serviceOrPackage"
                  value={formData.serviceOrPackage}
                  onChange={handleInputChange}
                  label="Booking Type"
                >
                  <MenuItem value="Service">Service</MenuItem>
                  <MenuItem value="Package">Package</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.serviceOrPackage === 'Service' && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="dense" required error={!!formErrors.serviceId}>
                  <InputLabel id="service-label">Select Service</InputLabel>
                  <Select
                    labelId="service-label"
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleServiceChange}
                    label="Select Service"
                  >
                    {services.map((service) => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.serviceId && <FormHelperText error>{formErrors.serviceId}</FormHelperText>}
                </FormControl>
              </Grid>
            )}

            {formData.serviceOrPackage === 'Package' && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="dense" required error={!!formErrors.serviceId}>
                  <InputLabel id="package-label">Select Package</InputLabel>
                  <Select
                    labelId="package-label"
                    name="packageId"
                    value={formData.serviceId}
                    onChange={handlePackageChange}
                    label="Select Package"
                  >
                    {packages.map((pkg) => (
                      <MenuItem key={pkg._id} value={pkg._id}>
                        {pkg.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.serviceId && <FormHelperText error>{formErrors.serviceId}</FormHelperText>}
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={handleInputChange}
                margin="dense"
                error={!!formErrors.address}
                helperText={formErrors.address}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" required>
                <InputLabel id="edit-id-card-type-label">ID Card Type</InputLabel>
                <Select
                  labelId="edit-id-card-type-label"
                  name="idCardType"
                  value={formData.idCardType || 'PAN Card'}
                  onChange={handleInputChange}
                  label="ID Card Type"
                >
                  <MenuItem value="Aadharcard">Aadhar Card</MenuItem>
                    <MenuItem value="VoterIdCard">VoterId Card</MenuItem>
                    <MenuItem value="PanCard">Pan Card</MenuItem>
                    <MenuItem value="DrivingLicense">Driving License</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="idCardNumber"
                label="ID Card Number"
                fullWidth
                value={formData.idCardNumber}
                onChange={handleInputChange}
                margin="dense"
                error={!!formErrors.idCardNumber}
                helperText={formErrors.idCardNumber}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="numberOfPersons"
                name="numberOfPersons"
                label="Number of Persons"
                fullWidth
                type="number"
                value={formData.numberOfPersons}
                onChange={handleInputChange}
                margin="dense"
                error={!!formErrors.numberOfPersons}
                helperText={formErrors.numberOfPersons}
                required
                InputProps={{
                  inputProps: { min: 1 },
                  onWheel: (e) => {
                    e.target.blur();
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Booking Date"
                  value={formData.bookingDate}
                  onChange={(date) => handleDateChange('bookingDate', date)}
                  minDate={today}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="dense"
                      error={!!formErrors.bookingDate}
                      helperText={formErrors.bookingDate}
                      required
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Booking Time"
                  value={formData.bookingTime}
                  onChange={(date) => handleDateChange('bookingTime', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="dense"
                      error={!!formErrors.bookingTime}
                      helperText={formErrors.bookingTime}
                      required
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="price"
                name="price"
                label="Price"
                fullWidth
                value={formData.price}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>

            {formData.serviceOrPackage === 'Service' && (
              <Grid item xs={12} md={6}>
                <TextField
                  id="duration"
                  name="duration"
                  label="Duration"
                  fullWidth
                  value={formData.duration}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                id="totalAmount"
                name="totalAmount"
                label="Total Amount"
                fullWidth
                value={formData.totalAmount}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status || 'Pending'}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                fullWidth
                multiline
                rows={2}
                value={formData.notes || ''}
                onChange={handleInputChange}
                margin="dense"
              />
            </Grid>
          </Grid>
        ) : (
          <Typography>Loading customer data...</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={handleCancel} color="secondary" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSpaCustomer;
