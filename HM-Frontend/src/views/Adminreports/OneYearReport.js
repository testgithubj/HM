// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import TableStyle from '../../ui-component/TableStyle';
// import { useState } from 'react';
// import { Stack, Button, Container, Typography, Box, Card } from '@mui/material';
// import * as React from 'react';
// import { useEffect } from 'react';
// import { getApi } from 'views/services/api';
// import { useNavigate } from 'react-router';
// import { styled } from '@mui/system';

// const OneYearReport = () => {
//   const navigate = useNavigate();
//   const [hotelData, setHotelData] = useState([]);

//   const CustomTableStyle = styled(Box)(({ theme }) => ({
//     width: '100%',
//     overflowX: 'auto', // Ensures horizontal scrolling is enabled
//     whiteSpace: 'nowrap', // Prevents content from wrapping

//     // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge)
//     '&::-webkit-scrollbar': {
//       width: '0', // Hides the scrollbar
//       height: '0', // Hides the scrollbar
//     },
//     '&::-webkit-scrollbar-track': {
//       backgroundColor: 'transparent', // Makes the track transparent
//     },
//     '&::-webkit-scrollbar-thumb': {
//       backgroundColor: 'transparent', // Makes the thumb transparent
//     },

//     // Firefox scrollbar behavior
//     '*': {
//       scrollbarWidth: 'none', // Hides the scrollbar in Firefox
//     },

//     msOverflowStyle: 'none', // Hide scrollbar in IE and Edge
//   }));

//   // function for fetching all the hotels data from the db

//   const fetchhotelData = async () => {
//     try {
//       console.log('api hit ==>', `api/hotel/viewallhotelreports`);
//       const response = await getApi(`api/hotel/viewallhotelreports`);
//       console.log('response --------- ===>', response);

//       if (response.status === 204) {
//         setHotelData([]);
//       } else {
//         setHotelData(response?.data);
//       }
//     } catch (error) {
//       console.log('error ===>', error);
//     }
//   };
//   useEffect(() => {
//     fetchhotelData();
//   }, []);

//   const columns = [
//     {
//       field: 'name',
//       headerName: 'Hotel Name',
//       flex: 1,
//       cellClassName: 'name-column--cell name-column--cell--capitalize',
//       renderCell: (params) => {
//         return (
//           <Box
//             onClick={() => {
//               navigate(`/dashboard/hotel/view/${params.row._id}`);
//             }}
//           >
//             {params.value}
//           </Box>
//         );
//       }
//     },

//     {
//       field: 'totalIncome1Year',
//       headerName: 'Total Income',
//       flex: 1,
//       renderCell: (params) => {
//         return <Box>${params.value}</Box>;
//       }
//     },
//     {
//       field: 'roomCount',
//       headerName: 'Total Rooms',
//       flex: 1
//     },
//     {
//       field: 'customerCount',
//       headerName: 'Total Customer',
//       flex: 1
//     },
//     {
//       field: 'planName',
//       headerName: 'Subscripion Plan',
//       flex: 1
//     },
//     {
//       field: 'days',
//       headerName: 'End Date',
//       flex: 1,
//       valueGetter: (params) => {
//         try {
//           // Access the first item in the subscriptionInfo array
//           const subscription = params.row.subscriptionInfo[0];

//           if (!subscription) {
//             throw new Error('Subscription info is missing');
//           }

//           // Extract and validate the startDate
//           const startDateStr = subscription.createdDate;
//           const startDate = new Date(startDateStr);

//           if (isNaN(startDate.getTime())) {
//             throw new Error('Invalid start date');
//           }

//           // Extract and validate the days
//           const days = Array.isArray(subscription.days) ? parseInt(subscription.days[0], 10) : parseInt(subscription.days, 10);

//           if (isNaN(days)) {
//             throw new Error('Invalid number of days');
//           }

