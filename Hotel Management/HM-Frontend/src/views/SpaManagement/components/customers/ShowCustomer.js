// import React from 'react';
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button,
//     Typography,
//     IconButton,
//     Box,
//     Grid,
//     Chip // Optional: for displaying status nicely
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { format } from 'date-fns'; // For formatting dates

// // Helper function to display data nicely
// const DataItem = ( { label, value } ) => (
//     <Grid item xs={ 12 } sm={ 6 }>
//         <Box mb={ 1.5 }>
//             <Typography variant="body2" color="textSecondary" gutterBottom sx={ { fontWeight: 500 } }>
//                 { label }
//             </Typography>
//             <Typography variant="body1">
//                 { value || '-' } {/* Show '-' if value is empty/null */ }
//             </Typography>
//         </Box>
//     </Grid>
// );

// const ShowSpaCustomer = ( { open, handleClose, customerData } ) => {

//     console.log( customerData, 'this is the customer data' );

//     const handleCancel = () => {
//         handleClose();
//     };

//     // Format dates for display
//     const formatDate = ( dateString ) => {

//         console.log( typeof dateString, dateString, 'this is the date string' );
//         if ( !dateString ) return '-';
//         try {
//             // Assuming dateString is either a Date object or a parseable string
//             const date = typeof dateString === 'string' ? new Date( dateString ) : dateString;
//             if ( date instanceof Date && !isNaN( date ) ) {
//                 return format( date, 'PP' ); // Format like 'Sep 17, 2023'
//             }
//             if ( typeof dateString === 'number' ) return dateString
//             return dateString;
//         } catch ( error ) {
//             console.error( "Error formatting date:", error );
//             return '-';
//         }
//     };

//     return (
//         <Dialog
//             open={ open }
//             onClose={ handleCancel }
//             maxWidth="md" // Adjust as needed
//             fullWidth
//             aria-labelledby="view-customer-dialog-title"
//         >
//             <DialogTitle id="view-customer-dialog-title">
//                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                     <Typography variant="h6">Customer Details</Typography>
//                     <IconButton onClick={ handleCancel } size="small" aria-label="close">
//                         <CloseIcon />
//                     </IconButton>
//                 </Box>
//             </DialogTitle>
//             <DialogContent dividers>
//                 { customerData ? (
//                     <Grid container spacing={ 1 }> {/* Reduced spacing */ }
//                         <DataItem label="Customer Name" value={ customerData.firstName + ' ' + customerData.lastName } />
//                         <DataItem label="Phone Number" value={ customerData.phoneNumber } />
//                         <DataItem label="Email" value={ customerData.email } />
//                         <DataItem label="Service Name" value={ customerData.serviceName } />
//                         <DataItem label="ID Card Type" value={ customerData.idCardType } />
//                         <DataItem label="ID Card Number" value={ customerData.idcardNumber } />
//                         <DataItem label="Booking Date Time" value={ formatDate( customerData.bookingDateTime ) } />
//                         <DataItem label="Number Of Persons" value={ formatDate( customerData.numberOfPersons ) } />
//                         <DataItem label="Duration" value={ customerData?.duration + ' minutes' } />
//                         <Grid item xs={ 12 } sm={ 6 }>
//                             <Box mb={ 1.5 }>
//                                 <Typography variant="body2" color="textSecondary" gutterBottom sx={ { fontWeight: 500 } }>
//                                     Payment Status
//                                 </Typography>
//                                 <Chip
//                                     label={ customerData.status || '-' }
//                                     color={ customerData.status === 'Completed' ? 'success' : 'warning' }
//                                     size="small"
//                                 />
//                             </Box>
//                         </Grid>
//                         <Grid item xs={ 12 }> {/* Address spanning full width */ }
//                             <Box mb={ 1 }>
//                                 <Typography variant="body2" color="textSecondary" gutterBottom sx={ { fontWeight: 500 } }>
//                                     Address
//                                 </Typography>
//                                 <Typography variant="body1" sx={ { whiteSpace: 'pre-wrap' } }> {/* Preserve line breaks */ }
//                                     { customerData.address || '-' }
//                                 </Typography>
//                             </Box>
//                         </Grid>
//                     </Grid>
//                 ) : (
//                     <Typography>No customer data available.</Typography>
//                 ) }
//             </DialogContent>
//             <DialogActions sx={ { padding: '16px 24px' } }>
//                 <Button onClick={ handleCancel } color="primary" variant="outlined">
//                     Close
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default ShowSpaCustomer;
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
    Box,
    Grid,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';

