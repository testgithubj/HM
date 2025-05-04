import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { deleteApi } from 'views/services/api';

const DeleteEmployee = ({ open, handleClose, employeeID }) => {
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      console.log('api/employee/delete/');

      let result = await deleteApi(`api/spaStaff/delete/`, employeeID);
      console.log('result ==>', result);

      if (result) {
        toast.success('Employee Deleted Successfully');
        handleClose();
        setTimeout(() => {
          navigate('/dashboard/spamanagement');
        }, 500);
      } else {
        toast.error('Cannot delete Employee');
      }
    } catch (error) {
      console.log(error);
      toast.error('Cannot delete Employee');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete employee</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this employee?</p>
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

DeleteEmployee.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  employeeID: PropTypes.string
};

export default DeleteEmployee;
