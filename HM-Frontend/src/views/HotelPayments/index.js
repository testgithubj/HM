/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Stack, Container, Typography, Card, Box, Button, useMediaQuery } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getApi } from 'views/services/api';
import { useMemo } from 'react';
import { styled } from '@mui/system';

const HotelPaymentsDetails = () => {
  const hotelId = JSON.parse(localStorage.getItem('hotelData'))._id;

  const [paymentData, setPaymentData] = useState([]);

  const getAllPaymentsDetails = async () => {
    const response = await getApi(`api/payments/list/?createdBy=${hotelId}`);
    console.log(" response ==> ", response);
    if (response && response.status === 200) {
      setPaymentData(response?.data?.paymentsData);
    }
  };

  useEffect(() => {
    getAllPaymentsDetails();
    // eslint-disable-next-line
  }, []);

  const isMobile = useMediaQuery('(max-width:600px)'); // for mobile devices



  const shouldHidePagination = useMemo(() =>!paymentData?.length || paymentData?.length <=25, [paymentData]);

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
  const TableStyle = styled(Box)(({ theme }) => ({
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
      field: '_id',
      headerName: 'S.No.',
      flex:isMobile?1:0.5,
      cellClassName: 'name-column--cell--capitalize',
      valueGetter: (index) => index.api.getRowIndexRelativeToVisibleRows(index.row._id) + 1
    },
    {
      field: 'title',
      headerName: 'Package Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'days',
      headerName: 'Duration',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => {
        return <Box>{params.value} Days</Box>;
      }
    },

    {
      field: 'createdOn',
      headerName: ' Start Date',
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleString(undefined, dateOptions);
      }
    },
    {
      field: 'endDate',
      headerName: ' End Date',
      flex: 1,
      valueGetter: (params) => {
        const startDate = new Date(params.row.createdOn);
        const days = parseInt(params.row.days);
        const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
        const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return endDate.toLocaleString(undefined, dateOptions);
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        let color;
        switch (params.value) {
          case 'active':
            color = 'success';
            break;
          case 'expired':
            color = 'error';
            break;
          case 'expiresSoon':
            color = 'warning';
            break;
          default:
            color = 'inherit';
            break;
        }
        return (
          <Button variant="contained" color={color} sx={{ cursor: 'none' }}>
            {params.value}
          </Button>
        );
      }
    }
  ];

  return (
    <>
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
          <Typography variant="h4">Payments Details Lists</Typography>
        </Stack>
        <TableStyle >
          <Box width="100%">
            <Card  sx={{
                minWidth: '100%',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px',
                overflowX: 'auto', 
                  '&::-webkit-scrollbar': {
                    width: '0', 
                    height: '0', 
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',  
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'transparent', 
                  },
                  '*': {  
                    scrollbarWidth: 'none', 
                  },
                  msOverflowStyle: 'none', 
              }}>
              <DataGrid
                rows={paymentData ?? []}
                columns={columns}
                getRowId={(row) => row._id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
                sx={{
                  minHeight: 400,
                  minWidth: '1200px',
                  ...paginationStyle,
                fontSize: { xs: '12px', sm: '12px',lg: '14px' },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  fontSize: { xs: '12px', sm: '14px' }
                },
                '& .MuiDataGrid-cell': {
                  padding: { xs: '4px', sm: '8px' }, // Adjust padding
                  wordBreak: 'break-word' ,// prevent text overflow in cells
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',

                },
                '& .MuiDataGrid-root': {
                  overflowX: 'auto' // Ensure scrollability
                }
                }}
              />
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default HotelPaymentsDetails;
