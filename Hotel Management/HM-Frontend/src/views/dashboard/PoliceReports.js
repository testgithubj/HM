import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../ui-component/TableStyle';
import { useState } from 'react';
import { Stack, Container, Typography, Box, Card, Button, TableContainer, Table, TableHead, TableRow, TableCell } from '@mui/material';
import * as React from 'react';
import { useEffect } from 'react';
import { getApi } from 'views/services/api';
import { color, maxWidth, styled } from '@mui/system';
import { useMemo } from 'react';
// ----------------------------------------------------------------------

const PoliceReports = () => {
  const [reservationData, setReservationData] = useState([]);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const navigate = useNavigate();


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

  // function for fetching all the active reservation data
  const fetchActiveReservationData = async () => {
    try {
      // const response = await getApi(`api/reservation/viewcustomerofactivereservation/${hotel?._id}`);
      const response = await getApi(`api/reservation/viewcustomerofactivereservation/${hotel?.hotelId}`);
      console.log('in police report =>', response);
      console.log('==> ==> ', response);
      setReservationData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchActiveReservationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  
  const shouldHidePagination = useMemo(() =>!reservationData?.length || reservationData?.length <=25, [reservationData]);

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
  //---------------------------------------------------------------------
  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => <Box sx={{ textAlign: 'center', width: '100%' }}>{params.value}</Box>,
      headerAlign: 'center', // Center-align the header
      align: 'center' // Center-align the cells
    },
    {
      field: `fullName`,
      headerName: 'Name',
      flex: 1,
      // maxWidth: 200,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      color: 'black',
      renderCell: (params) => {
        return (
          <Box>
            <Box onClick={() => navigate(`/dashboard/customer/view/${params.row.phoneNumber}`)}>{params.value}</Box>
          </Box>
        );
      }
    },
    {
      field: `phoneNumber`,
      headerName: 'Contact Details',
      flex: 1,
      // maxWidth: 200,
      color: 'black',
      renderCell: (params) => {
        return (
          <Box>
            {params.row.phoneNumber}
            <br /> {params.row.email}
          </Box>
        );
      }
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      // maxWidth:200,
      renderCell: (params) => {
        return <Box>{params.row.address}</Box>;
      }
    },
    {
      field: 'idcardNumber',
      headerName: 'Id Card Number',
      flex: 1,
      // maxWidth:130,
      renderCell: (params) => {
        return <Box>{params.row.idcardNumber}</Box>;
      }
    }
  ];

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write('<html><head><title>Police Report</title>');
    printWindow.document.write(
      '<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; }</style>'
    );
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div id="print-report">');

    // Creating a simple HTML version of the table
    printWindow.document.write(`
      <h1>Police Reports</h1>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact Details</th>
            <th>Address</th>
            <th>Id Card Number</th>
          </tr>
        </thead>
        <tbody>
          ${reservationData
            .map(
              (row) => `
            <tr>
              <td>${row.fullName}</td>
              <td>${row.phoneNumber}<br />${row.email}</td>
              <td>${row.address}</td>
              <td>${row.idcardNumber}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `);

    printWindow.document.write('</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

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
          <Typography variant="h4">Police Reports</Typography>
          <Button variant="contained" onClick={handlePrint}>
            Print
          </Button>
        </Stack>

        <TableStyle>
          <Box width="100%">
          <CustomTableStyle>

            <Card
              style={{
                height: '600px',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px',
                overflowX:'scroll'
              }}
            >
              {reservationData && (
                <DataGrid
                  rows={reservationData?.map((row, index) => ({ ...row, serialNo: index + 1 }))}
                  columns={columns}
                  checkboxSelection
                  getRowId={(row) => row?._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  sx={{
                    ...paginationStyle,
                    minWidth:'800px',
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
              )}
            </Card>
            </CustomTableStyle>

          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default PoliceReports;
