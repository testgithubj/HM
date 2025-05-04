import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, ButtonBase, Typography } from '@mui/material';

// project imports
import ProfileSection from './ProfileSection';

// assets
import { IconMenu2 } from '@tabler/icons';
import LogoSection from '../LogoSection';
import NotificationSection from './NotificationSection';
import LogoutButton from './LogoutButton';
import SearchSection from './SearchSection/index';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();

  // const hotel = JSON.parse(localStorage.getItem('hotelData'));
  // console.log('in in header section hotel===>', hotel);

  return (
    <>
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ overflow: 'hidden' }}>
          <Avatar
            variant="square"
            sx={{
              backgroundColor: '#fff',
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out'
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>
      {/* {
        hotel.role === 'HotelAdmin' ?
        (<Typography variant="h6" sx={{
          mx: 2, 
          color: '#1B365D',
          fontWeight: 500,
          letterSpacing: '0.5px',
          borderLeft: '3px solid #C1A87D',
          paddingLeft: '15px'
        }}> Welcome to Hotel {hotel.name}</Typography>): 
        hotel.role === 'admin' ?
        (<Typography variant="h6" sx={{
          mx: 2, 
          color: '#1B365D',
          fontWeight: 500,
          letterSpacing: '0.5px',
          borderLeft: '3px solid #C1A87D',
          paddingLeft: '15px'
        }}> Welcome, Admin {hotel.firstName} {hotel.lastName} </Typography>) :
        (<Typography variant="h6" sx={{
          mx: 2, 
          color: '#1B365D',
          fontWeight: 500,
          letterSpacing: '0.5px',
          borderLeft: '3px solid #C1A87D',
          paddingLeft: '15px'
        }}> Welcome, {hotel.firstName} {hotel.lastName} </Typography>)
      } */}

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />
      {/* notification & profile */}
      <ProfileSection />
      {/* <LogoutButton/> */}
      {/* <Button variant="contained" sx={{mx : 2}} > Logout </Button> */}
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
