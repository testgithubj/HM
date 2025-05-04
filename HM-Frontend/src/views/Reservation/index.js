// import DryCleaningIcon from '@mui/icons-material/DryCleaning';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { Box, Button, Card, Container, FormControl, MenuItem, Select, Stack, Typography } from '@mui/material';
// import { useMediaQuery } from '@mui/system'; // Import styled from @mui/system
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import moment from 'moment';
// import { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router';
// import { getApi } from 'views/services/api';
// import Iconify from '../../ui-component/iconify';
// import TableStyle from '../../ui-component/TableStyle';
// import AddLaundary from '../Laundary/AddLaundary';
// import AddReservation from './AddReservations';

// // Create a styled Box component for custom scrollbar styling
// const Contact = () => {
//   const navigate = useNavigate();
//   const [ openAdd, setOpenAdd ] = useState( false );
//   const [ reservationData, setReservationData ] = useState( [] );
//   const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );
//   const [ filterValue, setFilterValue ] = useState( 'all' );
//   const [ openLaundryDialog, setOpenLaundryDialog ] = useState( false );
//   const isAdmin = hotel?.role === 'admin'; // Check if the user is an admin

//   const isMobile = useMediaQuery( '(max-width:1450px)' ); // for mobile devices
//   const handleOpenAdd = () => setOpenAdd( true );
//   const handleCloseAdd = () => setOpenAdd( false );

//   const handleAddFoodClick = ( reservationId ) => {
//     navigate( `/dashboard/reservation/addfood/${ reservationId }` );
//   };

//   const handleOpenview = ( reservationId ) => {
//     navigate( `/dashboard/reservation/view/${ reservationId }` );
//   };
//   const handleOpenLaundry = () => {
//     setOpenLaundryDialog( true );
//   };

//   const handleCloseLaundry = () => {
//     setOpenLaundryDialog( false );
//   };

//   console.log( reservationData?.length, 'this is for length' );

//   const shouldHidePagination = useMemo( () => !reservationData?.length || reservationData?.length <= 25, [ reservationData ] );

//   const paginationStyle = useMemo(
//     () => ( {
//       '& .css-6tekhb-MuiTablePagination-root': {
//         display: shouldHidePagination ? 'none' : 'block'
//       },
//       '& .MuiDataGrid-footer': {
//         // Add this to hide the footer
//         display: shouldHidePagination ? 'none' : 'block'
//       }
//     } ),
//     [ shouldHidePagination ]
//   );

//   const fetchReservationData = async () => {
//     try {
//       let response;
//       if ( filterValue === 'all' ) {
//         response = await getApi( `api/reservation/viewpendingandactivereservations/${ hotel?.hotelId }` );
//       } else if ( filterValue === 'active' ) {
//         response = await getApi( `api/reservation/viewallactivereservations/${ hotel?.hotelId }` );
//       } else if ( filterValue === 'pending' ) {
//         response = await getApi( `api/reservation/viewallpendingreservations/${ hotel?.hotelId }` );
//       } else if ( filterValue === 'checked-out' ) {
//         response = await getApi( `api/reservation/viewallcompletedreservations/${ hotel?.hotelId }` );
//       }
//       setReservationData( response?.data?.reservationData || [] );
//       console.log( 'response?.data?.reservationData ==>', response?.data?.reservationData );
//     } catch ( error ) {
//       console.log( error );
//     }
//   };
//   const fetchReservationDataForAdmin = async () => {
//     try {
//       let response;
//       if ( filterValue === 'all' ) {
//         response = await getApi( `api/reservation/viewallreservation/${ filterValue }` );
//       } else if ( filterValue === 'active' ) {
//         response = await getApi( `api/reservation/viewallreservation/${ filterValue }` );
//       } else if ( filterValue === 'pending' ) {
//         response = await getApi( `api/reservation/viewallreservation/${ filterValue }` );
//       } else if ( filterValue === 'checked-out' ) {
//         response = await getApi( `api/reservation/viewallreservation/${ filterValue }` );
//       }
//       setReservationData( response?.data?.reservationData || [] );
//       console.log( 'response?.data?.reservationData ==>', response?.data?.reservationData || [] );
//     } catch ( error ) {
//       console.log( error );
//     }
//   };

