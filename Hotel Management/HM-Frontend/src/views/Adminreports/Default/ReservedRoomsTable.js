import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, Tooltip, Slider, Box } from '@mui/material';
import { getApi } from 'views/services/api';
import moment from 'moment';

const dayCellStyle = {
  width: '30px',
  height: '30px',
  border: '1px solid #ccc',
  textAlign: 'center',
  lineHeight: '30px',
  cursor: 'pointer',
  borderRadius: '50%',
  margin: '12px'
};

const reservedDayStyle = {
  backgroundColor: '#f44336'
};

const sliderContainerStyle = {
  margin: '10px',
  marginBottom: '20px'
};

const ReservedRoomView = () => {
  const [reservationData, setReservationData] = useState([]);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));

  const fetchReservationData = async () => {
    try {
      const response = await getApi(`api/reservation/viewactiveandcompletedreservation/${hotel?.hotelId}`);
      setReservationData(response?.data?.reservationData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReservationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel?.hotelId]);

  const reservedRoomMap = {};
  reservationData?.forEach((item) => {
    const checkInDate = moment(item.checkInDate).startOf('day').add(10, 'hours');
    const checkInDateString = checkInDate.format('YYYY-MM-DD');

    reservedRoomMap[checkInDateString] = (reservedRoomMap[checkInDateString] || 0) + 1;
  });
  const renderDayCell = (date) => {
    const dayOfMonth = date.getDate();
    const reservedCount = reservedRoomMap[moment(date).format('YYYY-MM-DD')] || 0;
    const isReserved = reservedCount > 0;

    return (
      <Tooltip title={`Date: ${moment(date).format('MMMM Do YYYY')}\nReserved Rooms: ${reservedCount}`} placement="top">
        <Paper sx={{ ...dayCellStyle, ...(isReserved && reservedDayStyle) }} elevation={3} key={date}>
          {dayOfMonth}
        </Paper>
      </Tooltip>
    );
  };

  const generateCalendarGrid = (year, month) => {
    const calendarGrid = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let week = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i, 10);
      week.push(renderDayCell(dayDate));
      if (i % 7 === 0 || i === daysInMonth) {
        calendarGrid.push(week);
        week = [];
      }
    }

    return calendarGrid.map((week, index) => (
      <Grid container spacing={1} key={index}>
        {week.map((day, index) => (
          <Grid item key={index}>
            {day}
          </Grid>
        ))}
      </Grid>
    ));
  };

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const handleMonthChange = (event, newValue) => {
    setCurrentMonth(newValue);
  };

  const totalReservedRoomsInMonth = Object.values(reservedRoomMap).reduce((acc, count) => acc + count, 0);

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Reserved Rooms - {new Date().getFullYear()} ( {totalReservedRoomsInMonth} rooms reserved )
        </Typography>
      </Grid>
      <Grid item xs={12} style={sliderContainerStyle}>
        <Slider
          value={currentMonth}
          onChange={handleMonthChange}
          min={0}
          max={11}
          step={1}
          marks={[
            { value: 0, label: 'Jan' },
            { value: 1, label: 'Feb' },
            { value: 2, label: 'Mar' },
            { value: 3, label: 'Apr' },
            { value: 4, label: 'May' },
            { value: 5, label: 'Jun' },
            { value: 6, label: 'Jul' },
            { value: 7, label: 'Aug' },
            { value: 8, label: 'Sep' },
            { value: 9, label: 'Oct' },
            { value: 10, label: 'Nov' },
            { value: 11, label: 'Dec' }
          ]}
          valueLabelDisplay="auto"
        />
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Box>{generateCalendarGrid(new Date().getFullYear(), currentMonth)}</Box>
      </Grid>
    </Grid>
  );
};

export default ReservedRoomView;
