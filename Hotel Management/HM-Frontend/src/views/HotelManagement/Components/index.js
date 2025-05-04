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
import { useParams } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import moment from 'moment';
import { getApi } from 'views/services/api';
import AddHotel from '../AddHotel';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
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

export default function HotelManagementDashboard() {
  const navigate = useNavigate();
  const [value, setValue] = useState('1');
  const [openAdd, setOpenAdd] = useState(false);
  const [customerData, setCustomerData] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  //function for fetching property data based on the property id

  // ----------------------------------------------------------------------
  const [hotelData, setHotelData] = useState([]);
  const params = useParams();
  const hotelId = params.id;

  const fetchHotelData = async () => {
    try {
      const response = await getApi(`api/hotel/view/${hotelId}`);
      setHotelData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllCustomer = async () => {
    try {
      const response = await getApi(`api/customer/viewallcustomer/${hotelId}`);
      console.log("here response ===>",response);
      setCustomerData(response.data.customerData);

    } catch (error) {
      console.log("Found error =>",error);
    }
  }




  useEffect(() => {
    fetchHotelData();
    fetchAllCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAdd]);

  return (
    <>
      <AddHotel open={openAdd} handleClose={handleCloseAdd} />
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
          <Typography variant="h4">Hotel Details</Typography>
          <Box>
           
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
          </Box>
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
                  <Tab label="Information" value="1" />
                  <Tab label="Customer Information" value="2" />
                </TabList>
              </Box>

              <TabPanel value="1">
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                        <Typography variant="h4" sx={{ mb: 3 }}>Hotel Information</Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>Hotel Name</Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {hotelData.name ? hotelData?.name : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>Email</Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {hotelData.email ? hotelData.email : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>Contact</Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {hotelData.contact ? hotelData.contact : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>Address</Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {hotelData.address ? hotelData.address : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                        <Typography variant="h4" sx={{ mb: 3 }}>Additional Information</Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>GST Number</Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {hotelData.gstNumber ? hotelData.gstNumber : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>Food GST %</Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {hotelData.gstNumber ? hotelData.gstNumber : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>Room GST %</Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {hotelData.roomgstpercentage ? hotelData.roomgstpercentage : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>Joined Date</Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {hotelData.createdDate ? moment(hotelData.createdDate).format('YYYY-MM-DD') : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>Map Location</Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {hotelData.mapurl ? (
                                  <Button
                                    variant="contained"
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelData.mapurl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Open in Google Maps
                                  </Button>
                                ) : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              <TabPanel value="2">
                <Box sx={{ p: 2 }}>
                  <Card elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                    <TableContainer>
                      <Table sx={{ minWidth: 650 }} aria-label="customer table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Id Card Type</TableCell>
                            <TableCell>Id Card Number</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {customerData.map((customer) => (
                            <TableRow key={customer._id}>
                              <TableCell>{customer.fullName}</TableCell>
                              <TableCell>{customer.email}</TableCell>
                              <TableCell>{customer.address}</TableCell>
                              <TableCell>{customer.phoneNumber}</TableCell>
                              <TableCell>{customer.idCardType}</TableCell>
                              <TableCell>{customer.idcardNumber}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
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
