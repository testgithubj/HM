import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// material-ui
import {
  Avatar,
  Box,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import User1 from 'assets/images/users/user-round.svg';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { getApi } from 'views/services/api';

// assets
import { IconLogout, IconSettings } from '@tabler/icons';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  //handle logout--------------------------------------------
  const handleLogout = async () => {
    localStorage.removeItem('token');
    // localStorage.removeItem('user');
    localStorage.removeItem('hotelData');
    navigate('/login');
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  //function for fetching admin based on the admin id
  const hotel = JSON.parse(localStorage.getItem('hotelData'));

  const [hotelData, sethotelData] = useState([]);
  const fetchhotelData = async () => {
    try {
      // const response = await getApi(`api/hotel/view/${hotel?._id}`);
      const response = await getApi(`api/hotel/view/${hotel?.hotelId}`);
      sethotelData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchhotelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // all related to admin------------------------------------------------------------------------------------------
  const admin = JSON.parse(localStorage.getItem('hotelData'))?.role;
  const hotelProfile = JSON.parse(localStorage.getItem('hotelData'));
  const [adminData, setAdminData] = useState([]);
  const fetchAdminData = async () => {
    try {
      const response = await getApi(`api/user/view`);
      setAdminData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAdminData();
  }, []);
  //function for handling profile settings

  const handleProfileSettings = () => {
    admin === 'admin' ? navigate('/dashboard/adminprofile') : navigate('/dashboard/profile');
  };

  const DefaultUrl = JSON.parse(localStorage.getItem('defaultUrl'));

  // all related to admin------------------------------------------------------------------------------------------
  return (
    <>
      <Avatar
        src={User1}
        sx={{
          ...theme.typography.mediumAvatar,
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Welcome Back ,</Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                          {hotel.role === 'HotelAdmin'
                            ? `Hotel ${hotelData?.name?.charAt(0).toUpperCase() + hotelData?.name.slice(1)}`
                            : hotel.role === 'admin'
                            ? `Admin ${adminData?.firstName?.charAt(0).toUpperCase() + adminData?.firstName.slice(1)} ${
                                adminData?.lastName?.charAt(0).toUpperCase() + adminData?.lastName.slice(1)
                              }`
                            : `${hotel?.firstName.charAt(0).toUpperCase() + hotel?.firstName.slice(1)}  
                               ${hotel?.lastName.charAt(0).toUpperCase() + hotel?.lastName.slice(1)}`}
                        </Typography>
                      </Stack>
                      {/* <Typography variant="subtitle2"> {hotelData.role === 'admin' ? 'Project Admin' : ''}</Typography> */}
                    </Stack>
                  </Box>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 2 }}>
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          // selected={selectedIndex === 0}
                          onClick={() => {
                            navigate(DefaultUrl);

                            // hotel ? navigate('/') : navigate('/dashboard/admindashboard');
                          }}
                        >
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Home</Typography>} />
                        </ListItemButton>
                        {(admin === 'admin' || admin === 'HotelAdmin' || hotelProfile.permissions.includes('Hotel Profile')) && (
                          <ListItemButton
                            sx={{ borderRadius: `${customization.borderRadius}px` }}
                            // selected={selectedIndex === 0}
                            onClick={handleProfileSettings}
                          >
                            <ListItemIcon>
                              <IconSettings stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body3">Profile Settings</Typography>} />
                          </ListItemButton>
                        )}

                        {/* //------------ */}
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          // selected={selectedIndex === 4}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
