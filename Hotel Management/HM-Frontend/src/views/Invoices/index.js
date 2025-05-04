import { useState, useEffect } from 'react';
import { Stack, Container, Typography, Card, Box, Button, useMediaQuery, useTheme } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getApi } from 'views/services/api';
import { useNavigate } from 'react-router';
import { styled } from '@mui/system';
import { useMemo } from 'react';

const CustomTableStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  overflowX: 'auto',
  // Hide the scrollbar
  '&::-webkit-scrollbar': {
    width: 0,
    height: 0,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'transparent',
  },
  scrollbarWidth: 'none', /* Firefox */
  msOverflowStyle: 'none', /* IE and Edge */
  '*::-webkit-scrollbar': {
    display: 'none'
  },
}));

const ViewInvoices = () => {
  const hotelId = JSON.parse(localStorage.getItem('hotelData')).hotelId;
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState([]);
  const [reservationIds, setReservationId] = useState([]);
  const theme = useTheme();

  // Breakpoints for responsiveness
  const isSmall = useMediaQuery('(max-width:1450px)'); // for mobile devices

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // small devices
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // tablets

  const fetchInvoiceData = async () => {
    try {
      const response = await getApi(`api/invoice/viewallinvoice/${hotelId}`);
      setInvoiceData(response?.data?.invoiceData);

      const reservationids = response.data.invoiceData.map((item) => item.reservationId);
      setReservationId(reservationids);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSingleBillData = async () => {
    try {
      reservationIds.map(async (reservationId) => {
        const response = await getApi(`api/singleinvoice/view/${reservationId}`);
        response?.data?.InvoiceData && setInvoiceData((prevData) => [...prevData, ...response.data.InvoiceData]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  useEffect(() => {
    if (reservationIds.length > 0) {
      fetchSingleBillData();
    }
  }, [reservationIds]);

  const handleGenerateBill = (billItem) => {
    if (billItem.type === 'room' || billItem.type === 'food') {
      navigate(`/roombill/view/${billItem._id}`);
    } else {
      navigate(`/singlebill/view/${billItem.reservationId}`);
    }
  };


  // this is for controll pagination 
  
  const shouldHidePagination = useMemo(() =>!invoiceData?.length || invoiceData?.length <=25, [invoiceData]);

  const paginationStyle = useMemo(
    () => ({
      '& .css-6tekhb-MuiTablePagination-root': {
        display: shouldHidePagination ? 'none' : 'block',
      },
      '& .MuiDataGrid-footer': { // Add this to hide the footer
        display: shouldHidePagination ? 'none' : 'block'
      },
    }),
    [shouldHidePagination]
  );
  const CustomTableStyle = styled(Box)(({ theme }) => ({
    width: '100%',
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: '400px', // optional: set a height to enable vertical scrolling
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px'
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent'
    },
    '*': {
      scrollbarWidth: 'thin'
    },
    msOverflowStyle: 'auto'
  }));

  const columns = [
    {
      field: `invoiceNumber`,
      headerName: 'Invoice Number',
      flex: 1,
      minWidth: isSmallScreen ? 120 : 150, // Increase minWidth for better readability
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => (
        <Box onClick={() => handleGenerateBill(params?.row)} sx={{ cursor: 'pointer' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: `name`,
      headerName: 'Name',
      flex: 1,
      minWidth: isSmallScreen ? 150 : 200, // Increase minWidth
      cellClassName: ' name-column--cell--capitalize',
      renderCell: (params) => (
        <Box>
          <Box>{params.value}</Box>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#777' }}>{params.row.customerPhoneNumber}</div>
        </Box>
      ),
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 2,
      minWidth: 200,
      hide: isMobile,
    },
    {
      field: 'type',
      headerName: 'Invoice Type',
      flex: 0.8, // Reduced flex for better fit
      minWidth: 100,
      renderCell: (params) => <Box>{params.row.type ? params.value : 'Food+Room'}</Box>,
      hide: isSmallScreen
    },
    {
      field: 'foodAmount',
      headerName: 'Food Amount',
      flex: 0.7, // Reduced flex
      minWidth: 80,
      renderCell: (params) => (
        <Box>
          {params.row.totalFoodAmount
            ? `$ ${params.row.totalFoodAmount}`
            : params.row.foodAmount
              ? `$ ${params.row.foodAmount}`
              : 'N/A'}
        </Box>
      ),
      hide: isMobile
    },
    {
      field: 'laundryAmount',
      headerName: 'Laundry Amount',
      flex: 0.7, // Reduced flex
      minWidth: 80,
      renderCell: (params) => (
        <Box>
          {params.row.totalLaundryAmount
            ? `$ ${params.row.totalLaundryAmount}`
            : params.row.laundryAmount
              ? `$ ${params.row.laundryAmount}`
              : 'N/A'}
        </Box>
      ),
      hide: isSmallScreen
    },
    {
      field: 'roomRent',
      headerName: 'Room Amount',
      flex: 0.7, // Reduced flex
      minWidth: 80,
      renderCell: (params) => (
        <Box>
          {params.row.totalRoomAmount ? `$ ${params.row.totalRoomAmount}` : params.row.roomRent ? `$ ${params.row.roomRent}` : 'N/A'}
        </Box>
      ),
      hide: isMobile
    },
    {
      field: 'advanceAmount',
      headerName: 'Advance Amount',
      flex: 0.7, // Reduced flex
      minWidth: 80,
      renderCell: (params) => (
        <Box>
          {params.row.totalRoomAmount
            ? 'N/A'
            : params.row.advanceAmount
              ? `$ ${params.row.advanceAmount}`
              : params.row.totalRoomAmount
                ? 'N/A'
                : 'N/A'}
        </Box>
      ),
      hide: isSmallScreen,
    },
    {
      field: 'discount',
      headerName: 'Discount',
      flex: 0.7, // Reduced flex
      minWidth: 80,
      renderCell: (params) => <Box>{params.value ? `$ ${params.value}` : ' N/A'}</Box>,
      hide: isMobile
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
      minWidth: isSmallScreen ? 120 : 150, // Adjusted minWidth
      renderCell: (params) => (
        <Box>{params.row.totalAmount ? `$ ${params.row.totalAmount}` : `$ ${params.row.totalFoodAndRoomAmount}`}</Box>
      ),
    },
  ];

  return (
    <>
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
          <Typography variant="h4">Customer Invoices</Typography>
        </Stack>
        <TableStyle>
          <CustomTableStyle>
            <Box width="100%" >
              <Card
                style={{
                  height: '600px',
                  paddingTop: '15px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                  borderRadius: '5px'
                }}
              >
                <DataGrid
                  rows={invoiceData ?? []}
                  columns={columns.map((col)=>({
                    ...col,
                    flex: 1,
                    minWidth: isSmall?150:50,
                    hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false,

                  }))}
                  getRowId={(row) => row._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  sx={{
                    ...paginationStyle,
                    '& .MuiDataGrid-toolbarContainer': {
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginBottom: '15px',
                      padding: '8px 16px',
                      gap: '8px',
                      '& > *:first-child': {
                        display: 'none'
                      },
                      '& > *:nth-child(3)': {
                        display: 'none'
                      }
                    },
                    '& .MuiButton-root': {
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      color: '#121926',
                      fontSize: '14px',
                      fontWeight: '500',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      textTransform: 'none',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      '&:hover': {
                        backgroundColor: '#f8f9fa',
                        borderColor: '#d0d0d0'
                      }
                    },
                    '& .MuiFormControl-root': {
                      color: '#121926',
                      fontSize: '14px',
                      fontWeight: '400',
                      padding: '4px 10px 0px',
                      '& .MuiInputBase-root': {
                        borderRadius: '5px'
                      }
                    },
                    '& .MuiCheckbox-root': {
                      padding: '4px'
                    },
                    '& .name-column--cell--capitalize': {
                      textTransform: 'capitalize',
                      cursor: 'pointer'
                    }
                  }}
                />
              </Card>
            </Box>
          </CustomTableStyle>
        </TableStyle>
      </Container>
    </>
  );
};

export default ViewInvoices;