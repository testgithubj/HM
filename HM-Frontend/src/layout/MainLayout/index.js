import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

// material-ui
import { AppBar, Box, CssBaseline, Fab, Toolbar, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// project imports
import navigation from 'menu-items';
import { SET_MENU } from 'store/actions';
import { drawerWidth } from 'store/constant';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';

// assets
import { IconChevronRight } from '@tabler/icons';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }
  ),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px',
    marginRight: '10px'
  }
}));

// Add floating chat button styles
const FloatingChat = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  zIndex: 1000
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };
 



  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        {/* breadcrumb */}
        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
        <Outlet />
      </Main>

      {/* Floating Chat Button */}
      {/* <FloatingChat
        color="primary"
        sx={{ backgroundColor: '#846cf9' }}
        aria-label="chat"
        onClick={() => {
          // Add your chat button click handler here
          console.log('Chat button clicked');
        }}
      >
        <ChatIcon />
      </FloatingChat> */}
    </Box>
  );
};

export default MainLayout;
