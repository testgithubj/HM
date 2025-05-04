import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets

import BedIcon from '@mui/icons-material/Bed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// styles
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

// ==============================|| DASHBOARD - TOTAL Task CARD ||============================== //

const TotalReservationCard = ({ isLoading, reservationData }) => {
  const theme = useTheme();

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25, position: 'relative', minHeight: '150px' }}>
            <Avatar
              sx={{
                position: 'absolute',
                right: { lg: 10, xs: 20 },
                top: 20,
                backgroundColor: '#ffeee2',
                width: 44,
                height: 44,
                borderRadius: '5px'
              }}
            >
              <BedIcon fontSize="medium" style={{ color: '#fa8d40' }} />
            </Avatar>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#121926',
                    width: {
                      xs: '100%',  // 60% width for small screens
                      sm: '100%',  // 70% for small to medium screens
                      md: '100%',  // 80% for medium screens
                      lg: '50%',  // 90% for large screens
                      xl: '100%'  // Full width for extra-large screens
                    }
                  }}
                >
                  Total Reservations
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h2" sx={{ color: '#fa8d40', fontWeight: 600 }}>
                  {reservationData?.length}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#7E7E7E' }}>
                    Active Bookings
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#4CAF50' }}>
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      +10.2%
                    </Typography>
                  </Box>
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
  isLoading: PropTypes.bool.isRequired,
  reservationData: PropTypes.array
};

export default TotalReservationCard;
