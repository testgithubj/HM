import { Box, Container, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useState } from 'react';
import CurrentMonthReport from './CurrentMonthReport';
import OneYearReport from './OneYearReport';
import SixMonthReport from './SixMonthReport';
import ThreeMonthReport from './ThreeMonthReport';

const AdminReports = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const CustomTableStyle = styled(Box)(({ theme }) => ({
    width: '100%',
    overflowX: 'auto', // Ensures horizontal scrolling is enabled
    whiteSpace: 'nowrap', // Prevents content from wrapping

    // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge)
    '&::-webkit-scrollbar': {
      width: '0', // Hides the scrollbar
      height: '0' // Hides the scrollbar
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent' // Makes the track transparent
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent' // Makes the thumb transparent
    },

    // Firefox scrollbar behavior
    '*': {
      scrollbarWidth: 'none' // Hides the scrollbar in Firefox
    },

    msOverflowStyle: 'none' // Hide scrollbar in IE and Edge
  }));
  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Container maxWidth="100%">
      <Stack spacing={3}>
        <Paper elevation={3} sx={{ p: { xs: 0, lg: 3 }, borderRadius: 2 }}>
          <Stack sx={{ p: { xs: 2, lg: 0 } }} direction="row" alignItems="center" mb={3} justifyContent="space-between">
            <Typography variant="h4" color="primary.main">
              Reports
            </Typography>
          </Stack>

          <CustomTableStyle>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="report tabs"
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  minWidth: '500px', // Ensure content is wide enough to cause scrolling

                  '& .MuiDataGrid-toolbarContainer': {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '15px',
                    padding: '8px 16px',
                    gap: '8px',
                    '& > *:first-child': {
                      display: 'none'
                    },
                    '& > *:nth-child(3)': {
                      display: 'none'
                    }
                  },
                  '& .MuiButton-root': {
                    border: '1px solid #e0e0e0',
                    color: '#121926',
                    fontSize: '14px',
                    fontWeight: '500',
                    padding: '6px 12px',
                    borderRadius: '5px',
                    textTransform: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                      borderColor: '#d0d0d0'
                    }
                  },
                  '& .MuiFormControl-root': {
                    color: '#121926',
                    fontSize: '14px',
                    fontWeight: '400',
                    padding: '4px 10px 0px',
                    '& .MuiInputBase-root': {
                      borderRadius: '5px'
                    }
                  },
                  '& .MuiCheckbox-root': {
                    padding: '4px'
                  },
                  '& .name-column--cell--capitalize': {
                    textTransform: 'capitalize'
                  }
                }}
              >
                <Tab label="Current Month" />
                <Tab label="Past 3 Months" />
                <Tab label="Past 6 Months" />
                <Tab label="Past Year" />
              </Tabs>
            </Box>
          </CustomTableStyle>

          <Box sx={{ py: 2 }}>
            {tabIndex === 0 && <CurrentMonthReport />}
            {tabIndex === 1 && <ThreeMonthReport />}
            {tabIndex === 2 && <SixMonthReport />}
            {tabIndex === 3 && <OneYearReport />}
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default AdminReports;
