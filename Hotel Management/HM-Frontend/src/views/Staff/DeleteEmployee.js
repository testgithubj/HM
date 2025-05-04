import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { deleteApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';

const DeleteEmployee = ({ open, handleClose, employeeID }) => {
  // const params = useParams();
  // const employeeId = params.id;
  // console.log("employeeId ===>",employeeID);

  const navigate = useNavigate();
  //handle delete function-------------
  const handleDelete = async () => {
    try {
      console.log('api/employee/delete/');

      let result = await deleteApi(`api/employee/delete/`, employeeID);
      console.log('result ==>', result);

      if (result) {
        toast.success('Employee Deleted Successfully');
        handleClose();
        setTimeout(() => {
          navigate('/dashboard/staffmanagement');
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
