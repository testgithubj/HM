import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { deleteApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const DeleteLaundary = ({ open, handleClose, id }) => {
  const navigate = useNavigate();
  //handle delete function-------------
  const handleDelete = async () => {
    try {
      let result = await deleteApi(`api/inventory/delete/`, id);
      if (result) {
        toast.success('Laundary Deleted Successfully');
        handleClose();
        setTimeout(() => {
          navigate('/dashboard/inventory');
        }, 500);
      } else {
        toast.error('Cannot delete Laundary');
      }
    } catch (error) {
      console.log(error);
      toast.error('Cannot delete Laundary');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Laundary</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this laundary?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>handleClose()} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteLaundary.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};
export default DeleteLaundary;
