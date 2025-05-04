import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { deleteApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import { postApi } from 'views/services/api';

const DeleteExpenses = ({ open, handleClose, id }) => {
  console.log('id in props ==>', id);

  const params = useParams();
  const expenseId = params.id;
  const navigate = useNavigate();
  //handle delete function-------------
  const handleDelete = async () => {
    try {
      let result = await deleteApi(`api/expenses/delete/`, expenseId || id);
      if (result) {
        toast.success('Expense Deleted Successfully');
        handleClose();
        setTimeout(() => {
          navigate('/dashboard/expenses');
        }, 500);
      } else {
        toast.error('Cannot delete Expense');
      }
    } catch (error) {
      console.log(error);
      toast.error('Cannot delete Expense');
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center' }}>
          Delete Expense
        </Typography>
      </DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this expense?</p>
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
DeleteExpenses.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string
};

export default DeleteExpenses;
