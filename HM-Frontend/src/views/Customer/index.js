// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { Box, Button, Card, Container, IconButton, MenuItem, Popover, Stack, Typography, useMediaQuery } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getApi } from 'views/services/api';
// import Iconify from '../../ui-component/iconify';
// import TableStyle from '../../ui-component/TableStyle';
// import AddCustomer from './AddCustomer';
// import DeleteCustomer from './DeleteCustomer';
// import EditCustomer from './EditCustomer';

// // ----------------------------------------------------------------------

// const Customer = () => {
//   const [ openAdd, setOpenAdd ] = useState( false );
//   const [ openEdit, setOpenEdit ] = useState( false );
//   const [ openDelete, setOpenDelete ] = useState( false );
//   const [ customerData, setCustomerData ] = useState( [] );

//   // Track which row's menu is currently open
//   const [ openMenuId, setOpenMenuId ] = useState( null );
//   const [ anchorElMap, setAnchorElMap ] = useState( {} );

//   const [ rowData, setRowData ] = useState( null );
//   const [ selectedPhone, setSelectedPhone ] = useState( '' );

//   const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );
//   const isAdmin = hotel?.role === 'admin'; // Check if the user is an admin
//   const navigate = useNavigate();
//   const theme = useTheme();

//   console.log( 'customer check', customerData );

//   const shouldHidePagination = useMemo( () => !customerData?.length || customerData?.length <= 25, [ customerData ] );

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

//   const isMobile = useMediaQuery( '(max-width:1450px)' ); // for mobile devices

//   const handleClick = ( event, row ) => {
//     // Store the anchor element for this specific row
//     setAnchorElMap( ( prev ) => ( {
//       ...prev,
//       [ row._id ]: event.currentTarget
//     } ) );

//     setRowData( row );
//     setOpenMenuId( row._id );
//   };

//   const handleClose = () => {
//     setOpenMenuId( null );
//   };

//   // Fetch customer data for non-admin users
//   const fetchCustomerData = async () => {
//     try {
//       const response = await getApi( `api/customer/viewallcustomer/${ hotel?.hotelId }` );
//       setCustomerData( response?.data?.customerData || [] );
//     } catch ( error ) {
//       console.error( 'Error fetching customer data:', error );
//     }
//   };

//   // Fetch customer data for admin
//   const fetchCustomerDataForAdmin = async () => {
//     try {
//       const response = await getApi( `api/customer/viewallcustomer` );
//       setCustomerData( response?.data?.customerData || [] );
//     } catch ( error ) {
//       console.error( 'Error fetching customer data:', error );
//     }
//   };

//   useEffect( () => {
//     if ( isAdmin ) {
//       fetchCustomerDataForAdmin();
//     } else {
//       fetchCustomerData();
//     }
//   }, [ openAdd, openEdit, openDelete ] );

//   // Dialog Handlers
//   const handleOpenAdd = () => setOpenAdd( true );
//   const handleCloseAdd = () => setOpenAdd( false );

//   const handleOpenEditCustomer = ( row ) => {
//     setRowData( row );
//     setOpenEdit( true );
//     handleClose();
//   };

//   const handleCloseEditCustomer = () => setOpenEdit( false );

//   const handleOpenDeleteCustomer = ( row ) => {
//     console.log( row, 'this is row what i want ' );
//     setRowData( row );
//     setSelectedPhone( row.phoneNumber );
//     setOpenDelete( true );
//     handleClose();
//   };

//   const handleCloseDeleteCustomer = () => {
//     setOpenDelete( false );
//   };

//   const handleViewCustomer = ( phone ) => {
//     console.log( 'view phone number', phone );
//     navigate( `/dashboard/customer/view/${ phone }` );
//     handleClose();
//   };

//   const role = JSON.parse( localStorage.getItem( 'hotelData' ) )?.role;

