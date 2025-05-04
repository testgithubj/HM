import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { deleteApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const DeleteItem = ({ open, handleClose, id }) => {
  const navigate = useNavigate();
  //handle delete function-------------
  const handleDelete = async () => {
    try {
      console.log("url ===>",`api/restaurant/delete/${id}` );
      let result = await deleteApi(`api/restaurant/delete/`, id);
      console.log("result==>",result);
      if (result) {
        toast.success('Item Deleted Successfully');
        handleClose();
        setTimeout(() => {
          navigate('/dashboard/restaurant');
        }, 500);
      } else {
        toast.error('Cannot delete item');
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

DeleteItem.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default DeleteItem;
