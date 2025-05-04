import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { toast } from 'react-toastify';
import { deleteApi } from 'views/services/api';

const DeleteComplain = ({ open, handleClose, complaintID }) => {
  const handleDeleteComplaint = async () => {
    try {
      // Replace this URL with your actual API endpoint for deleting complaints
      const response = await deleteApi(`api/complaint/delete/`, complaintID);
      console.log('response', response);
      if (response.status === 200) {
        toast.success('Complaint deleted successfully');
        handleClose(); // Close the dialog and refresh the data
      } else {
        toast.error('Failed to delete complaint');
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast.error('Failed to delete complaint');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this complaint? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDeleteComplaint} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteComplain;