//   useEffect( () => {
//     if ( isAdmin ) {
//       fetchReservationDataForAdmin();
//     } else {
//       fetchReservationData();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ openAdd, filterValue, isAdmin ] );

//   const role = JSON.parse( localStorage.getItem( 'hotelData' ) )?.role;

//   const columns = [
//     {
//       field: 'serialNo',
//       headerName: 'Serial No',
//       flex: 0.5,
//       cellClassName: 'name-column--cell--capitalize',
//       renderCell: ( params ) => <Box sx={ { textAlign: 'center', width: '100%' } }>{ params.value }</Box>,
//       headerAlign: 'center', // Center-align the header
//       align: 'center' // Center-align the cells
//     },
//     ...( role === 'admin'
//       ? [
//         {
//           field: 'hotelId',
//           headerName: 'Hotel Name',
//           flex: 1,
//           cellClassName: 'name-column--cell--capitalize',
//           renderCell: ( params ) => (
//             console.log( 'params?.value?.name ==>', params ),
//             ( <Box sx={ { textAlign: 'center', width: '100%' } }>{ params?.row?.hotelName || '-' }</Box> )
//           ),
//           headerAlign: 'center',
//           align: 'center'
//         }
//       ]
//       : [] ),

//     // {
//     //   field: 'hotelName',
//     //   headerName: 'Hotel Name',
//     //   flex: 0.5,
//     //   cellClassName: 'name-column--cell--capitalize',
//     //   renderCell: (params) => <Box sx={{ textAlign: 'center', width: '100%' }}>{params.value}</Box>,
//     //   headerAlign: 'center', // Center-align the header
//     //   align: 'center' // Center-align the cells
//     // },
//     {
//       field: 'roomNo',
//       headerName: 'Room No',
//       flex: 1,
//       cellClassName: 'name-column--cell name-column--cell--capitalize ',

//       renderCell: ( params ) => {
//         const handleOpenOnClick = () => {
//           navigate( `/dashboard/reservation/view/${ params.row._id }` );
//         };
//         return (
//           <Box onClick={ () => handleOpenOnClick() } sx={ { cursor: 'pointer', color: '#364152' } }>
//             { params.value }
//           </Box>
//         );
//       }
//     },
//     {
//       field: 'fullName',
//       headerName: 'Guest',
//       flex: 1,
//       cellClassName: 'name-column--cell name-column--cell--capitalize',
//       renderCell: ( params ) => {
//         const customerDetails = params?.row?.customerDetails;
//         const handleOpenOnClick = () => {
//           console.log( 'params.row._id ==>', params.row._id );

