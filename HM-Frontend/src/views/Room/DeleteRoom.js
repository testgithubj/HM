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

const DeleteRoom = ({ open, handleClose, id }) => {
  const navigate = useNavigate();
  //handle delete function-------------
  const handleDelete = async () => {
    try {
      let result = await deleteApi(`api/room/delete/`, id);
      if (result) {
        toast.success('Room Deleted Successfully');
        handleClose();
        setTimeout(() => {
          navigate('/dashboard/roommanagement');
        }, 500);
      } else {
        toast.error('Cannot delete room');
      }
    } catch (error) {
      console.log(error);
      toast.error('Cannot delete room');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Room</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this Room?</p>
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

DeleteRoom.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string
};
export default DeleteRoom;
