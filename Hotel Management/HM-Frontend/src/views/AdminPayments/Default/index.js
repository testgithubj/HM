import { Grid, MenuItem, Select, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import { gridSpacing } from 'store/constant';
import { getApi } from 'views/services/api';
import ExpensesChart from '../ExpensesChart';
import ReservedRoomView from './ReservedRoomsTable';

// ==============================|| DEFAULT REPORTS ||============================== //

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary
}));

const Dashboard = () => {
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const [reservationData, setReservationData] = useState([]);
  const [filterType, setFilterType] = useState('today');

  // Helper function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  };

  // Function to fetch reservation data from the API
  const fetchReservationData = async () => {
    try {
      // const response = await getApi(`api/reservation/viewallcompletedreservations/${hotel?._id}`);
      const response = await getApi(`api/reservation/viewallcompletedreservations/${hotel?.hotelId}`);
      let filteredData = response.data.reservationData;

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

  useEffect(() => {
    fetchReservationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  // Calculate total payment for reservations
  const totalReservationPayment = reservationData.reduce((total, reservation) => total + reservation.totalPayment, 0);

  // Calculate total payment for food items
  const totalFoodPayment = reservationData.reduce((total, reservation) => {
    if (reservation.foodItems && reservation.foodItems.length > 0) {
      return total + reservation.foodItems.reduce((foodTotal, food) => foodTotal + food.price * food.quantity, 0);
    } else {
      return total;
    }
  }, 0);

  // Function to generate random color
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Prepare data for the income pie chart
  const pieChartIncomeData = [
    {
      id: 0,
      value: totalReservationPayment,
      label: 'reservation',
      amount: `$${totalReservationPayment}`,
      color: getRandomColor()
    },
    {
      id: 1,
      value: totalFoodPayment,
      label: 'food',
      color: getRandomColor()
    }
  ];

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6}>
            <Item>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Incomes ( in $ )
                </Typography>
                <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </Box>

              <Grid item xs={12} sm={6} md={6}>
                <PieChart
                  series={[
                    {
                      data: pieChartIncomeData
                    }
                  ]}
                  width={500}
                  height={340}
                />
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                <Typography>Food Income ( ${totalFoodPayment} )</Typography>
                <Typography>Reservation Income ( ${totalReservationPayment} ) </Typography>
              </Box>
            </Item>
          </Grid>
          <Grid item xs={12} md={6}>
            <Item>
              <ReservedRoomView />
            </Item>
          </Grid>
          <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Item>
              <ExpensesChart />
            </Item>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
