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

const SpaInvoiceDialog = ( props ) => {
  const navigate = useNavigate();
  const { open, handleClose, data } = props;
  const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );
  const [ hotelData, setHotelData ] = useState( [] );
  const [ haveGST, setHaveGST ] = useState( false );
  const [ totalSpaAmount, setTotalSpaAmount ] = useState( 0 );
  const [ gstAmount, setGstAmount ] = useState();

  console.log( 'data for generating invoice', data );
  // function for fetching hotel data from the db
  const fetchHotelData = async () => {
    try {
      const response = await getApi( `api/hotel/view/${ hotel?.hotelId }` );
      setHotelData( response?.data );
    } catch ( error ) {
      console.log( error );
    }
  };

  useEffect( () => {
    fetchHotelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  const calculateTotalSpaAmount = () => {
    if ( !data ) {
      return 0;
    }
    // If data has price directly
    if ( data.price ) {
      return data.price;
    }
    // For spa services in array format
    return data?.spaDetails?.reduce( ( total, spaData ) => total + spaData.totalAmount, 0 ) || 0;
  };

  useEffect( () => {
    setTotalSpaAmount( calculateTotalSpaAmount() );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data ] );

  const initialValues = {
    name: data?.firstName ? `${ data?.firstName } ${ data?.lastName }` : data?.fullName || '',
    address: data?.address || data?.customerDetails?.address || '',
    spaAmount: totalSpaAmount,
    discount: '',
    gstPercentage: hotelData?.spagstpercentage || 0,
    haveGST: false,
    gstNumber: '',
    totalAmount: '',
    paymentMethod: 'cash'
  };

  const validationSchema = yup.object().shape( {
    name: yup.string().required( 'Customer name is required' ),
    address: yup.string().required( 'Address is required' ),
    spaAmount: yup.number().required( 'Spa service amount is required' ).min( 0, 'Spa amount cannot be negative' ),
    discount: yup.number().min( 0, 'Discount cannot be negative' ),
    totalAmount: yup.number().required( 'Total amount is required' ).min( 0, 'Total amount cannot be negative' ),
    paymentMethod: yup.string().required( 'Payment method is required' )
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
    const invoiceNumber = `INV-SPA-${ year }-${ month }-${ day }-${ randomPart }`;
    return invoiceNumber;
  };

  // function for generating Invoice
  const generateSpaInvoice = async ( values, resetForm ) => {
    try {
      values.type = 'spa';
      values.hotelId = hotel.hotelId;
      values.reservationId = data?._id;
      values.serviceId = data?.spa;
      values.invoiceNumber = generateInvoiceNumber();
      values.customerPhoneNumber = data?.phoneNumber || data?.customerDetails?.phoneNumber;
      values.gstAmount = gstAmount;

      // Still include these in the backend data even if not displayed
      values.serviceName = data?.serviceName;
      values.serviceType = data?.serviceType || 'SpaService';
      values.duration = data?.duration;

      const response = await postApi( 'api/invoice/add', values );

      if ( !hotelData.spagstpercentage && formik.values.gstPercentage ) {
        const updateData = {};
        updateData.spagstpercentage = formik.values.gstPercentage;
        // You might want to update hotel data with new GST percentage
        // await postApi(`api/hotel/update/${hotel.hotelId}`, updateData);
      }

      toast.success( 'Spa Invoice generated successfully' );
      handleClose();
      resetForm();
      setTimeout( () => {
        navigate( `/roombill/view/${ response?.data?._id }` );
      }, 200 );
    } catch ( error ) {
      console.log( error );
      toast.error( 'Cannot generate Spa Invoice' );
    }
  };

  const formik = useFormik( {
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async ( values, { resetForm } ) => {
      generateSpaInvoice( values, resetForm );
    }
  } );

  const handleGSTToggle = () => {
    setHaveGST( !haveGST );
    formik.setFieldValue( 'haveGST', !haveGST );
  };

  const calculateTotalAmount = () => {
    const totalSpaAmountWithoutGst = formik.values.spaAmount - ( formik.values.discount || 0 );
    const gstAmount = totalSpaAmountWithoutGst * ( formik.values.gstPercentage / 100 );
    setGstAmount( gstAmount );
    const totalAmount = haveGST ? totalSpaAmountWithoutGst + gstAmount : totalSpaAmountWithoutGst;
    formik.setFieldValue( 'totalAmount', totalAmount );
  };

  useEffect( () => {
    calculateTotalAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ formik.values.spaAmount, formik.values.discount, formik.values.gstPercentage, haveGST ] );

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
          <Typography variant="h6">Spa Service Invoice Information</Typography>
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
              {/* Customer Name and Address */ }
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

              {/* Spa Amount */ }
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Spa Amount</FormLabel>
                <TextField
                  id="spaAmount"
                  name="spaAmount"
                  size="small"
                  type="number"
                  fullWidth
                  value={ formik.values.spaAmount }
                  onChange={ formik.handleChange }
                  error={ formik.touched.spaAmount && Boolean( formik.errors.spaAmount ) }
                  helperText={ formik.touched.spaAmount && formik.errors.spaAmount }
                />
              </Grid>

              {/* Discount */ }
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Discount</FormLabel>
                <TextField
                  id="discount"
                  name="discount"
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="In $"
                  value={ formik.values.discount }
                  onChange={ ( e ) => {
                    let value = e.target.value.trim();
                    if ( value === '' ) {
                      value = '';
                    } else {
                      value = value.replace( /\D/, '' ).slice( 0, 6 );
                      value = Math.max( 0, Math.min( parseInt( value ), formik.values.spaAmount ) );
                      value = value === formik.values.spaAmount ? formik.values.spaAmount - 1 : value;
                    }
                    formik.setFieldValue( 'discount', value );
                  } }
                  error={ formik.touched.discount && Boolean( formik.errors.discount ) }
                  helperText={ formik.touched.discount && formik.errors.discount }
                  disabled={ formik.values.spaAmount <= 0 || haveGST }
                />
              </Grid>

              {/* Payment Method */ }
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  id="paymentMethod"
                  name="paymentMethod"
                  size="small"
                  fullWidth
                  value={ formik.values.paymentMethod }
                  onChange={ formik.handleChange }
                  error={ formik.touched.paymentMethod && Boolean( formik.errors.paymentMethod ) }
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="onlinePayment">Online Payment</MenuItem>
                </Select>
              </Grid>

              {/* GST Toggle */ }
              <Grid item xs={ 12 } sm={ 6 }>
                <FormControlLabel control={ <Switch checked={ haveGST } onChange={ handleGSTToggle } /> } label="Have GST" />
              </Grid>

              {/* GST Number and Percentage */ }
              { haveGST && (
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
                        calculateTotalAmount();
                      } }
                      error={ formik.touched.gstNumber && Boolean( formik.errors.gstNumber ) }
                      helperText={ formik.touched.gstNumber && formik.errors.gstNumber }
                    />
                  </Grid>
                  { !hotelData.spagstpercentage ? (
                    <Grid item xs={ 12 } sm={ 6 }>
                      <FormLabel>GST Percentage</FormLabel>
                      <TextField
                        id="gstPercentage"
                        name="gstPercentage"
                        size="small"
                        type="number"
                        fullWidth
                        placeholder="In %"
                        value={ formik.values.gstPercentage }
                        onChange={ ( e ) => {
                          formik.handleChange( e );
                          calculateTotalAmount();
                        } }
                        error={ formik.touched.gstPercentage && Boolean( formik.errors.gstPercentage ) }
                        helperText={ formik.touched.gstPercentage && formik.errors.gstPercentage }
                      />
                    </Grid>
                  ) : (
                    ''
                  ) }
                </>
              ) }

              {/* Total Amount */ }
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Total Amount</FormLabel>
                <TextField
                  id="totalAmount"
                  name="totalAmount"
                  size="small"
                  type="number"
                  fullWidth
                  value={ formik.values.totalAmount }
                  onChange={ formik.handleChange }
                  error={ formik.touched.totalAmount && Boolean( formik.errors.totalAmount ) }
                  helperText={ formik.touched.totalAmount && formik.errors.totalAmount }
                />
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

SpaInvoiceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default SpaInvoiceDialog;
