import { FormControlLabel, FormLabel, MenuItem, Select } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { getApi, postApi } from 'views/services/api';
import * as yup from 'yup';

const SingleInvoiceDialog = ( props ) => {
  console.log( props, 'this is come form single invoice dialog' );
  const navigate = useNavigate();
  const { open, handleClose, data } = props;

  console.log( 'data=>>>>>>>>>>>>>>>>>>', data );
  const [ hotelData, setHotelData ] = useState( [] );
  const [ haveFoodGst, setHaveFoodGst ] = useState( false );
  const [ haveRoomGst, setHaveRoomGst ] = useState( false );
  const [ haveSpaGst, setHaveSpaGst ] = useState( false );
  const [ roomGstAmount, setRoomGstAmount ] = useState();
  const [ foodGstAmount, setFoodGstAmount ] = useState();
  const [ spaGstAmount, setSpaGstAmount ] = useState();
  const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );
  const [ totalFoodAmount, setTotalFoodAmount ] = useState( 0 );
  const [ totalLaundaryAmount, setTotalLaundaryAmount ] = useState( 0 );
  const [ totalSpaAmount, setTotalSpaAmount ] = useState( 0 );

  // function for fetching hotel data from the db

  console.log( 'main single data', data );
  console.log( 'laundary amount', totalLaundaryAmount );
  console.log( 'hotel data single', hotelData );
  console.log( 'reservation id', data?._id );
  const fetchHotelData = async () => {
    try {
      const response = await getApi( `api/hotel/view/${ hotel._id }` );
      // const response = await getApi( `api/hotel/view/${ hotel?.hotelId }` );

      setHotelData( response?.data );
    } catch ( error ) {
      console.log( error );
    }
  };

  useEffect( () => {
    fetchHotelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  // function for calculating total food amount
  const calculateFoodAmount = () => {
    if ( !data || !data?.foodItems ) {
      return 0;
    }

    const totalFoodAmount = data.foodItems.reduce( ( total, foodData ) => {
      return total + ( foodData.quantity * foodData.price || 0 );
    }, 0 );

    return totalFoodAmount;
  };

  // function for calculating total laundary amount
  const calculateLaundaryAmount = () => {
    const totalLaundaryAmount =
      data?.laundryDetails?.reduce( ( total, laundaryData ) => {
        return total + laundaryData.quantity * laundaryData.amount;
      }, 0 ) || 0;

    return totalLaundaryAmount;
  };

  // Function for calculating total spa amount
  console.log( data, 'this is come from single invoice dialog' );
  const calculateSpaAmount = () => {
    const totalSpaAmount =
      data?.spaDetails?.reduce( ( total, spaData ) => {
        console.log( 'spa data', spaData );
        if ( spaData.status !== 'Completed' ) {
          return 0;
        } else {
          return total + spaData?.totalAmount;
        }
      }, 0 ) || 0;

    return totalSpaAmount;
  };

  console.log( 'total spa amount', calculateSpaAmount() );

  useEffect( () => {
    setTotalFoodAmount( calculateFoodAmount() );
    setTotalLaundaryAmount( calculateLaundaryAmount() );
    setTotalSpaAmount( calculateSpaAmount() );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data ] );
  const initialValues = {
    name: `${ data?.customerDetails?.firstName || '' } ${ data?.customerDetails?.lastName || '' }`,
    address: data?.customerDetails?.address || '',
    roomRent: data?.totalPayment || 0,
    advanceAmount: data?.advanceAmount || 0,
    pendingAmount: data?.totalAmount || 0,
    roomDiscount: 0,
    paymentMethod: 'cash',
    haveRoomGst: false, // Default to false
    roomGstPercentage: hotelData?.roomGstPercentage || 0, // Default to 0
    foodGstPercentage: hotelData?.foodGstPercentage || 0, // Default to 0
    spaGstPercentage: hotelData?.spaGstPercentage || 0, // Default to 0
    haveFoodGst: false, // Default to false
    haveSpaGst: false, // Default to false
    gstNumber: '', // Optional
    totalRoomAmount: data?.totalPayment || 0, // Ensure this is passed correctly
    foodAmount: totalFoodAmount, // Set foodAmount to the calculated total
    laundaryAmount: totalLaundaryAmount,
    spaAmount: totalSpaAmount,
    foodDiscount: 0, // Default to 0
    laundaryDiscount: 0, // Default to 0
    spaDiscount: 0, // Default to 0
    totalFoodAmount: totalFoodAmount,
    totalLaundaryAmount: totalLaundaryAmount,
    totalSpaAmount: totalSpaAmount,
    reservationId: data?._id || '', // Ensure reservationId is passed
    hotelId: hotelData?.hotelId || '', // Ensure hotelId is passed if required
    invoiceNumber: `INV-${ new Date().toISOString().slice( 0, 10 ) }-${ hotelData?.hotelCode || 'XYZ' }`, // Generate invoice number
    customerPhoneNumber: data?.customerDetails?.phone || '', // Ensure customerPhoneNumber is passed
    finalCheckInTime: new Date().toLocaleTimeString(), // Ensure check-in time is passed
    finalCheckOutTime: '', // Optional, leave empty if not needed
    foodGstAmount: 0, // Default to 0
    roomGstAmount: 0, // Default to 0
    spaGstAmount: 0, // Default to 0
    finalTotalAmount: data?.totalPayment || 0, // Ensure this is calculated correctly
    totalFoodAndRoomAmount: ( data?.totalPayment || 0 ) + 0
  };

  console.log( 'initial values', initialValues );

  const validationSchema = yup.object().shape( {
    name: yup.string().required( 'Customer name is required' ),
    address: yup.string().required( 'Address is required' ),
    roomRent: yup.number().required( 'Room rent is required' ).min( 0, 'Room rent cannot be negative' ),
    advanceAmount: yup.number().required( 'Advance amount is required' ).min( 0, 'Advance amount cannot be negative' ),
    pendingAmount: yup.number().required( 'Pending amount is required' ).min( 0, 'Pending amount cannot be negative' ),
    roomDiscount: yup.number().min( 0, 'Discount cannot be negative' ),
    paymentMethod: yup.string().required( 'Payment Method is required' ).oneOf( [ 'cash', 'card', 'upi' ], 'Invalid payment method' ),
    totalRoomAmount: yup.number().required( 'Total amount is required' ).min( 0, 'Total amount cannot be negative' ),
    foodAmount: yup.number().min( 0, 'Food amount cannot be negative' ),
    laundaryAmount: yup.number().min( 0, 'Laundary amount cannot be negative' ),
    spaAmount: yup.number().min( 0, 'Spa amount cannot be negative' ),
    foodDiscount: yup.number().min( 0, 'Discount cannot be negative' ),
    laundaryDiscount: yup.number().min( 0, 'Discount cannot be negative' ),
    spaDiscount: yup.number().min( 0, 'Discount cannot be negative' ),
    totalFoodAmount: yup.number().required( 'Total food amount is required' ).min( 0, 'Total food amount cannot be negative' ),
    totalLaundaryAmount: yup.number().required( 'Total laundary amount is required' ).min( 0, 'Total laundary amount cannot be negative' ),
    totalSpaAmount: yup.number().required( 'Total spa amount is required' ).min( 0, 'Total spa amount cannot be negative' ),

    // Boolean validation for GST fields
    haveRoomGst: yup.boolean().required( 'Room GST selection is required' ),
    haveFoodGst: yup.boolean().required( 'Food GST selection is required' ),
    haveSpaGst: yup.boolean().required( 'Spa GST selection is required' ),

    // Conditional validation based on GST fields
    roomGstPercentage: yup
      .number()
      .min( 0, 'GST percentage cannot be negative' )
      .when( 'haveRoomGst', {
        is: true,
        then: yup.number().required( 'Room GST percentage is required' ),
        otherwise: yup.number().notRequired()
      } ),

    foodGstPercentage: yup
      .number()
      .min( 0, 'GST percentage cannot be negative' )
      .when( 'haveFoodGst', {
        is: true,
        then: yup.number().required( 'Food GST percentage is required' ),
        otherwise: yup.number().notRequired()
      } ),
    spaGstPercentage: yup
      .number()
      .min( 0, 'GST percentage cannot be negative' )
      .when( 'haveSpaGst', {
        is: true,
        then: yup.number().required( 'Spa GST percentage is required' ),
        otherwise: yup.number().notRequired()
      } )
  } );

  // function for generating Invoice Number
  const generateInvoiceNumber = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String( today.getMonth() + 1 ).padStart( 2, '0' );
    const day = String( today.getDate() ).padStart( 2, '0' );

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 4; i++ ) {
      randomPart += characters.charAt( Math.floor( Math.random() * charactersLength ) );
    }
    const invoiceNumber = `INV-${ year }-${ month }-${ day }-${ randomPart }`;
    return invoiceNumber;
  };

  // function for generating Invoice

  const generateInvoice = async ( values, resetForm ) => {
    console.log( 'generateInvoice function called' );

    try {
      // Validate data and hotelData
      if ( !data || !hotelData ) {
        toast.error( 'Missing required data.' );
        return;
      }

      // Prepare values before submission
      values.hotelId = hotelData?.hotelId || '';
      values.reservationId = data?._id || '';
      values.invoiceNumber = generateInvoiceNumber(); // Ensure this returns a valid invoice number
      values.customerPhoneNumber = data?.customerDetails?.phoneNumber || '';
      values.finalCheckInTime = data?.FinalCheckInTime || '';
      values.foodGstAmount = foodGstAmount || 0;
      values.roomGstAmount = roomGstAmount || 0;
      values.spaGstAmount = spaGstAmount || 0;
      values.finalTotalAmount =
        ( values.totalFoodAmount || 0 ) + ( values.totalRoomAmount || 0 ) + ( values.totalLaundaryAmount || 0 ) + ( values.totalSpaAmount || 0 );

      // Calculate totalFoodAndRoomAmount (totalRoomAmount + totalFoodAmount)
      values.totalFoodAndRoomAmount = ( values.totalRoomAmount || 0 ) + ( values.totalFoodAmount || 0 );

      // Ensure that all required fields are populated
      values.name = `${ data?.customerDetails?.firstName || '' } ${ data?.customerDetails?.lastName || '' }`;
      values.address = data?.customerDetails?.address || '';
      values.roomRent = values.totalRoomAmount || 0;
      values.advanceAmount = values.advanceAmount || 0;
      values.pendingAmount = values.pendingAmount || 0;
      values.roomDiscount = values.roomDiscount || 0;
      values.paymentMethod = values.paymentMethod || 'cash';
      values.haveRoomGst = values.haveRoomGst || false;
      values.roomGstPercentage = hotelData?.roomGstPercentage || 0; // Ensure it's set
      values.foodGstPercentage = hotelData?.foodGstPercentage || 0; // Ensure it's set
      values.spaGstPercentage = hotelData?.spaGstPercentage || 0; // Ensure it's set
      values.haveFoodGst = values.haveFoodGst || false;
      values.haveSpaGst = values.haveSpaGst || false;
      values.gstNumber = values.gstNumber || ''; // Optional
      values.foodAmount = values.foodAmount || 0; // Default to 0 if not provided
      values.laundaryAmount = values.laundaryAmount || 0; // Default to 0 if not provided
      values.spaAmount = values.spaAmount || 0; // Default to 0 if not provided
      values.foodDiscount = values.foodDiscount || 0; // Default to 0 if not provided
      values.laundaryDiscount = values.laundaryDiscount || 0; // Default to 0 if not provided
      values.spaDiscount = values.spaDiscount || 0; // Default to 0 if not provided
      values.totalFoodAmount = values.totalFoodAmount || 0; // Default to 0 if not provided
      values.totalLaundaryAmount = values.totalLaundaryAmount || 0; // Default to 0 if not provided
      values.totalSpaAmount = values.totalSpaAmount || 0; // Default to 0 if not provided
      values.grandTotalAmount = values.totalLaundaryAmount + values.totalSpaAmount + values.totalRoomAmount + values.totalFoodAmount;

      // Debug: Log the values to check what is being submitted
      console.log( 'Submitting invoice with values:', JSON.stringify( values, null, 2 ) );

      // Validate required fields before making API call
      if ( !values.hotelId || !values.reservationId || !values.totalRoomAmount ) {
        console.error( 'Missing required fields:', values );
        toast.error( 'Some required fields are missing.' );
        return;
      }

      // Debug: Ensure that validation passed before the API call
      console.log( 'Validated values for submission:', values );

      // Make the API call
      const response = await postApi( 'api/singleinvoice/add', values );

      // Debug: Log the raw API response
      console.log( 'API Response:', response );

      // If the response object is not valid, log the status and data
      if ( !response || !response.data ) {
        console.error( 'API response is invalid:', response );
        toast.error( 'Invalid API response.' );
        return;
      }

      // Check the response and handle success/failure
      if ( response.data && response.data.reservationId ) {
        toast.success( 'Invoice generated successfully' );
        handleClose();
        resetForm();

        setTimeout( () => {
          navigate( `/singlebill/view/${ response.data.reservationId }` );
        }, 200 );
      } else {
        // If the response doesn't contain the expected data, log it
        console.error( 'Invalid API response data:', response.data );
        toast.error( 'Failed to generate invoice. Invalid response from server.' );
      }
    } catch ( error ) {
      // Debug: Log the error details
      console.error( 'Invoice Generation Error:', error.response?.data || error.message );

      // Check if error response exists to provide detailed error
      if ( error.response ) {
        console.error( 'Error Response Data:', error.response.data );
        console.error( 'Error Response Status:', error.response.status );
        console.error( 'Error Response Headers:', error.response.headers );
      }

      // Show user-friendly error message
      toast.error( `Cannot generate invoice: ${ error.response?.data?.message || 'Unknown error' }` );
    }
  };

  const formik = useFormik( {
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async ( values, { resetForm } ) => {
      console.log( 'Submitting Values:', values );
      formik.validateForm().then( ( errors ) => console.log( 'Formik Errors before submit:', errors ) );

      generateInvoice( values, resetForm );
    }
  } );

  const handleRoomGstToggle = () => {
    setHaveRoomGst( !haveRoomGst );
    formik.setFieldValue( 'haveRoomGst', !haveRoomGst );
  };

  const handleFoodGstToggle = () => {
    setHaveFoodGst( !haveFoodGst );
    formik.setFieldValue( 'haveFoodGst', !haveFoodGst );
  };

  const handleSpaGstToggle = () => {
    setHaveSpaGst( !haveSpaGst );
    formik.setFieldValue( 'haveSpaGst', !haveSpaGst );
  };

  const calculateTotalRoomAmount = () => {
    const totalAmountWithoutGst = formik.values.roomRent - formik.values.roomDiscount;

    const gstAmount = totalAmountWithoutGst * ( formik.values.roomGstPercentage / 100 );
    setRoomGstAmount( gstAmount );
    const totalAmount = haveRoomGst ? totalAmountWithoutGst + gstAmount : totalAmountWithoutGst;

    formik.setFieldValue( 'totalRoomAmount', totalAmount );
  };

  const calculateTotalFoodAmount = () => {
    const totalFoodAmountWithoutGst = formik.values.foodAmount - formik.values.foodDiscount;
    const gstAmount = totalFoodAmountWithoutGst * ( formik.values.foodGstPercentage / 100 );
    setFoodGstAmount( gstAmount );
    const totalAmount = haveFoodGst ? totalFoodAmountWithoutGst + gstAmount : totalFoodAmountWithoutGst;
    formik.setFieldValue( 'totalFoodAmount', totalAmount );
  };

  const calculateTotalSpaAmount = () => {
    const totalSpaAmountWithoutGst = formik.values.spaAmount - formik.values.spaDiscount;
    const gstAmount = totalSpaAmountWithoutGst * ( formik.values.spaGstPercentage / 100 );
    setSpaGstAmount( gstAmount );
    const totalAmount = haveSpaGst ? totalSpaAmountWithoutGst + gstAmount : totalSpaAmountWithoutGst;
    formik.setFieldValue( 'totalSpaAmount', totalAmount );
  };

  useEffect( () => {
    calculateTotalFoodAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ formik.values.foodAmount, formik.values.foodDiscount, formik.values.foodGstPercentage, haveFoodGst ] );
  useEffect( () => {
    calculateTotalRoomAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.pendingAmount,
    formik.values.roomDiscount,
    formik.values.roomGstPercentage,
    haveRoomGst,
    formik.values.pendingAmount,
    formik.values.advanceAmount
  ] );
  useEffect( () => {
    calculateTotalSpaAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ formik.values.spaAmount, formik.values.spaDiscount, formik.values.spaGstPercentage, haveSpaGst ] );

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
          <Typography variant="h6">Invoice Information</Typography>
          <Typography>
            <Button onClick={ handleClose } style={ { color: 'red' } }>
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={ formik.handleSubmit } encType="multipart/form-data">
            {/* Invoice Information */ }
            <Grid container rowSpacing={ 3 } columnSpacing={ { xs: 0, sm: 2 } }>
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Customer Name (Bill to)</FormLabel>
                <TextField
                  id="name"
                  name="name"
                  size="small"
                  type="text"
                  fullWidth
                  placeholder="Enter customer name"
                  value={ formik.values.name }
                  onChange={ formik.handleChange }
                  error={ formik.touched.name && Boolean( formik.errors.name ) }
                  helperText={ formik.touched.name && formik.errors.name }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Address</FormLabel>
                <TextField
                  id="address"
                  name="address"
                  size="small"
                  type="text"
                  fullWidth
                  placeholder="Enter customer address"
                  value={ formik.values.address }
                  onChange={ formik.handleChange }
                  error={ formik.touched.address && Boolean( formik.errors.address ) }
                  helperText={ formik.touched.address && formik.errors.address }
                />
              </Grid>
            </Grid>
            <Typography variant="h6" sx={ { margin: '14px 0px' } }>
              Room Bill Information
            </Typography>
            <Grid container rowSpacing={ 3 } columnSpacing={ { xs: 0, sm: 2 } }>
              {/* Customer Name and Address */ }

              {/* Room Rent */ }
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Room Rent</FormLabel>
                <TextField
                  id="roomRent"
                  name="roomRent"
                  size="small"
                  type="number"
                  fullWidth
                  value={ formik.values.roomRent }
                  onChange={ formik.handleChange }
                  error={ formik.touched.roomRent && Boolean( formik.errors.roomRent ) }
                  helperText={ formik.touched.roomRent && formik.errors.roomRent }
                />
              </Grid>
              {/* Advance Amount  */ }
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Advance Amount</FormLabel>
                <TextField
                  id="advanceAmount"
                  name="advanceAmount"
                  size="small"
                  type="number"
                  fullWidth
                  value={ formik.values.advanceAmount }
                  onChange={ formik.handleChange }
                  error={ formik.touched.advanceAmount && Boolean( formik.errors.advanceAmount ) }
                  helperText={ formik.touched.advanceAmount && formik.errors.advanceAmount }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Pending Amount</FormLabel>
                <TextField
                  id="pendingAmount"
                  name="pendingAmount"
                  size="small"
                  type="number"
                  fullWidth
                  value={ formik.values.pendingAmount }
                  onChange={ formik.handleChange }
                  error={ formik.touched.pendingAmount && Boolean( formik.errors.pendingAmount ) }
                  helperText={ formik.touched.pendingAmount && formik.errors.pendingAmount }
                />
              </Grid>
              {/* roomDiscount */ }
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Discount</FormLabel>
                <TextField
                  id="roomDiscount"
                  name="roomDiscount"
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="In $"
                  value={ formik.values.roomDiscount }
                  onChange={ ( e ) => {
                    let value = e.target.value.trim();
                    if ( value === '' ) {
                      value = '';
                    } else {
                      value = value.replace( /\D/, '' ).slice( 0, 6 );
                      value = Math.max( 0, Math.min( parseInt( value ), formik.values.roomRent ) );
                      value = value === formik.values.roomRent ? formik.values.roomRent - 1 : value;
                    }
                    formik.setFieldValue( 'roomDiscount', value );
                  } }
                  error={ formik.touched.roomDiscount && Boolean( formik.errors.roomDiscount ) }
                  helperText={ formik.touched.roomDiscount && formik.errors.roomDiscount }
                  disabled={ formik.values.roomRent <= 0 || haveRoomGst }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  id="paymentMethod"
                  name="paymentMethod"
                  size="small"
                  fullWidth
                  placeholder="Select Payment Method"
                  value={ formik.values.paymentMethod }
                  onChange={ formik.handleChange }
                  error={ formik.touched.paymentMethod && Boolean( formik.errors.paymentMethod ) }
                >
                  <MenuItem value="default" disabled>
                    Select Payment Method
                  </MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="onlinePayment">Online Payment</MenuItem>
                </Select>
              </Grid>

              {/* GST Toggle */ }
              <Grid item xs={ 12 } sm={ 6 }>
                <FormControlLabel control={ <Switch checked={ haveRoomGst } onChange={ handleRoomGstToggle } /> } label="Have Room GST" />
              </Grid>
              {/* GST Percentage */ }
              { haveRoomGst && (
                <>
                  <Grid item xs={ 12 } sm={ 6 }>
                    <FormLabel>GST Number</FormLabel>
                    <TextField
                      id="gstNumber"
                      name="gstNumber"
                      size="small"
                      type="text"
                      fullWidth
                      placeholder="Enter GST Number"
                      value={ formik.values.gstNumber }
                      onChange={ ( e ) => {
                        formik.handleChange( e );
                        calculateTotalRoomAmount();
                      } }
                      error={ formik.touched.gstNumber && Boolean( formik.errors.gstNumber ) }
                      helperText={ formik.touched.gstNumber && formik.errors.gstNumber }
                    />
                  </Grid>

                  { !hotelData.roomGstPercentage ? (
                    <Grid item xs={ 12 } sm={ 6 }>
                      <FormLabel>GST Percentage</FormLabel>
                      <TextField
                        id="roomGstPercentage"
                        name="roomGstPercentage"
                        size="small"
                        type="number"
                        fullWidth
                        placeholder="In %"
                        value={ formik.values.roomGstPercentage }
                        onChange={ ( e ) => {
                          formik.handleChange( e );
                          calculateTotalRoomAmount();
                        } }
                        error={ formik.touched.roomGstPercentage && Boolean( formik.errors.roomGstPercentage ) }
                        helperText={ formik.touched.roomGstPercentage && formik.errors.roomGstPercentage }
                      />
                    </Grid>
                  ) : (
                    ''
                  ) }
                </>
              ) }
              {/* Total Amount */ }
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Total Room Amount</FormLabel>
                <TextField
                  id="totalRoomAmount"
                  name="totalRoomAmount"
                  size="small"
                  type="number"
                  fullWidth
                  value={ formik.values.totalRoomAmount }
                  onChange={ formik.handleChange }
                  error={ formik.touched.totalRoomAmount && Boolean( formik.errors.totalRoomAmount ) }
                  helperText={ formik.touched.totalRoomAmount && formik.errors.totalRoomAmount }
                />
              </Grid>
            </Grid>
            <Grid sx={ { display: `${ data?.foodItems?.length > 0 ? 'block' : 'none' }` } }>
              <Typography variant="h6" sx={ { margin: '14px 0px' } }>
                Food Bill Information
              </Typography>

              {/* //------------------------------------------------------food bill invoice  */ }
              <Grid container rowSpacing={ 3 } columnSpacing={ { xs: 0, sm: 2 } }>
                {/* Customer Name and Address */ }
                <Grid item xs={ 12 } sm={ 6 }>
                  <FormLabel>Food Amount</FormLabel>
                  <TextField
                    id="foodAmount"
                    name="foodAmount"
                    size="small"
                    type="number"
                    fullWidth
                    value={ formik.values.foodAmount || totalFoodAmount }
                    onChange={ formik.handleChange }
                    error={ formik.touched.foodAmount && Boolean( formik.errors.foodAmount ) }
                    helperText={ formik.touched.foodAmount && formik.errors.foodAmount }
                  />
                </Grid>

                {/* foodDiscount */ }
                <Grid item xs={ 12 } sm={ 6 }>
                  <FormLabel>Discount</FormLabel>
                  <TextField
                    id="foodDiscount"
                    name="foodDiscount"
                    size="small"
                    type="number"
                    fullWidth
                    placeholder="In $"
                    value={ formik.values.foodDiscount }
                    onChange={ ( e ) => {
                      let value = e.target.value.trim();
                      if ( value === '' ) {
                        value = '';
                      } else {
                        value = value.replace( /\D/, '' ).slice( 0, 6 );
                        value = Math.max( 0, Math.min( parseInt( value ), formik.values.foodAmount ) );
                        value = value === formik.values.foodAmount ? formik.values.foodAmount - 1 : value;
                      }
                      formik.setFieldValue( 'foodDiscount', value );
                    } }
                    error={ formik.touched.foodDiscount && Boolean( formik.errors.foodDiscount ) }
                    helperText={ formik.touched.foodDiscount && formik.errors.foodDiscount }
                    disabled={ formik.values.foodAmount <= 0 || haveFoodGst }
                  />
                </Grid>
                {/* GST Toggle */ }
                <Grid item xs={ 12 } sm={ 6 }>
                  <FormControlLabel control={ <Switch checked={ haveFoodGst } onChange={ handleFoodGstToggle } /> } label="Have Food GST" />
                </Grid>
                {/* GST Percentage */ }
                { haveFoodGst && (
                  <>
                    { !hotelData.foodGstPercentage ? (
                      <Grid item xs={ 12 } sm={ 6 }>
                        <FormLabel>GST Percentage</FormLabel>
                        <TextField
                          id="foodGstPercentage"
                          name="foodGstPercentage"
                          size="small"
                          type="number"
                          fullWidth
                          placeholder="In %"
                          value={ formik.values.foodGstPercentage }
                          onChange={ ( e ) => {
                            formik.handleChange( e );
                            calculateTotalFoodAmount();
                          } }
                          error={ formik.touched.foodGstPercentage && Boolean( formik.errors.foodGstPercentage ) }
                          helperText={ formik.touched.foodGstPercentage && formik.errors.foodGstPercentage }
                        />
                      </Grid>
                    ) : (
                      ''
                    ) }
                  </>
                ) }
                {/* Total Amount */ }
                <Grid item xs={ 12 } sm={ 6 }>
                  <FormLabel>Total Food Amount</FormLabel>
                  <TextField
                    id="totalFoodAmount"
                    name="totalFoodAmount"
                    size="small"
                    type="number"
                    fullWidth
                    value={ formik.values.totalFoodAmount }
                    onChange={ formik.handleChange }
                    error={ formik.touched.totalFoodAmount && Boolean( formik.errors.totalFoodAmount ) }
                    helperText={ formik.touched.totalFoodAmount && formik.errors.totalFoodAmount }
                  />
                </Grid>
                <Grid item xs={ 12 } sm={ 12 }>
                  <FormLabel>Total Amount ( Room + Food )</FormLabel>
                  <TextField
                    id="totalFoodAndRoomAmount"
                    name="totalFoodAndRoomAmount"
                    size="small"
                    type="number"
                    fullWidth
                    value={ formik.values.totalRoomAmount + formik.values.totalFoodAmount }
                    error={ formik.touched.totalFoodAndRoomAmount && Boolean( formik.errors.totalFoodAndRoomAmount ) }
                    helperText={ formik.touched.totalFoodAndRoomAmount && formik.errors.totalFoodAndRoomAmount }
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* laundary bill info  */ }
            <Grid sx={ { display: `${ data?.laundryDetails?.length > 0 ? 'block' : 'none' }` } }>
              <Typography variant="h6" sx={ { margin: '14px 0px' } }>
                Laundary Bill Information
              </Typography>

              {/* //------------------------------------------------------laundary bill invoice  */ }
              <Grid container rowSpacing={ 3 } columnSpacing={ { xs: 0, sm: 2 } }>
                {/* Laundary Amount */ }
                <Grid item xs={ 12 } sm={ 6 }>
                  <FormLabel>Laundary Amount</FormLabel>
                  <TextField
                    id="laundaryAmount"
                    name="laundaryAmount"
                    size="small"
                    type="number"
                    fullWidth
                    value={ totalLaundaryAmount }
                    onChange={ formik.handleChange }
                    error={ formik.touched.laundaryAmount && Boolean( formik.errors.laundaryAmount ) }
                    helperText={ formik.touched.laundaryAmount && formik.errors.laundaryAmount }
                  />
                </Grid>
                {/* Laundary Discount */ }
                <Grid item xs={ 12 } sm={ 6 }>
                  <FormLabel>Discount</FormLabel>
                  <TextField
                    id="laundaryDiscount"
                    name="laundaryDiscount"
                    size="small"
                    type="number"
                    fullWidth
                    placeholder="In $"
                    value={ formik.values.laundaryDiscount }
                    onChange={ ( e ) => {
                      let value = e.target.value.trim();
                      if ( value === '' ) {
                        value = '';
                      } else {
                        value = value.replace( /\D/, '' ).slice( 0, 6 );
                        value = Math.max( 0, Math.min( parseInt( value ), formik.values.laundaryAmount ) );
                        value = value === formik.values.laundaryAmount ? formik.values.laundaryAmount - 1 : value;
                      }
                      formik.setFieldValue( 'laundaryDiscount', value );
                    } }
                    error={ formik.touched.laundaryDiscount && Boolean( formik.errors.laundaryDiscount ) }
                    helperText={ formik.touched.laundaryDiscount && formik.errors.laundaryDiscount }
                    disabled={ formik.values.laundaryAmount <= 0 }
                  />
                </Grid>
                {/* Total Laundary Amount */ }
                <Grid item xs={ 12 } sm={ 6 }>
                  <FormLabel>Total Laundary Amount</FormLabel>
                  <TextField
                    id="totalLaundaryAmount"
                    name="totalLaundaryAmount"
                    size="small"
                    type="number"
                    fullWidth
                    value={ totalLaundaryAmount }
                    onChange={ formik.handleChange }
                    error={ formik.touched.totalLaundaryAmount && Boolean( formik.errors.totalLaundaryAmount ) }
                    helperText={ formik.touched.totalLaundaryAmount && formik.errors.totalLaundaryAmount }
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* spa bill info */ }
            <Grid sx={ { display: `${ data?.spaDetails?.[ 0 ]?.status == 'Completed' ? 'block' : 'none' }` } }>
              <Typography variant="h6" sx={ { margin: '14px 0px' } }>
                Spa Bill Information
              </Typography>

              {/* //------------------------------------------------------spa bill invoice  */ }
              <Grid container rowSpacing={ 3 } columnSpacing={ { xs: 0, sm: 2 } }>
                {/* Spa Amount */ }
                <Grid item xs={ 12 } sm={ 6 }>
                  <FormLabel>Spa Amount</FormLabel>
                  <TextField
                    id="spaAmount"
                    name="spaAmount"
                    size="small"
                    type="number"
                    fullWidth
                    value={ totalSpaAmount }
                    onChange={ formik.handleChange }
                    error={ formik.touched.spaAmount && Boolean( formik.errors.spaAmount ) }
                    helperText={ formik.touched.spaAmount && formik.errors.spaAmount }
                  />
                </Grid>
                {/* Spa Discount */ }
                <Grid item xs={ 12 } sm={ 6 }>
                  <FormLabel>Discount</FormLabel>
                  <TextField
                    id="spaDiscount"
                    name="spaDiscount"
                    size="small"
                    type="number"
                    fullWidth
                    placeholder="In $"
                    value={ formik.values.spaDiscount }
                    onChange={ ( e ) => {
                      let value = e.target.value.trim();
                      if ( value === '' ) {
                        value = '';
                      } else {
                        value = value.replace( /\D/, '' ).slice( 0, 6 );
                        value = Math.max( 0, Math.min( parseInt( value ), formik.values.spaAmount ) );
                        value = value === formik.values.spaAmount ? formik.values.spaAmount - 1 : value;
                      }
                      formik.setFieldValue( 'spaDiscount', value );
                    } }
                    error={ formik.touched.spaDiscount && Boolean( formik.errors.spaDiscount ) }
                    helperText={ formik.touched.spaDiscount && formik.errors.spaDiscount }
                    disabled={ formik.values.spaAmount <= 0 || haveSpaGst }
                  />
                </Grid>
                {/* GST Toggle */ }
                <Grid item xs={ 12 } sm={ 6 }>
                  <FormControlLabel control={ <Switch checked={ haveSpaGst } onChange={ handleSpaGstToggle } /> } label="Have Spa GST" />
                </Grid>
                {/* GST Percentage */ }
                { haveSpaGst && (
                  <>
                    { !hotelData.spaGstPercentage ? (
                      <Grid item xs={ 12 } sm={ 6 }>
                        <FormLabel>GST Percentage</FormLabel>
                        <TextField
                          id="spaGstPercentage"
                          name="spaGstPercentage"
                          size="small"
                          type="number"
                          fullWidth
                          placeholder="In %"
                          value={ formik.values.spaGstPercentage }
                          onChange={ ( e ) => {
                            formik.handleChange( e );
                            calculateTotalSpaAmount();
                          } }
                          error={ formik.touched.spaGstPercentage && Boolean( formik.errors.spaGstPercentage ) }
                          helperText={ formik.touched.spaGstPercentage && formik.errors.spaGstPercentage }
                        />
                      </Grid>
                    ) : (
                      ''
                    ) }
                  </>
                ) }
                {/* Total Spa Amount */ }
                <Grid item xs={ 12 } sm={ 6 }>
                  <FormLabel>Total Spa Amount</FormLabel>
                  <TextField
                    id="totalSpaAmount"
                    name="totalSpaAmount"
                    size="small"
                    type="number"
                    fullWidth
                    value={ totalSpaAmount }
                    onChange={ formik.handleChange }
                    error={ formik.touched.totalSpaAmount && Boolean( formik.errors.totalSpaAmount ) }
                    helperText={ formik.touched.totalSpaAmount && formik.errors.totalSpaAmount }
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={ { margin: '14px 0px' } }>
                Total Bill Amount
              </Typography>
              <Grid container>
                <Grid item xs={ 12 }>
                  <FormLabel>Final Total Amount</FormLabel>
                  <TextField
                    id="finalTotalAmount"
                    name="finalTotalAmount"
                    size="small"
                    type="number"
                    fullWidth
                    value={ formik.values.totalRoomAmount + formik.values.totalFoodAmount + totalLaundaryAmount + totalSpaAmount }
                    InputProps={ {
                      readOnly: true
                    } }
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Submit Button */ }
            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Generate Invoice
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
SingleInvoiceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default SingleInvoiceDialog;
