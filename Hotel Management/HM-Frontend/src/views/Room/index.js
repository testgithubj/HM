// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import EditIcon from '@mui/icons-material/Edit';
// import Iconify from '../../ui-component/iconify';
// import TableStyle from '../../ui-component/TableStyle';
// import { useState, useEffect } from 'react';
// import { Stack, Button, Container, Typography, Box, Card, Popover, useMediaQuery } from '@mui/material';

// import DeleteIcon from '@mui/icons-material/Delete';
// import * as React from 'react';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import MenuItem from '@mui/material/MenuItem';
// import { getApi } from 'views/services/api';
// import IconButton from '@mui/material/IconButton';
// import EditRoom from './EditRoom';
// import moment from 'moment';
// import AddRoom from './AddRoom.js';
// import ReserveRoom from './ReserveRoom';
// import DeleteRoom from './DeleteRoom';
// import { styled } from '@mui/system';
// import { useMemo } from 'react';

// const RoomManagement = () => {
//   const [ openAdd, setOpenAdd ] = useState( false );
//   const [ openEdit, setOpenEdit ] = useState( false );
//   const [ openDelete, setOpenDelete ] = useState( false );
//   const [ anchorEl, setAnchorEl ] = React.useState( null );
//   const [ roomData, setroomData ] = useState( [] );
//   const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );
//   const [ openReservationDialog, setOpenReservationDialog ] = useState( false );
//   const [ propsRoomData, setPropsRoomData ] = useState( [] );
//   const [ rowData, setRowData ] = useState();
//   const isAdmin = hotel?.role === 'admin';
//   const isMobile = useMediaQuery( '(max-width:1450px)' );


//   const role = JSON.parse( localStorage.getItem( 'hotelData' ) ).role;
//   const shouldHidePagination = useMemo( () => !roomData?.length || roomData?.length <= 25, [ roomData ] );

//   const paginationStyle = useMemo(
//     () => ( {
//       '& .css-6tekhb-MuiTablePagination-root': {
//         display: shouldHidePagination ? 'none' : 'block',
//       },
//       '& .MuiDataGrid-footer': { // Add this to hide the footer
//         display: shouldHidePagination ? 'none' : 'block'
//       },
//     } ),
//     [ shouldHidePagination ]
//   );

//   // Create a styled Box component for custom scrollbar styling
//   // const CustomTableStyle = styled(Box)(({ theme }) => ({
//   //   width: '100%',
//   //   overflowX: 'auto',

//   //   // Media query for mobile devices (max-width: 600px)
//   //   [`@media (max-width: 600px)`]: {
//   //     // Styling for Webkit browsers (Chrome, Safari, Edge) to *hide* the scrollbar
//   //     '&::-webkit-scrollbar': {
//   //       width: '0', // Set width to 0 to hide
//   //       height: '0', // Set height to 0 to hide
//   //     },
//   //     '&::-webkit-scrollbar-track': {
//   //       backgroundColor: 'transparent', // Make the track transparent
//   //     },
//   //     '&::-webkit-scrollbar-thumb': {
//   //       backgroundColor: 'transparent', // Make the thumb transparent
//   //     },
//   //     // Styling for Firefox to *hide* the scrollbar
//   //     '*': {
//   //       scrollbarWidth: 'none', // This hides the scrollbar in Firefox
//   //     },
//   //     msOverflowStyle: 'none', // Hide the scrollbar in IE and Edge (legacy)
//   //   },
//   // }));


//   // Create a styled Box component for custom scrollbar styling
//   const CustomTableStyle = styled( Box )( ( { theme } ) => ( {
//     width: '100%',
//     overflowX: 'auto',

//     // Styling for Webkit browsers (Chrome, Safari, Edge) to hide the scrollbar
//     '&::-webkit-scrollbar': {
//       width: '0',  // Set width to 0 to hide
//       height: '0', // Set height to 0 to hide
//     },
//     '&::-webkit-scrollbar-track': {
//       backgroundColor: 'transparent',  // Make the track transparent
//     },
//     '&::-webkit-scrollbar-thumb': {
//       backgroundColor: 'transparent',  // Make the thumb transparent
//     },
//     // Styling for Firefox to hide the scrollbar
//     '*': {  // Apply to all elements within
//       scrollbarWidth: 'none', // This hides the scrollbar in Firefox
//     },
//     msOverflowStyle: 'none',  // Hide the scrollbar in IE and Edge (legacy)
//   } ) );

