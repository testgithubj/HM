import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery, Card, CardMedia, Typography, Button } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';

// project imports
import MenuList from './MenuList';
import { drawerWidth } from 'store/constant';
import LogoSection from '../LogoSection';
import HotelServ from '../../../assets/images/hotel-promo.jpg';

// ==============================|| SIDEBAR DRAWER ||============================== //

const SidebarWidget = () => (
  <Card sx={{ m: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
    <CardMedia component="img" height="180" image={HotelServ} alt="Luxury Hotel" sx={{ borderRadius: 1 }} />
    <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
      Discover Luxury
    </Typography>
    <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
      Experience world-class hospitality.
    </Typography>
    <Button variant="contained" fullWidth sx={{ bgcolor: '#846cf9', '&:hover': { bgcolor: '#6c50f7' } }}>
      View
    </Button>
  </Card>
);

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  const drawer = (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' }, justifyContent: 'center', alignItems: 'center', margin: '10px 16px' }}>
        <LogoSection />
      </Box>
      <BrowserView>
        <PerfectScrollbar
          component="div"
          style={{
            height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
            paddingLeft: '16px',
            paddingRight: '16px'
          }}
        >


          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' ,
          '&::-webkit-scrollbar': {
            width: 0,
            height: 0,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'transparent',
          },
          scrollbarWidth: 'none',
          overflowY: 'auto', 
          }}>
            <MenuList />
            <Box sx={{ marginTop: 'auto' }}>
              <SidebarWidget />
            </Box>
          </Box>
        </PerfectScrollbar>
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', height: '100%',
          '&::-webkit-scrollbar': {
            width: 0,
            height: 0,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'transparent',
          },
          scrollbarWidth: 'none',
          overflowY: 'auto', 
           }}>
          <MenuList />
          <Box sx={{ marginTop: 'auto' }}>
            <SidebarWidget />
          </Box>
        </Box>
      </MobileView>
    </>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label="mailbox folders">
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            background: '#fff',
            color: theme.palette.text.primary,
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: '88px'
            }
          }
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        <Box
          sx={{
            '& .MuiListItemButton-root': {
              '&:hover, &.Mui-selected': {
                '& .MuiListItemIcon-root, & .MuiTypography-root': {
                  color: '#846cf9'
                }
              }
            },
            '& .MuiListItemIcon-root': {
              color: '#1B365D'
            },
            '& .MuiListItemText-primary': {
              color: '#1B365D'
            }
          }}
        >
          {drawer}
        </Box>
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default Sidebar;
