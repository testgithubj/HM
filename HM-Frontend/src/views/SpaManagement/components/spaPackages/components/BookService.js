import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    Grid,
    TextField,
    MenuItem,
    Typography,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    useTheme
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import { postApi, getApi } from 'views/services/api';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const bookServiceSchema = Yup.object( {
    userType: Yup.string().required( 'User type is required' ),
    serviceId: Yup.string().required( 'Service is required' ),
    guestName: Yup.string().when( 'userType', {
        is: 'Guest',
        then: () => Yup.string().required( 'Guest name is required' ),
        otherwise: () => Yup.string().notRequired()
    } ),
    cardType: Yup.string().when( 'userType', {
        is: 'Guest',
        then: () => Yup.string().required( 'Card type is required' ),
        otherwise: () => Yup.string().notRequired()

    } ),
    cardNumber: Yup.string().when( [ 'userType', 'cardType' ], {
        is: ( userType, cardType ) => userType === 'Guest',
        then: () => {
            let schema = Yup.string().required( 'Card number is required' );
            // Additional validation for PAN card format
            return schema.test( {
                name: 'cardNumberFormat',
                test: function ( value ) {
                    const { cardType } = this.parent;
                    if ( cardType === 'PAN' && value ) {
                        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test( value ) ||
                            this.createError( { message: 'Invalid PAN card format' } );
                    }
                    return true;
                }
            } );
        }
    } ),
    roomNumber: Yup.number().when( 'userType', {
        is: 'Room',
        then: () => Yup.number().required( 'Room number is required' )
    } ),
    numberOfPersons: Yup.number()
        .min( 1, 'At least 1 person required' )
        .required( 'Number of persons is required' ),
    bookingDate: Yup.date().required( 'Date is required' ),
    bookingTime: Yup.date().required( 'Time is required' ),
    notes: Yup.string()
} );

const userTypeOptions = [ 'Guest', 'Room' ];
const cardTypeOptions = [ 'PAN', 'Aadhar', 'Driving License', 'Passport', 'Voter ID' ];

