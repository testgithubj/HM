import * as React from 'react';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { getApi, patchApi } from 'views/services/api';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import EditHotel from './Components/EditHotel';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary
}));

export default function HotelProfile() {
  const [openEdit, setOpenEdit] = useState(false);
  const [hotelData, setHotelData] = useState({});
  const [value, setValue] = useState('1');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const hotel = JSON.parse(localStorage.getItem('hotelData'));

  const handleOpenEditHotel = () => setOpenEdit(true);
  const handleCloseEditHotel = () => setOpenEdit(false);

  const fetchHotelData = async () => {
    try {
      const response = await getApi(`api/hotel/view/${hotel?.hotelId}`);
      setHotelData(response.data);
    } catch (error) {
      console.error('Error fetching hotel data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openEdit]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeForCheckInButton = async (event) => {
    const newCheckedValue = event.target.checked;
    setHotelData((prevData) => ({ ...prevData, checkInButtonStatus: newCheckedValue }));

    try {
      const response = await patchApi(`api/hotel/editCheckInButtonStatus/${hotel?.hotelId}`, {
        status: newCheckedValue
      });
      console.log('Check-In Response:', response);
    } catch (error) {
      console.error('Error updating check-in status:', error);
    }
  };

  const handleChangeForCheckOutButton = async (event) => {
    const newCheckedValue = event.target.checked;
    setHotelData((prevData) => ({ ...prevData, checkOutButtonStatus: newCheckedValue }));

    try {
      const response = await patchApi(`api/hotel/editCheckOutButtonStatus/${hotel?.hotelId}`, {
        status: newCheckedValue
      });
      console.log('Check-Out Response:', response);
    } catch (error) {
      console.error('Error updating check-out status:', error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <>
      <EditHotel open={openEdit} handleClose={handleCloseEditHotel} data={hotelData} />
      <Container maxWidth="100%" sx={{ paddingLeft: '0px !important', paddingRight: '0px !important' }}>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}
          sx={{
            backgroundColor: '#fff',
            fontSize: '18px',
            fontWeight: '500',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '15px',
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
          }}>
          <Typography variant="h4">Hotel Profile</Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#673ab7',
              borderColor: '#673ab7',
              '&:hover': {
                borderColor: '#563099'
              }
            }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Stack>

        <Box width="100%">
          <Card style={{
            minHeight: '600px',
            paddingTop: '15px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            borderRadius: '5px',
          }}>
            <TabContext value={value}>
              <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                px: 2
              }}>
                <TabList onChange={handleChange} 
                  aria-label="lab API tabs example" 
                  textColor="secondary" 
                  indicatorColor="secondary">
                  <Tab label="Hotel Profile" value="1" />
                  <Tab label="WhatsApp API Message Status" value="2" />
                </TabList>
              </Box>

              <TabPanel value="1">
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Card elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h4">View Details</Typography>
                          <Button
                            startIcon={<EditIcon />}
                            variant="contained"
                            onClick={handleOpenEditHotel}
                            sx={{
                              backgroundColor: '#673ab7',
                              '&:hover': { backgroundColor: '#563099' }
                            }}
                          >
                            Edit
                          </Button>
                        </Stack>
                        
                        <Grid container spacing={3}>
                          {/* Existing grid items with updated styling */}
                          <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>Hotel Name</Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {hotelData?.name || 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          {/* ...Repeat similar styling for other grid items... */}
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              <TabPanel value="2">
                <Box sx={{ p: 2 }}>
                  <Card elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="h4" sx={{ mb: 3 }}>WhatsApp Message Disable / Enable</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h5">Check-In Message Button</Typography>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Switch 
                                  checked={hotelData.checkInButtonStatus} 
                                  onChange={handleChangeForCheckInButton}
                                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#673ab7' } }}
                                />
                              }
                            />
                          </FormGroup>
                        </Box>
                      </Grid>
                      {/* Repeat for Check-Out Message Button */}
                    </Grid>
                  </Card>
                </Box>
              </TabPanel>
            </TabContext>
          </Card>
        </Box>
      </Container>
    </>
  );
}
