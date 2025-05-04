import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
//import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets

import PersonIcon from '@mui/icons-material/Person';

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

// ===========================|| DASHBOARD Policies CARD ||=========================== //

const TotalCustomersCard = ({ isLoading, customerData }) => {
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
                right: 20,
                top: 20,
                backgroundColor: '#846cf94d',
                width: 44,
                height: 44,
                borderRadius: '5px'
              }}
            >
              <PersonIcon fontSize="medium" style={{ color: '#846cf9' }} />
            </Avatar>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{ color: '#121926', width: {
                      xs: '100%',  // 60% width for small screens
                      sm: '100%',  // 70% for small to medium screens
                      md: '100%',  // 80% for medium screens
                      lg: '50%',  // 90% for large screens
                      xl: '100%'  // Full width for extra-large screens
                    }  }}>
                  Total Customers
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h2" sx={{ color: '#846cf9', fontWeight: 600 }}>
                  {customerData?.length || 0}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#7E7E7E' }}>
                    Registered Customers
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

TotalCustomersCard.propTypes = {
  isLoading: PropTypes.bool,
  customerData: PropTypes.array
};

export default TotalCustomersCard;