//           navigate( `/dashboard/reservation/view/${ params.row._id }` );
//         };
//         return (
//           <Box onClick={ handleOpenOnClick }>
//             <div
//               style={ { fontWeight: 'bold', color: '#846cf9', cursor: 'pointer' } }
//             >{ `${ customerDetails?.firstName } ${ customerDetails?.lastName }` }</div>
//             <div style={ { marginTop: '4px', fontSize: '12px', color: '#777' } }>{ customerDetails?.phoneNumber }</div>
//           </Box>
//         );
//       }
//     },
//     {
//       field: 'checkInDate',
//       headerName: 'Check-In Date',
//       flex: 1,
//       cellClassName: 'name-column--cell--capitalize',
//       renderCell: ( params ) => {
//         return <Box>{ moment( params?.value ).format( 'YYYY-MM-DD' ) }</Box>;
//       }
//     },
//     {
//       field: 'checkOutDate',
//       headerName: 'Check-Out Date',
//       flex: 1,
//       cellClassName: 'name-column--cell--capitalize',
//       renderCell: ( params ) => {
//         return <Box>{ moment( params?.value ).format( 'YYYY-MM-DD' ) }</Box>;
//       }
//     },
//     {
//       field: 'totalPayment',
//       headerName: 'Total Amount',
//       flex: 1,
//       renderCell: ( params ) => {
//         console.log( params, 'Total Amount' );
//         return <Box>$ { params?.row?.totalAmount }</Box>;
//       }
//     },
//     {
//       field: 'advanceAmount',
//       headerName: 'Advance Amount',
//       flex: 1,
//       renderCell: ( params ) => {
//         return <Box>$ { params?.row?.advanceAmount }</Box>;
//       }
//     },
//     {
//       field: 'totalAmount',
//       headerName: 'Remaining Amount',
//       flex: 1,
//       renderCell: ( params ) => {
//         const remaining = ( params?.row?.totalAmount || 0 ) - ( params?.row?.advanceAmount || 0 );
//         return <Box>$ { remaining }</Box>;
//       }
//     },
//     {
//       field: 'status',
//       headerName: 'Room Status',
//       flex: 1,
//       renderCell: ( params ) => {
//         return (
//           <Box
//             sx={
//               params?.value?.toLowerCase() == 'active'
//                 ? {
//                   backgroundColor: '#01B574',
//                   color: 'white',
//                   padding: '4px',
//                   borderRadius: '5px'
//                 }
//                 : params?.value?.toLowerCase() == 'pending'
//                   ? {
//                     backgroundColor: '#ECC94B',
//                     color: 'white',
//                     padding: '4px',
//                     borderRadius: '5px'
//                   }
//                   : {
//                     backgroundColor: '#eb7b74',
//                     color: 'white',
//                     padding: '4px',
//                     borderRadius: '5px'
//                   }
//             }
//           >
//             { params?.value === 'checked-out' ? 'Completed' : params?.value }
//           </Box>
//         );
//       }
//     },

//     {
//       field: 'addFood',
//       headerName: 'Add Food',
//       flex: 1,
//       renderCell: ( params ) => {
//         return params.row.status === 'active' ? (
//           <Button
//             variant="contained"
//             startIcon={ <Iconify icon="mdi:food" /> } // Food icon
//             onClick={ () => handleAddFoodClick( params.row._id ) }
//           />
//         ) : (
//           <Box sx={ { textAlign: 'center' } }>-</Box>
//         );
//       }
//     },
//     {
//       field: 'addLaundry',
//       headerName: 'Add Laundry',
//       flex: 1,
//       renderCell: ( params ) => {
//         return params.row.status === 'active' ? (
//           <Button
//             variant="contained"
//             startIcon={ <DryCleaningIcon sx={ { fontSize: 20 } } /> }
//             onClick={ handleOpenLaundry } // Open dialog when clicked
//           />
//         ) : (
//           <Box sx={ { textAlign: 'center' } }>-</Box>
//         );
//       }
//     },
//     {
//       field: 'action',
//       headerName: 'Action',
//       flex: 1,
//       renderCell: ( params ) => {
//         return (
//           <MenuItem onClick={ () => handleOpenview( params.row._id ) } disableRipple>
//             <VisibilityIcon style={ { marginRight: '8px', fontSize: '20px' } } />
//           </MenuItem>
//         );
//       }
//     }
//   ];
//   const filteredColumns = isAdmin ? columns.filter( ( col ) => col.field !== 'addFood' && col.field !== 'addLaundry' ) : columns;
//   return (
//     <>
//       <AddReservation open={ openAdd } handleClose={ handleCloseAdd } />
//       <Container
//         maxWidth="100%"
//         sx={ {
//           paddingLeft: '0px !important',
//           paddingRight: '0px !important'
//         } }
//       >
//         {/* Responsive Header Section */ }
//         <Stack
//           direction={ { xs: 'column', sm: 'row' } }
//           alignItems={ { xs: 'flex-start', sm: 'center' } }
//           justifyContent="space-between"
//           sx={ {
//             backgroundColor: '#fff',
//             fontSize: '16px',
//             fontWeight: '500',
//             padding: '10px',
//             borderRadius: '5px',
//             marginBottom: '10px',
//             boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)'
//           } }
//         >
//           <Typography
//             variant="h6"
//             sx={ {
//               fontSize: { xs: '14px', sm: '18px' },
//               marginBottom: { xs: '10px', sm: '0px' },
//               width: '100%'
//             } }
//           >
//             Room Reservation
//           </Typography>

