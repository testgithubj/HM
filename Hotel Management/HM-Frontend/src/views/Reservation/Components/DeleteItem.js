import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { patchApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import PropTypes from 'prop-types';

const DeleteFoodItem = ({ open, handleClose, data }) => {
  const params = useParams();
  const reservationId = params.id;
  const navigate = useNavigate();
  //handle delete function-------------
  const handleDelete = async () => {
    try {
      let result = await patchApi(`api/reservation/deletefooditem/${reservationId}`, { data });
      if (result) {
        toast.success('Item Deleted Successfully');
        handleClose();
        window.location.reload();
        navigate(`/dashboard/reservation/view/${reservationId}`);
      } else {
        toast.error('Cannot Delete item');
      }
    } catch (error) {
      console.log(error);
      toast.error('Cannot delete item');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Item</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this item?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
DeleteFoodItem.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default DeleteFoodItem;
