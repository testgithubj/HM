import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ChangePassword = ({ open, handleClose, email, onChangePassword }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    onChangePassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Change Password
        </Typography>
        <TextField label="Email Address" value={email} fullWidth margin="normal" InputProps={{ readOnly: true }} />
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

export default ChangePassword;
