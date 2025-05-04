import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getApi, patchApi } from 'views/services/api';

const DeletePackage = ({ open, handleClose, id, getAllPackagesData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasActivePayments, setHasActivePayments] = useState(false);

  // Check if the package has active payments
  useEffect(() => {
    const checkPackageStatus = async () => {
      if (open && id) {
        setIsLoading(true);
        try {
          const response = await getApi(`api/payments/list/${id}`);
          const payments = response?.data?.data || [];
          const active = payments.status === 'active' || payments.status === 'expires soon';
          setHasActivePayments(active);
        } catch (error) {
          console.error('Error checking package status:', error);
          toast.error('Failed to check package status');
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkPackageStatus();
  }, [id, open]);

  // Handle delete after confirmation
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await patchApi(`api/packages/delete/${id}`, id);
      if (result && result.status === 200) {
        toast.success('Package deleted successfully');
        getAllPackagesData();
        handleClose();
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Package</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <p>Checking package status...</p>
        ) : hasActivePayments ? (
          <p>This package has active payments and cannot be deleted.</p>
        ) : (
          <p>Are you sure you want to delete this package?</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={isLoading || hasActivePayments}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeletePackage.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string,
  getAllPackagesData: PropTypes.func
};

export default DeletePackage;