//   const columns = [
//     {
//       field: 'serialNo',
//       headerName: 'Serial No',
//       flex: 1,
//       cellClassName: 'name-column--cell--capitalize',
//       renderCell: ( params ) => <Box sx={ { textAlign: 'center', width: '100%' } }>{ params.value }</Box>,
//       headerAlign: 'center',
//       align: 'center'
//     },
//     ...( role === 'admin'
//       ? [
//         {
//           field: 'hotelId',
//           headerName: 'Hotel Name',
//           flex: 1,
//           cellClassName: 'name-column--cell--capitalize',
//           renderCell: ( params ) => <Box sx={ { textAlign: 'center', width: '100%' } }>{ params?.value?.name || '-' }</Box>,
//           headerAlign: 'center',
//           align: 'center'
//         }
//       ]
//       : [] ),
//     {
//       field: 'fullName',
//       headerName: 'Name',
//       flex: 1,
//       renderCell: ( params ) => {
//         const name = params.value || `${ params.row?.firstName || '' } ${ params.row?.lastName || '' }`.trim() || 'N/A';
//         return (
//           <Box>
//             <Box onClick={ () => handleViewCustomer( params.row.phoneNumber ) } style={ { cursor: 'pointer' } }>
//               { name }
//             </Box>
//           </Box>
//         );
//       }
//     },
//     { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
//     { field: 'address', headerName: 'Address', flex: 1 },
//     { field: 'idCardType', headerName: 'ID Card Type', flex: 1 },
//     { field: 'idcardNumber', headerName: 'ID Card Number', flex: 1 },
//     {
//       field: 'action',
//       headerName: 'Action',
//       flex: 1,
//       renderCell: ( params ) => {
//         return (
//           <>
//             <div>
//               <IconButton
//                 aria-describedby={ `popover-${ params.row._id }` }
//                 variant="contained"
//                 onClick={ ( event ) => handleClick( event, params.row ) }
//               >
//                 <MoreVertIcon />
//               </IconButton>
//               <Popover
//                 id={ `popover-${ params.row._id }` }
//                 open={ openMenuId === params.row._id }
//                 anchorEl={ anchorElMap[ params.row._id ] }
//                 onClose={ handleClose }
//                 anchorOrigin={ {
//                   vertical: 'bottom',
//                   horizontal: 'right'
//                 } }
//               >
//                 <MenuItem onClick={ () => handleOpenEditCustomer( params.row ) } disableRipple>
//                   <EditIcon fontSize="small" />
//                 </MenuItem>
//                 <MenuItem onClick={ () => handleViewCustomer( params.row.phoneNumber ) } disableRipple>
//                   <VisibilityIcon fontSize="small" />
//                 </MenuItem>
//                 <MenuItem onClick={ () => handleOpenDeleteCustomer( params.row ) } disableRipple sx={ { color: 'red' } }>
//                   <DeleteIcon fontSize="small" />
//                 </MenuItem>
//               </Popover>
//             </div>
//           </>
//         );
//       }
//     }
//   ];

//   return (
//     <>
//       <AddCustomer open={ openAdd } handleClose={ handleCloseAdd } />
//       <EditCustomer open={ openEdit } handleClose={ handleCloseEditCustomer } data={ rowData } />
//       <DeleteCustomer open={ openDelete } handleClose={ handleCloseDeleteCustomer } id={ selectedPhone } />

//       <Container maxWidth="xl" sx={ { padding: 0 } }>
//         <Stack
//           direction={ { xs: 'column', sm: 'row' } }
//           alignItems="center"
//           justifyContent="space-between"
//           spacing={ 2 }
//           mb={ 4 }
//           sx={ {
//             backgroundColor: '#fff',
//             padding: 2,
//             borderRadius: 1,
//             boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)'
//           } }
//         >
//           <Typography variant="h4">Customer Management</Typography>
//           <Button
//             variant="contained"
//             startIcon={ <Iconify icon="eva:plus-fill" /> }
//             onClick={ handleOpenAdd }
//             sx={ {
//               fontSize: { xs: '12px', sm: '14px' },
//               padding: { xs: '4px 6px', sm: '8px 16px' },
//               minWidth: 'auto',
//               maxWidth: '100%',
//               whiteSpace: 'nowrap'
//             } }
//           >
//             Add Customer
//           </Button>
//         </Stack>

//         <TableStyle>
//           <Box width={ '100%' }>
//             <Card
//               sx={ {
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
//                 rows={ customerData?.map( ( row, index ) => ( { ...row, serialNo: index + 1 } ) ) }
//                 columns={ columns?.map( ( col ) => ( {
//                   ...col,
//                   flex: 1,
//                   minWidth: isMobile ? 150 : 100,
//                   hide: window?.innerWidth < 400 ? col.field !== 'serialNo' : false
//                 } ) ) }
//                 getRowId={ ( row ) => row?._id }
//                 slots={ { toolbar: GridToolbar } }
//                 slotProps={ { toolbar: { showQuickFilter: true } } }
//                 sx={ {
//                   minHeight: 400,
//                   minWidth: '1200px',
//                   ...paginationStyle,
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
//     </>
//   );
// };

