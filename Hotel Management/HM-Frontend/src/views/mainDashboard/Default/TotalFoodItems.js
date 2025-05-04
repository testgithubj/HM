import PropTypes from 'prop-types';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

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

// ===========================|| DASHBOARD Contact CARD ||=========================== //

const FoodItems = ({ isLoading, foodItemData }) => {
  const theme = useTheme();

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25, position: 'relative' ,minHeight:'150px'}}>
            <Avatar
              sx={{
                position: 'absolute',
                right: { lg: 10, xs: 20 },
                top: 20,
                backgroundColor: '#e5ffed',
                width: 44,
                height: 44,
                borderRadius: '5px'
              }}
            >
              <FastfoodIcon fontSize="medium" style={{ color: '#4bd17c' }} />
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
                >                  Total Food Items
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h2" sx={{ color: '#4bd17c', fontWeight: 600 }}>
                  {foodItemData?.length || 0}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#7E7E7E' }}>
                    Available Items
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#4CAF50' }}>
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      +8.4%
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

FoodItems.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  foodItemData: PropTypes.array
};

export default FoodItems;
