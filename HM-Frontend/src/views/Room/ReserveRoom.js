// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { FormLabel, Input } from '@mui/material';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import Grid from '@mui/material/Grid';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import { ErrorMessage, FieldArray, Form, Formik } from 'formik';
// import PropTypes from 'prop-types';
// import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { reservationSchema } from 'schema';
// import { getApi, postApi } from 'views/services/api';

// const ReserveRoom = (props) => {
//   const { open, handleClose, roomDataByProps } = props;
//   const today = new Date().toISOString().split('T')[0];

//   const [roomData, setroomData] = useState([]);
//   const [existingCustomerData, setExistingCustomerData] = useState([]);
//   const hotel = JSON.parse(localStorage.getItem('hotelData'));
//   const [amount, setAmount] = useState('');

//   const [initialValues, setInitialValues] = useState({
//     roomType: '',
//     roomNo: '',
//     checkInDate: today,
//     checkOutDate: '',
//     advanceAmount: '',
//     totalAmount: '',
//     customers: [
//       { phoneNumber: '', firstName: '', lastName: '', email: '', idCardType: 'default', idcardNumber: '', idFile: '', address: '' }
//     ]
//   });

//   useEffect(() => {
//     setInitialValues((prevValues) => ({
//       ...prevValues,
//       phoneNumber: existingCustomerData?.phoneNumber || '',
//       roomType: roomDataByProps?.roomType,
//       roomNo: roomDataByProps?.roomNo
//     }));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [roomDataByProps]);

//   const fetchroomData = async () => {
//     try {
//       // const response = await getApi(`api/room/viewallrooms/${hotel._id}`);
//       const response = await getApi(`api/room/viewallrooms/${hotel?.hotelId}`);
//       setroomData(response?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchroomData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleTotalAmount = (advanceAmount) => {
//     if (advanceAmount < 0) {
//       return;
//     }
//     const totalAmt = amount - advanceAmount;
//     if (!isNaN(advanceAmount) && advanceAmount <= amount) {
//       setInitialValues((prev) => ({
//         ...prev,
//         advanceAmount: advanceAmount,
//         totalAmount: totalAmt
//       }));
//     }
//     return totalAmt;
//   };

//   const AddData = async (values, resetForm) => {
//     console.log('values =>', values);

//     try {
//       values.hotelId = JSON.parse(localStorage.getItem('hotelData')).hotelId;
//       console.log('values.hotelId ===>', values.hotelId);

//       const formData = new FormData();
//       formData.append('hotelId', values.hotelId);
//       formData.append('roomNo', values.roomNo);
//       formData.append('checkInDate', values.checkInDate);
//       formData.append('checkOutDate', values.checkOutDate);
//       formData.append('advanceAmount', values.advanceAmount);
//       formData.append('totalAmount', values.totalAmount);
//       formData.append('customers', JSON.stringify(values.customers));
//       values.customers.forEach((customer) => {
//         formData.append('idFile', customer.idFile);
//       });

//       let response = await postApi('api/customer/doreservation', formData);