//   //function for the dropdowns
//   const handleClick = ( event, row ) => {
//     setAnchorEl( event.currentTarget );
//     setRowData( row );
//   };

//   const handleClose = () => {
//     setAnchorEl( null );
//   };

//   const open = Boolean( anchorEl );

//   // Delete room dialog
//   const handleOpenDeleteRoomDialog = ( row ) => {
//     setRowData( row );
//     setOpenDelete( true );
//   };

//   const handleCloseDeleteRoomDialog = () => {
//     setOpenDelete( false );
//     handleClose();
//   };

//   const handleOpenEditRoom = ( row ) => {
//     setRowData( row );
//     setOpenEdit( true );
//   };

//   // Add room dialog
//   const handleOpenAddRoom = () => setOpenAdd( true );
//   const handleCloseAddRoom = () => {
//     setOpenAdd( false );
//     fetchroomData(); // Explicitly refetch room data
//   };

//   // Edit room dialog
//   const handleCloseEditRoom = () => {
//     setOpenEdit( false );
//     handleClose();
//   };

//   // Book room dialog
//   const handleOpenBookRoom = ( roomData ) => {
//     setPropsRoomData( roomData );
//     setOpenReservationDialog( true );
//   };

//   const handleCloseBookRoom = () => {
//     setOpenReservationDialog( false );
//   };

//   // Function for fetching all the rooms data from the db
//   const fetchroomData = async () => {
//     try {
//       const response = await getApi( `api/room/viewallrooms/${ hotel?.hotelId }` );

//       console.log( response.data, 'this is data for room management' )
//       setroomData( response?.data );
//     } catch ( error ) {
//       console.log( error );
//     }
//   };

//   const fetchroomDataForAdmin = async () => {
//     try {
//       const response = await getApi( `api/room/viewallrooms` );
//       setroomData( response?.data );
//     } catch ( error ) {
//       console.log( error );
//     }
//   };

//   useEffect( () => {
//     fetchroomData();
//   }, [ openAdd, openEdit, openDelete, openReservationDialog ] );

//   useEffect( () => {
//     if ( isAdmin ) {
//       fetchroomDataForAdmin();
//     } else {
//       fetchroomData();
//     }
//   }, [ openAdd, openEdit, openDelete ] );

//   const columns = [
//     {
//       field: 'serialNo',
//       headerName: 'Serial No',
//       flex: 0.5,
//       renderCell: ( params ) => <Box sx={ { textAlign: 'center' } }>{ params.value }</Box>,
//       headerAlign: 'center',
//       align: 'center'
//     },
//     {
//       field: 'roomNo',
//       headerName: 'Room No',
//       flex: 1
//     },

//     ...( role === 'admin'
//       ? [
//         {
//           field: 'hotelId',
//           headerName: 'Hotel Name',
//           flex: 1,
//           cellClassName: 'name-column--cell--capitalize',
//           renderCell: ( params ) => (
//             <Box sx={ { textAlign: 'center', width: '100%' } }>
//               { params?.row?.hotelId?.name || '-' }
//             </Box>
//           ),
//           headerAlign: 'center',
//           align: 'center',
//         },
//       ]
//       : [] ),

