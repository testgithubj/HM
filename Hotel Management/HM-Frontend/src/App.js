// import { useSelector } from 'react-redux';
// import { ThemeProvider } from '@mui/material/styles';
// import { CssBaseline, StyledEngineProvider } from '@mui/material';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Navigate, Route, Routes } from 'react-router-dom';
// import LoginPage from './views/pages/authentication/authentication3/Login3';
// import Register from 'views/pages/authentication/authentication3/Register3';
// import PageRoutes from 'routes';
// import themes from 'themes';
// import NavigationScroll from 'layout/NavigationScroll';
// import { useEffect } from 'react';
// import { useState } from 'react';

// // ==============================|| APP ||============================== //
// const App = () => {
//   const customization = useSelector((state) => state.customization);
//   const [user, setUser] = useState();
//   const [token, setToken] = useState();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     console.log('storedUser ==>',storedUser);

//     // Check if token and user are present
//     if (storedToken && storedUser?.role) {
//       setToken(storedToken);
//       setUser(storedUser);
//     }
//     setLoading(false);
//   }, []);

//   return (
//     <StyledEngineProvider injectFirst>
//       <ThemeProvider theme={themes(customization)}>
//         <CssBaseline />
//         <ToastContainer />
//         <NavigationScroll>
//           {loading ? (
//             <div></div>
//           ) : token && user ? (
//             <PageRoutes />
//           ) : localStorage.getItem('hotelData') ? (
//             <PageRoutes />
//           ) : (
//             <Routes>
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="*" element={<Navigate to="/login" />} />
//             </Routes>
//           )}
//         </NavigationScroll>
//       </ThemeProvider>
//     </StyledEngineProvider>
//   );
// };

// export default App;

import { Box, CircularProgress, CssBaseline, StyledEngineProvider, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import NavigationScroll from 'layout/NavigationScroll';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageRoutes from 'routes';
import themes from 'themes';
import Register from 'views/pages/authentication/authentication3/Register3';
import LoginPage from './views/pages/authentication/authentication3/Login3';

// Loading component with MUI styling
const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      bgcolor: 'background.default'
    }}
  >
    <CircularProgress size={60} thickness={4} />
    <Typography variant="h6" sx={{ mt: 2 }}>
      Loading application...
    </Typography>
  </Box>
);

// ==============================|| APP ||============================== //
const App = () => {
  const customization = useSelector((state) => state.customization);
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Check if token and user are present
    if (storedToken && storedUser?.role) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <ToastContainer />
        <NavigationScroll>
          {loading ? (
            <LoadingScreen />
          ) : token && user ? (
            <PageRoutes />
          ) : localStorage.getItem('hotelData') ? (
            <PageRoutes />
          ) : (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<LoginPage />} />
            </Routes>
          )}
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