//           // Calculate the end date
//           const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
//           const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
//           return endDate.toLocaleString(undefined, dateOptions);
//         } catch (error) {
//           //   console.error('Error calculating end date:', error);
//           return 'Invalid Date';
//         }
//       }
//     },
//     {
//       field: 'planStatus',
//       headerName: 'Plan Status',
//       flex: 1,
//       renderCell: (params) => {
//         let color;
//         switch (params.value) {
//           case 'active':
//             color = 'success';
//             break;
//           case 'expired':
//             color = 'error';
//             break;
//           case 'expiresSoon':
//             color = 'warning';
//             break;
//           default:
//             color = 'inherit';
//             break;
//         }
//         return (
//           <Button variant="contained" color={color} sx={{ cursor: 'none' }}>
//             {params.value}
//           </Button>
//         );
//       }
//     }
//   ];

//   return (
//     <Container maxWidth="100%">
//       <Stack direction="row" alignItems="center" my={2} justifyContent={'space-between'}>
//         <Typography variant="h4">Past 3 Month Report</Typography>
//       </Stack>
//       <Box sx={{ width: '100%' }}>
//         <TableStyle>
//           {hotelData && (
//             <CustomTableStyle>
//             <DataGrid
//               rows={hotelData}
//               columns={columns}
//               getRowId={(row) => row?._id}
//               sx={{

//                 minWidth: '1200px', // Ensure content is wide enough to cause scrolling

//                 '& .MuiDataGrid-toolbarContainer': {
//                   display: 'flex',
//                   justifyContent: 'flex-end',
//                   marginBottom: '15px',
//                   padding: '8px 16px',
//                   gap: '8px',
//                   '& > *:first-child': {
//                     display: 'none'
//                   },
//                   '& > *:nth-child(3)': {
//                     display: 'none'
//                   }
//                 },
//                 '& .MuiButton-root': {
//                   border: '1px solid #e0e0e0',
//                   color: '#121926',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   padding: '6px 12px',
//                   borderRadius: '5px',
//                   textTransform: 'none',
//                   boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//                   '&:hover': {
//                     backgroundColor: '#f8f9fa',
//                     borderColor: '#d0d0d0'
//                   }
//                 },
//                 '& .MuiFormControl-root': {
//                   color: '#121926',
//                   fontSize: '14px',
//                   fontWeight: '400',
//                   padding: '4px 10px 0px',
//                   '& .MuiInputBase-root': {
//                     borderRadius: '5px'
//                   }
//                 },
//                 '& .MuiCheckbox-root': {
//                   padding: '4px'
//                 },
//                 '& .name-column--cell--capitalize': {
//                   textTransform: 'capitalize'
//                 }
//               }}
//             />
//             </CustomTableStyle>
//           )}
//         </TableStyle>
//       </Box>
//     </Container>
//   );
// };

// export default OneYearReport;

import { Box, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getApi } from 'views/services/api';
import TableStyle from '../../ui-component/TableStyle';

