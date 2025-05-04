import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControlLabel, FormLabel, MenuItem, Select } from '@mui/material';
import { toast } from 'react-toastify';
import { postApi, getApi } from 'views/services/api';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

const FoodInvoiceDialog = ( props ) => {
  const navigate = useNavigate();
  const { open, handleClose, data } = props;
  const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );
  const [ hotelData, setHotelData ] = useState( [] );
  const [ haveGST, setHaveGST ] = useState( false );
  const [ totalFoodAmount, setTotalFoodAmount ] = useState( 0 );
  const [ gstAmount, setGstAmount ] = useState();

  // function for fetching hotel data from the db

  const fetchHotelData = async () => {
    try {
      // const response = await getApi(`api/hotel/view/${hotel._id}`);
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

  const calculateTotalFoodAmount = () => {
    if ( !data || !data.foodItems ) {
      return 0;
    }

    const totalFoodAmount = data.foodItems.reduce( ( total, foodData ) => {
      return total + foodData.quantity * foodData.price;
    }, 0 );

    return totalFoodAmount;
  };

  useEffect( () => {
    setTotalFoodAmount( calculateTotalFoodAmount() );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data ] );

  const initialValues = {
    name: `${ data?.customerDetails?.firstName } ${ data?.customerDetails?.lastName }`,
    address: data?.customerDetails?.address,
    foodAmount: totalFoodAmount,
    discount: '',
    gstPercentage: hotelData?.foodgstpercentage,
    haveGST: false,
    gstNumber: '',
    totalAmount: '',
    paymentMethod: 'cash'
  };

  const validationSchema = yup.object().shape( {
    name: yup.string().required( 'Customer name is required' ),
    address: yup.string().required( 'Address is required' ),
    foodAmount: yup.number().required( 'Food amount is required' ).min( 0, 'Food amount cannot be negative' ),
    discount: yup.number().min( 0, 'Discount cannot be negative' ),
    // gstPercentage: yup.number().min(0, 'GST percentage cannot be negative'),
    // gstNumber: yup.string().when('haveGST', {
    //   is: true,
    //   then: yup
    //     .string()
    //     .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9A-Za-z]{1}$/, 'Invalid GST number format')
    //     .required('GST number is required'),
    //   otherwise: yup.string()
    // }),

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
    const invoiceNumber = `INV-${ year }-${ month }-${ day }-${ randomPart }`;
    return invoiceNumber;
  };

  // function for generating Invoice

  const generateFoodInvoice = async ( values, resetForm ) => {
    try {
      values.type = 'food';
      values.hotelId = hotel.hotelId;
      values.reservationId = data?._id;
      values.invoiceNumber = generateInvoiceNumber();
      values.customerPhoneNumber = data?.customerDetails?.phoneNumber;
      values.gstAmount = gstAmount;
      const response = await postApi( 'api/invoice/add', values );
      if ( !hotelData.foodgstpercentage ) {
        const data = {};
        data.foodgstpercentage = formik.values.gstPercentage;
      } else {
        console.log( '' );
      }

      toast.success( 'Invoice generated successfully' );
      handleClose();
      resetForm();
      setTimeout( () => {
        navigate( `/roombill/view/${ response.data._id }` );
      }, 200 );
    } catch ( error ) {
      console.log( error );
      toast.error( 'cannot generate Invoice' );
    }
  };

  const formik = useFormik( {
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async ( values, { resetForm } ) => {
      generateFoodInvoice( values, resetForm );
    }
  } );

  const handleGSTToggle = () => {
    setHaveGST( !haveGST );
    formik.setFieldValue( 'haveGST', !haveGST );
  };
  const calculateTotalAmount = () => {
    const totalFoodAmountWithoutGst = formik.values.foodAmount - formik.values.discount;
    const gstAmount = totalFoodAmountWithoutGst * ( formik.values.gstPercentage / 100 );
    setGstAmount( gstAmount );
    const totalAmount = haveGST ? totalFoodAmountWithoutGst + gstAmount : totalFoodAmountWithoutGst;
    formik.setFieldValue( 'totalAmount', totalAmount );
  };

  useEffect( () => {
    calculateTotalAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ formik.values.foodAmount, formik.values.discount, formik.values.gstPercentage, haveGST ] );

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
          <Typography variant="h6">Food Invoice Information</Typography>
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

              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Food Amount</FormLabel>
                <TextField
                  id="foodAmount"
                  name="foodAmount"
                  size="small"
                  type="number"
                  fullWidth
                  value={ formik.values.foodAmount }
                  onChange={ formik.handleChange }
                  error={ formik.touched.foodAmount && Boolean( formik.errors.foodAmount ) }
                  helperText={ formik.touched.foodAmount && formik.errors.foodAmount }
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
                      value = Math.max( 0, Math.min( parseInt( value ), formik.values.foodAmount ) );
                      value = value === formik.values.foodAmount ? formik.values.foodAmount - 1 : value;
                    }
                    formik.setFieldValue( 'discount', value );
                  } }
                  error={ formik.touched.discount && Boolean( formik.errors.discount ) }
                  helperText={ formik.touched.discount && formik.errors.discount }
                  disabled={ formik.values.foodAmount <= 0 || haveGST }
                />
              </Grid>
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
              {/* GST Percentage */ }
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
                  { !hotelData.foodgstpercentage ? (
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
FoodInvoiceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default FoodInvoiceDialog;
