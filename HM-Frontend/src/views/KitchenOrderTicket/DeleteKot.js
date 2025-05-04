import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { deleteApi } from 'views/services/api';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

const DeleteKot = ({ open, handleClose, id }) => {
console.log("id ====>", id);
  const navigate = useNavigate();
  //handle delete function-------------
  const handleDelete = async () => {
    try {
        console.log("Api hit ==>",`api/kitchenorderticket/deleteKot/`);
      let result = await deleteApi(`api/kitchenorderticket/deleteKot/`, id);
      if (result) {
        toast.success('Ticket Deleted Successfully');
        handleClose();
        setTimeout(() => {
          navigate('/dashboard/kot');
        }, 500);
      } else {
        toast.error('Cannot delete ticket');
      }
    } catch (error) {
      console.log(error);
      toast.error('Cannot delete ticket');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Ticket</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this ticket?</p>
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

DeleteKot.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string
};
export default DeleteKot;
