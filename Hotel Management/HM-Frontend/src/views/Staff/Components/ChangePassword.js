import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { patchApi } from 'views/services/api';

const ChangePasswordForStaff = ({ open, handleClose, employeEmail}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async() => {
    try {
      console.log('newPassword =>', newPassword);
      console.log('confirmPassword =>', confirmPassword);

      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match!');
        return;
      }

      console.log("api call =>",'api/employee/changeEmployePassword');
      const response = await patchApi('api/employee/changeEmployePassword', { email: employeEmail, password: newPassword });
      console.log("response is here ======== ========>",response);

      if (response.status === 200) {
        toast.success('Password changed successfully');
        handleClose();
      } else {
        toast.error('Failed to change password');
      }

      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error changing password');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Change Password
        </Typography>
        <TextField label="Email Address" value={employeEmail} fullWidth margin="normal" InputProps={{ readOnly: true }} />
        <TextField
          label="New Password"
          type={showNewPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                  {showNewPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" sx={{ mr: 5 }} onClick={handlePasswordChange}>
            Change Password
          </Button>
          <Button variant="outlined" color="error" onClick={handleClose} sx={{ mr: 5 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export default ChangePasswordForStaff;