// Helper function to display data nicely
const DataItem = ( { label, value } ) => (
    <Grid item xs={ 12 } sm={ 6 }>
        <Box mb={ 1.5 }>
            <Typography variant="body2" color="textSecondary" gutterBottom sx={ { fontWeight: 500 } }>
                { label }
            </Typography>
            <Typography variant="body1">
                { value || '-' }
            </Typography>
        </Box>
    </Grid>
);

const ShowSpaCustomer = ( { open, handleClose, customerData } ) => {

    console.log( customerData, 'customer details: ' );

    const handleCancel = () => {
        handleClose();
    };

    // Format dates for display
    // Format dates for display
const formatDate = (dateString) => {
    console.log(typeof dateString, dateString, 'this is the date string');
    if (!dateString) return '-';
    try {
        // Assuming dateString is either a Date object or a parseable string
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        if (date instanceof Date && !isNaN(date)) {
            return format(date, 'PPpp'); // Example: 'Apr 25, 2025 at 3:45 PM'
        }
        if (typeof dateString === 'number') return dateString;
        return dateString;
    } catch (error) {
        console.error("Error formatting date:", error);
        return '-';
    }
};

    // Check if service type is "Service" to show duration
    const showDuration = customerData?.serviceType === "Service";

    return (
        <Dialog
            open={ open }
            onClose={ handleCancel }
            maxWidth="md"
            fullWidth
            aria-labelledby="view-customer-dialog-title"
        >
            <DialogTitle id="view-customer-dialog-title">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Customer Details</Typography>
                    <IconButton onClick={ handleCancel } size="small" aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                { customerData ? (
                    <Grid container spacing={ 1 }>
                        <DataItem label="Customer Name" value={ customerData.firstName + ' ' + customerData.lastName } />
                        <DataItem label="Room No" value={ customerData.roomNo|| 'N/A'}/>
                        <DataItem label="Phone Number" value={ customerData.phoneNumber } />
                        <DataItem label="Email" value={ customerData.email } />
                        <DataItem label="Service Name" value={ customerData?.serviceId?.name } />
                        <DataItem label="Service Type" value={ customerData.serviceType || '-' } />
                        <DataItem label="ID Card Type" value={ customerData.idCardType } />
                        <DataItem label="ID Card Number" value={ customerData.idcardNumber } />
                        <DataItem label="Booking Date Time" value={ formatDate( customerData.bookingDateTime ) } />
                        <DataItem label="Number Of Persons" value={ formatDate( customerData.numberOfPersons ) } />

                        {/* Only show Duration if serviceType is "Service" */ }
                        { showDuration && (
                            <DataItem label="Duration" value={ ( customerData?.duration || '-' ) + ' minutes' } />
                        ) }

                        <Grid item xs={ 12 } sm={ 6 }>
                            <Box mb={ 1.5 }>
                                <Typography variant="body2" color="textSecondary" gutterBottom sx={ { fontWeight: 500 } }>
                                    Payment Status
                                </Typography>
                                <Chip
                                    label={ customerData.status || '-' }
                                    color={ customerData.status === 'Completed' ? 'success' : 'warning' }
                                    size="small"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={ 12 }>
                            <Box mb={ 1 }>
                                <Typography variant="body2" color="textSecondary" gutterBottom sx={ { fontWeight: 500 } }>
                                    Address
                                </Typography>
                                <Typography variant="body1" sx={ { whiteSpace: 'pre-wrap' } }>
                                    { customerData.address || '-' }
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography>No customer data available.</Typography>
                ) }
            </DialogContent>
            <DialogActions sx={ { padding: '16px 24px' } }>
                <Button onClick={ handleCancel } color="primary" variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShowSpaCustomer;