import { Button, Grid, Menu, MenuItem, Select, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { gridSpacing } from 'store/constant';
// import ExpensesChart from '../ExpensesChart';
// import ReservedRoomView from './ReservedRoomsTable';
import { Box, Container, Stack } from '@mui/system';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { getApi } from 'views/services/api';
import ReservedRoomView from './Default/ReservedRoomsTable';

// ==============================|| DEFAULT REPORTS ||============================== //

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary
}));

const GeneralReports = () => {
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const [reservationData, setReservationData] = useState([]);
  const [spaGuestData, setSpaguestData] = useState([]);
  const [separateFoodData, setSeparateFoodData] = useState([]);
  const [filterType, setFilterType] = useState('today');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  };

  const fetchLaundryData = async () => {
    const response = await getApi(`api/laundary/viewall`);
  };

  // Function to fetch reservation data from the API
  const fetchReservationData = async () => {
    try {
      // const response = await getApi(`api/reservation/viewallcompletedreservations/${hotel._id}`);
      const response = await getApi(`api/reservation/viewallcompletedreservations/${hotel.hotelId}`);
      console.log('graph data:', response);
      let filteredData = response.data.reservationData;
      setSpaguestData(response?.data?.spaGuestData);

      const today = new Date();

      if (filterType === 'today') {
        filteredData = filteredData.filter((item) => {
          const checkOutDate = new Date(item.checkOutDate);
          return isSameDay(checkOutDate, today);
        });
      } else if (filterType === 'weekly') {
        const startOfWeek = getStartOfWeek(today);
        const endOfWeek = getEndOfWeek(today);
        filteredData = filteredData.filter((item) => {
          const checkOutDate = new Date(item.checkOutDate);
          return checkOutDate >= startOfWeek && checkOutDate <= endOfWeek;
        });
      } else if (filterType === 'monthly') {
        const startOfMonth = getStartOfMonth(today);
        const endOfMonth = getEndOfMonth(today);
        filteredData = filteredData.filter((item) => {
          const checkOutDate = new Date(item.checkOutDate);
          return checkOutDate >= startOfMonth && checkOutDate <= endOfMonth;
        });
      }

      setReservationData(filteredData);
    } catch (error) {
      console.error('Error fetching reservation data:', error);
    }
  };

  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek;
  };

  const getEndOfWeek = (date) => {
    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() - date.getDay() + 6);
    return endOfWeek;
  };

  const getStartOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getEndOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // function to fetch separate food inv data from the api

  // Function to fetch separate food invoice data from the API
  const fetchBillData = async () => {
    // try {
    // 	// const response = await getApi(`api/separatefoodinvoice/view/${hotel._id}`);
    // 	const response = await getApi(`api/separatefoodinvoice/view/${hotel.hotelId}`);
    // 	const invoiceData = response?.data?.InvoiceData || [];
    // 	console.log("fetch bill data", response);
    // 	// Filter data based on different time periods
    // 	const today = new Date();
    // 	const startOfWeek = getStartOfWeek(today);
    // 	const startOfMonth = getStartOfMonth(today);
    // 	const todayPayments = invoiceData.filter((item) => isSameDay(new Date(item.createdDate), today));
    // 	const weekPayments = invoiceData.filter((item) => new Date(item.createdDate) >= startOfWeek);
    // 	const monthPayments = invoiceData.filter((item) => new Date(item.createdDate) >= startOfMonth);
    // 	filterType === 'today'
    // 		? setSeparateFoodData(todayPayments)
    // 		: filter === 'weekly'
    // 			? setSeparateFoodData(weekPayments)
    // 			: setSeparateFoodData(monthPayments);
    // } catch (error) {
    // 	console.log(error);
    // }
  };

  useEffect(() => {
    //fetchBillData();
    fetchReservationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  // Calculate total payment for reservations
  const totalReservationPayment = reservationData.reduce((total, reservation) => total + reservation.totalPayment, 0);

  const totalLaundaryPayment = reservationData?.reduce((total, reservation) => {
    if (reservation.laundarieDetails && reservation.laundarieDetails.length > 0) {
      return (
        total + reservation?.laundarieDetails?.reduce((laundryTotal, laundary) => laundryTotal + laundary.amount * laundary.quantity, 0)
      );
    } else {
      return total;
    }
  }, 0);

  const spaGuestTotal = spaGuestData?.reduce((sum, spa) => sum + spa.totalAmount, 0) || 0;
  console.log('Spa Guest Total:', spaGuestTotal);

  // Step 2: Calculate total from reservation.spaGuest
  const spaReservationTotal =
    reservationData?.reduce((total, reservation) => {
      if (reservation.spaGuest && reservation.spaGuest.length > 0) {
        const spaRoomTotal = reservation.spaGuest.reduce((spaSum, spa) => spaSum + spa.totalAmount, 0);
        return total + spaRoomTotal;
      }
      return total;
    }, 0) || 0;

  // Step 3: Combine both
  const totalSpaPayment = spaReservationTotal + spaGuestTotal;

  // Calculate total payment for food items
  const totalFoodPayment = reservationData?.reduce((total, reservation) => {
    if (reservation.foodItems && reservation.foodItems.length > 0) {
      return total + reservation?.foodItems?.reduce((foodTotal, food) => foodTotal + food?.price * food?.quantity, 0);
    } else {
      return total;
    }
  }, 0);

  // calculate total food payment of separate food bill
  const totalSeparateFoodPayment = separateFoodData?.reduce((total, item) => {
    if (item.totalAmount) {
      return total + item.totalAmount;
    } else {
      return total;
    }
  }, 0);

  // Replace pieChartIncomeData with series and labels for ApexCharts
  const chartSeries = [
    totalReservationPayment,
    totalSeparateFoodPayment + totalFoodPayment,
    totalLaundaryPayment,
    totalSpaPayment // Add Spa
  ];

  const chartLabels = ['Reservation', 'Food', 'Laundry', 'Spa'];

  const chartOptions = {
    chart: {
      type: 'donut',
      background: '#FFFFFF'
    },
    labels: chartLabels,
    colors: ['#2563EB', '#FACC15', '#10B981', '#A855F7'], // Blue, Yellow, Green, Purple for Spa
    dataLabels: {
      enabled: true
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%'
        }
      }
    },
    theme: {
      mode: 'light',
      palette: 'palette1'
    },
    legend: {
      show: true,
      position: 'bottom',
      labels: {
        colors: '#2C3E50'
      }
    }
  };

  // Function to export pie chart data as CSV
  const exportToCSV = () => {
    const csvData = chartSeries.map((item, index) => `${chartLabels[index]},${item}`).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, 'income_data.csv');
  };

  // Function to print the PieChart
  const printPieChart = () => {
    const chartDiv = document.getElementById('pie-chart-div');
    if (chartDiv && filterType) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>PieChart Print</title></head><body>');
      printWindow.document.write(chartDiv.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Container maxWidth="100%" sx={{ paddingLeft: '0px !important', paddingRight: '0px !important' }}>
      <Stack
        direction="row"
        alignItems="center"
        mb={5}
        justifyContent={'space-between'}
        sx={{
          backgroundColor: '#fff',
          fontSize: '18px',
          fontWeight: '500',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '15px',
          boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)'
        }}
      >
        <Typography variant="h4">General Reports</Typography>
      </Stack>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6}>
              <Item>
                <Box sx={{ display: { lg: 'flex', xs: 'block' }, justifyContent: 'space-between' }}>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    Incomes ( in $)
                  </Typography>
                  <Box sx={{ marginTop: { xs: '5px', lg: '0px' }, display: 'flex', alignItems: 'center' }}>
                    <Select size="small" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                      <MenuItem value="today">Today</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                    <Button variant="contained" onClick={handleClick} sx={{ ml: 1 }}>
                      Export / Print
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                      <MenuItem onClick={exportToCSV}>Export to CSV</MenuItem>
                      <MenuItem onClick={printPieChart}>Print</MenuItem>
                    </Menu>
                  </Box>
                </Box>
                <Box id="pie-chart-div">
                  <Grid item xs={12} sm={6} md={6}>
                    <Chart
                      sx={{
                        border: 'red 1px solid',
                        margin: '0px 25px 0px 0px',
                        width: { xs: '200px', lg: '500px' },
                        height: { xs: '200px', lg: '300px' }
                      }}
                      options={chartOptions}
                      series={chartSeries}
                      type="donut"
                    />
                  </Grid>

                  <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', flexDirection: 'column' }}>
                    <Typography>Food Income ( ${totalSeparateFoodPayment + totalFoodPayment} )</Typography>
                    <Typography>Reservation Income ( ${totalReservationPayment} ) </Typography>
                    <Typography>Laundary Income ( ${totalLaundaryPayment}) </Typography>
                    <typography>Spa Income ( ${totalSpaPayment}) </typography>
                  </Box>
                </Box>
              </Item>
            </Grid>

            <Grid item xs={12} md={6}>
              <Item>
                <ReservedRoomView />
              </Item>
            </Grid>

            {/* <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center' }}>
							<Item>
								<ExpensesChart />
							</Item>
						</Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GeneralReports;