const OneYearReport = () => {
  const navigate = useNavigate();
  const [hotelData, setHotelData] = useState([]);

  console.log('one year hotel data', hotelData);

  const CustomTableStyle = styled(Box)(({ theme }) => ({
    width: '100%',
    overflowX: 'auto', // Ensures horizontal scrolling is enabled
    whiteSpace: 'nowrap', // Prevents content from wrapping

    // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge)
    '&::-webkit-scrollbar': {
      width: '0', // Hides the scrollbar
      height: '0' // Hides the scrollbar
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent' // Makes the track transparent
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent' // Makes the thumb transparent
    },

    // Firefox scrollbar behavior
    '*': {
      scrollbarWidth: 'none' // Hides the scrollbar in Firefox
    },

    msOverflowStyle: 'none' // Hide scrollbar in IE and Edge
  }));

  // function for fetching all the hotels data from the db
  const fetchhotelData = async () => {
    try {
      console.log('api hit ==>', `api/hotel/viewallhotelreports`);
      const response = await getApi(`api/hotel/viewallhotelreports`);
      console.log('response --------- ===>', response);

      if (response.status === 204) {
        setHotelData([]);
      } else {
        setHotelData(response?.data);
      }
    } catch (error) {
      console.log('error ===>', error);
    }
  };

  useEffect(() => {
    fetchhotelData();
  }, []);

  // Helper function to check if subscription exists
  const hasValidSubscription = (row) => {
    return row.subscriptionInfo && Array.isArray(row.subscriptionInfo) && row.subscriptionInfo.length > 0;
  };

  // Helper function to get plan status text and color
  const getPlanStatusInfo = (status) => {
    if (!status) return { text: 'No Plan', color: 'inherit' };

    switch (status) {
      case 'active':
        return { text: 'Active', color: 'success' };
      case 'expired':
        return { text: 'Expired', color: 'error' };
      case 'expiresSoon':
        return { text: 'Expires Soon', color: 'warning' };
      default:
        return { text: status, color: 'inherit' };
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Hotel Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box
            onClick={() => {
              navigate(`/dashboard/hotel/view/${params.row._id}`);
            }}
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            {params.value}
          </Box>
        );
      }
    },
    {
      field: 'totalIncome1Year',
      headerName: 'Total Income',
      flex: 1,
      renderCell: (params) => {
        return <Box>${params.value || '0'}</Box>;
      }
    },
    {
      field: 'roomCount',
      headerName: 'Total Rooms',
      flex: 1,
      renderCell: (params) => {
        return <Box>{params.value || '0'}</Box>;
      }
    },
    {
      field: 'customerCount',
      headerName: 'Total Customer',
      flex: 1,
      renderCell: (params) => {
        return <Box>{params.value || '0'}</Box>;
      }
    },
    {
      field: 'planName',
      headerName: 'Subscription Plan',
      flex: 1,
      renderCell: (params) => {
        const hasSubscription = hasValidSubscription(params.row);
        if (!hasSubscription) {
          return <Box sx={{ color: 'text.secondary' }}>No Active Plan</Box>;
        }

        return <Box>{params.value || 'Basic Plan'}</Box>;
      }
    },
    {
      field: 'days',
      headerName: 'End Date',
      flex: 1,
      renderCell: (params) => {
        try {
          // Check if subscription info exists
          if (!hasValidSubscription(params.row)) {
            return <Box sx={{ color: 'text.secondary' }}>Not Available</Box>;
          }

          const subscription = params.row.subscriptionInfo[0];
          const startDateStr = subscription.createdDate;
          const startDate = new Date(startDateStr);

          if (isNaN(startDate.getTime())) {
            return <Box sx={{ color: 'text.secondary' }}>Invalid Date</Box>;
          }

          const days = Array.isArray(subscription.days) ? parseInt(subscription.days[0], 10) : parseInt(subscription.days, 10);

          if (isNaN(days)) {
            return <Box sx={{ color: 'text.secondary' }}>Invalid Duration</Box>;
          }

          const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
          const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
          return <Box>{endDate.toLocaleString(undefined, dateOptions)}</Box>;
        } catch (error) {
          return <Box sx={{ color: 'text.secondary' }}>Not Available</Box>;
        }
      }
    },
    {
      field: 'planStatus',
      headerName: 'Plan Status',
      flex: 1,
      renderCell: (params) => {
        // Check if subscription exists
        if (!hasValidSubscription(params.row)) {
          return <Box sx={{ color: 'text.secondary' }}>No Subscription</Box>;
        }

        const { text, color } = getPlanStatusInfo(params.value);

        return (
          <Box
            sx={{
              color: `text.secondary`,
              textTransform: 'capitalize',
              fontWeight: 500
            }}
          >
            {text}
          </Box>
        );
      }
    }
  ];

  return (
    <>
      <Container maxWidth="100%">
        <Stack direction="row" alignItems="center" my={2} justifyContent={'space-between'}>
          <Typography variant="h4">Past 3 Month Report</Typography>
        </Stack>
        <Box
          sx={{
            width: '100%',
            overflowX: 'auto',
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
            '&::-webkit-scrollbar': { display: 'none' }
          }}
        >
          <TableStyle>
            {hotelData && (
              <CustomTableStyle>
                <DataGrid
                  rows={hotelData}
                  columns={columns}
                  getRowId={(row) => row?._id}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 }
                    }
                  }}
                  pageSizeOptions={[10, 25, 50]}
                  sx={{
                    minWidth: '1200px', // Ensure content is wide enough to cause scrolling

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
            )}
          </TableStyle>
        </Box>
      </Container>
    </>
  );
};

export default OneYearReport;