//     {
//       field: 'roomType',
//       headerName: 'Room Type',
//       flex: 1
//     },
//     {
//       field: 'amount',
//       headerName: 'Room Amount',
//       flex: 1,
//       renderCell: ( params ) => <Box>${ params.value }</Box>
//     },
//     {
//       field: 'bookingStatus',
//       headerName: 'Booking Status',
//       flex: 1,
//       renderCell: ( params ) => {
//         console.log( params?.value, 'this is the vaulu  sdffjsfhaisfhijudfauihfh' );
//         return params?.value === 'false' ? (
//           <Button variant="contained" onClick={ () => handleOpenBookRoom( params.row ) } >
//             Book Room
//           </Button>
//         ) : (
//           <Button sx={ { paddingX: '10px' } } variant="contained" disabled>
//             Room Booked
//           </Button>
//         );
//       }
//     },
//     {
//       field: 'checkIn',
//       headerName: 'Check In',
//       flex: 1,
//       renderCell: ( params ) => {
//         return params?.value ? <Box>{ moment( params?.value ).format( 'YYYY-MM-DD' ) }</Box> : <Box>-</Box>;
//       }
//     },
//     {
//       field: 'checkOut',
//       headerName: 'Check Out',
//       flex: 1,
//       renderCell: ( params ) => {
//         return params?.value ? <Box>{ moment( params?.value ).format( 'YYYY-MM-DD' ) }</Box> : <Box>-</Box>;
//       }
//     },
//     {
//       field: 'ac',
//       headerName: 'AC',
//       flex: 0.5,
//       renderCell: ( params ) => {
//         return <Box>{ params.value === 'AC' ? 'Yes' : 'No' }</Box>;
//       }
//     },
//     {
//       field: 'smoking',
//       headerName: 'Smoking',
//       flex: 1,
//       renderCell: ( params ) => {
//         return <Box>{ params.value === 'Smoking' ? 'Yes' : 'No' }</Box>;
//       }
//     },
//     {
//       field: 'action',
//       headerName: 'Action',
//       flex: 1,
//       renderCell: ( params ) => {
//         return (
//           <div style={ { display: 'flex', justifyContent: 'center' } }>
//             <MenuItem onClick={ () => handleOpenEditRoom( params.row ) } disableRipple>
//               <EditIcon style={ { fontSize: '20px' } } />
//             </MenuItem>
//             <MenuItem onClick={ () => handleOpenDeleteRoomDialog( params.row ) } sx={ { color: 'red' } } disableRipple>
//               <DeleteIcon style={ { color: '#f44336', fontSize: '20px' } } />
//             </MenuItem>
//           </div>
//         );
//       }
//     }
//   ];

//   return (
//     <>
//       <ReserveRoom open={ openReservationDialog } handleClose={ handleCloseBookRoom } roomDataByProps={ propsRoomData } />
//       <AddRoom open={ openAdd } handleClose={ handleCloseAddRoom } />
//       <DeleteRoom open={ openDelete } handleClose={ handleCloseDeleteRoomDialog } id={ rowData?._id } />
//       <EditRoom open={ openEdit } handleClose={ handleCloseEditRoom } data={ rowData } />
//       <Container maxWidth="100%" sx={ { paddingLeft: 0, paddingRight: 0 } }>
//         <Stack
//           direction="row"
//           alignItems="center"
//           mb={ 6 }
//           justifyContent="space-between"
//           sx={ {
//             backgroundColor: '#fff',
//             fontSize: '18px',
//             fontWeight: '500',
//             padding: '15px',
//             borderRadius: '5px',
//             marginBottom: '20px',
//             boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
//             '@media (max-width: 320px)': {
//               flexDirection: 'column',
//               textAlign: 'center',
//               fontSize: '14px', // Smaller font size on very small screens
//               padding: '10px'
//             },
//             '@media (min-width: 321px) and (max-width: 600px)': {
//               flexDirection: 'column',
//               textAlign: 'center',
//               fontSize: '16px', // Adjust font size for slightly larger devices
//               padding: '12px'
//             },
//             '@media (min-width: 601px)': {
//               flexDirection: 'row', // Default layout for devices larger than 600px
//               textAlign: 'left',
//               fontSize: '18px', // Normal font size for larger devices
//               padding: '15px'
//             }
//           } }
//         >
//           <Typography variant="h4">Room Management</Typography>
//           <Stack direction="row" alignItems="center" justifyContent={ 'flex-end' } spacing={ 2 }>
//             <Button
//               variant="contained"
//               startIcon={ <Iconify icon="eva:plus-fill" /> }
//               onClick={ handleOpenAddRoom }
//               sx={ {
//                 fontSize: { xs: '12px', sm: '14px' }, // Reduce font size on small screens
//                 padding: { xs: '4px 6px', sm: '8px 16px' },
//                 minWidth: 'auto',
//                 maxWidth: '100%',
//                 whiteSpace: 'nowrap',
//               } }
//             >
//               Add Room
//             </Button>

//           </Stack>
//         </Stack>

//         <TableStyle>
//           <Box width="100%" >
//             <CustomTableStyle >

