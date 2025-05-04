// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';
// import * as yup from 'yup';
// import { useFormik } from 'formik';
// import PropTypes from 'prop-types';
// import { FormHelperText, FormLabel } from '@mui/material';
// import { getApi, patchApi } from 'views/services/api';
// import { toast } from 'react-toastify';
// import { useState } from 'react';
// import { useEffect } from 'react';
// import { addDays, format } from 'date-fns';

// const EditReservation = (props) => {
//   const { open, handleClose, data } = props;
//   console.log("props --> data ==>",data);
//   const today = new Date().toISOString().split('T')[0];

//   const [roomData, setroomData] = useState([]);
//   const user = JSON.parse(localStorage.getItem('hotelData'));
//   const [amount, setAmount] = useState(data?.totalPayment);

//   const initialValues = {
//     roomType: data?.roomType || 'default',
//     roomNo: data?.roomNo || 'default',
//     checkInDate: data?.checkInDate ? data.checkInDate.split('T')[0] : '',
//     checkOutDate: data?.checkOutDate ? data.checkOutDate.split('T')[0] : '',
//     advanceAmount: data?.advanceAmount,
//     totalAmount: ''
//   };

//   const handleTotalAmount = (event) => {
//     const advanceAmount = parseFloat(event.target.value);

//     if (advanceAmount < 0) {
//       formik.setFieldValue('advanceAmount', '');
//       formik.setFieldError('advanceAmount', 'Advance amount cannot be negative');
//       return; // Exit the function early if the amount is negative
//     }

//     const totalAmt = amount - advanceAmount;

//     if (!isNaN(advanceAmount) && advanceAmount <= amount) {
//       formik.setFieldValue('advanceAmount', advanceAmount);
//       formik.setFieldValue('totalAmount', totalAmt);
//       formik.setFieldError('advanceAmount', ''); // Clear any previous errors
//     } else {
//       formik.setFieldValue('advanceAmount', '');
//       formik.setFieldError('advanceAmount', 'Advance amount cannot exceed total amount');
//     }
//   };

//   const EditData = async (values, resetForm) => {
//     try {
//       let response = await patchApi(`api/reservation/edit/${data?._id}`, values);
//       if (response.status === 200) {
//         toast.success('Reservation Successfully Modified');
//         handleClose();
//         resetForm();
//         localStorage.setItem('modifiedDate', true);
//       } else {
//         toast.error('Failed to modify reservation');
//       }
//     } catch (e) {
//       toast.error(e.response.data.error);
//     }
//   };

//   const formik = useFormik({
//     initialValues,
//     validationSchema: yup.object({
//       checkInDate: yup.date().required('Check-In Date is required'),
//       checkOutDate: yup.date().required('Check-Out Date is required'),
//       advanceAmount: yup.number().integer('Advance Amount must be an integer').required('Advance Amount  is required'),
//       totalAmount: yup.number().integer('Total Amount must be an integer')
//     }),
//     enableReinitialize: true,
//     onSubmit: async (values, { resetForm }) => {
//       EditData(values, resetForm);
//     }
//   });

//   const fetchroomData = async () => {
//     try {
//       const response = await getApi(`api/room/viewallrooms/${user._id}`);
//       console.log("rooms here =>",response);
//       setroomData(response?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchroomData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const calculateAmount = () => {
//     const checkInDate = new Date(formik.values.checkInDate);
//     const checkOutDate = new Date(formik.values.checkOutDate);
//     const numberOfDays = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24));
//     const selectedRoom = roomData.find((room) => Number(room.roomNo) === data?.roomNo);
//     if (numberOfDays == 0 && selectedRoom) {
//       setAmount(selectedRoom?.amount);
//     } else {
//       if (selectedRoom) {
//         const totalAmount = selectedRoom.amount * numberOfDays;
//         setAmount(totalAmount);
//       }
//     }
//   };

//   useEffect(() => {
//     calculateAmount();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [formik.values.checkInDate, formik.values.checkOutDate, roomData]);

//   useEffect(() => {
//     const totalAmt = amount - formik.values.advanceAmount;
//     formik.setFieldValue('totalAmount', totalAmt);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [formik.values.advanceAmount, amount]);

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
//           <Typography variant="h6">Edit Room Reservation</Typography>
//           <Typography>
//             <Button
//               onClick={() => {
//                 handleClose();
//               }}
//               style={{ color: 'red' }}
//             >
//               Cancel
//             </Button>
//           </Typography>
//         </DialogTitle>