const BookService = ( { open, handleClose, serviceData } ) => {
    const theme = useTheme();
    const [ loading, setLoading ] = useState( false );

    const initialValues = {
        userType: 'Guest',
        serviceId: serviceData?._id || '',
        serviceName: serviceData?.name || '',
        guestName: '',
        cardType: 'PAN',
        cardNumber: '',
        roomNumber: '',
        numberOfPersons: 1,
        bookingDate: new Date(),
        bookingTime: new Date(),
        price: serviceData?.price || 0,
        duration: serviceData?.duration || 0,
        notes: '',
        status: 'Pending'
    };

    const formik = useFormik( {
        initialValues,
        validationSchema: bookServiceSchema,
        onSubmit: async ( values ) => {
            await addServiceBooking( values );
        }
    } );

    useEffect( () => {
        if ( open ) {
            // Reset form with new initial values that include serviceData
            formik.resetForm( {
                values: {
                    ...initialValues,
                    serviceId: serviceData?._id || '',
                    serviceName: serviceData?.name || '',
                    price: serviceData?.price || 0,
                    duration: serviceData?.duration || 0
                }
            } );
        }
    }, [ open, serviceData ] );

    // Update form values when serviceData changes
    useEffect( () => {
        if ( serviceData ) {
            formik.setFieldValue( 'serviceId', serviceData._id || '' );
            formik.setFieldValue( 'serviceName', serviceData.name || '' );
            formik.setFieldValue( 'price', serviceData.price || 0 );
            formik.setFieldValue( 'duration', serviceData.duration || 0 );
        }
    }, [ serviceData ] );

    const addServiceBooking = async ( values ) => {
        try {
            setLoading( true );
            const hotelData = JSON.parse( localStorage.getItem( 'hotelData' ) );
            const dataToSend = {
                ...values,
                hotelId: hotelData?.hotelId,
                bookingDateTime: new Date(
                    values.bookingDate.getFullYear(),
                    values.bookingDate.getMonth(),
                    values.bookingDate.getDate(),
                    values.bookingTime.getHours(),
                    values.bookingTime.getMinutes()
                )
            };

            const response = await postApi( 'api/spa/service-booking/add', dataToSend );
            console.log( response.data, 'this is for spa service booking' );
            if ( response && ( response.status === 200 || response.status === 201 ) ) {
                formik.resetForm();
                toast.success( 'Spa service booked successfully' );
                handleClose();
            } else {
                const errorMessage = response?.response?.data?.error || 'Failed to book service';
                toast.error( errorMessage );
            }
        } catch ( error ) {
            const errorMessage = error?.response?.data?.error || error?.message || 'An unexpected error occurred';
            toast.error( errorMessage );
        } finally {
            setLoading( false );
        }
    };

    useEffect( () => {
        if ( formik.values.userType === 'Guest' ) {
            formik.setFieldValue( 'roomNumber', '' );
        } else if ( formik.values.userType === 'Room' ) {
            formik.setFieldValue( 'guestName', '' );
            formik.setFieldValue( 'cardType', '' );
            formik.setFieldValue( 'cardNumber', '' );
        }
    }, [ formik.values.userType ] );

    return (
        <Dialog
            open={ open }
            onClose={ handleClose }
            aria-labelledby="book-service-dialog-title"
            maxWidth="md"
            fullWidth
            PaperProps={ {
                sx: {
                    borderRadius: 1.5,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden'
                }
            } }
        >
            <DialogTitle
                id="book-service-dialog-title"
                sx={ {
                    background: `linear-gradient(135deg, ${ theme.palette.primary.main }, ${ theme.palette.primary.dark })`,
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1.5,
                    px: 2
                } }
            >
                <Typography variant="h6" sx={ { fontWeight: 'bold', color: 'white' } }>Book Spa Service</Typography>
                <ClearIcon onClick={ handleClose } sx={ { cursor: 'pointer', color: 'white' } } />
            </DialogTitle>

            <DialogContent dividers>
                <form onSubmit={ formik.handleSubmit }>
                    <DialogContentText id="scroll-dialog-description" tabIndex={ -1 }>
                        <Grid container spacing={ 2 } sx={ { mt: 0.5 } }>
                            <Grid item xs={ 12 } md={ 6 }>
                                <TextField
                                    select
                                    id="userType"
                                    name="userType"
                                    label="User Type"
                                    fullWidth
                                    value={ formik.values.userType }
                                    onChange={ formik.handleChange }
                                    error={ formik.touched.userType && Boolean( formik.errors.userType ) }
                                    helperText={ formik.touched.userType && formik.errors.userType }
                                    size="small"
                                >
                                    { userTypeOptions.map( ( type ) => (
                                        <MenuItem key={ type } value={ type }>
                                            { type }
                                        </MenuItem>
                                    ) ) }
                                </TextField>
                            </Grid>


                            <Grid item xs={ 12 } md={ 6 }>
                                <TextField
                                    id="serviceName"
                                    name="serviceName"
                                    label="Service"
                                    fullWidth
                                    value={ formik.values.serviceName }
                                    InputProps={ { readOnly: true } }
                                    size="small"
                                />
                            </Grid>

                            { formik.values.userType === 'Guest' && (
                                <>
                                    <Grid item xs={ 12 } md={ 6 }>
                                        <TextField
                                            id="guestName"
                                            name="guestName"
                                            label="Guest Name"
                                            fullWidth
                                            value={ formik.values.guestName }
                                            onChange={ formik.handleChange }
                                            error={ formik.touched.guestName && Boolean( formik.errors.guestName ) }
                                            helperText={ formik.touched.guestName && formik.errors.guestName }
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={ 12 } md={ 6 }>
                                        <TextField
                                            select
                                            id="cardType"
                                            name="cardType"
                                            label="ID Card Type"
                                            fullWidth
                                            value={ formik.values.cardType }
                                            onChange={ formik.handleChange }
                                            error={ formik.touched.cardType && Boolean( formik.errors.cardType ) }
                                            helperText={ formik.touched.cardType && formik.errors.cardType }
                                            size="small"
                                        >
                                            { cardTypeOptions.map( ( type ) => (
                                                <MenuItem key={ type } value={ type }>
                                                    { type }
                                                </MenuItem>
                                            ) ) }
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={ 12 } md={ 6 }>
                                        <TextField
                                            id="cardNumber"
                                            name="cardNumber"
                                            label={ `${ formik.values.cardType } Number` }
                                            fullWidth
                                            value={ formik.values.cardNumber }
                                            onChange={ ( e ) => formik.setFieldValue( 'cardNumber',
                                                formik.values.cardType === 'PAN' ? e.target.value.toUpperCase() : e.target.value ) }
                                            error={ formik.touched.cardNumber && Boolean( formik.errors.cardNumber ) }
                                            helperText={ formik.touched.cardNumber && formik.errors.cardNumber }
                                            placeholder={ formik.values.cardType === 'PAN' ? "ABCDE1234F" : "" }
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={ 12 } md={ 6 }>
                                        <TextField
                                            id="numberOfPersons"
                                            name="numberOfPersons"
                                            label="Number of Persons"
                                            fullWidth
                                            type="number"
                                            value={ formik.values.numberOfPersons }
                                            onChange={ formik.handleChange }
                                            error={ formik.touched.numberOfPersons && Boolean( formik.errors.numberOfPersons ) }
                                            helperText={ formik.touched.numberOfPersons && formik.errors.numberOfPersons }
                                            size="small"
                                        />
                                    </Grid>
                                </>
                            ) }

                            { formik.values.userType === 'Room' && (
                                <>
                                    <Grid item xs={ 12 } md={ 6 }>
                                        <TextField
                                            id="roomNumber"
                                            name="roomNumber"
                                            label="Room Number"
                                            fullWidth
                                            type="number"
                                            value={ formik.values.roomNumber }
                                            onChange={ formik.handleChange }
                                            error={ formik.touched.roomNumber && Boolean( formik.errors.roomNumber ) }
                                            helperText={ formik.touched.roomNumber && formik.errors.roomNumber }
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={ 12 } md={ 6 }>
                                        <TextField
                                            id="numberOfPersons"
                                            name="numberOfPersons"
                                            label="Number of Persons"
                                            fullWidth
                                            type="number"
                                            value={ formik.values.numberOfPersons }
                                            onChange={ formik.handleChange }
                                            error={ formik.touched.numberOfPersons && Boolean( formik.errors.numberOfPersons ) }
                                            helperText={ formik.touched.numberOfPersons && formik.errors.numberOfPersons }
                                            size="small"
                                        />
                                    </Grid>
                                </>
                            ) }

                            <Grid item xs={ 12 } md={ 6 }>
                                <LocalizationProvider dateAdapter={ AdapterDateFns }>
                                    <DatePicker
                                        label="Booking Date"
                                        value={ formik.values.bookingDate }
                                        onChange={ ( value ) => formik.setFieldValue( 'bookingDate', value ) }
                                        slotProps={ {
                                            textField: {
                                                fullWidth: true,
                                                size: "small",
                                                error: formik.touched.bookingDate && Boolean( formik.errors.bookingDate ),
                                                helperText: formik.touched.bookingDate && formik.errors.bookingDate
                                            }
                                        } }
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={ 12 } md={ 6 }>
                                <LocalizationProvider dateAdapter={ AdapterDateFns }>
                                    <TimePicker
                                        label="Booking Time"
                                        value={ formik.values.bookingTime }
                                        onChange={ ( value ) => formik.setFieldValue( 'bookingTime', value ) }
                                        slotProps={ {
                                            textField: {
                                                fullWidth: true,
                                                size: "small",
                                                error: formik.touched.bookingTime && Boolean( formik.errors.bookingTime ),
                                                helperText: formik.touched.bookingTime && formik.errors.bookingTime
                                            }
                                        } }
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={ 12 } md={ 6 }>
                                <TextField
                                    id="price"
                                    name="price"
                                    label="Price"
                                    fullWidth
                                    value={ formik.values.price }
                                    InputProps={ { readOnly: true } }
                                    size="small"
                                />
                            </Grid>

                            <Grid item xs={ 12 } md={ 6 }>
                                <TextField
                                    id="status"
                                    name="status"
                                    label="Status"
                                    fullWidth
                                    value="Pending"
                                    InputProps={ { readOnly: true } }
                                    size="small"
                                />
                            </Grid>

                            <Grid item xs={ 12 }>
                                <TextField
                                    id="notes"
                                    name="notes"
                                    label="Notes"
                                    multiline
                                    rows={ 3 }
                                    fullWidth
                                    value={ formik.values.notes }
                                    onChange={ formik.handleChange }
                                    error={ formik.touched.notes && Boolean( formik.errors.notes ) }
                                    helperText={ formik.touched.notes && formik.errors.notes }
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </form>
            </DialogContent>

            <DialogActions sx={ { px: 3, py: 2, borderTop: `1px solid ${ theme.palette.divider }` } }>
                <Button onClick={ handleClose } color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={ formik.handleSubmit }
                    variant="contained"
                    color="primary"
                    disabled={ loading }
                    sx={ {
                        borderRadius: 1,
                        px: 3
                    } }
                >
                    { loading ? 'Booking...' : 'Book Service' }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookService;