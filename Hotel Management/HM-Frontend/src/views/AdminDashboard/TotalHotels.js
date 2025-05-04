import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

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

const TotalHotelsCard = ({ isLoading, hotelData }) => {
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
                right: 20,
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
                <Typography variant="h4" sx={{ color: '#121926' }}>
                  Total Hotels
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h2" sx={{ color: '#846cf9', fontWeight: 600 }}>
                  {hotelData?.length || 0}                 </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#7E7E7E' }}>
                    Registered Hotels
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

TotalHotelsCard.propTypes = {
  isLoading: PropTypes.bool,
  hotelData: PropTypes.array
};

export default TotalHotelsCard;