//       console.log(formData, 'this is form data ');
//       if (response.status === 200) {
//         toast.success('Room successfully Reserved');
//         handleClose();
//         resetForm();
//         setExistingCustomerData([]);
//         // Update the bookingStatus for the relevant row
//         setRows((prevRows) => prevRows.map((row) => (row.id === reservedRoomId ? { ...row, bookingStatus: 'true' } : row)));
//       } else if (response.response.status === 400 && response.response.data.error === 'File not provided') {
//         toast.error('Please provide a file');
//       } else if (response.response.status === 400 && response.response.data.error === 'Failed to add customer') {
//         toast.error('Failed to add customer');
//       } else if (
//         response.response.status === 400 &&
//         response.response.data.error === 'This room is already reserved on the given checkIn Date'
//       ) {
//         toast.error('This room is already reserved on the given checkIn Date');
//       } else if (response.response.status === 400 && response.response.data.error === 'Room already reserved') {
//         toast.error('Room already reserved');
//       } else {
//         toast.error('Failed to add reservation');
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const fetchCustomerData = async (phoneNumber) => {
//     try {
//       // const response = await getApi(`api/customer/view/${phoneNumber}?hotelId=${hotel._id}`);
//       const response = await getApi(`api/customer/view/${phoneNumber}?hotelId=${hotel?.hotelId}`);

//       setExistingCustomerData(response?.data?.customerData[0]);
//       return response?.data?.customerData[0];
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const calculateAmount = (values) => {
//     console.log('values =>', values);
//     const checkInDate = new Date(values.checkInDate);
//     const checkOutDate = new Date(values.checkOutDate);
//     const numberOfDays = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24));
//     const selectedRoom = roomData?.find((room) => room.roomType === values.roomType);

//     if (numberOfDays == 0 && selectedRoom) {
//       setAmount(selectedRoom?.amount);
//     } else {
//       if (selectedRoom) {
//         const totalAmount = selectedRoom.amount * numberOfDays;
//         setAmount(totalAmount);
//       }
//     }
//   };

//   return (
//     <div>
//       <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
//         <DialogTitle
//           id="scroll-dialog-title"
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between'
//           }}
//         >
//           <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center' }}>
//             Add Room Reservation
//           </Typography>
//           <Typography>
//             <Button
//               onClick={() => {
//                 handleClose();
//                 setInitialValues({
//                   roomType: '',
//                   roomNo: '',
//                   checkInDate: today,
//                   checkOutDate: '',
//                   advanceAmount: '',
//                   totalAmount: '',
//                   customers: [
//                     {
//                       phoneNumber: '',
//                       firstName: '',
//                       lastName: '',
//                       email: '',
//                       idCardType: 'default',
//                       idcardNumber: '',
//                       idFile: '',
//                       address: ''
//                     }
//                   ]
//                 });
//                 setAmount('');
//               }}
//               style={{ color: 'red' }}
//             >
//               Cancel
//             </Button>
//           </Typography>
//         </DialogTitle>

//         <DialogContent dividers>
//           <Formik
//             initialValues={initialValues}
//             validationSchema={reservationSchema}
//             enableReinitialize={true}
//             onSubmit={(values, { resetForm }) => {
//               AddData(values, { resetForm });
//             }}
//             render={({ values, setFieldValue, errors, touched }) => {
//               return (
//                 <>
//                   <Form encType="multipart/form-data">
//                     {/* //-------------------------Room Information______________________________________ */}
//                     <Typography style={{ marginBottom: '15px', marginTop: '15px' }} variant="h4">
//                       Room Information
//                     </Typography>
//                     <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 2 }}>
//                       {/* //room type  */}
//                       <Grid item xs={12} sm={12} md={6}>
//                         <TextField
//                           id="roomType"
//                           name="roomType"
//                           label="Room Type"
//                           // size="small"
//                           fullWidth
//                           value={roomDataByProps?.roomType}
//                           onChange={(e) => {
//                             setFieldValue('roomType', e.target.value);
//                           }}
//                           error={errors.roomType && Boolean(errors.roomType)}
//                           helperText={touched.roomType && errors.roomType}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={12} md={6}>
//                         <TextField
//                           id="roomNo"
//                           name="roomNo"
//                           label="Room Number"
//                           // size="small"
//                           fullWidth
//                           value={roomDataByProps?.roomNo}
//                           onChange={(e) => {
//                             setFieldValue('roomNo', e.target.value);
//                           }}
//                           error={errors.roomNo && Boolean(errors.roomNo)}
//                           helperText={touched.roomNo && errors.roomNo}
//                         />
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <TextField
//                           id="checkInDate"
//                           name="checkInDate"
//                           label="Check-In Date"
//                           // size="small"
//                           type="date"
//                           fullWidth
//                           value={values.checkInDate}
//                           onChange={(e) => {
//                             setFieldValue('checkInDate', e.target.value);
//                             setInitialValues((prev) => ({
//                               ...prev,
//                               checkInDate: e.target.value
//                             }));
//                           }}
//                           InputLabelProps={{
//                             shrink: true
//                           }}
//                           inputProps={{
//                             min: today
//                           }}
//                           error={errors.checkInDate && Boolean(errors.checkInDate)}
//                           helperText={touched.checkInDate && errors.checkInDate}
//                         />
//                       </Grid>
//                       {/* Check-Out Date */}
//                       <Grid item xs={12} sm={6}>
//                         {/* <FormLabel>Check-Out Date</FormLabel> */}
//                         <TextField
//                           id="checkOutDate"
//                           name="checkOutDate"
//                           label="Check-Out Date"
//                           // size="small"
//                           type="date"
//                           fullWidth
//                           value={values.checkOutDate}
//                           onChange={(e) => {
//                             const newCheckOutDate = e.target.value;
//                             setInitialValues((prev) => ({
//                               ...prev,
//                               checkOutDate: newCheckOutDate
//                             }));
//                             setFieldValue('checkOutDate', newCheckOutDate);
//                             calculateAmount({ ...values, checkOutDate: newCheckOutDate });
//                           }}
//                           InputLabelProps={{
//                             shrink: true
//                           }}
//                           inputProps={{
//                             min: values.checkInDate
//                           }}
//                           error={errors.checkOutDate && Boolean(errors.checkOutDate)}
//                           helperText={touched.checkOutDate && errors.checkOutDate}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <TextField
//                           id="amount"
//                           name="amount"
//                           label="Amount"
//                           // size="small"
//                           type="text"
//                           fullWidth
//                           // placeholder="Enter Phone "
//                           // value={`Rs ${amount}`}

//                           value={amount}
//                           onChange={(e) => {
//                             setAmount(e.target.value);
//                           }}
//                           error={touched.amount && Boolean(errors.amount)}
//                           helperText={touched.amount && errors.amount}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <TextField
//                           id="advanceAmount"
//                           name="advanceAmount"
//                           label="Advance Amount"
//                           // size="small"
//                           type="text"
//                           fullWidth
//                           placeholder="Enter advance amount"
//                           value={values.advanceAmount}
//                           onChange={(e) => {
//                             const inputAdvanceAmount = parseFloat(e.target.value);
//                             if (!isNaN(inputAdvanceAmount) && inputAdvanceAmount <= amount && inputAdvanceAmount >= 0) {
//                               setFieldValue('advanceAmount', inputAdvanceAmount);
//                               const totalAmount = handleTotalAmount(inputAdvanceAmount);
//                               setFieldValue('totalAmount', totalAmount);
//                             } else {
//                               const totalAmount = handleTotalAmount(inputAdvanceAmount);
//                               setFieldValue('totalAmount', totalAmount);
//                               setFieldValue('advanceAmount', ''); // Clear the input if it exceeds the total amount or is negative
//                             }
//                           }}
//                           error={touched.advanceAmount && Boolean(errors.advanceAmount)}
//                           helperText={touched.advanceAmount && errors.advanceAmount}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <TextField
//                           id="totalAmount"
//                           name="totalAmount"
//                           label="Total Amount"
//                           // size="small"
//                           type="text"
//                           fullWidth
//                           value={`Rs ${amount - values.advanceAmount}`}
//                           error={touched.totalAmount && Boolean(errors.totalAmount)}
//                           helperText={touched.totalAmount && errors.totalAmount}
//                         />
//                       </Grid>
//                     </Grid>
//                     <FieldArray
//                       name="customers"
//                       render={(arrayHelpers) => (
//                         <div>
//                           {values?.customers?.map((customer, index) => (
//                             <div key={index}>
//                               <>
//                                 {/* //------------------------- Customer Information______________________________________ */}
//                                 <Typography style={{ marginBottom: '15px', marginTop: '15px' }} variant="h4">
//                                   Customer Information
//                                 </Typography>
//                                 <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 2 }}>
//                                   <Grid item xs={12} sm={6}>
//                                     <TextField
//                                       id={`customers.${index}.phoneNumber`}
//                                       name={`customers.${index}.phoneNumber`}
//                                       label="Phone Number"
//                                       // size="small"
//                                       type="text"
//                                       fullWidth
//                                       placeholder="Enter Phone Number"
//                                       value={values.customers[index].phoneNumber}
//                                       onChange={async (e) => {
//                                         const phoneNumber = e.target.value.replace(/\D/g, '').slice(0, 10);
//                                         setFieldValue(`customers.${index}.phoneNumber`, phoneNumber);
//                                         setFieldValue(`customers.${index}.idFile`, '');

//                                         if (phoneNumber.length === 10) {
//                                           const aa = await fetchCustomerData(phoneNumber);
//                                           const updatedCustomers = [...values.customers];
//                                           if (aa) {
//                                             updatedCustomers[index] = {
//                                               phoneNumber,
//                                               firstName: aa?.firstName || '',
//                                               lastName: aa?.lastName || '',
//                                               email: aa?.email || '',
//                                               idCardType: aa?.idCardType || 'default',
//                                               idcardNumber: aa?.idcardNumber || '',
//                                               address: aa?.address || '',
//                                               idFile: aa?.idFile || ''
//                                             };
//                                           } else {
//                                             // Handle case when existingCustomerData is not present
//                                             updatedCustomers[index] = {
//                                               phoneNumber: e.target.value,
//                                               firstName: '',
//                                               lastName: '',
//                                               email: '',
//                                               idCardType: 'default',
//                                               idcardNumber: '',
//                                               address: '',
//                                               idFile: ''
//                                             };
//                                           }
//                                           setFieldValue('customers', updatedCustomers);

//                                           // Update initial values as well
//                                           setInitialValues((prev) => ({
//                                             ...prev,
//                                             customers: updatedCustomers
//                                           }));
//                                         }
//                                       }}
//                                       error={
//                                         errors.customers &&
//                                         errors.customers.length > index &&
//                                         errors.customers[index] &&
//                                         errors.customers[index].phoneNumber &&
//                                         Boolean(errors.customers[index].phoneNumber)
//                                       }
//                                     />

//                                     <div
//                                       style={{
//                                         color: '#f44336',
//                                         fontSize: '0.75rem',
//                                         marginTop: '4px',
//                                         marginRight: '14px',
//                                         marginLeft: '14px',
//                                         fontFamily: 'Roboto,sans-serif',
//                                         fontWeight: 'font-weight'
//                                       }}
//                                     >
//                                       <ErrorMessage name={`customers.${index}.phoneNumber`} />
//                                     </div>
//                                   </Grid>
//                                   <Grid item xs={12} sm={6}>
//                                     <TextField
//                                       id={`customers.${index}.firstName`}
//                                       name={`customers.${index}.firstName`}
//                                       label="First Name"
//                                       // size="small"
//                                       fullWidth
//                                       placeholder="Enter First Name"
//                                       value={
//                                         values.customers && values.customers.length > 0 && values.customers[index].firstName
//                                           ? values.customers[index].firstName
//                                           : ''
//                                       }
//                                       onChange={(e) => {
//                                         const newFirstName = e.target.value;
//                                         setFieldValue(`customers.${index}.firstName`, newFirstName);
//                                         const updatedCustomers = [...values.customers];
//                                         updatedCustomers[index] = {
//                                           ...updatedCustomers[index],
//                                           firstName: newFirstName
//                                         };
//                                         setInitialValues((prev) => ({
//                                           ...prev,
//                                           customers: updatedCustomers
//                                         }));
//                                       }}
//                                       error={
//                                         errors.customers &&
//                                         errors.customers.length > index &&
//                                         errors.customers[index] &&
//                                         errors.customers[index].firstName &&
//                                         Boolean(errors.customers[index].firstName)
//                                       }
//                                       // helperText={touched.firstName && errors.firstName}
//                                     />
//                                     <div
//                                       style={{
//                                         color: '#f44336',
//                                         fontSize: '0.75rem',
//                                         marginTop: '4px',
//                                         marginRight: '14px',
//                                         marginLeft: '14px',
//                                         fontFamily: 'Roboto,sans-serif',
//                                         fontWeight: 'font-weight'
//                                       }}
//                                     >
//                                       <ErrorMessage name={`customers.${index}.firstName`} />
//                                     </div>
//                                   </Grid>
//                                   <Grid item xs={12} sm={6}>
//                                     <TextField
//                                       id={`customers.${index}.lastName`}
//                                       name={`customers.${index}.lastName`}
//                                       label="Last Name"
//                                       // size="small"
//                                       fullWidth
//                                       placeholder="Enter Last Name"
//                                       value={
//                                         values.customers && values.customers.length > 0 && values.customers[index].lastName
//                                           ? values.customers[index].lastName
//                                           : ''
//                                       }
//                                       onChange={(e) => {
//                                         setFieldValue(`customers.${index}.lastName`, e.target.value);
//                                         const updatedCustomers = [...values.customers];
//                                         updatedCustomers[index] = {
//                                           ...updatedCustomers[index],
//                                           lastName: e.target.value
//                                         };
//                                         setInitialValues((prev) => ({
//                                           ...prev,
//                                           customers: updatedCustomers
//                                         }));
//                                       }}
//                                       error={
//                                         errors.customers &&
//                                         errors.customers.length > index &&
//                                         errors.customers[index] &&
//                                         errors.customers[index].lastName &&
//                                         Boolean(errors.customers[index].lastName)
//                                       }
//                                       // helperText={touched.lastName && errors.lastName}
//                                     />
//                                     <div
//                                       style={{
//                                         color: '#f44336',
//                                         fontSize: '0.75rem',
//                                         marginTop: '4px',
//                                         marginRight: '14px',
//                                         marginLeft: '14px',
//                                         fontFamily: 'Roboto,sans-serif',
//                                         fontWeight: 'font-weight'
//                                       }}
//                                     >
//                                       <ErrorMessage name={`customers.${index}.lastName`} />
//                                     </div>
//                                   </Grid>

//                                   <Grid item xs={12} sm={6}>
//                                     <TextField
//                                       id={`customers.${index}.email`}
//                                       name={`customers.${index}.email`}
//                                       label="Email"
//                                       // size="small"
//                                       fullWidth
//                                       placeholder="Enter Email"
//                                       value={
//                                         values.customers && values.customers.length > 0 && values.customers[index].email
//                                           ? values.customers[index].email
//                                           : ''
//                                       }
//                                       onChange={(e) => {
//                                         setFieldValue(`customers.${index}.email`, e.target.value);
//                                         const updatedCustomers = [...values.customers];
//                                         updatedCustomers[index] = {
//                                           ...updatedCustomers[index],
//                                           email: e.target.value
//                                         };
//                                         setInitialValues((prev) => ({
//                                           ...prev,
//                                           customers: updatedCustomers
//                                         }));
//                                       }}
//                                       error={
//                                         errors.customers &&
//                                         errors.customers.length > index &&
//                                         errors.customers[index] &&
//                                         errors.customers[index].email &&
//                                         Boolean(errors.customers[index].email)
//                                       }
//                                       // helperText={touched.email && errors.email}
//                                     />
//                                     <div
//                                       style={{
//                                         color: '#f44336',
//                                         fontSize: '0.75rem',
//                                         marginTop: '4px',
//                                         marginRight: '14px',
//                                         marginLeft: '14px',
//                                         fontFamily: 'Roboto,sans-serif',
//                                         fontWeight: 'font-weight'
//                                       }}
//                                     >
//                                       <ErrorMessage name={`customers.${index}.email`} />
//                                     </div>
//                                   </Grid>
//                                   <Grid item xs={12} sm={12} md={6}>
//                                     <Select
//                                       id={`customers.${index}.idCardType`}
//                                       name={`customers.${index}.idCardType`}
//                                       // size="small"
//                                       fullWidth
//                                       value={
//                                         values.customers && values.customers.length > 0 && values.customers[index].idCardType
//                                           ? values.customers[index].idCardType
//                                           : ''
//                                       }
//                                       onChange={(e) => {
//                                         setFieldValue(`customers.${index}.idCardType`, e.target.value);
//                                         const updatedCustomers = [...values.customers];
//                                         updatedCustomers[index] = {
//                                           ...updatedCustomers[index],
//                                           idCardType: e.target.value
//                                         };
//                                         setInitialValues((prev) => ({
//                                           ...prev,
//                                           customers: updatedCustomers
//                                         }));
//                                       }}
//                                       error={
//                                         errors.customers &&
//                                         errors.customers.length > index &&
//                                         errors.customers[index] &&
//                                         errors.customers[index].idCardType &&
//                                         Boolean(errors.customers[index].idCardType)
//                                       }
//                                     >
//                                       <MenuItem value="default" disabled>
//                                         Select Id Card Type
//                                       </MenuItem>
//                                       <MenuItem value="Aadharcard">Aadhar Card</MenuItem>
//                                       <MenuItem value="VoterIdCard">VoterId Card</MenuItem>
//                                       <MenuItem value="PanCard">Pan Card</MenuItem>
//                                       <MenuItem value="DrivingLicense">Driving License</MenuItem>
//                                     </Select>
//                                     <div
//                                       style={{
//                                         color: '#f44336',
//                                         fontSize: '0.75rem',
//                                         marginTop: '4px',
//                                         marginRight: '14px',
//                                         marginLeft: '14px',
//                                         fontFamily: 'Roboto,sans-serif',
//                                         fontWeight: 'font-weight'
//                                       }}
//                                     >
//                                       <ErrorMessage name={`customers.${index}.idCardType`} />
//                                     </div>
//                                   </Grid>
//                                   <Grid item xs={12} sm={6}>
//                                     <TextField
//                                       id={`customers.${index}.idcardNumber`}
//                                       name={`customers.${index}.idcardNumber`}
//                                       label="Id Card Number"
//                                       // size="small"
//                                       type="text"
//                                       fullWidth
//                                       placeholder="Enter card number"
//                                       value={
//                                         values.customers && values.customers.length > 0 && values.customers[index].idcardNumber
//                                           ? values.customers[index].idcardNumber
//                                           : ''
//                                       }
//                                       onChange={(e) => {
//                                         setFieldValue(`customers.${index}.idcardNumber`, e.target.value);
//                                         const updatedCustomers = [...values.customers];
//                                         updatedCustomers[index] = {
//                                           ...updatedCustomers[index],
//                                           idcardNumber: e.target.value
//                                         };
//                                         setInitialValues((prev) => ({
//                                           ...prev,
//                                           customers: updatedCustomers
//                                         }));
//                                       }}
//                                       error={
//                                         errors.customers &&
//                                         errors.customers.length > index &&
//                                         errors.customers[index] &&
//                                         errors.customers[index].idcardNumber &&
//                                         Boolean(errors.customers[index].idcardNumber)
//                                       }
//                                       // helperText={touched.idcardNumber && errors.idcardNumber}
//                                     />
//                                     <div
//                                       style={{
//                                         color: '#f44336',
//                                         fontSize: '0.75rem',
//                                         marginTop: '4px',
//                                         marginRight: '14px',
//                                         marginLeft: '14px',
//                                         fontFamily: 'Roboto,sans-serif',
//                                         fontWeight: 'font-weight'
//                                       }}
//                                     >
//                                       <ErrorMessage name={`customers.${index}.idcardNumber`} />
//                                     </div>
//                                   </Grid>

//                                   {existingCustomerData?.idFile ? (
//                                     <Grid item xs={12} sm={6}>
//                                       <FormLabel>Id Proof</FormLabel>

//                                       <Typography style={{ color: 'black', marginTop: '7px' }}>
//                                         <a
//                                           href={values.customers[index].idFile}
//                                           target="_blank"
//                                           rel="noreferrer"
//                                           style={{ textDecoration: 'none' }}
//                                         >
//                                           <Button startIcon={<VisibilityIcon />} variant="contained" color="primary">
//                                             View ID Proof
//                                           </Button>
//                                         </a>
//                                       </Typography>
//                                     </Grid>
//                                   ) : (
//                                     <Grid item xs={12} sm={6}>
//                                       <FormLabel>Upload ID Card File</FormLabel>
//                                       <Input
//                                         id={`customers.${index}.idFile`}
//                                         name={`customers.${index}.idFile`}
//                                         type="file"
//                                         onChange={(event) => setFieldValue(`customers.${index}.idFile`, event.currentTarget.files[0])}
//                                       />
//                                       <div
//                                         style={{
//                                           color: '#f44336',
//                                           fontSize: '0.75rem',
//                                           marginTop: '4px',
//                                           marginRight: '14px',
//                                           marginLeft: '14px',
//                                           fontFamily: 'Roboto,sans-serif',
//                                           fontWeight: 'font-weight'
//                                         }}
//                                       >
//                                         <ErrorMessage name={`customers.${index}.idFile`} />
//                                       </div>
//                                     </Grid>
//                                   )}

//                                   <Grid item xs={12} sm={6}>
//                                     <TextField
//                                       id={`customers.${index}.address`}
//                                       name={`customers.${index}.address`}
//                                       label="Address"
//                                       // size="small"
//                                       fullWidth
//                                       placeholder="Enter Physical Address"
//                                       value={
//                                         values.customers && values.customers.length > 0 && values.customers[index].address
//                                           ? values.customers[index].address
//                                           : ''
//                                       }
//                                       onChange={(e) => {
//                                         setFieldValue(`customers.${index}.address`, e.target.value);
//                                         const updatedCustomers = [...values.customers];
//                                         updatedCustomers[index] = {
//                                           ...updatedCustomers[index],
//                                           address: e.target.value
//                                         };
//                                         setInitialValues((prev) => ({
//                                           ...prev,
//                                           customers: updatedCustomers
//                                         }));
//                                       }}
//                                       error={
//                                         errors.customers &&
//                                         errors.customers.length > index &&
//                                         errors.customers[index] &&
//                                         errors.customers[index].address &&
//                                         Boolean(errors.customers[index].address)
//                                       }
//                                       // helperText={touched.address && errors.address}
//                                     />
//                                     <div
//                                       style={{
//                                         color: '#f44336',
//                                         fontSize: '0.75rem',
//                                         marginTop: '4px',
//                                         marginRight: '14px',
//                                         marginLeft: '14px',
//                                         fontFamily: 'Roboto,sans-serif',
//                                         fontWeight: 'font-weight'
//                                       }}
//                                     >
//                                       <ErrorMessage name={`customers.${index}.address`} />
//                                     </div>
//                                   </Grid>
//                                 </Grid>
//                               </>
//                               {index !== 0 && (
//                                 <Button
//                                   type="button"
//                                   variant="outlined"
//                                   sx={{ margin: '10px 0px' }}
//                                   onClick={() => arrayHelpers.remove(index)} // remove a customer from the list
//                                 >
//                                   - Remove
//                                 </Button>
//                               )}
//                               {index === 0 && (
//                                 <Button
//                                   type="button"
//                                   variant="outlined"
//                                   sx={{ margin: '10px 0px' }}
//                                   onClick={() =>
//                                     arrayHelpers.insert(index + 1, {
//                                       phoneNumber: '',
//                                       firstName: '',
//                                       lastName: '',
//                                       email: '',
//                                       idCardType: '',
//                                       idcardNumber: '',
//                                       idFile: '',
//                                       address: ''
//                                     })
//                                   }
//                                 >
//                                   + Add Person
//                                 </Button>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     />
//                     <DialogActions>
//                       <Button type="submit" variant="contained" color="primary">
//                         Add Reservation
//                       </Button>
//                     </DialogActions>
//                   </Form>
//                 </>
//               );
//             }}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// ReserveRoom.propTypes = {
//   open: PropTypes.bool.isRequired,
//   handleClose: PropTypes.func.isRequired,
//   roomDataByProps: PropTypes.object
// };

// export default ReserveRoom;

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
// Import the phone number input component
import PhoneInput from 'react-phone-number-input';
// Import the default styles for the phone input
import 'react-phone-number-input/style.css';

const ReserveRoom = (props) => {
  const { open, handleClose, roomDataByProps } = props;
  const today = new Date().toISOString().split('T')[0];

  const [roomData, setroomData] = useState([]);
  const [existingCustomerData, setExistingCustomerData] = useState([]);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const [amount, setAmount] = useState('');

  const [initialValues, setInitialValues] = useState({
    roomType: '',
    roomNo: '',
    checkInDate: today,
    checkOutDate: '',
    advanceAmount: '',
    totalAmount: '',
    customers: [
      { phoneNumber: '', firstName: '', lastName: '', email: '', idCardType: 'default', idcardNumber: '', idFile: '', address: '' }
    ]
  });

  useEffect(() => {
    setInitialValues((prevValues) => ({
      ...prevValues,
      phoneNumber: existingCustomerData?.phoneNumber || '',
      roomType: roomDataByProps?.roomType,
      roomNo: roomDataByProps?.roomNo
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomDataByProps]);

  const fetchroomData = async () => {
    try {
      // const response = await getApi(`api/room/viewallrooms/${hotel._id}`);
      const response = await getApi(`api/room/viewallrooms/${hotel?.hotelId}`);
      setroomData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchroomData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const AddData = async (values, resetForm) => {
    console.log('values =>', values);

    try {
      values.hotelId = JSON.parse(localStorage.getItem('hotelData')).hotelId;
      console.log('values.hotelId ===>', values.hotelId);

      const formData = new FormData();
      formData.append('hotelId', values.hotelId);
      formData.append('roomNo', values.roomNo);
      formData.append('checkInDate', values.checkInDate);
      formData.append('checkOutDate', values.checkOutDate);
      formData.append('advanceAmount', values.advanceAmount);
      formData.append('totalAmount', values.totalAmount);
      formData.append('customers', JSON.stringify(values.customers));
      values.customers.forEach((customer) => {
        formData.append('idFile', customer.idFile);
      });

      let response = await postApi('api/customer/doreservation', formData);

      console.log(formData, 'this is form data ');
      if (response.status === 200) {
        toast.success('Room successfully Reserved');
        handleClose();
        resetForm();
        setExistingCustomerData([]);
        // Update the bookingStatus for the relevant row
        setRows((prevRows) => prevRows.map((row) => (row.id === reservedRoomId ? { ...row, bookingStatus: 'true' } : row)));
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
      // Extract only digits for the API call if needed
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      const response = await getApi(`api/customer/view/${digitsOnly}?hotelId=${hotel?.hotelId}`);

      setExistingCustomerData(response?.data?.customerData[0]);
      return response?.data?.customerData[0];
    } catch (error) {
      console.log(error);
    }
  };

  const calculateAmount = (values) => {
    console.log('values =>', values);
    const checkInDate = new Date(values.checkInDate);
    const checkOutDate = new Date(values.checkOutDate);
    const numberOfDays = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24));
    const selectedRoom = roomData?.find((room) => room.roomType === values.roomType);

    if (numberOfDays == 0 && selectedRoom) {
      setAmount(selectedRoom?.amount);
    } else {
      if (selectedRoom) {
        const totalAmount = selectedRoom.amount * numberOfDays;
        setAmount(totalAmount);
      }
    }
  };

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
          <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center' }}>
            Add Room Reservation
          </Typography>
          <Typography>
            <Button
              onClick={() => {
                handleClose();
                setInitialValues({
                  roomType: '',
                  roomNo: '',
                  checkInDate: today,
                  checkOutDate: '',
                  advanceAmount: '',
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
            enableReinitialize={true}
            onSubmit={(values, { resetForm }) => {
              AddData(values, { resetForm });
            }}
            render={({ values, setFieldValue, errors, touched }) => {
              return (
                <>
                  <Form encType="multipart/form-data">
                    {/* //-------------------------Room Information______________________________________ */}
                    <Typography style={{ marginBottom: '15px', marginTop: '15px' }} variant="h4">
                      Room Information
                    </Typography>
                    <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 2 }}>
                      {/* //room type  */}
                      <Grid item xs={12} sm={12} md={6}>
                        <TextField
                          id="roomType"
                          name="roomType"
                          label="Room Type"
                          fullWidth
                          value={roomDataByProps?.roomType}
                          onChange={(e) => {
                            setFieldValue('roomType', e.target.value);
                          }}
                          error={errors.roomType && Boolean(errors.roomType)}
                          helperText={touched.roomType && errors.roomType}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <TextField
                          id="roomNo"
                          name="roomNo"
                          label="Room Number"
                          fullWidth
                          value={roomDataByProps?.roomNo}
                          onChange={(e) => {
                            setFieldValue('roomNo', e.target.value);
                          }}
                          error={errors.roomNo && Boolean(errors.roomNo)}
                          helperText={touched.roomNo && errors.roomNo}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          id="checkInDate"
                          name="checkInDate"
                          label="Check-In Date"
                          type="date"
                          fullWidth
                          value={values.checkInDate}
                          onChange={(e) => {
                            setFieldValue('checkInDate', e.target.value);
                            setInitialValues((prev) => ({
                              ...prev,
                              checkInDate: e.target.value
                            }));
                          }}
                          InputLabelProps={{
                            shrink: true
                          }}
                          inputProps={{
                            min: today
                          }}
                          error={errors.checkInDate && Boolean(errors.checkInDate)}
                          helperText={touched.checkInDate && errors.checkInDate}
                        />
                      </Grid>
                      {/* Check-Out Date */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          id="checkOutDate"
                          name="checkOutDate"
                          label="Check-Out Date"
                          type="date"
                          fullWidth
                          value={values.checkOutDate}
                          onChange={(e) => {
                            const newCheckOutDate = e.target.value;
                            setInitialValues((prev) => ({
                              ...prev,
                              checkOutDate: newCheckOutDate
                            }));
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
                        <TextField
                          id="amount"
                          name="amount"
                          label="Amount"
                          type="text"
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
                        <TextField
                          id="advanceAmount"
                          name="advanceAmount"
                          label="Advance Amount"
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
                              setFieldValue('advanceAmount', ''); // Clear the input if it exceeds the total amount or is negative
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
                          type="text"
                          fullWidth
                          value={`$${amount - values.advanceAmount}`}
                          error={touched.totalAmount && Boolean(errors.totalAmount)}
                          helperText={touched.totalAmount && errors.totalAmount}
                        />
                      </Grid>
                    </Grid>
                    <FieldArray
                      name="customers"
                      render={(arrayHelpers) => (
                        <div>
                          {values?.customers?.map((customer, index) => (
                            <div key={index}>
                              <>
                                {/* //------------------------- Customer Information______________________________________ */}
                                <Typography style={{ marginBottom: '15px', marginTop: '15px' }} variant="h4">
                                  Customer Information
                                </Typography>
                                <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 2 }}>
                                  <Grid item xs={12} sm={6}>
                                    <PhoneInput
                                      international
                                      defaultCountry="IN"
                                      id={`customers.${index}.phoneNumber`}
                                      name={`customers.${index}.phoneNumber`}
                                      value={values.customers[index].phoneNumber}
                                      onChange={(value) => {
                                        setFieldValue(`customers.${index}.phoneNumber`, value || '');
                                        setFieldValue(`customers.${index}.idFile`, '');

                                        // Only fetch customer data if we have a complete phone number
                                        if (value && value.length >= 10) {
                                          fetchCustomerData(value).then((aa) => {
                                            const updatedCustomers = [...values.customers];
                                            if (aa) {
                                              updatedCustomers[index] = {
                                                phoneNumber: value,
                                                firstName: aa?.firstName || '',
                                                lastName: aa?.lastName || '',
                                                email: aa?.email || '',
                                                idCardType: aa?.idCardType || 'default',
                                                idcardNumber: aa?.idcardNumber || '',
                                                address: aa?.address || '',
                                                idFile: aa?.idFile || ''
                                              };
                                            } else {
                                              // Handle case when existingCustomerData is not present
                                              updatedCustomers[index] = {
                                                phoneNumber: value,
                                                firstName: '',
                                                lastName: '',
                                                email: '',
                                                idCardType: 'default',
                                                idcardNumber: '',
                                                address: '',
                                                idFile: ''
                                              };
                                            }
                                            setFieldValue('customers', updatedCustomers);

                                            // Update initial values as well
                                            setInitialValues((prev) => ({
                                              ...prev,
                                              customers: updatedCustomers
                                            }));
                                          });
                                        }
                                      }}
                                      style={{
                                        width: '100%',
                                        height: '56px',
                                        borderRadius: '4px',
                                        padding: '0 14px',
                                        outline: 'none'
                                      }}
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
                                      <ErrorMessage name={`customers.${index}.phoneNumber`} />
                                    </div>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      id={`customers.${index}.firstName`}
                                      name={`customers.${index}.firstName`}
                                      label="First Name"
                                      fullWidth
                                      placeholder="Enter First Name"
                                      value={
                                        values.customers && values.customers.length > 0 && values.customers[index].firstName
                                          ? values.customers[index].firstName
                                          : ''
                                      }
                                      onChange={(e) => {
                                        const newFirstName = e.target.value;
                                        setFieldValue(`customers.${index}.firstName`, newFirstName);
                                        const updatedCustomers = [...values.customers];
                                        updatedCustomers[index] = {
                                          ...updatedCustomers[index],
                                          firstName: newFirstName
                                        };
                                        setInitialValues((prev) => ({
                                          ...prev,
                                          customers: updatedCustomers
                                        }));
                                      }}
                                      error={
                                        errors.customers &&
                                        errors.customers.length > index &&
                                        errors.customers[index] &&
                                        errors.customers[index].firstName &&
                                        Boolean(errors.customers[index].firstName)
                                      }
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
                                  {/* Rest of the form remains unchanged */}
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      id={`customers.${index}.lastName`}
                                      name={`customers.${index}.lastName`}
                                      label="Last Name"
                                      fullWidth
                                      placeholder="Enter Last Name"
                                      value={
                                        values.customers && values.customers.length > 0 && values.customers[index].lastName
                                          ? values.customers[index].lastName
                                          : ''
                                      }
                                      onChange={(e) => {
                                        setFieldValue(`customers.${index}.lastName`, e.target.value);
                                        const updatedCustomers = [...values.customers];
                                        updatedCustomers[index] = {
                                          ...updatedCustomers[index],
                                          lastName: e.target.value
                                        };
                                        setInitialValues((prev) => ({
                                          ...prev,
                                          customers: updatedCustomers
                                        }));
                                      }}
                                      error={
                                        errors.customers &&
                                        errors.customers.length > index &&
                                        errors.customers[index] &&
                                        errors.customers[index].lastName &&
                                        Boolean(errors.customers[index].lastName)
                                      }
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
                                      fullWidth
                                      placeholder="Enter Email"
                                      value={
                                        values.customers && values.customers.length > 0 && values.customers[index].email
                                          ? values.customers[index].email
                                          : ''
                                      }
                                      onChange={(e) => {
                                        setFieldValue(`customers.${index}.email`, e.target.value);
                                        const updatedCustomers = [...values.customers];
                                        updatedCustomers[index] = {
                                          ...updatedCustomers[index],
                                          email: e.target.value
                                        };
                                        setInitialValues((prev) => ({
                                          ...prev,
                                          customers: updatedCustomers
                                        }));
                                      }}
                                      error={
                                        errors.customers &&
                                        errors.customers.length > index &&
                                        errors.customers[index] &&
                                        errors.customers[index].email &&
                                        Boolean(errors.customers[index].email)
                                      }
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
                                      fullWidth
                                      value={
                                        values.customers && values.customers.length > 0 && values.customers[index].idCardType
                                          ? values.customers[index].idCardType
                                          : ''
                                      }
                                      onChange={(e) => {
                                        setFieldValue(`customers.${index}.idCardType`, e.target.value);
                                        const updatedCustomers = [...values.customers];
                                        updatedCustomers[index] = {
                                          ...updatedCustomers[index],
                                          idCardType: e.target.value
                                        };
                                        setInitialValues((prev) => ({
                                          ...prev,
                                          customers: updatedCustomers
                                        }));
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
                                        const updatedCustomers = [...values.customers];
                                        updatedCustomers[index] = {
                                          ...updatedCustomers[index],
                                          idcardNumber: e.target.value
                                        };
                                        setInitialValues((prev) => ({
                                          ...prev,
                                          customers: updatedCustomers
                                        }));
                                      }}
                                      error={
                                        errors.customers &&
                                        errors.customers.length > index &&
                                        errors.customers[index] &&
                                        errors.customers[index].idcardNumber &&
                                        Boolean(errors.customers[index].idcardNumber)
                                      }
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
                                      fullWidth
                                      placeholder="Enter Physical Address"
                                      value={
                                        values.customers && values.customers.length > 0 && values.customers[index].address
                                          ? values.customers[index].address
                                          : ''
                                      }
                                      onChange={(e) => {
                                        setFieldValue(`customers.${index}.address`, e.target.value);
                                        const updatedCustomers = [...values.customers];
                                        updatedCustomers[index] = {
                                          ...updatedCustomers[index],
                                          address: e.target.value
                                        };
                                        setInitialValues((prev) => ({
                                          ...prev,
                                          customers: updatedCustomers
                                        }));
                                      }}
                                      error={
                                        errors.customers &&
                                        errors.customers.length > index &&
                                        errors.customers[index] &&
                                        errors.customers[index].address &&
                                        Boolean(errors.customers[index].address)
                                      }
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
                                <Button
                                  type="button"
                                  variant="outlined"
                                  sx={{ margin: '10px 0px' }}
                                  onClick={() => arrayHelpers.remove(index)} // remove a customer from the list
                                >
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
                </>
              );
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

ReserveRoom.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  roomDataByProps: PropTypes.object
};

export default ReserveRoom;
