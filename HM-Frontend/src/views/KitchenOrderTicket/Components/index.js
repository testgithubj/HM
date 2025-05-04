import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import moment from 'moment';
import { getApi } from 'views/services/api';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary
}));

export default function KitchenDashboard() {
  const navigate = useNavigate();
  const [kotData, setkotData] = useState([]);
  const [value, setValue] = React.useState('1');
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const params = useParams();
  const kotId = params.id;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchKotData = async () => {
    try {
      const response = await getApi(`api/kitchenorderticket/viewSingleKot/${hotel?.hotelId}/${kotId}`);
      setkotData(response?.data?.mergedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchKotData();
  }, []);

  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          {/* Tab Header */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <TabList onChange={handleChange} aria-label="KOT details tabs" textColor="secondary" indicatorColor="secondary">
              <Tab label="Kitchen Order Ticket" value="1" />
            </TabList>

            {/* Back Button */}
            <div>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ marginLeft: 2, color: '#673ab7', borderColor: '#673ab7' }}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </div>
          </Box>

          {/* Tab Panel */}
          <TabPanel value="1">
            <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {/* KOT Information */}
                  <Item sx={{ height: '100%' }}>
                    <Typography variant="h4" fontWeight="bold">
                      Kitchen Order Ticket Details
                    </Typography>
                    <hr />

                    {/* Staff Name */}
                    <Typography variant="h5" sx={{ marginTop: 2 }}>
                      Staff Name:
                    </Typography>
                    <Typography style={{ color: 'black' }}>{kotData?.staffName || 'N/A'}</Typography>

                    {/* Created Date */}
                    <Typography variant="h5" sx={{ marginTop: 2 }}>
                      Date:
                    </Typography>
                    {kotData?.createdDate ? (
                      <Typography style={{ color: 'black' }}>{moment(kotData.createdDate).format('YYYY-MM-DD')}</Typography>
                    ) : (
                      <Typography style={{ color: 'black' }}>N/A</Typography>
                    )}

                    {/* Description */}
                    <Typography variant="h5" sx={{ marginTop: 2 }}>
                      Description:
                    </Typography>
                    <Typography
                      sx={{
                        color: 'black',
                        wordWrap: 'break-word', // Ensures long words break properly
                        overflow: 'hidden', // Hides overflowing content
                        textOverflow: 'ellipsis', // Adds ellipsis (...) for overflowing text
                        whiteSpace: 'pre-wrap' // Preserves formatting and ensures text wraps
                      }}
                    >
                      {kotData?.description || 'N/A'}
                    </Typography>
                  </Item>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
