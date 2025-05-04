import PropTypes from 'prop-types';

// material-ui
import { Avatar, Box, Grid, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// // assets

import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

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

// ==============================|| DASHBOARD - TOTAL leads CARD ||============================== //

const TotalRoomsCard = ({ isLoading, roomData }) => {
  const theme = useTheme();

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25, position: 'relative', minHeight: '150px' }}>
            <Avatar
              sx={{
                position: 'absolute',
                right: { lg: 10, xs: 20 },
                top: 20,
                backgroundColor: '#846cf94d',
                width: 44,
                height: 44,
                borderRadius: '5px'
              }}
            >
              <MeetingRoomIcon fontSize="medium" style={{ color: '#846cf9' }} />
            </Avatar>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    color: '#121926',
                    width: {
                      xs: '100%', // 60% width for small screens
                      sm: '100%', // 70% for small to medium screens
                      md: '100%', // 80% for medium screens
                      lg: '50%',
                      xl: '90%' // 90% for large screens
                    }
                  }}
                  variant="h4"
                >
                  Total Rooms
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h2" sx={{ color: '#846cf9', fontWeight: 600 }}>
                  {roomData?.length}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#7E7E7E' }}>
                    Available Rooms
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

TotalRoomsCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  roomData: PropTypes.array
};

export default TotalRoomsCard;