//           {/* Filter and Add Button Container */ }
//           <Stack
//             direction="row"
//             alignItems="center"
//             justifyContent={ { xs: 'center', sm: 'flex-end' } }
//             spacing={ 1.5 }
//             sx={ { width: '100%', flexWrap: 'wrap' } }
//           >
//             {/* Filter Dropdown */ }
//             <FormControl
//               sx={ {
//                 minWidth: { xs: 90, sm: 120 },
//                 backgroundColor: '#fff',
//                 borderRadius: '6px'
//               } }
//             >
//               <Select
//                 labelId="filter-label"
//                 id="filter"
//                 value={ filterValue }
//                 onChange={ ( e ) => setFilterValue( e.target.value ) }
//                 sx={ {
//                   '& .MuiSelect-select': {
//                     borderRadius: '5px',
//                     padding: { xs: '4px 8px', sm: '6px 12px' },
//                     fontSize: { xs: '12px', sm: '14px' },
//                     color: '#121926',
//                     fontWeight: '500',
//                     border: '1px solid #e0e0e0'
//                   }
//                 } }
//               >
//                 <MenuItem value="all">All</MenuItem>
//                 <MenuItem value="active">Active</MenuItem>
//                 <MenuItem value="pending">Pending</MenuItem>
//                 <MenuItem value="checked-out">Completed</MenuItem>
//               </Select>
//             </FormControl>

//             {/* Add Reservation Button */ }
//             <Button
//               variant="contained"
//               startIcon={ <Iconify icon="eva:plus-fill" /> }
//               onClick={ handleOpenAdd }
//               sx={ {
//                 fontSize: { xs: '12px', sm: '14px' },
//                 padding: { xs: '4px 6px', sm: '8px 16px' },
//                 minWidth: 'auto',
//                 maxWidth: '100%',
//                 whiteSpace: 'nowrap'
//               } }
//             >
//               Add Reservation
//             </Button>
//           </Stack>
//         </Stack>

//         {/* Table Section */ }
//         <TableStyle>
//           <Box>
//             <Card
//               sx={ {
//                 ...paginationStyle,
//                 minWidth: '100%',
//                 paddingTop: '15px',
//                 boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
//                 borderRadius: '5px',
//                 overflowX: 'auto',
//                 '&::-webkit-scrollbar': {
//                   width: '0',
//                   height: '0'
//                 },
//                 '&::-webkit-scrollbar-track': {
//                   backgroundColor: 'transparent'
//                 },
//                 '&::-webkit-scrollbar-thumb': {
//                   backgroundColor: 'transparent'
//                 },
//                 '*': {
//                   scrollbarWidth: 'none'
//                 },
//                 msOverflowStyle: 'none'
//               } }
//             >
//               <DataGrid
//                 rows={ reservationData?.map( ( row, index ) => ( { ...row, serialNo: index + 1 } ) ) }
//                 columns={ columns?.map( ( col ) => ( {
//                   ...col,
//                   flex: 1,
//                   minWidth: isMobile ? 150 : 100,
//                   hide: window?.innerWidth < 400 ? col.field !== 'serialNo' : false
//                 } ) ) }
//                 components={ { Toolbar: GridToolbar } }
//                 getRowId={ ( row ) => row?._id }
//                 sx={ {
//                   minHeight: 400,
//                   minWidth: '1200px',
//                   // ...paginationStyle,
//                   fontSize: { xs: '12px', sm: '12px', lg: '14px' },
//                   '& .MuiDataGrid-columnHeaders': {
//                     backgroundColor: '#f5f5f5',
//                     fontSize: { xs: '12px', sm: '14px' }
//                   },
//                   '& .MuiDataGrid-cell': {
//                     padding: { xs: '4px', sm: '8px' }, // Adjust padding
//                     wordBreak: 'break-word', // prevent text overflow in cells
//                     whiteSpace: 'nowrap',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis'
//                   },
//                   '& .MuiDataGrid-root': {
//                     overflowX: 'auto' // Ensure scrollability
//                   }
//                 } }
//               />
//             </Card>
//           </Box>
//         </TableStyle>
//       </Container>

