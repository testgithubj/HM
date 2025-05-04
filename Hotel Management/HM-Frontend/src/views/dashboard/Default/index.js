import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TextField,
  Button,
  MenuItem,
  Menu,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getApi } from 'views/services/api'; // Adjust the import path as needed
import { set } from 'immutable';
import { expenseSchema } from 'schema';
import PrintIcon from '@mui/icons-material/Print';
import HotelIcon from '@mui/icons-material/Hotel';
import TimelineIcon from '@mui/icons-material/Timeline';
import PaidIcon from '@mui/icons-material/Paid';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';

const gridSpacing = 2;

const Dashboard = () => {
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservationData, setReservationData] = useState([]);

  const [roomCount, setRoomCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRoomCount, setTotalRoomCount] = useState(0);
  const [overallOccupancy, setOverallOccupancy] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const CustomTableStyle = styled(Box)(({ theme }) => ({
    width: '100%',
    overflowX: 'auto',
  
    // Styling for Webkit browsers (Chrome, Safari, Edge) to *hide* the scrollbar
    '&::-webkit-scrollbar': {
      width: '0',  // Set width to 0 to hide
      height: '0', // Set height to 0 to hide
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',  // Make the track transparent
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent',  // Make the thumb transparent
    },
    // Styling for Firefox to *hide* the scrollbar
    '*': {  // Apply to all elements within
      scrollbarWidth: 'none', // This hides the scrollbar in Firefox
    },
    msOverflowStyle: 'none',  // Hide the scrollbar in IE and Edge (legacy)
  }));



  const fetchroomData = async () => {
    try {
      const response = await getApi(`api/room/viewallrooms/${hotel.hotelId}`);
      console.log('response room ==>', response);

      let countTotalRooms = 0;

      const roomData = response.data;
      console.log('roomData ==>', roomData);

      roomData.forEach((room) => {
        countTotalRooms += 1;
      });

      console.log('hmmm countTotalRooms ===========>', countTotalRooms);
      setTotalRoomCount(countTotalRooms);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpensesByDate = async () => {
    try {
      console.log('url hit ==>', `api/expenses/viewByDate/${hotel.hotelId}/${selectedDate.toISOString()}`);
      const response = await getApi(`api/expenses/viewByDate/${hotel.hotelId}/${selectedDate.toISOString()}`);
      console.log('response for expense ==>', response);

      const allExpenses = response.data.matchedDateExpenses;
      console.log('allExpenses ==>', allExpenses);

      let countExpenses = 0;

      allExpenses.forEach((expense) => {
        countExpenses += expense.amount;
      });

      console.log('countExpenses ==>', countExpenses);
      setTotalExpenses(countExpenses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchReservationDataByDate = async () => {
      console.log('selectedDate ====>', selectedDate);
      try {
        console.log('url hit ==>', `api/reservation/viewbydate/${hotel.hotelId}/${selectedDate.toISOString()}`);
        const response = await getApi(`api/reservation/viewbydate/${hotel.hotelId}/${selectedDate.toISOString()}`);
        console.log('response--- ======>', response);
        setReservationData(response?.data?.matchedData);

        const reservations = response.data.matchedData;

        let roomCount = 0;
        let totalRevenue = 0;

        reservations.forEach((reservation) => {
          roomCount += 1;
          totalRevenue += reservation.totalAmount + reservation.advanceAmount;
        });

        console.log('Total Rooms:', roomCount);
        console.log('Total Revenue:', totalRevenue);

        const total_occupancy = (roomCount / totalRoomCount) * 100;
        console.log('total_occupancy ======>', total_occupancy);

        setRoomCount(roomCount);
        setTotalRevenue(totalRevenue);
        setOverallOccupancy(total_occupancy);
      } catch (error) {
        console.error('Error fetching reservation data:', error);
      }
    };

    fetchReservationDataByDate();
    fetchroomData();
    fetchExpensesByDate();
  }, [selectedDate]);

  console.log('reservationData ==>', reservationData);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const printComponent = () => {
    const printContents = document.getElementById('print-area').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrint = () => {
    printComponent();
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Card elevation={3} sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center" justifyContent="space-between">
              <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#0066b2'
                            }
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>

                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    marginLeft: 5,
                    color: '#1e3a5f',
                    fontWeight: 600
                  }}
                >
                  Date: {selectedDate.toDateString()}
                </Typography>
              </Grid>

              <Grid item>
                <Tooltip title="Print Report">
                  <IconButton
                    variant="contained"
                    onClick={handlePrint}
                    sx={{
                      backgroundColor: '#846cf9',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#004d99'
                      }
                    }}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <CustomTableStyle>

            <TableContainer
              id="print-area"
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{
                p: 2,
                marginTop: '24px',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: '#e8ecf1',
                        color: '#747474',
                        fontSize: '1.1rem',
                        fontWeight: 600
                      }}
                    >
                      Metrics
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: '#e8ecf1',
                        color: '#747474',
                        fontSize: '1.1rem',
                        fontWeight: 600
                      }}
                    >
                      {selectedDate.toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow hover>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <HotelIcon color="primary" />
                      <Typography>No of Rooms Booked</Typography>
                    </TableCell>
                    <TableCell>{roomCount}</TableCell>
                  </TableRow>

                  {/* <TableRow hover>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TimelineIcon color="primary" />
                      <Typography>Overall Occupancy</Typography>
                    </TableCell>
                    <TableCell>{overallOccupancy}%</TableCell>
                  </TableRow> */}

                  <TableRow hover>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PaidIcon color="primary" />
                      <Typography>Revenue</Typography>
                    </TableCell>
                    <TableCell>${totalRevenue}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            </CustomTableStyle>

          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
