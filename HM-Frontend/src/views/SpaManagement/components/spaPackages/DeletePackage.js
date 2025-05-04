import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { deleteApi } from 'views/services/api';

const DeletePackage = ({ open, handleClose, id }) => {
  console.log(id, handleClose, 'this is the id');
  //handle delete function-------------
  const handleDelete = async () => {
    try {
      let result = await deleteApi(`api/spa/packages/`, id);
      console.log('delete result', result);
      if (result.status === 200) {
        toast.success('Service Deleted Successfully');
        handleClose();
      } else {
        handleClose();

        toast.error('Cannot delete Package');
      }
    } catch (error) {
      console.log(error);
      toast.error('Cannot delete Package');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Package</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this Package?</p>
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

DeletePackage.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string
};
export default DeletePackage;
