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

const DeleteVisitor = ({ open, handleClose, id }) => {
  const params = useParams();
  const phoneNumber = params.phone;

  const navigate = useNavigate();
  //handle delete function-------------
  const handleDelete = async () => {
    try {
      let result = await deleteApi(`api/visitors/delete/`, phoneNumber || id);
      if (result.status === 200) {
        toast.success('Visitor Deleted Successfully');
        handleClose();
        setTimeout(() => {
          !id ? navigate(-1) : '';
        }, 700);
      } else {
        toast.error('Cannot delete visitor');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete visitor</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this visitor?</p>
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

DeleteVisitor.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string
};
export default DeleteVisitor;
