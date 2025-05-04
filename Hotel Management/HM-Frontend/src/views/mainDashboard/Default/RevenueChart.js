/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Paper, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/system';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { getApi } from 'views/services/api';

const RevenueChart = ({
  defaultData = [
    850, // Jan - Post holiday season
    750, // Feb - Low season
    900, // Mar - Spring break
    1100, // Apr - Spring tourism
    1200, // May - Wedding season
    1500, // Jun - Summer peak
    1600, // Jul - Summer peak
    1400, // Aug - Late summer
    1000, // Sep - Fall season
    850, // Oct - Off season
    950, // Nov - Thanksgiving
    1300 // Dec - Holiday season
  ],
  theme
}) => {
  const isLaptop = useMediaQuery('(max-width:1300px)');
  const isLarge = useMediaQuery('(max-width:1400px)');
  const isMobile = useMediaQuery('(max-width:600px)');
  const [revenueData, setRevenueData] = useState([]);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));

  console.log('revenueData', revenueData);

  const fetchRevenueData = async () => {
    try {
      const response = await getApi(`api/singleInvoice/revenue`);

      // Check if response has the expected structure
      if (response?.data?.data && Array.isArray(response.data.data)) {
        // Extract just the revenue values from the array of month objects
        const revenueValues = response.data.data.map((item) => item.revenue || 0);
        setRevenueData(revenueValues);
      } else {
        console.log('Unexpected API response format:', response);
        setRevenueData(defaultData); // Fallback to default data
      }
    } catch (error) {
      console.log('Error fetching revenue data:', error);
      setRevenueData(defaultData); // Fallback to default data on error
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const deviceWidth = window.innerWidth;

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      fontSize: '0.1px',
      maxWidth: '500px',
      toolbar: {
        show: false
      },
      background: '#FFFFFF'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 2
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val)
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#2C3E50' // text color
        }
      }
    },
    yaxis: {
      title: {
        text: 'Revenue ($)',
        style: {
          color: '#2C3E50' // text color
        }
      },
      labels: {
        style: {
          colors: '#2C3E50' // text color
        },
        formatter: (val) => val // Keep original values for y-axis
      }
    },
    fill: {
      opacity: 1,
      colors: ['#846cf9'] // deep blue
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toLocaleString()}`
      }
    },
    theme: {
      mode: 'light',
      palette: 'palette1'
    }
  };

  // Use the state data for the chart, ensure it's an array of numbers
  const chartData = Array.isArray(revenueData) && revenueData.length === 12 ? revenueData : defaultData;

  return (
    <Paper
      height={deviceWidth < 1500 ? '60%' : 350}
      sx={{
        p: 3,
        width: '100%',
        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)'
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Monthly Revenue
      </Typography>
      <Chart
        options={options}
        series={[{ name: 'Revenue', data: chartData }]}
        type="bar"
        height={deviceWidth < 1500 ? '100%' : 350}
        width={
          deviceWidth < 600
            ? '100%'
            : deviceWidth < 800
            ? '600px'
            : deviceWidth < 1050
            ? '420px'
            : deviceWidth < 1400
            ? '590px'
            : deviceWidth < 1500
            ? '680px'
            : '950px'
        }
      />
    </Paper>
  );
};

export default RevenueChart;
