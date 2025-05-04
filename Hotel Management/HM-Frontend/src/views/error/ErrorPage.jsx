import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper, Divider } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const ErrorPage = () => {

  const getUserData = () => {
    const userData = localStorage.getItem('hotelData');
    return userData ? JSON.parse(userData) : null;
  };
  const { role ,permissions}  = getUserData();
  console.log('role', role)
  const errorCode = `ERR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: 2
          }}
        >
          <Box sx={{ mb: 3, color: 'error.main' }}>
            <ErrorOutlineIcon sx={{ fontSize: 80 }} />
          </Box>

          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Page Not Found
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: '80%' }}>
            We apologize for the inconvenience. The page you are looking for doesn&apos;t exist or has been moved.
            Please contact the hotel management for assistance.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            sx={{ mt: 2 }}
            onClick={() => {
              window.location.href = permissions?.length===0?'/login':'/';
            }}
          >

            {permissions?.length===0?'Log In':'Go to Home'}
          </Button>

          <Divider sx={{ width: '100%', mb: 3 }} />

       

        
        </Paper>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Error Reference: {errorCode}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ErrorPage;