import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { deleteApi, patchApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import PropTypes from 'prop-types';

const DeleteInvoice = ({ open, handleClose, invData }) => {

  const params = useParams();
  const reservationId = params.id;

  const navigate = useNavigate();
  //handle delete function-------------
  const handleDelete = async () => {
    try {  
        let result =  await invData?.type  === "room" || invData?.type  === "food" ?
         deleteApi(`api/invoice/delete/`, invData?._id) :  deleteApi(`api/singleinvoice/delete/`, invData?._id)
       
      if (result) {
        toast.success('Invoice Deleted Successfully');
        handleClose();
        window.location.reload();
        navigate(`/dashboard/reservation/view/${reservationId}`);
      } else {
        toast.error('Cannot Delete Invoice');
      }
    } catch (error) {
      console.log(error);
      toast.error('Cannot delete Invoice');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Invoice</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this Invoice?</p>
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
DeleteInvoice.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default DeleteInvoice;