//               <Card
//                 sx={ {
//                   minWidth: '100%',
//                   paddingTop: '15px',
//                   boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
//                   borderRadius: '5px',
//                   overflowX: 'auto',
//                   '&::-webkit-scrollbar': {
//                     width: '0',
//                     height: '0',
//                   },
//                   '&::-webkit-scrollbar-track': {
//                     backgroundColor: 'transparent',
//                   },
//                   '&::-webkit-scrollbar-thumb': {
//                     backgroundColor: 'transparent',
//                   },
//                   '*': {
//                     scrollbarWidth: 'none',
//                   },
//                   msOverflowStyle: 'none',
//                 } }
//               >
//                 { roomData && (
//                   <DataGrid
//                     rows={ roomData?.map( ( row, index ) => ( { ...row, serialNo: index + 1 } ) ) }
//                     columns={ columns?.map( ( col ) => ( {
//                       ...col,
//                       flex: 1,
//                       minWidth: isMobile ? 150 : 100,
//                       hide: isMobile ? col.field !== 'serialNo' : false,
//                     } ) ) }
//                     getRowId={ ( row ) => row?._id }
//                     slots={ { toolbar: GridToolbar } }
//                     slotProps={ { toolbar: { showQuickFilter: true } } }
//                     sx={ {
//                       minHeight: 400,
//                       minWidth: '1200px',
//                       ...paginationStyle,
//                       fontSize: { xs: '12px', sm: '12px', lg: '14px' },
//                       '& .MuiDataGrid-columnHeaders': {
//                         backgroundColor: '#f5f5f5',
//                         fontSize: { xs: '12px', sm: '14px' }
//                       },
//                       '& .MuiDataGrid-cell': {
//                         padding: { xs: '4px', sm: '8px' }, // Adjust padding
//                         wordBreak: 'break-word',// prevent text overflow in cells
//                         whiteSpace: 'nowrap',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',

//                       },
//                       '& .MuiDataGrid-root': {
//                         overflowX: 'auto' // Ensure scrollability
//                       }
//                     } }
//                   />
//                 ) }
//               </Card>
//             </CustomTableStyle>

//           </Box>
//         </TableStyle>
//       </Container>
//     </>
//   );
// };

// export default RoomManagement;
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Popover, useMediaQuery } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import { getApi } from 'views/services/api';
import IconButton from '@mui/material/IconButton';
import EditRoom from './EditRoom';
import moment from 'moment';
import AddRoom from './AddRoom.js';
import ReserveRoom from './ReserveRoom';
import DeleteRoom from './DeleteRoom';
import { styled } from '@mui/system';
import { useMemo } from 'react';

