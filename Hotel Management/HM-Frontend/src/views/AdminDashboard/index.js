import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router';
import {
  BarChart, Bar, CartesianGrid, Legend, PieChart, Pie,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Cell
} from 'recharts';

import { gridSpacing } from 'store/constant';
import DashboardHotelList from 'views/HotelManagement/DashboardHotelList';
import { getApi } from 'views/services/api';

import TotalCustomersCard from './TotalCustomers';
import TotalHotelsCard from './TotalHotels';
import TotalReservationCard from './TotalReseravtions';
import TotalRooms from './TotalRooms';

// Theme and chart styles
const themeColors = {
  primary: '#846cf9',
  secondary: '#ff9e69',
  accent: '#07b6d5',
  text: '#2C3E50'
};

const donutChartStyles = {
  width: 160,
  height: 160,
  innerRadius: '70%',
  outerRadius: '100%'
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(true);
  const [hotelData, sethotelData] = useState(0);
  const [reservationData, setReservationData] = useState(0);
  const [customerData, setcustomerData] = useState(0);
  const [roomData, setRoomData] = useState(0);
  const [allhotelReservationData, setAllhotelReservationData] = useState([]);
  const [occupancy, setOccupancy] = useState({ currentMonthActiveCount: 0, previousMonthCheckoutCount: 0 });
  const [totalRevenue, setTotalRevenue] = useState(0);

  const targetRevenue = 200000; // Set your target revenue

  useEffect(() => {
    setLoading(false);
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    fetchhotelData();
    fetchReservationData();
    fetchcustomerData();
    fetchRoomData();
    fetchHotelAllReservationData();
    fetchOccupancyData();
    fetchTotalRevenue();
  };

  const fetchhotelData = async () => {
    try {
      const response = await getApi(`api/hotel/viewallhotels`);
      sethotelData(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReservationData = async () => {
    try {
      const response = await getApi(`api/reservation/viewallreservation/all`);
      setReservationData(response?.data?.reservationData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchcustomerData = async () => {
    try {
      const response = await getApi(`api/customer/viewallcustomer`);
      setcustomerData(response?.data?.customerData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoomData = async () => {
    try {
      const response = await getApi(`api/room/viewallrooms`);
      setRoomData(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHotelAllReservationData = async () => {
    try {
      const response = await getApi(`api/reservation/monthly`);
      setAllhotelReservationData(response?.data?.graphData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOccupancyData = async () => {
    try {
      const response = await getApi(`api/reservation/adiminOccupancyRate/stats`);
      setOccupancy(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const response = await getApi(`api/reservation/getTotalRevenueForAdmin`);

      console.log('response ===>',response.data);
      const total = [response.data].reduce((acc, item) => {
        
    
        let reservationTotal = 0;
        if (item?.reservationData) {
          reservationTotal += item?.reservationData?.reduce((sum, reservation) => {
            console.log('item inside reservation ===>', reservation);
            const foodTotal = reservation?.foodItems?.reduce((fSum, fItem) => fSum + fItem.price * fItem.quantity, 0) || 0;
            const laundryTotal = reservation.laundryDetails?.reduce((lSum, lItem) => lSum + lItem.amount * lItem.quantity, 0) || 0;
            return sum + foodTotal + laundryTotal + (reservation.totalPayment || 0);
          }, 0);
        }
        const spaTotal = item?.spaData?.reduce((sSum, sItem) => sSum + (sItem.totalAmount || 0), 0) || 0;
        return acc + reservationTotal + spaTotal;
      }, 0);
      setTotalRevenue(total);
    } catch (error) {
      console.error(error);
    }
  };


  console.log('occupancy ===>', totalRevenue);

  const progressPercentage = ((occupancy.currentMonthActiveCount / (occupancy.previousMonthCheckoutCount || 1)) * 100).toFixed(1);
  const growthPercentage = (((occupancy.currentMonthActiveCount - occupancy.previousMonthCheckoutCount) / (occupancy.previousMonthCheckoutCount || 1)) * 100).toFixed(1);

  return (
    <Grid container spacing={gridSpacing}>
      {/* Summary Cards */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} md={6} sm={6} xs={12} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/hotel')}>
            <TotalHotelsCard isLoading={isLoading} hotelData={hotelData} />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/customers')}>
            <TotalCustomersCard isLoading={isLoading} customerData={customerData} />
          </Grid>
          <Grid item sm={6} xs={12} md={6} lg={3} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/rooms')}>
            <TotalRooms isLoading={isLoading} roomData={roomData} />
          </Grid>
          <Grid item sm={6} xs={12} md={6} lg={3} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/reservation')}>
            <TotalReservationCard isLoading={isLoading} reservationData={reservationData} />
          </Grid>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid item xs={12} md={8}>
        <Paper elevation={0} sx={{ borderRadius: 3, background: '#ffffff', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
          <Typography variant="h4" gutterBottom sx={{ padding: '20px', fontWeight: 600, color: '#2C3E50' }}>
            Performance Overview
          </Typography>
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={allhotelReservationData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="reservationsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={themeColors.secondary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={themeColors.secondary} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#999999', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999999', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="reservations" fill="url(#reservationsGradient)" radius={[4, 4, 0, 0]} barSize={30} name="Reservations" />
              <Bar dataKey="occupancy" fill="url(#occupancyGradient)" radius={[4, 4, 0, 0]} barSize={30} name="Occupancy" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, mt: 2, boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)' }}>
          <Typography variant="h4" gutterBottom>
            Hotel Management
          </Typography>
          <DashboardHotelList />
        </Paper>
      </Grid>

      {/* Donut Charts */}
      <Grid item xs={12} md={4}>
        <Grid container spacing={gridSpacing}>
          {/* Revenue Donut */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)' }}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6">Total Revenue</Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <ResponsiveContainer width={donutChartStyles.width} height={donutChartStyles.height}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Revenue', value: totalRevenue },
                          { name: 'Remaining', value: Math.max(0, targetRevenue - totalRevenue) }
                        ]}
                        innerRadius={donutChartStyles.innerRadius}
                        outerRadius={donutChartStyles.outerRadius}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        cornerRadius={5}
                      >
                        <Cell fill={themeColors.primary} />
                        <Cell fill="#f0f0f0" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" component="div">
                      ${totalRevenue.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {(totalRevenue / targetRevenue * 100).toFixed(1)}% of target
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Occupancy Donut */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)' }}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6">Occupancy Rate</Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <ResponsiveContainer width={donutChartStyles.width} height={donutChartStyles.height}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Occupied', value: Number(progressPercentage) },
                          { name: 'Empty', value: Math.max(0, 100 - Number(progressPercentage)) }
                        ]}
                        innerRadius={donutChartStyles.innerRadius}
                        outerRadius={donutChartStyles.outerRadius}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        cornerRadius={5}
                      >
                        <Cell fill="#82ca9d" />
                        <Cell fill="#f0f0f0" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" component="div">
                      {progressPercentage}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  Compared to last month: {growthPercentage}%
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
