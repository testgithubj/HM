import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { deleteApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';

const DeleteHotel = ({ open, handleClose, id }) => {
  const handleDelete = async () => {
    try {
      if (!id) {
        toast.error('Hotel ID is missing');
        return;
      }

      console.log('Deleting hotel with ID:', id);
      const result = await deleteApi(`api/hotel/deletehotels/`, `${id}`);
      console.log('Delete response:', result);

      if (result && result.status === 200) {
        toast.success('Hotel Deleted Successfully');
        handleClose();
      } else {
        toast.error(result?.data?.message || 'Cannot delete Hotel');
      }
    } catch (error) {
      console.error('Delete hotel error:', error);
      toast.error(error?.response?.data?.message || 'Cannot delete Hotel');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Hotel</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this hotel? </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteHotel.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string
};
export default DeleteHotel;
