import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

function BootstrapDeleteModel(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDeleteModel.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
};

export default function CustomizedDialogs(props) {
  // eslint-disable-next-line react/prop-types
  const { openPayment, handleClosePayment, purchaseData, addPayments } = props;

  const purchaseConfirm = () => {
    addPayments(purchaseData);
    handleClosePayment();
  };

  return (
    <div>
      <BootstrapDialog aria-labelledby="customized-dialog-title" open={openPayment}>
        <BootstrapDeleteModel id="customized-dialog-title" onClose={handleClosePayment}>
          Subscription Confirmation
        </BootstrapDeleteModel>
        <DialogContent dividers>
          <Typography gutterBottom p={3}>
            Are you sure you want to buy this plan?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2}>
            <Button color="error" onClick={handleClosePayment}>
              Cancel
            </Button>
            <Button variant="contained" onClick={purchaseConfirm}>
              Buy
            </Button>
          </Stack>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
