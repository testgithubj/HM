import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import BedIcon from '@mui/icons-material/Bed';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#121926',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '5px',
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
  transition: 'box-shadow 0.3s ease-in-out', 
  '&:hover': {
    boxShadow: '0px 3px 20px 0px rgba(0, 0, 0, 0.2)'
  }
}));

const TotalReservationCard = ({ isLoading, reservationData }) => {
  const theme = useTheme();

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper   border={false} content={false}>
          <Box sx={{ p: 2.25, position: 'relative',minHeight:'150px'}}>
            <Avatar
              sx={{
                position: 'absolute',
                right: 20,
                top: 20,
                backgroundColor: '#846cf94d',
                width: 44,
                height: 44,
                borderRadius: '5px'
              }}
            >
              <BedIcon fontSize="medium" style={{ color: '#846cf9' }} />
            </Avatar>

            <Grid container spacing={2}>
              <Grid sx={{ flexWrap:'wrap',zIndex:'30'}} item xs={12}>
                <Typography variant="h4" sx={{ color: '#121926', width: {
                      xs: '100%',  // 60% width for small screens
                      sm: '100%',  // 70% for small to medium screens
                      md: '100%',  // 80% for medium screens
                      lg: '50%',  // 90% for large screens
                      xl: '100%'  // Full width for extra-large screens
                    }  }}>
                  Total Reservations
                </Typography>
              </Grid>

              <Grid zIndex={100} item xs={12}>
                <Typography variant="h2" sx={{ color: '#846cf9', fontWeight: 600 ,}}>
                  {reservationData?.length || 0}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#7E7E7E' }}>
                    Active Reservations
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

TotalReservationCard.propTypes = {
  isLoading: PropTypes.bool,
  reservationData: PropTypes.array
};

export default TotalReservationCard;
