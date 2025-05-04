import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { deleteApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

import { useParams } from 'react-router';

const DeleteCustomer = ( { open, handleClose, id } ) => {
  const params = useParams();
  const phoneNumber = params.phone;

  const navigate = useNavigate();
  //handle delete function-------------
  const handleDelete = async () => {
    try {
      let result = await deleteApi( `api/customer/delete/`, phoneNumber || id );
      if ( result.status === 200 ) {
        toast.success( 'Customer Deleted Successfully' );
        handleClose();
        setTimeout( () => {
          navigate( '/dashboard/customers' );
        }, 1000 );
      } else {
        toast.error( 'Cannot delete Customer' );
      }
    } catch ( error ) {
      console.log( error );
      toast.error( 'Cannot delete Customer' );
    }
  };

  return (
    <Dialog open={ open } onClose={ handleClose }>
      <DialogTitle>Delete Customer</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this customer?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={ handleClose } color="primary">
          Cancel
        </Button>
        <Button onClick={ handleDelete } color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteCustomer.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};
export default DeleteCustomer;