// export default Customer;
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Card, Container, IconButton, MenuItem, Popover, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApi } from 'views/services/api';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddCustomer from './AddCustomer';
import DeleteCustomer from './DeleteCustomer';
import EditCustomer from './EditCustomer';

// ----------------------------------------------------------------------

const Customer = () => {
  const [ openAdd, setOpenAdd ] = useState( false );
  const [ openEdit, setOpenEdit ] = useState( false );
  const [ openDelete, setOpenDelete ] = useState( false );
  const [ customerData, setCustomerData ] = useState( [] );

  // Track which row's menu is currently open
  const [ openMenuId, setOpenMenuId ] = useState( null );
  const [ anchorElMap, setAnchorElMap ] = useState( {} );

  const [ rowData, setRowData ] = useState( null );
  const [ selectedPhone, setSelectedPhone ] = useState( '' );

  const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );
  const isAdmin = hotel?.role === 'admin'; // Check if the user is an admin
  const navigate = useNavigate();
  const theme = useTheme();

  console.log( 'customer check', customerData );

  const shouldHidePagination = useMemo( () => !customerData?.length || customerData?.length <= 25, [ customerData ] );

  const paginationStyle = useMemo(
    () => ( {
      '& .css-6tekhb-MuiTablePagination-root': {
        display: shouldHidePagination ? 'none' : 'block'
      },
      '& .MuiDataGrid-footer': {
        // Add this to hide the footer
        display: shouldHidePagination ? 'none' : 'block'
      }
    } ),
    [ shouldHidePagination ]
  );

  // Media queries for responsive design
  const isMobile = useMediaQuery( '(max-width:1450px)' ); // for mobile devices
  const isLaptop = useMediaQuery( '(min-width:768px) and (max-width:1700px)' ); // for laptop devices
  const isLargeScreen = useMediaQuery( '(min-width:1701px)' ); // for large screens

  const handleClick = ( event, row ) => {
    // Store the anchor element for this specific row
    setAnchorElMap( ( prev ) => ( {
      ...prev,
      [ row._id ]: event.currentTarget
    } ) );

    setRowData( row );
    setOpenMenuId( row._id );
  };

  const handleClose = () => {
    setOpenMenuId( null );
  };

  // Fetch customer data for non-admin users
  const fetchCustomerData = async () => {
    try {
      const response = await getApi( `api/customer/viewallcustomer/${ hotel?.hotelId }` );
      setCustomerData( response?.data?.customerData || [] );
    } catch ( error ) {
      console.error( 'Error fetching customer data:', error );
    }
  };

  // Fetch customer data for admin
  const fetchCustomerDataForAdmin = async () => {
    try {
      const response = await getApi( `api/customer/viewallcustomer` );
      setCustomerData( response?.data?.customerData || [] );
    } catch ( error ) {
      console.error( 'Error fetching customer data:', error );
    }
  };

  useEffect( () => {
    if ( isAdmin ) {
      fetchCustomerDataForAdmin();
    } else {
      fetchCustomerData();
    }
  }, [ openAdd, openEdit, openDelete ] );

  // Dialog Handlers
  const handleOpenAdd = () => setOpenAdd( true );
  const handleCloseAdd = () => setOpenAdd( false );

  const handleOpenEditCustomer = ( row ) => {
    setRowData( row );
    setOpenEdit( true );
    handleClose();
  };

  const handleCloseEditCustomer = () => setOpenEdit( false );

  const handleOpenDeleteCustomer = ( row ) => {
    console.log( row, 'this is row what i want ' );
    setRowData( row );
    setSelectedPhone( row.phoneNumber );
    setOpenDelete( true );
    handleClose();
  };

  const handleCloseDeleteCustomer = () => {
    setOpenDelete( false );
  };

  const handleViewCustomer = ( phone ) => {
    console.log( 'view phone number', phone );
    navigate( `/dashboard/customer/view/${ phone }` );
    handleClose();
  };

  const role = JSON.parse( localStorage.getItem( 'hotelData' ) )?.role;

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: ( params ) => <Box sx={ { textAlign: 'center', width: '100%' } }>{ params.value }</Box>,
      headerAlign: 'center',
      align: 'center'
    },
    ...( role === 'admin'
      ? [
        {
          field: 'hotelId',
          headerName: 'Hotel Name',
          flex: 1,
          cellClassName: 'name-column--cell--capitalize',
          renderCell: ( params ) => <Box sx={ { textAlign: 'center', width: '100%' } }>{ params?.value?.name || '-' }</Box>,
          headerAlign: 'center',
          align: 'center'
        }
      ]
      : [] ),
    {
      field: 'fullName',
      headerName: 'Name',
      flex: 1,
      renderCell: ( params ) => {
        const name = params.value || `${ params.row?.firstName || '' } ${ params.row?.lastName || '' }`.trim() || 'N/A';
        return (
          <Box>
            <Box onClick={ () => handleViewCustomer( params.row.phoneNumber ) } style={ { cursor: 'pointer' } }>
              { name }
            </Box>
          </Box>
        );
      }
    },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'idCardType', headerName: 'ID Card Type', flex: 1 },
    { field: 'idcardNumber', headerName: 'ID Card Number', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: ( params ) => {
        return (
          <>
            <div>
              <IconButton
                aria-describedby={ `popover-${ params.row._id }` }
                variant="contained"
                onClick={ ( event ) => handleClick( event, params.row ) }
              >
                <MoreVertIcon />
              </IconButton>
              <Popover
                id={ `popover-${ params.row._id }` }
                open={ openMenuId === params.row._id }
                anchorEl={ anchorElMap[ params.row._id ] }
                onClose={ handleClose }
                anchorOrigin={ {
                  vertical: 'bottom',
                  horizontal: 'right'
                } }
              >
                <MenuItem onClick={ () => handleOpenEditCustomer( params.row ) } disableRipple>
                  <EditIcon fontSize="small" />
                </MenuItem>
                <MenuItem onClick={ () => handleViewCustomer( params.row.phoneNumber ) } disableRipple>
                  <VisibilityIcon fontSize="small" />
                </MenuItem>
                <MenuItem onClick={ () => handleOpenDeleteCustomer( params.row ) } disableRipple sx={ { color: 'red' } }>
                  <DeleteIcon fontSize="small" />
                </MenuItem>
              </Popover>
            </div>
          </>
        );
      }
    }
  ];

  // Get scrollbar styles based on screen size
  const getScrollbarStyles = () => {
    if ( isLaptop ) {
      // Show scrollbar for laptop devices
      return {
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '4px'
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 #f1f1f1'
        },
        msOverflowStyle: 'auto'
      };
    } else {
      // Hide scrollbar for mobile and large screen devices
      return {
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
      };
    }
  };

  return (
    <>
      <AddCustomer open={ openAdd } handleClose={ handleCloseAdd } />
      <EditCustomer open={ openEdit } handleClose={ handleCloseEditCustomer } data={ rowData } />
      <DeleteCustomer open={ openDelete } handleClose={ handleCloseDeleteCustomer } id={ selectedPhone } />

      <Container maxWidth="xl" sx={ { padding: 0 } }>
        <Stack
          direction={ { xs: 'column', sm: 'row' } }
          alignItems="center"
          justifyContent="space-between"
          spacing={ 2 }
          mb={ 4 }
          sx={ {
            backgroundColor: '#fff',
            padding: 2,
            borderRadius: 1,
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)'
          } }
        >
          <Typography variant="h4">Customer Management</Typography>
          <Button
            variant="contained"
            startIcon={ <Iconify icon="eva:plus-fill" /> }
            onClick={ handleOpenAdd }
            sx={ {
              fontSize: { xs: '12px', sm: '14px' },
              padding: { xs: '4px 6px', sm: '8px 16px' },
              minWidth: 'auto',
              maxWidth: '100%',
              whiteSpace: 'nowrap'
            } }
          >
            Add Customer
          </Button>
        </Stack>

        <TableStyle>
          <Box width={ '100%' }>
            <Card
              sx={ {
                minWidth: '100%',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px',
                overflowX: 'auto',
                ...getScrollbarStyles()
              } }
            >
              <DataGrid
                rows={ customerData?.map( ( row, index ) => ( { ...row, serialNo: index + 1 } ) ) }
                columns={ columns?.map( ( col ) => ( {
                  ...col,
                  flex: 1,
                  minWidth: isMobile ? 150 : 100,
                  hide: window?.innerWidth < 400 ? col.field !== 'serialNo' : false
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
                    wordBreak: 'break-word', // prevent text overflow in cells
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  },
                  '& .MuiDataGrid-root': {
                    overflowX: isLaptop ? 'scroll' : 'auto' // Force scroll for laptops
                  }
                } }
              />
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default Customer;