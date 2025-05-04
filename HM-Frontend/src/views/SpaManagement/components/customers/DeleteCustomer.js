import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // Optional: for visual cue
import { deleteApi } from 'views/services/api';

const DeleteSpaCustomer = ( { open, handleClose, customerData, deleteCustomer } ) => {
    console.log( customerData, 'customer data' );
    const handleDeleteConfirm = async () => {
        const response = await deleteApi( "api/spa/spaCustomerDelete/", customerData )
        if ( response?.status == 200 ) {

            handleClose();
        }
        // Parent component's deleteCustomer should handle closing
    };

    const handleCancel = () => {
        handleClose();
    };

    return (
        <Dialog
            open={ open }
            onClose={ handleCancel } // Allow closing by clicking outside or ESC
            maxWidth="xs"
            fullWidth
            aria-labelledby="delete-customer-dialog-title"
        >
            <DialogTitle id="delete-customer-dialog-title">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={ 1 }>
                        <WarningAmberIcon color="error" />
                        <Typography variant="h6">Confirm Deletion</Typography>
                    </Box>
                    <IconButton onClick={ handleCancel } size="small" aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Typography>
                    Are you sure you want to delete? This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions sx={ { padding: '16px 24px' } }>
                <Button onClick={ handleCancel } color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={ handleDeleteConfirm }
                    variant="contained"
                    color="error"
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteSpaCustomer;