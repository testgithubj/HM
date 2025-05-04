import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { deleteApi } from 'views/services/api';

const DeleteLaundary = ({ open, handleClose, id, roomId, pathName }) => {
  const navigate = useNavigate();
  //handle delete function-------------
  const handleDelete = async () => {
    const data = { roomId, id };
    console.log(data, 'this is for laundary data in delete dialog');
    try {
      let result = await deleteApi(`api/laundary/delete/`, id, data);
      if (result) {
        toast.success('Laundary Deleted Successfully');
        handleClose();
        setTimeout(() => {
          navigate(pathName);
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

DeleteLaundary.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};
export default DeleteLaundary;