//       {/* Additional Components */ }
//       <AddLaundary open={ openLaundryDialog } handleClose={ handleCloseLaundry } />
//     </>
//   );
// };

// export default Contact;
import DryCleaningIcon from '@mui/icons-material/DryCleaning';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Card, Container, FormControl, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/system';
import { styled } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { getApi } from 'views/services/api';
import Iconify from '../../ui-component/iconify';
import AddLaundary from '../Laundary/AddLaundary';
import AddReservation from './AddReservations';

// Improved styled component for table with proper scrolling
const EnhancedTableContainer = styled(Box)(({ theme }) => ({
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

const Contact = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [reservationData, setReservationData] = useState([]);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const [filterValue, setFilterValue] = useState('all');
  const [openLaundryDialog, setOpenLaundryDialog] = useState(false);
  const isAdmin = hotel?.role === 'admin';

  // Media queries for responsive design
  const isMobile = useMediaQuery('(max-width:1450px)');
  const isLaptop = useMediaQuery('(min-width:768px) and (max-width:1700px)');
  const isLargeScreen = useMediaQuery('(min-width:1701px)');

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleAddFoodClick = (reservationId) => {
    navigate(`/dashboard/reservation/addfood/${reservationId}`);
  };

  const handleOpenview = (reservationId) => {
    navigate(`/dashboard/reservation/view/${reservationId}`);
  };
  
  const handleOpenLaundry = () => {
    setOpenLaundryDialog(true);
  };

  const handleCloseLaundry = () => {
    setOpenLaundryDialog(false);
  };

  const shouldHidePagination = useMemo(
    () => !reservationData?.length || reservationData?.length <= 25,
    [reservationData]
  );

  const paginationStyle = useMemo(
    () => ({
      '& .css-6tekhb-MuiTablePagination-root': {
        display: shouldHidePagination ? 'none' : 'block'
      },
      '& .MuiDataGrid-footer': {
        display: shouldHidePagination ? 'none' : 'block'
      }
    }),
    [shouldHidePagination]
  );

  const fetchReservationData = async () => {
    try {
      let response;
      if (filterValue === 'all') {
        response = await getApi(`api/reservation/viewpendingandactivereservations/${hotel?.hotelId}`);
      } else if (filterValue === 'active') {
        response = await getApi(`api/reservation/viewallactivereservations/${hotel?.hotelId}`);
      } else if (filterValue === 'pending') {
        response = await getApi(`api/reservation/viewallpendingreservations/${hotel?.hotelId}`);
      } else if (filterValue === 'checked-out') {
        response = await getApi(`api/reservation/viewallcompletedreservations/${hotel?.hotelId}`);
      }
      setReservationData(response?.data?.reservationData || []);
    } catch (error) {
      console.log(error);
    }
  };
  
  const fetchReservationDataForAdmin = async () => {
    try {
      let response;
      if (filterValue === 'all') {
        response = await getApi(`api/reservation/viewallreservation/${filterValue}`);
      } else if (filterValue === 'active') {
        response = await getApi(`api/reservation/viewallreservation/${filterValue}`);
      } else if (filterValue === 'pending') {
        response = await getApi(`api/reservation/viewallreservation/${filterValue}`);
      } else if (filterValue === 'checked-out') {
        response = await getApi(`api/reservation/viewallreservation/${filterValue}`);
      }
      setReservationData(response?.data?.reservationData || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchReservationDataForAdmin();
    } else {
      fetchReservationData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAdd, filterValue, isAdmin]);

  const role = JSON.parse(localStorage.getItem('hotelData'))?.role;

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 0.5,
      minWidth: 100,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => <Box sx={{ textAlign: 'center', width: '100%' }}>{params.value}</Box>,
      headerAlign: 'center',
      align: 'center'
    },
    ...(role === 'admin'
      ? [
          {
            field: 'hotelId',
            headerName: 'Hotel Name',
            flex: 1,
            minWidth: 150,
            cellClassName: 'name-column--cell--capitalize',
            renderCell: (params) => (
              <Box sx={{ textAlign: 'center', width: '100%' }}>{params?.row?.hotelName || '-'}</Box>
            ),
            headerAlign: 'center',
            align: 'center'
          }
        ]
      : []),
    {
      field: 'roomNo',
      headerName: 'Room No',
      flex: 1,
      minWidth: 120,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        const handleOpenOnClick = () => {
          navigate(`/dashboard/reservation/view/${params.row._id}`);
        };
        return (
          <Box onClick={() => handleOpenOnClick()} sx={{ cursor: 'pointer', color: '#364152' }}>
            {params.value}
          </Box>
        );
      }
    },
    {
      field: 'fullName',
      headerName: 'Guest',
      flex: 1,
      minWidth: 180,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        const customerDetails = params?.row?.customerDetails;
        const handleOpenOnClick = () => {
          navigate(`/dashboard/reservation/view/${params.row._id}`);
        };
        return (
          <Box onClick={handleOpenOnClick}>
            <div style={{ fontWeight: 'bold', color: '#846cf9', cursor: 'pointer' }}>
              {`${customerDetails?.firstName} ${customerDetails?.lastName}`}
            </div>
            <div style={{ marginTop: '4px', fontSize: '12px', color: '#777' }}>
              {customerDetails?.phoneNumber}
            </div>
          </Box>
        );
      }
    },
    {
      field: 'checkInDate',
      headerName: 'Check-In Date',
      flex: 1,
      minWidth: 140,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => {
        return <Box>{moment(params?.value).format('YYYY-MM-DD')}</Box>;
      }
    },
    {
      field: 'checkOutDate',
      headerName: 'Check-Out Date',
      flex: 1,
      minWidth: 140,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => {
        return <Box>{moment(params?.value).format('YYYY-MM-DD')}</Box>;
      }
    },
    {
      field: 'totalPayment',
      headerName: 'Total Amount',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        return <Box>$ {params?.row?.totalAmount}</Box>;
      }
    },
    {
      field: 'advanceAmount',
      headerName: 'Advance Amount',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return <Box>$ {params?.row?.advanceAmount}</Box>;
      }
    },
    {
      field: 'totalAmount',
      headerName: 'Remaining Amount',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const remaining = (params?.row?.totalAmount || 0) - (params?.row?.advanceAmount || 0);
        return <Box>$ {remaining}</Box>;
      }
    },
    {
      field: 'status',
      headerName: 'Room Status',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        return (
          <Box
            sx={
              params?.value?.toLowerCase() == 'active'
                ? {
                    backgroundColor: '#01B574',
                    color: 'white',
                    padding: '4px',
                    borderRadius: '5px'
                  }
                : params?.value?.toLowerCase() == 'pending'
                ? {
                    backgroundColor: '#ECC94B',
                    color: 'white',
                    padding: '4px',
                    borderRadius: '5px'
                  }
                : {
                    backgroundColor: '#eb7b74',
                    color: 'white',
                    padding: '4px',
                    borderRadius: '5px'
                  }
            }
          >
            {params?.value === 'checked-out' ? 'Completed' : params?.value}
          </Box>
        );
      }
    },
    {
      field: 'addFood',
      headerName: 'Add Food',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return params.row.status === 'active' ? (
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:food" />}
            onClick={() => handleAddFoodClick(params.row._id)}
          />
        ) : (
          <Box sx={{ textAlign: 'center' }}>-</Box>
        );
      }
    },
    {
      field: 'addLaundry',
      headerName: 'Add Laundry',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        return params.row.status === 'active' ? (
          <Button
            variant="contained"
            startIcon={<DryCleaningIcon sx={{ fontSize: 20 }} />}
            onClick={handleOpenLaundry}
          />
        ) : (
          <Box sx={{ textAlign: 'center' }}>-</Box>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <MenuItem onClick={() => handleOpenview(params.row._id)} disableRipple>
            <VisibilityIcon style={{ marginRight: '8px', fontSize: '20px' }} />
          </MenuItem>
        );
      }
    }
  ];

  const filteredColumns = isAdmin 
    ? columns.filter((col) => col.field !== 'addFood' && col.field !== 'addLaundry') 
    : columns;

  return (
    <>
      <AddReservation open={openAdd} handleClose={handleCloseAdd} />
      <Container
        maxWidth="100%"
        sx={{
          paddingLeft: '0px !important',
          paddingRight: '0px !important'
        }}
      >
        {/* Responsive Header Section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          sx={{
            backgroundColor: '#fff',
            fontSize: '16px',
            fontWeight: '500',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px',
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '14px', sm: '18px' },
              marginBottom: { xs: '10px', sm: '0px' },
              width: '100%'
            }}
          >
            Room Reservation
          </Typography>

          {/* Filter and Add Button Container */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={{ xs: 'center', sm: 'flex-end' }}
            spacing={1.5}
            sx={{ width: '100%', flexWrap: 'wrap' }}
          >
            {/* Filter Dropdown */}
            <FormControl
              sx={{
                minWidth: { xs: 90, sm: 120 },
                backgroundColor: '#fff',
                borderRadius: '6px'
              }}
            >
              <Select
                labelId="filter-label"
                id="filter"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                sx={{
                  '& .MuiSelect-select': {
                    borderRadius: '5px',
                    padding: { xs: '4px 8px', sm: '6px 12px' },
                    fontSize: { xs: '12px', sm: '14px' },
                    color: '#121926',
                    fontWeight: '500',
                    border: '1px solid #e0e0e0'
                  }
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="checked-out">Completed</MenuItem>
              </Select>
            </FormControl>

            {/* Add Reservation Button */}
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAdd}
              sx={{
                fontSize: { xs: '12px', sm: '14px' },
                padding: { xs: '4px 6px', sm: '8px 16px' },
                minWidth: 'auto',
                maxWidth: '100%',
                whiteSpace: 'nowrap'
              }}
            >
              Add Reservation
            </Button>
          </Stack>
        </Stack>

        {/* Table Section with improved scrolling */}
        <EnhancedTableContainer>
          <Card
            sx={{
              width: '100%',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
              borderRadius: '5px',
              overflow: 'hidden', // Hide overflow from Card itself
              height: 400
            }}
          >
            <Box sx={{ 
              overflowX: 'auto',  // This is key for horizontal scrolling
              '&::-webkit-scrollbar': {
                height: '8px'
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f0f0f0'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c1c1c1',
                borderRadius: '4px'
              }
            }}>
              <DataGrid
                rows={reservationData?.map((row, index) => ({ ...row, serialNo: index + 1 }))}
                columns={filteredColumns}
                components={{ Toolbar: GridToolbar }}
                getRowId={(row) => row?._id}
                autoHeight // Allow the grid to adjust its height
                disableColumnMenu={false}
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-main': {
                    overflow: 'visible' // Important for horizontal scrolling
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    overflow: 'visible !important' // Important for horizontal scrolling
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    fontSize: { xs: '12px', sm: '14px' }
                  },
                  '& .MuiDataGrid-cell': {
                    padding: { xs: '4px', sm: '8px' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  },
                  // Force minimum width to ensure scrollbars appear
                  minWidth: filteredColumns.reduce((acc, col) => acc + (col.minWidth || 100), 0),
                  '&.MuiDataGrid-root': {
                    border: 'none'
                  },
                  ...paginationStyle
                }}
                pageSize={25}
                rowsPerPageOptions={[25, 50, 100]}
              />
            </Box>
          </Card>
        </EnhancedTableContainer>
      </Container>

      {/* Additional Components */}
      <AddLaundary open={openLaundryDialog} handleClose={handleCloseLaundry} />
    </>
  );
};

export default Contact;