//         <DialogContent dividers>
//           <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
//             <Typography style={{ marginBottom: '15px', marginTop: '15px' }} variant="h6">
//               Room Information
//             </Typography>
//             <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 2 }}>
//               <Grid item xs={12} sm={12} md={6}>
//                 <FormLabel>Room Number</FormLabel>
//                 <TextField
//                   id="roomNo"
//                   name="roomNo"
//                   size="small"
//                   type="number"
//                   fullWidth
//                   disabled
//                   placeholder="Enter advance amount"
//                   value={formik.values.roomNo}
//                   onChange={handleTotalAmount}
//                   error={formik.touched.roomNo && Boolean(formik.errors.roomNo)}
//                   helperText={formik.touched.roomNo && formik.errors.roomNo}
//                 />
//                 <FormHelperText error={formik.touched.roomNo && formik.errors.roomNo}>
//                   {formik.touched.roomNo && formik.errors.roomNo}
//                 </FormHelperText>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <FormLabel>Check-In Date</FormLabel>
//                 <TextField
//                   id="checkInDate"
//                   name="checkInDate"
//                   size="small"
//                   type="date"
//                   fullWidth
//                   placeholder="Enter checkInDate"
//                   value={formik.values.checkInDate}
//                   onChange={formik.handleChange}
//                   InputLabelProps={{
//                     shrink: true
//                   }}
//                   inputProps={{
//                     min: formik.values.checkInDate > today ? today : formik.values.checkInDate
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormLabel>Check-Out Date</FormLabel>
//                 <TextField
//                   id="checkOutDate"
//                   name="checkOutDate"
//                   size="small"
//                   type="date"
//                   fullWidth
//                   placeholder="Enter checkOutDate"
//                   value={formik.values.checkOutDate}
//                   onChange={formik.handleChange}
//                   InputLabelProps={{
//                     shrink: true
//                   }}
//                   inputProps={{
//                     min: formik.values.checkInDate
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormLabel>Amount</FormLabel>
//                 <TextField
//                   id="amount"
//                   name="amount"
//                   size="small"
//                   type="text"
//                   onChange={(e) => setAmount(e.target.value)}
//                   fullWidth
//                   // disabled
//                   value={amount}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormLabel>Advance Amount</FormLabel>
//                 <TextField
//                   id="advanceAmount"
//                   name="advanceAmount"
//                   size="small"
//                   type="number"
//                   fullWidth
//                   placeholder="Enter advance amount"
//                   value={formik.values.advanceAmount}
//                   onChange={handleTotalAmount}
//                   error={formik.touched.advanceAmount && Boolean(formik.errors.advanceAmount)}
//                   helperText={formik.touched.advanceAmount && formik.errors.advanceAmount}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormLabel>Total Amount</FormLabel>
//                 <TextField
//                   id="totalAmount"
//                   name="totalAmount"
//                   size="small"
//                   type="text"
//                   fullWidth
//                   disabled
//                   value={`Rs ${amount - formik.values.advanceAmount}`}
//                   error={formik.touched.totalAmount && Boolean(formik.errors.totalAmount)}
//                   helperText={formik.touched.totalAmount && formik.errors.totalAmount}
//                 />
//               </Grid>
//             </Grid>

//             <DialogActions>
//               <Button type="submit" variant="contained" color="primary">
//                 Save Changes
//               </Button>
//             </DialogActions>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };
// EditReservation.propTypes = {
//   open: PropTypes.bool.isRequired,
//   handleClose: PropTypes.func.isRequired,
//   data: PropTypes.shape({
//     _id: PropTypes.string,
//     roomType: PropTypes.string,
//     roomNo: PropTypes.string,
//     checkInDate: PropTypes.string,
//     checkOutDate: PropTypes.string,
//     advanceAmount: PropTypes.number,
//     totalPayment: PropTypes.number
//   }).isRequired
// };
// export default EditReservation;

