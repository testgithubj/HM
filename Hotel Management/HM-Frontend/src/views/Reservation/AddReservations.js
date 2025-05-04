import VisibilityIcon from '@mui/icons-material/Visibility';
import { FormLabel, Input } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ErrorMessage, FieldArray, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { reservationSchema } from 'schema';
import { getApi, postApi } from 'views/services/api';
// Import PhoneInput component and its CSS
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const AddReservation = (props) => {
  const { open, handleClose } = props;
  const today = new Date().toISOString().split('T')[0];

  const [roomNumbers, setRoomNumbers] = useState([]);
  const [roomData, setroomData] = useState([]);
  const [existingCustomerData, setExistingCustomerData] = useState([]);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const [amount, setAmount] = useState('');
  const [hotelName, setHotelName] = useState([]);

  const [initialValues, setInitialValues] = useState({
    roomType: 'default',
    roomNo: 'default',
    checkInDate: today,
    checkOutDate: '',
    advanceAmount: 0,
    totalAmount: '',
    customers: [
      { phoneNumber: '', firstName: '', lastName: '', email: '', idCardType: 'default', idcardNumber: '', idFile: '', address: '' }
    ]
  });

  useEffect(() => {
    const allHotel = async () => {
      const response = await getApi('api/hotel/viewallhotels');
      setHotelName(response?.data);
    };
    allHotel();
  }, []);

  useEffect(() => {
    setInitialValues((prevValues) => ({
      ...prevValues,
      phoneNumber: existingCustomerData?.phoneNumber || ''
    }));
  }, [existingCustomerData]);
  const role = JSON.parse(localStorage.getItem('hotelData'))?.role;

  const fetchroomData = async () => {
    try {
      const Url = role !== 'admin' ? `api/room/viewallrooms/${hotel?.hotelId}` : 'api/room/viewallrooms';
      const response = await getApi(Url);
      setroomData(response?.data);
      console.log('here res =>', response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchroomData();
  }, []);

  const handleRoomTypeChange = (value) => {
    const selectedRoomType = value;

    const selectedRoomNumbers = roomData.filter((room) => room.roomType === selectedRoomType).map((room) => room.roomNo);

    setRoomNumbers(selectedRoomNumbers);
    console.log('rooms --->', selectedRoomNumbers);

    setInitialValues((prev) => ({
      ...prev,
      roomType: selectedRoomType,
      roomNo: 'default'
    }));
  };

  const handleTotalAmount = (advanceAmount) => {
    if (advanceAmount < 0) {
      return;
    }
    const totalAmt = amount - advanceAmount;
    if (!isNaN(advanceAmount) && advanceAmount <= amount) {
      setInitialValues((prev) => ({
        ...prev,
        advanceAmount: advanceAmount,
        totalAmount: totalAmt
      }));
    }
    return totalAmt;
  };
  const user = JSON.parse(localStorage.getItem('hotelData'));

  const AddData = async (values, resetForm) => {
    try {
      role !== 'admin' && (values.hotelId = user.hotelId);
      const formData = new FormData();

      formData.append('hotelId', values.hotelId);
      formData.append('roomNo', values.roomNo);
      formData.append('checkInDate', values.checkInDate);
      formData.append('checkOutDate', values.checkOutDate);
      formData.append('advanceAmount', values.advanceAmount);
      formData.append('totalAmount', values.totalAmount);
      values.customers.forEach((customer) => {
        formData.append('idFile', customer.idFile);
      });

      formData.append('customers', JSON.stringify(values.customers));

      let response = await postApi('api/customer/doreservation', formData);

      console.log(response, 'this is the response for reservation');
      if (response.status === 200) {
        toast.success('Room successfully Reserved');
        handleClose();
        resetForm();
        setExistingCustomerData([]);
      } else if (response.response.status === 400 && response.response.data.error === 'File not provided') {
        toast.error('Please provide a file');
      } else if (response.response.status === 400 && response.response.data.error === 'Failed to add customer') {
        toast.error('Failed to add customer');
      } else if (
        response.response.status === 400 &&
        response.response.data.error === 'This room is already reserved on the given checkIn Date'
      ) {
        toast.error('This room is already reserved on the given checkIn Date');
      } else if (response.response.status === 400 && response.response.data.error === 'Room already reserved') {
        toast.error('Room already reserved');
      } else {
        toast.error('Failed to add reservation');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCustomerData = async (phoneNumber) => {
    try {
      // Extract just the number without country code for API call
      // This assumes your backend expects just the number part
      const numberOnly = phoneNumber.replace(/^\+\d+\s*/, '');

      const response = await getApi(`api/customer/view/${numberOnly}?hotelId=${hotel?.hotelId}`);
      console.log('existing customer response -------------- ==>', response);

      setExistingCustomerData(response?.data?.customerData[0]);
      return response?.data?.customerData[0];
    } catch (error) {
      console.log(error);
    }
  };

  const calculateAmount = (values) => {
    const checkInDate = new Date(values.checkInDate);
    const checkOutDate = new Date(values.checkOutDate);

    const numberOfDays = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24));
    const selectedRoom = roomData?.find((room) => room.roomType === values.roomType);

    if (numberOfDays == 0 && selectedRoom) {
      selectedRoom?.amount;
    } else {
      if (selectedRoom) {
        const totalAmount = selectedRoom.amount * numberOfDays;
        setAmount(totalAmount);
      }
    }
  };

  // Add custom style for PhoneInput
  const phoneInputStyle = {
    width: '100%',
    height: '50px',
    padding: '0',
    borderRadius: '4px',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    fontSize: '10px',
    lineHeight: '1.4375em',
    fontFamily: 'Roboto, sans-serif',
    color: 'rgba(0, 0, 0, 0.87)',
    outline: 'none'
  };

  return (
    <div>
      <style>
        {`
    .errorMessage {
      color: red;
    }

    /* Custom styling for the react-phone-number-input */
    .PhoneInput {
      width: 100%;
      margin-top: 8px;
    }

    .PhoneInputInput {
      flex: 1;
      min-width: 0;
      border: none;
      border-radius: 0;
      padding: 16px 14px;
      font-size: 16px;
      font-family: "Roboto", "Helvetica", "Arial", sans-serif;
      line-height: 1.4375em;
      color: rgba(0, 0, 0, 0.87);
      background: none;
      outline: none;
    }

    .PhoneInputCountry {
      margin-right: 8px;
      padding-left: 8px;
    }
     `}
      </style>

      <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center' }}>
            Add Room Reservation
          </Typography>
          <Typography>
            <Button
              onClick={() => {
                handleClose();
                setInitialValues({
                  roomType: 'default',
                  roomNo: 'default',
                  checkInDate: today,
                  checkOutDate: '',
                  advanceAmount: 0,
                  totalAmount: '',
                  customers: [
                    {
                      phoneNumber: '',
                      firstName: '',
                      lastName: '',
                      email: '',
                      idCardType: 'default',
                      idcardNumber: '',
                      idFile: '',
                      address: ''
                    }
                  ]
                });
                setAmount('');
              }}
              style={{ color: 'red' }}
            >
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Formik
            initialValues={initialValues}
            validationSchema={reservationSchema}
            onSubmit={(values, { resetForm }) => {
              console.log('on submit ==>', values);

              AddData(values, { resetForm });
            }}
            render={({ values, setFieldValue, errors, touched }) => (
              <Form encType="multipart/form-data">
                {/* //-------------------------Room Information______________________________________ */}
                <Typography style={{ marginBottom: '15px', marginTop: '15px' }} variant="h4">
                  Room Information
                </Typography>
                <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 2 }}>
                  {/* //room type  */}
                  <Grid item xs={12} sm={12} md={6}>
                    <Select
                      id="roomType"
                      name="roomType"
                      // size="small"
                      fullWidth
                      value={values.roomType}
                      onChange={(e) => {
                        setFieldValue('roomType', e.target.value);
                        handleRoomTypeChange(e.target.value);
                      }}
                      error={errors.roomType && Boolean(errors.roomType)}
                    >
                      <MenuItem value="default" disabled>
                        Select Room Type
                      </MenuItem>
                      {roomData
                        ?.filter((room, index, self) => self.findIndex((r) => r.roomType === room.roomType) === index)
                        .map((rooms, index) => (
                          <MenuItem key={index} value={rooms?.roomType}>
                            {rooms?.roomType}
                          </MenuItem>
                        ))}
                    </Select>
                    <ErrorMessage name="roomType" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    {/* <FormLabel>Room Number</FormLabel> */}
                    <Select
                      id="roomNo"
                      name="roomNo"
                      // size="small"
                      fullWidth
                      value={values.roomNo}
                      onChange={(e) => {
                        setFieldValue('roomNo', e.target.value);
                      }}
                      error={errors.roomNo && Boolean(errors.roomNo)}
                    >
                      <MenuItem value="default" disabled>
                        Select Room Number
                      </MenuItem>
                      {roomNumbers.map((roomNumber) => (
                        <MenuItem key={roomNumber} value={roomNumber}>
                          {roomNumber}
                        </MenuItem>
                      ))}
                    </Select>
                    <ErrorMessage name="roomNo" />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {/* <FormLabel>Check-In Date</FormLabel> */}
                    <TextField
                      id="checkInDate"
                      name="checkInDate"
                      label="Check-In Date"
                      // size="small"
                      type="date"
                      fullWidth
                      value={values.checkInDate}
                      onChange={(e) => {
                        setFieldValue('checkInDate', e.target.value);
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      inputProps={{
                        min: today
                      }}
                      error={errors.checkInDate && Boolean(errors.checkInDate)}
                    />
                    <ErrorMessage name="checkInDate" className="errorMessage" />
                  </Grid>
                  {/* Check-Out Date */}
                  <Grid item xs={12} sm={6}>
                    {/* <FormLabel>Check-Out Date</FormLabel> */}
                    <TextField
                      id="checkOutDate"
                      name="checkOutDate"
                      label="Check-Out Date"
                      // size="small"
                      type="date"
                      fullWidth
                      value={values.checkOutDate}
                      onChange={(e) => {
                        const newCheckOutDate = e.target.value;
                        setFieldValue('checkOutDate', newCheckOutDate);
                        calculateAmount({ ...values, checkOutDate: newCheckOutDate });
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      inputProps={{
                        min: values.checkInDate
                      }}
                      error={errors.checkOutDate && Boolean(errors.checkOutDate)}
                      helperText={touched.checkOutDate && errors.checkOutDate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {/* <FormLabel>Amount</FormLabel> */}
                    <TextField
                      id="amount"
                      name="amount"
                      label="Amount"
                      // size="small"
                      type="number"
                      fullWidth
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                      error={touched.amount && Boolean(errors.amount)}
                      helperText={touched.amount && errors.amount}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {/* <FormLabel>Advance Amount</FormLabel> */}
                    <TextField
                      id="advanceAmount"
                      name="advanceAmount"
                      label="Advance Amount"
                      // size="small"
                      type="text"
                      fullWidth
                      placeholder="Enter advance amount"
                      value={values.advanceAmount}
                      onChange={(e) => {
                        const inputAdvanceAmount = parseFloat(e.target.value);
                        if (!isNaN(inputAdvanceAmount) && inputAdvanceAmount <= amount && inputAdvanceAmount >= 0) {
                          setFieldValue('advanceAmount', inputAdvanceAmount);
                          const totalAmount = handleTotalAmount(inputAdvanceAmount);
                          setFieldValue('totalAmount', totalAmount);
                        } else {
                          const totalAmount = handleTotalAmount(inputAdvanceAmount);
                          setFieldValue('totalAmount', totalAmount);
                          setFieldValue('advanceAmount', '');
                        }
                      }}
                      error={touched.advanceAmount && Boolean(errors.advanceAmount)}
                      helperText={touched.advanceAmount && errors.advanceAmount}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="totalAmount"
                      name="totalAmount"
                      label="Total Amount"
                      // size="small"
                      type="text"
                      disabled
                      fullWidth
                      value={`$ ${amount - values.advanceAmount}`}
                      error={touched.totalAmount && Boolean(errors.totalAmount)}
                      helperText={touched.totalAmount && errors.totalAmount}
                    />
                  </Grid>
                  <ErrorMessage name="totalAmount" style={{ color: 'red' }} />

                  {role === 'admin' && (
                    <Grid item xs={12} sm={12} md={6}>
                      <Select
                        id="hotelId"
                        name="hotelId"
                        fullWidth
                        value={values.hotelId || 'default'} // Ensure the default value is set if nothing is selected
                        onChange={(e) => {
                          setFieldValue('hotelId', e.target.value);
                        }}
                        error={Boolean(errors.hotelId)}
                      >
                        <MenuItem value="default" disabled>
                          Select Hotel Name
                        </MenuItem>

                        {hotelName?.map((item, index) => (
                          <MenuItem key={index} value={item.hotelId}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>

                      {errors.hotelId && touched.hotelId && (
                        <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.hotelId}</div>
                      )}
                    </Grid>
                  )}

                  <ErrorMessage name="hotelId" style={{ color: 'red' }} />
                </Grid>
                <FieldArray
                  name="customers"
                  render={(arrayHelpers) => (
                    <div>
                      {values.customers.map((customer, index) => (
                        <div key={index}>
                          <>
                            {/* //------------------------- Customer Information______________________________________ */}
                            <Typography style={{ marginBottom: '15px', marginTop: '15px' }} variant="h4">
                              Customer Information
                            </Typography>
                            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 2 }}>
                              <Grid item xs={12} sm={6}>
                                <div style={{ marginTop: '8px' }}>
                                  <PhoneInput
                                    international
                                    defaultCountry="US"
                                    value={values.customers[index].phoneNumber}
                                    onChange={(phoneNumber) => {
                                      setFieldValue(`customers.${index}.phoneNumber`, phoneNumber);
                                      // Only fetch customer data if we have a complete phone number
                                      if (phoneNumber && phoneNumber.length > 8) {
                                        fetchCustomerData(phoneNumber).then((aa) => {
                                          if (aa) {
                                            setFieldValue(`customers.${index}.firstName`, aa.firstName || '');
                                            setFieldValue(`customers.${index}.lastName`, aa.lastName || '');
                                            setFieldValue(`customers.${index}.email`, aa.email || '');
                                            setFieldValue(`customers.${index}.idCardType`, aa.idCardType || '');
                                            setFieldValue(`customers.${index}.idcardNumber`, aa.idcardNumber || '');
                                            setFieldValue(`customers.${index}.address`, aa.address || '');
                                            setFieldValue(`customers.${index}.idFile`, aa.idFile || '');
                                          }
                                        });
                                      }
                                    }}
                                    style={phoneInputStyle}
                                  />
                                </div>
                                <div
                                  style={{
                                    color: '#f44336',
                                    fontSize: '0.75rem',
                                    marginTop: '4px',
                                    marginRight: '14px',
                                    marginLeft: '14px',
                                    fontFamily: 'Roboto,sans-serif',
                                    fontWeight: 'font-weight'
                                  }}
                                >
                                  <ErrorMessage name={`customers.${index}.phoneNumber`} />
                                </div>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  id={`customers.${index}.firstName`}
                                  name={`customers.${index}.firstName`}
                                  label="First Name"
                                  // size="small"
                                  fullWidth
                                  placeholder="Enter First Name"
                                  value={
                                    values.customers && values.customers.length > 0 && values.customers[index].firstName
                                      ? values.customers[index].firstName
                                      : ''
                                  }
                                  onChange={(e) => {
                                    setFieldValue(`customers.${index}.firstName`, e.target.value);
                                  }}
                                  error={
                                    errors.customers &&
                                    errors.customers.length > index &&
                                    errors.customers[index] &&
                                    errors.customers[index].firstName &&
                                    Boolean(errors.customers[index].firstName)
                                  }
                                  // helperText={touched.firstName && errors.firstName}
                                />
                                <div
                                  style={{
                                    color: '#f44336',
                                    fontSize: '0.75rem',
                                    marginTop: '4px',
                                    marginRight: '14px',
                                    marginLeft: '14px',
                                    fontFamily: 'Roboto,sans-serif',
                                    fontWeight: 'font-weight'
                                  }}
                                >
                                  <ErrorMessage name={`customers.${index}.firstName`} />
                                </div>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  id={`customers.${index}.lastName`}
                                  name={`customers.${index}.lastName`}
                                  label="Last Name"
                                  // size="small"
                                  fullWidth
                                  placeholder="Enter Last Name"
                                  value={
                                    values.customers && values.customers.length > 0 && values.customers[index].lastName
                                      ? values.customers[index].lastName
                                      : ''
                                  }
                                  onChange={(e) => {
                                    setFieldValue(`customers.${index}.lastName`, e.target.value);
                                  }}
                                  error={
                                    errors.customers &&
                                    errors.customers.length > index &&
                                    errors.customers[index] &&
                                    errors.customers[index].lastName &&
                                    Boolean(errors.customers[index].lastName)
                                  }
                                  // helperText={touched.lastName && errors.lastName}
                                />
                                <div
                                  style={{
                                    color: '#f44336',
                                    fontSize: '0.75rem',
                                    marginTop: '4px',
                                    marginRight: '14px',
                                    marginLeft: '14px',
                                    fontFamily: 'Roboto,sans-serif',
                                    fontWeight: 'font-weight'
                                  }}
                                >
                                  <ErrorMessage name={`customers.${index}.lastName`} />
                                </div>
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  id={`customers.${index}.email`}
                                  name={`customers.${index}.email`}
                                  label="Email"
                                  // size="small"
                                  fullWidth
                                  placeholder="Enter Email"
                                  value={
                                    values.customers && values.customers.length > 0 && values.customers[index].email
                                      ? values.customers[index].email
                                      : ''
                                  }
                                  onChange={(e) => {
                                    setFieldValue(`customers.${index}.email`, e.target.value);
                                  }}
                                  error={
                                    errors.customers &&
                                    errors.customers.length > index &&
                                    errors.customers[index] &&
                                    errors.customers[index].email &&
                                    Boolean(errors.customers[index].email)
                                  }
                                  // helperText={touched.email && errors.email}
                                />
                                <div
                                  style={{
                                    color: '#f44336',
                                    fontSize: '0.75rem',
                                    marginTop: '4px',
                                    marginRight: '14px',
                                    marginLeft: '14px',
                                    fontFamily: 'Roboto,sans-serif',
                                    fontWeight: 'font-weight'
                                  }}
                                >
                                  <ErrorMessage name={`customers.${index}.email`} />
                                </div>
                              </Grid>
                              <Grid item xs={12} sm={12} md={6}>
                                <Select
                                  id={`customers.${index}.idCardType`}
                                  name={`customers.${index}.idCardType`}
                                  // size="small"
                                  fullWidth
                                  value={
                                    values.customers && values.customers.length > 0 && values.customers[index].idCardType
                                      ? values.customers[index].idCardType
                                      : '' || 'default'
                                  }
                                  onChange={(e) => {
                                    setFieldValue(`customers.${index}.idCardType`, e.target.value);
                                  }}
                                  error={
                                    errors.customers &&
                                    errors.customers.length > index &&
                                    errors.customers[index] &&
                                    errors.customers[index].idCardType &&
                                    Boolean(errors.customers[index].idCardType)
                                  }
                                >
                                  <MenuItem value="default" disabled>
                                    Select Id Card Type
                                  </MenuItem>
                                  <MenuItem value="Aadharcard">Aadhar Card</MenuItem>
                                  <MenuItem value="VoterIdCard">VoterId Card</MenuItem>
                                  <MenuItem value="PanCard">Pan Card</MenuItem>
                                  <MenuItem value="DrivingLicense">Driving License</MenuItem>
                                </Select>
                                <div
                                  style={{
                                    color: '#f44336',
                                    fontSize: '0.75rem',
                                    marginTop: '4px',
                                    marginRight: '14px',
                                    marginLeft: '14px',
                                    fontFamily: 'Roboto,sans-serif',
                                    fontWeight: 'font-weight'
                                  }}
                                >
                                  <ErrorMessage name={`customers.${index}.idCardType`} />
                                </div>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  id={`customers.${index}.idcardNumber`}
                                  name={`customers.${index}.idcardNumber`}
                                  label="Id Card Number"
                                  // size="small"
                                  type="text"
                                  fullWidth
                                  placeholder="Enter card number"
                                  value={
                                    values.customers && values.customers.length > 0 && values.customers[index].idcardNumber
                                      ? values.customers[index].idcardNumber
                                      : ''
                                  }
                                  onChange={(e) => {
                                    setFieldValue(`customers.${index}.idcardNumber`, e.target.value);
                                  }}
                                  error={
                                    errors.customers &&
                                    errors.customers.length > index &&
                                    errors.customers[index] &&
                                    errors.customers[index].idcardNumber &&
                                    Boolean(errors.customers[index].idcardNumber)
                                  }
                                  // helperText={touched.idcardNumber && errors.idcardNumber}
                                />
                                <div
                                  style={{
                                    color: '#f44336',
                                    fontSize: '0.75rem',
                                    marginTop: '4px',
                                    marginRight: '14px',
                                    marginLeft: '14px',
                                    fontFamily: 'Roboto,sans-serif',
                                    fontWeight: 'font-weight'
                                  }}
                                >
                                  <ErrorMessage name={`customers.${index}.idcardNumber`} />
                                </div>
                              </Grid>

                              {existingCustomerData?.idFile ? (
                                <Grid item xs={12} sm={6}>
                                  <FormLabel>Id Proof</FormLabel>

                                  <Typography style={{ color: 'black', marginTop: '7px' }}>
                                    <a
                                      href={values.customers[index].idFile}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ textDecoration: 'none' }}
                                    >
                                      <Button startIcon={<VisibilityIcon />} variant="contained" color="primary">
                                        View ID Proof
                                      </Button>
                                    </a>
                                  </Typography>
                                </Grid>
                              ) : (
                                <Grid item xs={12} sm={6}>
                                  <FormLabel>Upload ID Card File</FormLabel>
                                  <Input
                                    id={`customers.${index}.idFile`}
                                    name={`customers.${index}.idFile`}
                                    type="file"
                                    onChange={(event) => setFieldValue(`customers.${index}.idFile`, event.currentTarget.files[0])}
                                  />
                                  <div
                                    style={{
                                      color: '#f44336',
                                      fontSize: '0.75rem',
                                      marginTop: '4px',
                                      marginRight: '14px',
                                      marginLeft: '14px',
                                      fontFamily: 'Roboto,sans-serif',
                                      fontWeight: 'font-weight'
                                    }}
                                  >
                                    <ErrorMessage name={`customers.${index}.idFile`} />
                                  </div>
                                </Grid>
                              )}

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  id={`customers.${index}.address`}
                                  name={`customers.${index}.address`}
                                  label="Address"
                                  // size="small"
                                  fullWidth
                                  placeholder="Enter Physical Address"
                                  value={
                                    values.customers && values.customers.length > 0 && values.customers[index].address
                                      ? values.customers[index].address
                                      : ''
                                  }
                                  onChange={(e) => {
                                    setFieldValue(`customers.${index}.address`, e.target.value);
                                  }}
                                  error={
                                    errors.customers &&
                                    errors.customers.length > index &&
                                    errors.customers[index] &&
                                    errors.customers[index].address &&
                                    Boolean(errors.customers[index].address)
                                  }
                                  // helperText={touched.address && errors.address}
                                />
                                <div
                                  style={{
                                    color: '#f44336',
                                    fontSize: '0.75rem',
                                    marginTop: '4px',
                                    marginRight: '14px',
                                    marginLeft: '14px',
                                    fontFamily: 'Roboto,sans-serif',
                                    fontWeight: 'font-weight'
                                  }}
                                >
                                  <ErrorMessage name={`customers.${index}.address`} />
                                </div>
                              </Grid>
                            </Grid>
                          </>
                          {index !== 0 && (
                            <Button type="button" variant="outlined" sx={{ margin: '10px 0px' }} onClick={() => arrayHelpers.remove(index)}>
                              - Remove
                            </Button>
                          )}
                          {index === 0 && (
                            <Button
                              type="button"
                              variant="outlined"
                              sx={{ margin: '10px 0px' }}
                              onClick={() =>
                                arrayHelpers.insert(index + 1, {
                                  phoneNumber: '',
                                  firstName: '',
                                  lastName: '',
                                  email: '',
                                  idCardType: '',
                                  idcardNumber: '',
                                  idFile: '',
                                  address: ''
                                })
                              }
                            >
                              + Add Person
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                />
                <DialogActions>
                  <Button type="submit" variant="contained" color="primary">
                    Add Reservation
                  </Button>
                </DialogActions>
              </Form>
            )}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
AddReservation.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddReservation;
