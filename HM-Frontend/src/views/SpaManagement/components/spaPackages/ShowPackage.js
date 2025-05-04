import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import DiscountIcon from '@mui/icons-material/Discount';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const ShowPackage = ( { open, handleClose, data } ) => {
  const theme = useTheme();
  const [ hoveredService, setHoveredService ] = useState( null );
  const [ loadedServices, setLoadedServices ] = useState( [] );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    if ( open && data && Array.isArray( data.services ) ) {
      setLoading( true );
      const servicesData = data.services.map( ( service ) => {
        if ( typeof service === 'string' || !service.name ) {
          return {
            name: 'Loading service...',
            description: 'Loading service details...',
            _id: typeof service === 'string' ? service : service._id || Math.random().toString()
          };
        }
        return service;
      } );
      setLoadedServices( servicesData );
      setLoading( false );
    }
  }, [ open, data ] );

  if ( !data ) return null;

  const calculateDiscount = () => {
    if ( !data.discountType || data.discountType === 'none' || !data.discountValue ) {
      return { discountAmount: 0, finalPrice: data.price, discountPercentage: 0 };
    }
    if ( data.discountType === 'flat' ) {
      const discountAmount = data.discountValue;
      const finalPrice = Math.max( 0, data.price - discountAmount );
      const discountPercentage = Math.round( ( discountAmount / data.price ) * 100 );
      return { discountAmount, finalPrice, discountPercentage };
    }
    if ( data.discountType === 'percentage' ) {
      const discountPercentage = data.discountValue;
      const discountAmount = ( data.price * discountPercentage ) / 100;
      const finalPrice = Math.max( 0, data.price - discountAmount );
      return { discountAmount, finalPrice, discountPercentage };
    }
    return { discountAmount: 0, finalPrice: data.price, discountPercentage: 0 };
  };

  const { discountAmount, finalPrice, discountPercentage } = calculateDiscount();
  const hasDiscount = discountPercentage > 0;

  const estimatedTime = data.services?.length ? data.services.length * 30 : 60;
  const formattedTime =
    estimatedTime >= 60 ? `${ Math.floor( estimatedTime / 60 ) }h ${ estimatedTime % 60 ? `${ estimatedTime % 60 }m` : '' }` : `${ estimatedTime }m`;

  return (
    <Dialog
      open={ open }
      onClose={ handleClose }
      aria-labelledby="show-package-dialog-title"
      maxWidth="md"
      fullWidth
      PaperProps={ {
        sx: {
          borderRadius: 4,
          boxShadow: '0 20px 80px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          background: theme.palette.background.paper,
          backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0.92), rgba(255,255,255,0.98))',
          border: 'none'
        }
      } }
      TransitionComponent={ Fade }
      transitionDuration={ 400 }
    >
      <DialogTitle
        id="show-package-dialog-title"
        sx={ {
          background: `linear-gradient(135deg, ${ theme.palette.primary.main }, ${ alpha( theme.palette.primary.dark, 0.85 ) })`,
          color: 'white',
          py: 2.5,
          px: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.25), transparent 70%)',
            zIndex: 0
          }
        } }
      >
        <Typography variant="h5" sx={ { fontWeight: 700, zIndex: 1 } }>
          { data.name || 'Package Details' }
        </Typography>
        <IconButton
          onClick={ handleClose }
          size="medium"
          sx={ {
            color: 'white',
            zIndex: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(255,255,255,0.2)',
              transform: 'scale(1.1)'
            }
          } }
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={ { p: 0, overflowX: 'hidden' } }>
        {/* Package Header */ }
        <Box
          sx={ {
            p: 4,
            textAlign: 'center',
            background: `linear-gradient(to bottom, ${ alpha( theme.palette.primary.light, 0.15 ) }, rgba(255,255,255,0.8))`,
            position: 'relative',
            overflow: 'hidden',
            borderBottom: `1px solid ${ alpha( theme.palette.divider, 0.5 ) }`,
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${ theme.palette.primary.main }, ${ theme.palette.secondary.main }, ${ theme.palette.primary.main })`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s infinite linear'
            },
            '@keyframes shimmer': {
              '0%': { backgroundPosition: '0% 0%' },
              '100%': { backgroundPosition: '200% 0%' }
            }
          } }
        >
          <Avatar
            sx={ {
              width: 70,
              height: 70,
              mx: 'auto',
              mb: 2,
              background: `linear-gradient(135deg, ${ theme.palette.primary.main }, ${ theme.palette.secondary.main })`,
              border: `4px solid ${ alpha( theme.palette.common.white, 0.9 ) }`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            } }
          >
            <ShoppingCartOutlinedIcon sx={ { fontSize: 32 } } />
          </Avatar>

          <Typography variant="h2" sx={ { fontWeight: 700, mb: 0.5 } }>
            { data.name || 'Unnamed Package' }
          </Typography>

          {/* <Typography variant="h3" sx={ { color: theme.palette.text.secondary, mb: 1 } }>
            { data?.serviceCategory || 'Unnamed Category' }
          </Typography> */}

          {/* <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 2 }}>
            <Chip
              icon={<AccessTimeIcon />}
              label={formattedTime}
              variant="filled"
              sx={{
                borderRadius: 3,
                background: alpha(theme.palette.grey[500], 0.15)
              }}
            />
            <Chip
              label={`${data.services?.length || 0} Services`}
              variant="filled"
              sx={{
                borderRadius: 3,
                background: alpha(theme.palette.grey[500], 0.15)
              }}
            />
          </Box> */}

          {/* Price Chips */ }
          <Box sx={ { display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' } }>
            <Chip
              label={ <Typography sx={ { textDecoration: 'line-through' } }>${ Number( data.servicesTotal ?? 0 ) }</Typography> }
              variant="outlined"
              sx={ {
                borderColor: alpha( theme.palette.error.main, 0.6 ),
                color: theme.palette.error.main,
                borderRadius: 3
              } }
            />
            <Chip
              icon={ <LocalOfferOutlinedIcon /> }
              label={ <Typography sx={ { fontWeight: 700 } }>${ data.price }</Typography> }
              color="primary"
              variant="filled"
              sx={ {
                borderRadius: 3,
                background: `linear-gradient(135deg, ${ theme.palette.primary.main }, ${ theme.palette.primary.dark })`,
                boxShadow: `0 4px 12px ${ alpha( theme.palette.primary.main, 0.4 ) }`
              } }
            />
            { hasDiscount && (
              <Chip
                icon={ <DiscountIcon /> }
                label={ data.discountType === 'percentage' ? `${ data.discountValue }% OFF` : `$${ data.discountValue } OFF` }
                color="error"
                sx={ {
                  borderRadius: 3,
                  fontWeight: 600,
                  background: alpha( theme.palette.error.main, 0.9 )
                } }
              />
            ) }
          </Box>

          { hasDiscount && (
            <Typography variant="caption" sx={ { mt: 1, color: theme.palette.text.secondary } }>
              You save: ${ discountAmount }
            </Typography>
          ) }
        </Box>

        {/* Services List */ }
        <Box sx={ { p: 3 } }>
          <Typography variant="h6" sx={ { mb: 2 } }>
            Included Services:
          </Typography>

          { loading ? (
            <LinearProgress />
          ) : (
            <Box>
              { loadedServices.map( ( service ) => (
                <Paper
                  key={ service._id }
                  elevation={ hoveredService === service._id ? 4 : 1 }
                  onMouseEnter={ () => setHoveredService( service._id ) }
                  onMouseLeave={ () => setHoveredService( null ) }
                  sx={ {
                    p: 2,
                    mb: 1.5,
                    transition: 'all 0.3s ease',
                    backgroundColor: hoveredService === service._id ? alpha( theme.palette.primary.main, 0.08 ) : 'background.paper',
                    cursor: 'pointer'
                  } }
                >
                  <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                    <InfoOutlinedIcon sx={ { color: theme.palette.primary.main } } />
                    <Box>
                      <Typography variant="subtitle1" sx={ { fontWeight: 600 } }>
                        { service.name }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        { service.description }
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ) ) }
            </Box>
          ) }
        </Box>
      </DialogContent>

      <DialogActions sx={ { p: 3 } }>
        <Button onClick={ handleClose } variant="outlined" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ShowPackage.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object
};

export default ShowPackage;