// ---------------------------- updateion is done here -------------------------------

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import * as yup from 'yup';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { FormHelperText, FormLabel } from '@mui/material';
import { getApi, patchApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const EditReservation = ( props ) => {
  const { open, handleClose, data } = props;
  const today = new Date().toISOString().split( 'T' )[ 0 ];
  console.log("data", data);

  const [ roomData, setRoomData ] = useState( [] );
  const user = JSON.parse( localStorage.getItem( 'hotelData' ) );
  const [ amount, setAmount ] = useState( data?.totalPayment );

  const initialValues = {
    roomType: data?.roomType || 'default',
    roomNo: data?.roomNo || 'default',
    checkInDate: data?.checkInDate ? data.checkInDate.split( 'T' )[ 0 ] : '',
    checkOutDate: data?.checkOutDate ? data.checkOutDate.split( 'T' )[ 0 ] : '',
    advanceAmount: data?.advanceAmount,
    totalAmount: ''
  };

  const handleTotalAmount = ( advanceAmount ) => {
    console.log( 'in handleTotalAmount ==>', advanceAmount );
    if ( advanceAmount < 0 ) {
      formik.setFieldValue( 'advanceAmount', '' );
      formik.setFieldError( 'advanceAmount', 'Advance amount cannot be negative' );
      return;
    }

    const totalAmt = amount - advanceAmount;
    console.log( 'totalAmt ==>', totalAmt );

    if ( !isNaN( advanceAmount ) && advanceAmount <= amount ) {
      formik.setFieldValue( 'advanceAmount', advanceAmount );
      formik.setFieldValue( 'totalAmount', totalAmt );
      formik.setFieldError( 'advanceAmount', '' );
    } else {
      formik.setFieldValue( 'advanceAmount', '' );
      formik.setFieldError( 'advanceAmount', 'Advance amount cannot exceed total amount' );
    }
  };

  const handleRoomChange = ( event ) => {
    const selectedRoomNo = event.target.value;
    formik.setFieldValue( 'roomNo', selectedRoomNo );

    const selectedRoom = roomData.find( ( room ) => room.roomNo === selectedRoomNo );
    console.log( 'selectedRoom ==>', selectedRoom );

    if ( selectedRoom ) {
      const checkInDate = new Date( formik.values.checkInDate );
      const checkOutDate = new Date( formik.values.checkOutDate );
      const numberOfDays = Math.ceil( ( checkOutDate - checkInDate ) / ( 1000 * 3600 * 24 ) );

      console.log( 'checkInDate =>', checkInDate );
      console.log( 'checkOutDate =>', checkOutDate );
      console.log( 'numberOfDays =>', numberOfDays );

      let newAmount = selectedRoom.amount;
      console.log( 'newAmount =>', newAmount );

      if ( numberOfDays > 0 ) {
        newAmount *= numberOfDays;
      }

      console.log( 'newAmount after multiplay by no of days ==>', newAmount );

      setAmount( newAmount );
      console.log( 'amount ==>', amount );
      console.log( 'newAmount after ---- ==>', newAmount );

      handleTotalAmount( formik.values.advanceAmount );
    }
  };

  const EditData = async ( values, resetForm ) => {
    console.log( 'In EditData values ==>', values );
    try {
      let response = await patchApi( `api/reservation/edit/${ data?._id }`, values );
      if ( response.status === 200 ) {
        toast.success( 'Reservation Successfully Modified' );
        handleClose();
        resetForm();
        localStorage.setItem( 'modifiedDate', true );
      } else {
        toast.error( 'Failed to modify reservation' );
      }
    } catch ( e ) {
      toast.error( e.response.data.error );
    }
  };

  const formik = useFormik( {
    initialValues,
    validationSchema: yup.object( {
      checkInDate: yup.date().required( 'Check-In Date is required' ),
      checkOutDate: yup.date().required( 'Check-Out Date is required' ),
      advanceAmount: yup.number().integer( 'Advance Amount must be an integer' ).required( 'Advance Amount is required' ),
      totalAmount: yup.number().integer( 'Total Amount must be an integer' )
    } ),
    enableReinitialize: true,
    onSubmit: async ( values, { resetForm } ) => {
      console.log( 'values ==>', values );

      EditData( values, resetForm );
    }
  } );

  const fetchRoomData = async () => {
    try {
      const response = await getApi( `api/room/viewallrooms/${ user.hotelId }` );
      setRoomData( response?.data || [] );
    } catch ( error ) {
      console.log( error );
    }
  };

  console.log( 'roomData ==>', roomData );

  useEffect( () => {
    fetchRoomData();
  }, [] );

  const calculateAmount = () => {
    const checkInDate = new Date( formik.values.checkInDate );
    const checkOutDate = new Date( formik.values.checkOutDate );
    const numberOfDays = Math.ceil( ( checkOutDate - checkInDate ) / ( 1000 * 3600 * 24 ) );
    const selectedRoom = roomData.find( ( room ) => Number( room.roomNo ) === data?.roomNo );
    if ( numberOfDays === 0 && selectedRoom ) {
      setAmount( selectedRoom?.amount );
    } else {
      if ( selectedRoom ) {
        const totalAmount = selectedRoom.amount * numberOfDays;
        setAmount( totalAmount );
      }
    }
  };

  useEffect( () => {
    calculateAmount();
  }, [ formik.values.checkInDate, formik.values.checkOutDate, roomData ] );

  useEffect( () => {
    const totalAmt = amount - formik.values.advanceAmount;
    formik.setFieldValue( 'totalAmount', totalAmt );
  }, [ formik.values.advanceAmount, amount ] );

  return (
    <div>
      <Dialog open={ open } aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={ {
            display: 'flex',
            justifyContent: 'space-between'
          } }
        >
          <Typography variant="h6">Edit Room Reservation</Typography>
          <Typography>
            <Button
              onClick={ () => {
                handleClose();
              } }
              style={ { color: 'red' } }
            >
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={ formik.handleSubmit } encType="multipart/form-data">
            <Typography style={ { marginBottom: '15px', marginTop: '15px' } } variant="h6">
              Room Information
            </Typography>
            <Grid container rowSpacing={ 3 } columnSpacing={ { xs: 0, sm: 2 } }>
              <Grid item xs={ 12 } sm={ 12 } md={ 6 }>
                <FormControl fullWidth>
                  <FormLabel>Room Number</FormLabel>
                  <TextField
                  id="roomNo"
                  name="roomNo"
                  size="small"
                  type="text"
                  fullWidth
                  value={ data?.roomNo }
                  
                />
                  
                  <FormHelperText error={ formik.touched.roomNo && formik.errors.roomNo }>
                    { formik.touched.roomNo && formik.errors.roomNo }
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Check-In Date</FormLabel>
                <TextField
                  id="checkInDate"
                  name="checkInDate"
                  size="small"
                  type="date"
                  fullWidth
                  placeholder="Enter checkInDate"
                  value={ formik.values.checkInDate }
                  onChange={ formik.handleChange }
                  InputLabelProps={ {
                    shrink: true
                  } }
                  inputProps={ {
                    min: formik.values.checkInDate > today ? today : formik.values.checkInDate
                  } }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Check-Out Date</FormLabel>
                <TextField
                  id="checkOutDate"
                  name="checkOutDate"
                  size="small"
                  type="date"
                  fullWidth
                  placeholder="Enter checkOutDate"
                  value={ formik.values.checkOutDate }
                  onChange={ formik.handleChange }
                  InputLabelProps={ {
                    shrink: true
                  } }
                  inputProps={ {
                    min: formik.values.checkInDate
                  } }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Amount</FormLabel>
                <TextField
                  id="amount"
                  name="amount"
                  size="small"
                  type="text"
                  fullWidth
                  value={ amount }
                  onChange={ ( e ) => setAmount( e.target.value ) }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Advance Amount</FormLabel>
                <TextField
                  id="advanceAmount"
                  name="advanceAmount"
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="Enter advance amount"
                  value={ formik.values.advanceAmount }
                  onChange={ ( e ) => handleTotalAmount( parseFloat( e.target.value ) ) }
                  error={ formik.touched.advanceAmount && Boolean( formik.errors.advanceAmount ) }
                  helperText={ formik.touched.advanceAmount && formik.errors.advanceAmount }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Total Amount</FormLabel>
                <TextField
                  id="totalAmount"
                  name="totalAmount"
                  size="small"
                  type="text"
                  fullWidth
                  disabled
                  value={ `$ ${ amount - formik.values.advanceAmount }` }
                  error={ formik.touched.totalAmount && Boolean( formik.errors.totalAmount ) }
                  helperText={ formik.touched.totalAmount && formik.errors.totalAmount }
                />
              </Grid>
            </Grid>

            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

EditReservation.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.shape( {
    _id: PropTypes.string,
    roomType: PropTypes.string,
    roomNo: PropTypes.string,
    checkInDate: PropTypes.string,
    checkOutDate: PropTypes.string,
    advanceAmount: PropTypes.number,
    totalPayment: PropTypes.number
  } ).isRequired
};

export default EditReservation;
