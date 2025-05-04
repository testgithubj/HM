import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router';

const LogoutButton = () => {
    const navigate = useNavigate();
    const [ open, setOpen ] = useState( false );

    const handleClickOpen = () => {
        setOpen( true );
    };

    const handleClose = () => {
        setOpen( false );
    };

    const handleLogout = async () => {
        localStorage.removeItem( 'token' );
        localStorage.removeItem( 'hotelData' );
        navigate( '/login' );
        handleClose();
    };

    return (
        <>
            <Button variant="contained" sx={ { ml: 3 } } onClick={ handleClickOpen }>
                Logout
            </Button>
            <Dialog open={ open } onClose={ handleClose }>
                <DialogTitle>Logout Confirmation</DialogTitle>
                <DialogContent>
                    Are you sure you want to log out?
                </DialogContent>
                <DialogActions>
                    <Button onClick={ handleLogout } color="primary">
                        Confirm
                    </Button>
                    <Button onClick={ handleClose }>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LogoutButton;
