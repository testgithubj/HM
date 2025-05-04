import { useEffect, useState } from 'react';

// material-ui
import KingBedIcon from '@mui/icons-material/KingBed';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { gridSpacing } from 'store/constant';
import ReserveRoom from 'views/Room/ReserveRoom';
import { getApi } from 'views/services/api';
import RevenueChart from './RevenueChart';
import SummaryCard from './SummaryCard';
import TotalCustomersCard from './TotalCustomers';
import FoodItems from './TotalFoodItems';
import TotalReservationCard from './TotalReseravtions';
import TotalRoomsCard from './TotalRooms';

const RoomTypeIcons = {
  single: <SingleBedIcon sx={{ fontSize: '2.5rem' }} />,
  double: <KingBedIcon sx={{ fontSize: '2.5rem' }} />,
  triple: <KingBedIcon sx={{ fontSize: '2.5rem' }} />,
  family: <KingBedIcon sx={{ fontSize: '2.5rem' }} />
};

const MainDashboard = () => {
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [openReserveRoom, setOpenReserveRoom] = useState(false);
  const [roomPropsData, setRoomPropsData] = useState([]);
  const navigate = useNavigate();

  // Initialize with safe default values
  const [roomData, setroomData] = useState([]);
  const [reservationData, setreservationData] = useState([]);
  const [customerData, setcustomerData] = useState([]);
  const [foodItemData, setitemsData] = useState([]);
  const [revenueData, setRevenueData] = useState(Array(12).fill(0)); // Initialize with 12 months of zeros
  const [occupancyData, setOccupancyData] = useState([0, 0]);
  const [bookingData, setBookingData] = useState([0, 0]);
  const [staffData, setstaffData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState();
  const [permissionsAnchorEl, setPermissionsAnchorEl] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const hotel = JSON.parse(localStorage.getItem('hotelData'));

  // Update dummy data with more realistic values
  const dummyRevenueData = [4500, 6200, 5800, 7500, 8500, 9200, 8700, 9600, 10200, 9800, 11000, 12000];

  // Dummy data for occupancy and bookings (use positive integers)
  const dummyOccupancyData = [8, 12]; // [occupied, available]
  const dummyBookingData = [15, 45]; // [active bookings, total customers]

  // function for fetching all the rooms data from the db

  const fetchroomData = async () => {
    try {
      // const response = await getApi(`api/room/viewallrooms/${hotel._id}`);
      const response = await getApi(`api/room/viewallrooms/${hotel?.hotelId}`);
      setroomData(response?.data || []);
    } catch (error) {
      console.log(error);
      setroomData([]); // Fallback to empty array on error
    }
  };

  const fetchReservationData = async () => {
    try {
      // const response = await getApi(`api/reservation/viewallactivereservations/${hotel._id}`);
      const response = await getApi(`api/reservation/viewallactivereservations/${hotel?.hotelId}`);
      setreservationData(response?.data?.reservationData || []);
      console.log('reservationData', response?.data?.reservationData);
    } catch (error) {
      console.log(error);
      setreservationData([]); // Fallback to empty array on error
    }
  };

  const fetchcustomerData = async () => {
    try {
      // const response = await getApi(`api/customer/viewallcustomer/${hotel._id}`);
      const response = await getApi(`api/customer/viewallcustomer/${hotel?.hotelId}`);
      setcustomerData(response?.data?.customerData || []);
    } catch (error) {
      console.log(error);
      setcustomerData([]); // Fallback to empty array on error
    }
  };

  // // function for fetching all the restaurant items data from the db
  const fetchitemsData = async () => {
    try {
      // const response = await getApi(`api/restaurant/viewallitems/${hotel._id}`);
      const response = await getApi(`api/restaurant/viewallitems/${hotel?.hotelId}`);
      setitemsData(response?.data?.restaurantData);
    } catch (error) {
      console.log(error);
    }
  };

  // Add new function to fetch revenue data
  const fetchRevenueData = async () => {
    try {
      const response = await getApi(`api/singleInvoice/revenue/${hotel?.hotelId}`);
      setRevenueData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Add staff data fetching function
  const fetchstaffData = async () => {
    try {
      const response = await getApi(`api/employee/viewallemployee/${hotel?.hotelId}`);
      setstaffData(response?.data?.employeeData || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Split the useEffects to avoid race conditions
  useEffect(() => {
    // Initialize with dummy data immediately
    setRevenueData(dummyRevenueData);
    setOccupancyData(dummyOccupancyData);
    setBookingData(dummyBookingData);

    const fetchData = async () => {
      try {
        await Promise.all([
          fetchroomData(),
          fetchReservationData(),
          fetchcustomerData(),
          fetchitemsData(),
          fetchRevenueData(),
          fetchstaffData()
        ]);
      } catch (error) {
        console.log('Error fetching data:', error);
        // Keep using dummy data if API calls fail
      }
      setLoading(false);
    };
    fetchData();
  }, [hotel?.hotelId]);

  // Separate useEffect for calculations
  useEffect(() => {
    if (!roomData) return;

    const occupied = roomData?.filter((room) => room?.bookingStatus === 'active')?.length || 0;
    const total = roomData?.length || 0;
    setOccupancyData([occupied, Math.max(0, total - occupied)]);
  }, [roomData]);

  useEffect(() => {
    if (!reservationData || !customerData) return;

    const activeBookings = reservationData?.length || 0;
    const totalCustomers = customerData?.length || 0;
    setBookingData([activeBookings, totalCustomers]);
  }, [reservationData, customerData]);

  //function for opening dialogs
  const deviceWidth = window.innerWidth;
  const handleCloseReservationDialog = () => {
    setOpenReserveRoom(false);
  };

  const fetchReservationIdForActiveRooms = async (roomNo) => {
    try {
      const response = await getApi(`api/room/activroomreservationid/${roomNo}`);
      navigate(`/dashboard/reservation/view/${response?.data[0]?.reservationId}`);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRoomClick = (roominfo) => {
    console.log('on room click ==>', roominfo);

    setTimeout(() => {
      if (roominfo.bookingStatus === 'active') {
        fetchReservationIdForActiveRooms(roominfo.roomNo);
      } else {
        setOpenReserveRoom(true);
      }
      setRoomPropsData(roominfo);
    }, 300);
  };

  // Define theme colors
  const themeColors = {
    primary: '#846cf9', // deep blue
    secondary: '#ff9e69', // gold
    accent: '#07b6d5', // accent
    text: '#2C3E50' // text
  };

  // Add employee table related functions
  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setRowData(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPermissionsAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const columns = [
    {
      field: 'fullName',
      headerName: 'Employee Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'employeeType',
      headerName: 'Employee Type',
      flex: 1
    },
    {
      field: 'shift',
      headerName: 'Working Shift',
      flex: 1
    },
    {
      field: 'createdDate',
      headerName: 'Joining Date',
      flex: 1,
      renderCell: (params) => {
        return <Box>{moment(params?.value).format('YYYY-MM-DD')}</Box>;
      }
    },
    {
      field: 'salary',
      headerName: 'Salary',
      flex: 1,
      renderCell: (params) => {
        return <Box>${params.value}</Box>;
      }
    }
  ];

  // this is for controll pagination
  const shouldHidePagination = useMemo(() => !staffData?.length || staffData?.length <= 25, [staffData]);

  const paginationStyle = useMemo(
    () => ({
      '& .css-6tekhb-MuiTablePagination-root': {
        display: shouldHidePagination ? 'none' : 'block'
      },
      '& .MuiDataGrid-footer': {
        // Add this to hide the footer
        display: shouldHidePagination ? 'none' : 'block'
      }
    }),
    [shouldHidePagination]
  );

  return (
    <>
      <ReserveRoom open={openReserveRoom} handleClose={handleCloseReservationDialog} roomDataByProps={roomPropsData} />
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid
              item
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/roommanagement');
              }}
            >
              <TotalRoomsCard isLoading={isLoading} roomData={roomData} />
            </Grid>
            <Grid
              item
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/customers');
              }}
            >
              <TotalCustomersCard isLoading={isLoading} customerData={customerData} />
            </Grid>
            <Grid
              item
              sm={6}
              xs={12}
              md={6}
              lg={3}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/restaurant');
              }}
            >
              <FoodItems isLoading={isLoading} foodItemData={foodItemData} />
            </Grid>

            <Grid
              item
              sm={6}
              xs={12}
              md={6}
              lg={3}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/reservation');
              }}
            >
              <TotalReservationCard isLoading={isLoading} reservationData={reservationData} />
            </Grid>
          </Grid>
        </Grid>

        {/* New Revenue Chart */}
        <Grid item xs={12} md={8}>
          <RevenueChart data={revenueData} theme={theme} />
          <Paper elevation={0} sx={{ p: 2, mt: 2, boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)' }}>
            <Typography variant="h4" gutterBottom>
              Employee Overview
            </Typography>
            <Box
              sx={{
                height: deviceWidth < 1500 ? '250px' : '400px',
                width: '100%',
                minWidth: '100%',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px',
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  width: '0',
                  height: '0'
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'transparent'
                },
                '*': {
                  scrollbarWidth: 'none'
                },
                msOverflowStyle: 'none'
              }}
            >
              <DataGrid
                rows={staffData}
                columns={columns}
                getRowId={(row) => row?._id}
                disableRowSelectionOnClick
                sx={{
                  ...paginationStyle,
                  minWidth: { xs: '900px', lg: '100%' },
                  fontSize: { xs: '12px', sm: '12px', lg: '14px' },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    fontSize: { xs: '12px', sm: '14px' }
                  },
                  '& .MuiDataGrid-cell': {
                    padding: { xs: '4px', sm: '8px' }
                  },
                  '& .MuiDataGrid-root': {
                    overflowX: 'auto'
                  },
                  '& .MuiDataGrid-filterPanel': {
                    backgroundColor: theme.palette.background.default,
                    padding: theme.spacing(2)
                  },
                  '& .MuiDataGrid-filterForm': {
                    backgroundColor: theme.palette.grey[100],
                    borderRadius: theme.shape.borderRadius,
                    padding: theme.spacing(1),
                    flexDirection: 'column' // THIS IS THE KEY CHANGE!
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem'
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* New Summary Cards */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <SummaryCard
                title="Booking Overview"
                data={bookingData}
                labels={['Active Bookings', 'Total Customers']}
                colors={[themeColors.primary, themeColors.secondary]}
              />
            </Grid>
            <Grid item xs={12}>
              <SummaryCard
                title="Room Occupancy"
                data={roomData?.length ? occupancyData : [0, 0]}
                labels={['Occupied', 'Available']}
                colors={[themeColors.primary, themeColors.accent]}
                noDataMessage={!roomData?.length ? 'No rooms available' : null}
                cardHeight="250px" // Optional: fixed height for consistent layout
              />
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default MainDashboard;
