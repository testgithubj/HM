import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import { styled, useMediaQuery } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApi } from 'views/services/api';
import TableStyle from '../../ui-component/TableStyle';
// ----------------------------------------------------------------------

const AdminPayments = () => {
  const navigate = useNavigate();
  const [paymentData, setpaymentData] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)'); // for mobile devices

  const CustomTableStyle = styled(Box)(({ theme }) => ({
    width: '100%',
    overflowX: 'auto',
    whiteSpace: 'nowrap',

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
  }));

  console.log('paymentData', paymentData);

  const fetchpaymentData = async () => {
    try {
      const response = await getApi(`api/payments/totalPayment`);
      setpaymentData(response?.data?.paymentsData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchpaymentData();
  }, []);

  const shouldHidePagination = useMemo(() => !paymentData?.length || paymentData?.length <= 25, [paymentData]);

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

  const columns = [
    {
      field: 'hotelName',
      headerName: 'Hotel Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box
            onClick={() => {
              navigate(`/dashboard/hotel/view/${params.row.hotelId}`);
            }}
          >
            {params.value}
          </Box>
        );
      }
    },
    {
      field: 'packageName',
      headerName: 'Package Name',
      flex: 1
    },
    {
      field: 'amount',
      headerName: 'Package Amount',
      flex: 1,
      renderCell: (params) => {
        return <Box>${params.value}</Box>;
      }
    },
    {
      field: 'duration',

      headerName: 'Duration',
      flex: 1,
      renderCell: (params) => {
        return <Box>{params.value} Day(s)</Box>;
      }
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      renderCell: (params) => {
        return <Box>{moment(params?.value).format('YYYY-MM-DD ( HH:mm:ss )')}</Box>;
      }
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 1,
      renderCell: (params) => {
        return <Box>{moment(params?.value).format('YYYY-MM-DD ( HH:mm:ss )')}</Box>;
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
          case 'expires Soon':
            color = 'warning';
            break;
          default:
            color = 'inherit';
            break;
        }
        return (
          <Button variant="contained" color={color}>
            {params.value}
          </Button>
        );
      }
    }
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
          <Typography variant="h4">Payments Details Lists</Typography>
        </Stack>
        <TableStyle>
          <Box width="100%">
            <Card
              style={{
                height: '600px',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px'
              }}
            >
              <CustomTableStyle>
                <DataGrid
                  rows={paymentData}
                  columns={columns.map((col) => ({
                    ...col,
                    flex: 1,
                    minWidth: isMobile ? 200 : 50,
                    hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false
                  }))}
                  getRowId={(row) => row?._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  sx={{
                    ...paginationStyle,
                    minWidth: '1000px',
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
                      textTransform: 'capitalize'
                    }
                  }}
                />
              </CustomTableStyle>
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default AdminPayments;