const RoomManagement = () => {
  const [ openAdd, setOpenAdd ] = useState( false );
  const [ openEdit, setOpenEdit ] = useState( false );
  const [ openDelete, setOpenDelete ] = useState( false );
  const [ anchorEl, setAnchorEl ] = React.useState( null );
  const [ roomData, setroomData ] = useState( [] );
  const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );
  const [ openReservationDialog, setOpenReservationDialog ] = useState( false );
  const [ propsRoomData, setPropsRoomData ] = useState( [] );
  const [ rowData, setRowData ] = useState();
  const isAdmin = hotel?.role === 'admin';
  const isMobile = useMediaQuery( '(max-width:600px)' );
  const isLaptop = useMediaQuery( '(min-width:601px) and (max-width:1450px)' );
  const isLargeScreen = useMediaQuery( '(min-width:1451px)' );


  const role = JSON.parse( localStorage.getItem( 'hotelData' ) ).role;
  const shouldHidePagination = useMemo( () => !roomData?.length || roomData?.length <= 25, [ roomData ] );

  const paginationStyle = useMemo(
    () => ( {
      '& .css-6tekhb-MuiTablePagination-root': {
        display: shouldHidePagination ? 'none' : 'block',
      },
      '& .MuiDataGrid-footer': { // Add this to hide the footer
        display: shouldHidePagination ? 'none' : 'block'
      },
    } ),
    [ shouldHidePagination ]
  );

  // Create a styled Box component for custom scrollbar styling
  const CustomTableStyle = styled( Box )( ( { theme } ) => ( {
    width: '100%',
    overflowX: 'auto',

    // Laptop-specific scrollbar styles (show scrollbar)
    ...( isLaptop && {
      '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: '#555',
        },
      },
      '*': {
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 #f1f1f1',
      },
      msOverflowStyle: 'auto',
    } ),

    // Mobile devices and large screens (hide scrollbar)
    ...( ( isMobile || isLargeScreen ) && {
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
    } ),
  } ) );

  //function for the dropdowns
  const handleClick = ( event, row ) => {
    setAnchorEl( event.currentTarget );
    setRowData( row );
  };

  const handleClose = () => {
    setAnchorEl( null );
  };

  const open = Boolean( anchorEl );

  // Delete room dialog
  const handleOpenDeleteRoomDialog = ( row ) => {
    setRowData( row );
    setOpenDelete( true );
  };

  const handleCloseDeleteRoomDialog = () => {
    setOpenDelete( false );
    handleClose();
  };

  const handleOpenEditRoom = ( row ) => {
    setRowData( row );
    setOpenEdit( true );
  };

  // Add room dialog
  const handleOpenAddRoom = () => setOpenAdd( true );
  const handleCloseAddRoom = () => {
    setOpenAdd( false );
    fetchroomData(); // Explicitly refetch room data
  };

  // Edit room dialog
  const handleCloseEditRoom = () => {
    setOpenEdit( false );
    handleClose();
  };

  // Book room dialog
  const handleOpenBookRoom = ( roomData ) => {
    setPropsRoomData( roomData );
    setOpenReservationDialog( true );
  };

  const handleCloseBookRoom = () => {
    setOpenReservationDialog( false );
  };

  // Function for fetching all the rooms data from the db
  const fetchroomData = async () => {
    try {
      const response = await getApi( `api/room/viewallrooms/${ hotel?.hotelId }` );

      console.log( response.data, 'this is data for room management' )
      setroomData( response?.data );
    } catch ( error ) {
      console.log( error );
    }
  };

  const fetchroomDataForAdmin = async () => {
    try {
      const response = await getApi( `api/room/viewallrooms` );
      setroomData( response?.data );
    } catch ( error ) {
      console.log( error );
    }
  };

  useEffect( () => {
    fetchroomData();
  }, [ openAdd, openEdit, openDelete, openReservationDialog ] );

  useEffect( () => {
    if ( isAdmin ) {
      fetchroomDataForAdmin();
    } else {
      fetchroomData();
    }
  }, [ openAdd, openEdit, openDelete ] );

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 0.5,
      renderCell: ( params ) => <Box sx={ { textAlign: 'center' } }>{ params.value }</Box>,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'roomNo',
      headerName: 'Room No',
      flex: 1
    },

    ...( role === 'admin'
      ? [
        {
          field: 'hotelId',
          headerName: 'Hotel Name',
          flex: 1,
          cellClassName: 'name-column--cell--capitalize',
          renderCell: ( params ) => (
            <Box sx={ { textAlign: 'center', width: '100%' } }>
              { params?.row?.hotelId?.name || '-' }
            </Box>
          ),
          headerAlign: 'center',
          align: 'center',
        },
      ]
      : [] ),

    {
      field: 'roomType',
      headerName: 'Room Type',
      flex: 1
    },
    {
      field: 'amount',
      headerName: 'Room Amount',
      flex: 1,
      renderCell: ( params ) => <Box>${ params.value }</Box>
    },
    {
      field: 'bookingStatus',
      headerName: 'Booking Status',
      flex: 1,
      renderCell: ( params ) => {
        console.log( params?.value, 'this is the vaulu  sdffjsfhaisfhijudfauihfh' );
        return params?.value === 'false' ? (
          <Button variant="contained" onClick={ () => handleOpenBookRoom( params.row ) } >
            Book Room
          </Button>
        ) : (
          <Button sx={ { paddingX: '10px' } } variant="contained" disabled>
            Room Booked
          </Button>
        );
      }
    },
    {
      field: 'checkIn',
      headerName: 'Check In',
      flex: 1,
      renderCell: ( params ) => {
        return params?.value ? <Box>{ moment( params?.value ).format( 'YYYY-MM-DD' ) }</Box> : <Box>-</Box>;
      }
    },
    {
      field: 'checkOut',
      headerName: 'Check Out',
      flex: 1,
      renderCell: ( params ) => {
        return params?.value ? <Box>{ moment( params?.value ).format( 'YYYY-MM-DD' ) }</Box> : <Box>-</Box>;
      }
    },
    {
      field: 'ac',
      headerName: 'AC',
      flex: 0.5,
      renderCell: ( params ) => {
        return <Box>{ params.value === 'AC' ? 'Yes' : 'No' }</Box>;
      }
    },
    {
      field: 'smoking',
      headerName: 'Smoking',
      flex: 1,
      renderCell: ( params ) => {
        return <Box>{ params.value === 'Smoking' ? 'Yes' : 'No' }</Box>;
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: ( params ) => {
        return (
          <div style={ { display: 'flex', justifyContent: 'center' } }>
            <MenuItem onClick={ () => handleOpenEditRoom( params.row ) } disableRipple>
              <EditIcon style={ { fontSize: '20px' } } />
            </MenuItem>
            <MenuItem onClick={ () => handleOpenDeleteRoomDialog( params.row ) } sx={ { color: 'red' } } disableRipple>
              <DeleteIcon style={ { color: '#f44336', fontSize: '20px' } } />
            </MenuItem>
          </div>
        );
      }
    }
  ];

  return (
    <>
      <ReserveRoom open={ openReservationDialog } handleClose={ handleCloseBookRoom } roomDataByProps={ propsRoomData } />
      <AddRoom open={ openAdd } handleClose={ handleCloseAddRoom } />
      <DeleteRoom open={ openDelete } handleClose={ handleCloseDeleteRoomDialog } id={ rowData?._id } />
      <EditRoom open={ openEdit } handleClose={ handleCloseEditRoom } data={ rowData } />
      <Container maxWidth="100%" sx={ { paddingLeft: 0, paddingRight: 0 } }>
        <Stack
          direction="row"
          alignItems="center"
          mb={ 6 }
          justifyContent="space-between"
          sx={ {
            backgroundColor: '#fff',
            fontSize: '18px',
            fontWeight: '500',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px',
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
            '@media (max-width: 320px)': {
              flexDirection: 'column',
              textAlign: 'center',
              fontSize: '14px', // Smaller font size on very small screens
              padding: '10px'
            },
            '@media (min-width: 321px) and (max-width: 600px)': {
              flexDirection: 'column',
              textAlign: 'center',
              fontSize: '16px', // Adjust font size for slightly larger devices
              padding: '12px'
            },
            '@media (min-width: 601px)': {
              flexDirection: 'row', // Default layout for devices larger than 600px
              textAlign: 'left',
              fontSize: '18px', // Normal font size for larger devices
              padding: '15px'
            }
          } }
        >
          <Typography variant="h4">Room Management</Typography>
          <Stack direction="row" alignItems="center" justifyContent={ 'flex-end' } spacing={ 2 }>
            <Button
              variant="contained"
              startIcon={ <Iconify icon="eva:plus-fill" /> }
              onClick={ handleOpenAddRoom }
              sx={ {
                fontSize: { xs: '12px', sm: '14px' }, // Reduce font size on small screens
                padding: { xs: '4px 6px', sm: '8px 16px' },
                minWidth: 'auto',
                maxWidth: '100%',
                whiteSpace: 'nowrap',
              } }
            >
              Add Room
            </Button>

          </Stack>
        </Stack>

        <TableStyle>
          <Box width="100%" >
            <CustomTableStyle>
              <Card
                sx={ {
                  minWidth: '100%',
                  paddingTop: '15px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                  borderRadius: '5px',
                  overflowX: 'auto',
                  // Using the same conditional logic for scrollbar visibility in the Card component
                  ...( isLaptop ? {
                    '&::-webkit-scrollbar': {
                      width: '8px',
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#888',
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: '#555',
                      },
                    },
                    '*': {
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#888 #f1f1f1',
                    },
                    msOverflowStyle: 'auto',
                  } : {
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
                  } ),
                } }
              >
                { roomData && (
                  <DataGrid
                    rows={ roomData?.map( ( row, index ) => ( { ...row, serialNo: index + 1 } ) ) }
                    columns={ columns?.map( ( col ) => ( {
                      ...col,
                      flex: 1,
                      minWidth: isMobile ? 150 : 100,
                      hide: isMobile ? col.field !== 'serialNo' : false,
                    } ) ) }
                    getRowId={ ( row ) => row?._id }
                    slots={ { toolbar: GridToolbar } }
                    slotProps={ { toolbar: { showQuickFilter: true } } }
                    sx={ {
                      minHeight: 400,
                      minWidth: '1200px',
                      ...paginationStyle,
                      fontSize: { xs: '12px', sm: '12px', lg: '14px' },
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f5f5f5',
                        fontSize: { xs: '12px', sm: '14px' }
                      },
                      '& .MuiDataGrid-cell': {
                        padding: { xs: '4px', sm: '8px' }, // Adjust padding
                        wordBreak: 'break-word',// prevent text overflow in cells
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      },
                      '& .MuiDataGrid-root': {
                        overflowX: 'auto' // Ensure scrollability
                      }
                    } }
                  />
                ) }
              </Card>
            </CustomTableStyle>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default RoomManagement;