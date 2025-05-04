// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import EditIcon from '@mui/icons-material/Edit';
// import { useState, useEffect } from 'react';
// import { Stack, Button, Container, Typography, Box, Card, useMediaQuery, FormControl, Select, IconButton } from '@mui/material'; // Added IconButton import
// import DeleteIcon from '@mui/icons-material/Delete';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import ReceiptIcon from '@mui/icons-material/Receipt'; // Import Invoice icon
// import * as React from 'react';
// import MenuItem from '@mui/material/MenuItem'; // Keep for Select dropdown
// import { styled } from '@mui/system';
// import { useMemo } from 'react';
// import Iconify from 'ui-component/iconify';
// import TableStyle from 'ui-component/TableStyle';

// // Import the modal components
// import EditCustomer from '../customers/EditCustomer';
// import DeleteCustomer from '../customers/DeleteCustomer';
// import ViewCustomer from '../customers/ShowCustomer';
// import SpaInvoice from '../customers/invoice/Invoice';
// import { getApi, patchApi } from 'views/services/api';
// const Customers = () => {
//     const [ openAdd, setOpenAdd ] = useState( false );
//     const [ openEdit, setOpenEdit ] = useState( false );
//     const [ openDelete, setOpenDelete ] = useState( false );
//     const [ openView, setOpenView ] = useState( false );
//     const [ openInvoice, setOpenInvoice ] = useState( false ); // State for Invoice modal
//     // Removed unused anchorEl state
//     const [ customerData, setCustomerData ] = useState( [] );
//     const [ filteredData, setFilteredData ] = useState( [] );
//     const [ filterValue, setFilterValue ] = useState( 'all' );
//     const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) || '{"role": "admin"}' );
//     const [ rowData, setRowData ] = useState( null ); // Ensure rowData starts as null or undefined
//     const isAdmin = hotel?.role === 'admin';
//     const isMobile = useMediaQuery( '(max-width:1450px)' );

//     const handleOpenAddCustomer = () => setOpenAdd( true );
//     const handleCloseAddCustomer = () => setOpenAdd( false );

//     const handleOpenEditCustomer = ( row ) => {
//         setRowData( row );
//         setOpenEdit( true );
//     };
//     const handleCloseEditCustomer = () => {
//         setOpenEdit( false );
//         // setRowData(null); // Optional: Clear rowData when closing
//     };

//     const handleOpenDeleteCustomer = ( row ) => {
//         setRowData( row );
//         setOpenDelete( true );
//     };
//     const handleCloseDeleteCustomer = () => {
//         setOpenDelete( false );
//         setRowData( null );
//         fetchData();// Optional: Clear rowData when closing
//     };

//     const handleOpenViewCustomer = ( row ) => {
//         setRowData( row );
//         setOpenView( true );
//     };
//     const handleCloseViewCustomer = () => {
//         setOpenView( false );
//         // setRowData(null); // Optional: Clear rowData when closing
//     };

//     // New handlers for Invoice modal
//     const handleOpenInvoice = ( row ) => {
//         setRowData( row );
//         setOpenInvoice( true );
//     };
//     const handleCloseInvoice = () => {
//         setOpenInvoice( false );
//         // setRowData(null); // Optional: Clear rowData when closing invoice too
//     };

//     const role = hotel.role;
//     const shouldHidePagination = useMemo( () => !filteredData?.length || filteredData?.length <= 25, [ filteredData ] );

//     const paginationStyle = useMemo(
//         () => ( {
//             '& .MuiTablePagination-root': { // Simplified selector
//                 display: shouldHidePagination ? 'none' : 'flex', // Use flex for pagination display
//             },
//             '& .MuiDataGrid-footerContainer': { // Target footer container
//                 display: shouldHidePagination ? 'none' : 'flex', // Use flex
//                 minHeight: 'auto' // Adjust minHeight if needed
//             },
//             // Optional: Hide default pagination text if needed when hidden
//             // '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel, & .MuiTablePagination-select, & .MuiTablePagination-actions': {
//             //     display: shouldHidePagination ? 'none' : 'inherit',
//             // },
//         } ),
//         [ shouldHidePagination ]
//     );

//     // Delete customer handler
//     const handleDeleteCustomer = () => {
//         setOpenDelete( !openDelete )
//         setRowData( null ); // Clear selected row after delete
//         handleCloseDeleteCustomer();
//     };

//     // Update customer handler
//     const handleUpdateCustomer = ( updatedCustomer ) => {
//         const updatedData = customerData.map( customer =>
//             customer._id === updatedCustomer._id ? updatedCustomer : customer
//         );
//         setCustomerData( updatedData );
//         setRowData( null ); // Clear selected row after update
//         handleCloseEditCustomer();
//     };

//     // Add customer handler
//     const handleAddCustomer = ( newCustomer ) => {
//         const maxId = customerData.reduce( ( max, customer ) => {
//             const currentId = parseInt( customer._id, 10 );
//             return !isNaN( currentId ) && currentId > max ? currentId : max;
//         }, 0 );
//         const newId = ( maxId + 1 ).toString();
//         const customerWithId = { ...newCustomer, _id: newId };
//         setCustomerData( [ ...customerData, customerWithId ] );
//         handleCloseAddCustomer();
//     };

//     useEffect( () => {
//         fetchData();
//     }, [] );

//     const fetchData = async () => {
//         try {
//             const response = await getApi( `api/spa/get-guest-bookings/${ hotel?.hotelId }` );
//             console.log( 'customers', response.data );
//             if ( response?.data ) {
//                 setCustomerData( response.data.spaBookings );
//                 console.log( 'Spa services data updated:', response.data );
//             } else {
//                 setCustomerData( [] );
//                 console.log( 'No spa services data found' );
//             }
//         } catch ( error ) {
//             console.error( 'Error fetching spa services:', error );
//             toast.error( 'Failed to fetch spa services' );
//         }
//     };

//     // Filter data based on filter value
//     useEffect( () => {
//         if ( filterValue === 'all' ) {
//             setFilteredData( customerData );
//         } else {
//             setFilteredData( customerData.filter( item => item.paymentStatus === filterValue ) );
//         }
//     }, [ filterValue, customerData ] );

//     const CustomTableStyle = styled( Box )( ( { theme } ) => ( {
//         // Styles remain the same...
//         width: '100%', overflowX: 'auto', '&::-webkit-scrollbar': { width: '0', height: '0' },
//         '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'transparent' },
//         '*': { scrollbarWidth: 'none' }, msOverflowStyle: 'none',
//     } ) );

//     const columns = [
//         // Other columns remain the same...
//         {
//             field: 'serialNo', headerName: 'Serial No', flex: 0.5,
//             renderCell: ( params ) => <Box sx={ { textAlign: 'center' } }>{ params.value }</Box>,
//             headerAlign: 'center', align: 'center'
//         },
//         {
//             field: `firstName`,
//             headerName: 'Customer Name',
//             flex: 1,
//             renderCell: ( params ) => <Box>{ params.row.firstName + ' ' + params.row.lastName }</Box>

//         },
//         { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
//         { field: 'address', headerName: 'Address', flex: 1, renderCell: ( params ) => <Box>{ params.row.address }</Box> },
//         { field: 'idCardType', headerName: 'ID Card Type', flex: 1, renderCell: ( params ) => <Box>{ params.row.idCardType }</Box> },
//         { field: 'idCardNumber', headerName: 'ID Card Number', flex: 1, renderCell: ( params ) => <Box>{ params.row.idcardNumber }</Box> },
//         {
//             field: 'paymentStatus', headerName: 'Payment Status', flex: 1,
//             renderCell: ( params ) => {
//                 const currentStatus = params.row.status;
//                 const handleStatusChange = async ( _id, status ) => {
//                     try {

//                         console.log( _id, status, 'this is for spa  data status' );
//                         const data = {
//                             _id,
//                             status
//                         };

//                         await patchApi( `api/spa/bookings/status/${ _id }`, data );
//                         fetchData();
//                         toast.success( 'Status updated successfully!' );
//                     } catch ( error ) {
//                         console.error( 'Failed to update status', error );
//                     }
//                 };
//                 return (
//                     <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' } }> {/* Center select */ }
//                         <select
//                             value={ currentStatus }
//                             onChange={ ( event ) => handleStatusChange( params.row._id, event.target.value ) }
//                             style={ {
//                                 padding: '5px 8px', borderRadius: '4px', border: '1px solid #ccc',
//                                 backgroundColor: currentStatus === 'Completed' ? '#e6f7e6' : '#fff3e0',
//                                 color: currentStatus === 'Completed' ? '#2e7d32' : '#ed6c02',
//                                 fontWeight: 500, cursor: 'pointer', height: 'fit-content'
//                             } }
//                         >
//                             <option value="Pending">Pending</option>
//                             <option value="Completed">Completed</option>
//                         </select>
//                     </Box>
//                 );
//             }
//         },
//         {
//             field: 'action',
//             headerName: 'Action',
//             flex: 1.5, // Keep increased flex
//             minWidth: 170, // Adjusted minWidth to better fit 4 icons
//             headerAlign: 'center',
//             align: 'center',
//             sortable: false, // Actions usually aren't sortable
//             disableColumnMenu: true, // Actions usually don't need menus
//             renderCell: ( params ) => {
//                 const isCompleted = params.row.status === 'Completed';
//                 const iconButtonSize = 34; // Standard small IconButton size
//                 const placeholderWidth = iconButtonSize + 8; // Icon size + approx padding/margin (adjust if needed)

//                 return (
//                     <Box
//                         display="flex"
//                         justifyContent="center" // Center the group of icons
//                         alignItems="center"
//                         width="100%"
//                         height="100%" // Ensure vertical centering
//                         sx={ { gap: '4px' } } // Add small gap between icons
//                     >
//                         <IconButton
//                             aria-label="View Customer"
//                             size="small"
//                             onClick={ () => handleOpenViewCustomer( params.row ) }
//                             sx={ { color: '#2196f3' } } // Blue
//                             title="View Details" // Tooltip
//                         >
//                             <VisibilityIcon fontSize="inherit" />
//                         </IconButton>
//                         <IconButton
//                             aria-label="Edit Customer"
//                             size="small"
//                             onClick={ () => handleOpenEditCustomer( params.row ) }
//                             sx={ { color: '#ff9800' } } // Orange
//                             title="Edit Customer" // Tooltip
//                         >
//                             <EditIcon fontSize="inherit" />
//                         </IconButton>
//                         <IconButton
//                             aria-label="Delete Customer"
//                             size="small"
//                             onClick={ () => handleOpenDeleteCustomer( params.row._id ) }
//                             sx={ { color: '#f44336' } } // Red
//                             title="Delete Customer" // Tooltip
//                         >
//                             <DeleteIcon fontSize="inherit" />
//                         </IconButton>

//                         {/* Conditionally render Invoice Icon or Placeholder */ }
//                         { isCompleted ? (
//                             <IconButton
//                                 aria-label="Generate Invoice"
//                                 size="small"
//                                 onClick={ () => handleOpenInvoice( params.row ) }
//                                 sx={ { color: '#4caf50' } } // Green
//                                 title="Generate Invoice" // Tooltip
//                             >
//                                 <ReceiptIcon fontSize="inherit" />
//                             </IconButton>
//                         ) : (
//                             // Placeholder Box to maintain spacing
//                             <Box sx={ { width: iconButtonSize, height: iconButtonSize } } />
//                         ) }
//                     </Box>
//                 );
//             }
//         }
//     ];

//     return (
//         <Container maxWidth="100%" sx={ { padding: { xs: 1, sm: 0 }, margin: 0 } }> {/* Adjusted padding */ }
//             {/* Header with filter */ }
//             <Stack
//                 direction={ { xs: 'column', sm: 'row' } }
//                 alignItems={ { xs: 'flex-start', sm: 'center' } }
//                 justifyContent="space-between"
//                 sx={ {
//                     backgroundColor: '#fff', fontSize: '16px', fontWeight: '500',
//                     padding: '10px 15px', borderRadius: '5px', marginBottom: '15px', // Adjusted padding/margin
//                     boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1)', // Softer shadow
//                 } }
//             >
//                 <Typography variant="h5" // Slightly larger header
//                     sx={ {
//                         fontSize: { xs: '1.1rem', sm: '1.25rem' }, fontWeight: 500, // Adjusted font
//                         marginBottom: { xs: '10px', sm: '0px' },
//                         flexGrow: 1, // Allow text to take space
//                     } }
//                 >
//                     Customers
//                 </Typography>

//                 <Stack direction="row" alignItems="center" justifyContent={ { xs: 'flex-start', sm: 'flex-end' } } spacing={ 1.5 } sx={ { width: 'auto', flexWrap: 'nowrap' } }> {/* Adjusted width/wrap */ }
//                     {/* Filter Dropdown */ }
//                     <FormControl size="small" sx={ { minWidth: 120, backgroundColor: '#fff', borderRadius: '6px' } }> {/* Use size="small" */ }
//                         <Select
//                             labelId="filter-label" id="filter" value={ filterValue }
//                             onChange={ ( e ) => setFilterValue( e.target.value ) }
//                             displayEmpty
//                             sx={ {
//                                 '& .MuiSelect-select': {
//                                     borderRadius: '5px', padding: '8px 12px', // Adjusted padding
//                                     fontSize: '0.875rem', color: '#121926', fontWeight: '500',
//                                 },
//                                 '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' }, // Border color
//                             } }
//                         >
//                             <MenuItem value="all">All Status</MenuItem>
//                             <MenuItem value="Pending">Pending</MenuItem>
//                             <MenuItem value="Completed">Completed</MenuItem>
//                         </Select>
//                     </FormControl>
//                 </Stack>
//             </Stack>

//             <TableStyle>
//                 <Box width="100%" sx={ { padding: 0, margin: 0 } }>
//                     <CustomTableStyle>
//                         <Card sx={ {
//                             minWidth: '100%', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.06), 0 4px 5px 0px rgba(0,0,0,0.04)', // Updated shadow
//                             borderRadius: '8px', overflow: 'hidden', // Ensure overflow hidden for rounded corners
//                         } }>
//                             { customerData && (
//                                 <DataGrid
//                                     rows={ customerData?.map( ( row, index ) => ( { ...row, id: row._id, serialNo: index + 1 } ) ) } // Ensure 'id' field is set for DataGrid
//                                     columns={ columns } // Pass columns directly
//                                     // getRowId={(row) => row._id} // Use id field instead
//                                     slots={ { toolbar: GridToolbar } }
//                                     slotProps={ {
//                                         toolbar: {
//                                             showQuickFilter: true,
//                                             quickFilterProps: { debounceMs: 500 },
//                                             printOptions: { disableToolbarButton: true }, // Hide print
//                                             csvOptions: { disableToolbarButton: true }, // Hide CSV export
//                                         },
//                                     } }
//                                     sx={ {
//                                         border: 'none', // Remove outer border
//                                         minHeight: 400,
//                                         // minWidth: '1200px', // Let flex/minWidth handle this
//                                         ...paginationStyle,
//                                         fontSize: '0.875rem', // Base font size
//                                         '& .MuiDataGrid-columnHeaders': {
//                                             backgroundColor: '#f8f9fa', // Lighter header
//                                             borderBottom: '1px solid #e0e0e0',
//                                             fontWeight: '600',
//                                         },
//                                         '& .MuiDataGrid-cell': {
//                                             borderBottom: '1px solid #e0e0e0', // Cell border
//                                             padding: '0 8px', // Adjust cell padding
//                                             display: 'flex',
//                                             alignItems: 'center', // Vertically align cell content
//                                         },
//                                         '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within': {
//                                             outline: 'none', // Remove focus outline
//                                         },
//                                         '& .MuiDataGrid-toolbarContainer': { // Toolbar styling
//                                             padding: '8px 16px',
//                                             borderBottom: '1px solid #e0e0e0',
//                                         },
//                                         '& .MuiInputBase-root': { // Toolbar search input
//                                             fontSize: '0.875rem'
//                                         }
//                                     } }
//                                     density="compact"
//                                     autoHeight // Adjust height based on content
//                                     initialState={ {
//                                         pagination: { paginationModel: { pageSize: 25 } },
//                                     } }
//                                     pageSizeOptions={ [ 10, 25, 50, 100 ] }
//                                     disableRowSelectionOnClick // Prevent row selection on click
//                                 />
//                             ) }
//                         </Card>
//                     </CustomTableStyle>
//                 </Box>
//             </TableStyle>

//             {/* Ensure rowData exists before rendering modals needing it */ }
//             { rowData && (
//                 <>
//                     <EditCustomer open={ openEdit } handleClose={ handleCloseEditCustomer } customerData={ rowData } updateCustomer={ handleUpdateCustomer } />
//                     <DeleteCustomer open={ openDelete } handleClose={ handleCloseDeleteCustomer } customerData={ rowData } deleteCustomer={ handleDeleteCustomer } />
//                     <ViewCustomer open={ openView } handleClose={ handleCloseViewCustomer } customerData={ rowData } />
//                     <SpaInvoice open={ openInvoice } handleClose={ handleCloseInvoice } customerData={ rowData } />
//                 </>
//             ) }
//         </Container>
//     );
// };

// export default Customers;
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect } from 'react';
import { Stack, Container, Box, Card, useMediaQuery, FormControl, Select, IconButton, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { styled } from '@mui/system';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import EditCustomer from '../customers/EditCustomer';
import DeleteCustomer from '../customers/DeleteCustomer';
import ViewCustomer from '../customers/ShowCustomer';
import SpaInvoice from '../customers/invoice/Invoice';
import { getApi, patchApi } from 'views/services/api';

const Customers = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterValue, setFilterValue] = useState('all');
  const [guestTypeValue, setGuestTypeValue] = useState('all');
  const hotel = JSON.parse(localStorage.getItem('hotelData') || '{"role": "admin"}');
  const [rowData, setRowData] = useState(null);
  const isMobile = useMediaQuery('(max-width:1450px)');

  const handleOpenAddCustomer = () => setOpenAdd(true);
  const handleCloseAddCustomer = () => setOpenAdd(false);
  const handleOpenEditCustomer = (row) => {
    setRowData(row);
    setOpenEdit(true);
  };
  const handleCloseEditCustomer = () => setOpenEdit(false);
  const handleOpenDeleteCustomer = (row) => {
    setRowData(row);
    setOpenDelete(true);
  };
  const handleCloseDeleteCustomer = () => {
    setOpenDelete(false);
    setRowData(null);
    fetchData();
  };
  const handleOpenViewCustomer = (row) => {
    setRowData(row);
    setOpenView(true);
  };
  const handleCloseViewCustomer = () => setOpenView(false);
  const handleOpenInvoice = (row) => {
    setRowData(row);
    setOpenInvoice(true);
  };
  const handleCloseInvoice = () => setOpenInvoice(false);

  const shouldHidePagination = useMemo(() => !filteredData?.length || filteredData?.length <= 25, [filteredData]);

  const paginationStyle = useMemo(
    () => ({
      '& .MuiTablePagination-root': { display: shouldHidePagination ? 'none' : 'flex' },
      '& .MuiDataGrid-footerContainer': { display: shouldHidePagination ? 'none' : 'flex', minHeight: 'auto' }
    }),
    [shouldHidePagination]
  );

  const handleDeleteCustomer = () => {
    setOpenDelete(!openDelete);
    setRowData(null);
    handleCloseDeleteCustomer();
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    const updatedData = customerData.map((customer) => (customer._id === updatedCustomer._id ? updatedCustomer : customer));
    setCustomerData(updatedData);
    setRowData(null);
    handleCloseEditCustomer();
    fetchData();
  };

  const handleAddCustomer = (newCustomer) => {
    const maxId = customerData.reduce((max, customer) => {
      const currentId = parseInt(customer._id, 10);
      return !isNaN(currentId) && currentId > max ? currentId : max;
    }, 0);
    const newId = (maxId + 1).toString();
    const customerWithId = { ...newCustomer, _id: newId };
    setCustomerData([...customerData, customerWithId]);
    handleCloseAddCustomer();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getApi(`api/spa/get-guest-bookings/${hotel?.hotelId}`);
      if (response?.data) {
        setCustomerData(response.data.spaBookings);
      } else {
        setCustomerData([]);
        console.log('No spa services data found');
      }
    } catch (error) {
      console.error('Error fetching spa services:', error);
      toast.error('Failed to fetch spa services');
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = customerData;

    if (filterValue !== 'all') {
      filtered = filtered.filter((item) => item.status === filterValue);
    }
    if (guestTypeValue !== 'all') {
      filtered = filtered.filter((item) => item.userType === guestTypeValue);
    }
    setFilteredData(filtered);
  }, [filterValue, guestTypeValue, customerData]);

  const CustomTableStyle = styled(Box)(({ theme }) => ({
    width: '100%',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { width: '0', height: '0' },
    '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
    '&::-webkit-scrollbar-thumb': { backgroundColor: 'transparent' },
    '*': { scrollbarWidth: 'none' },
    msOverflowStyle: 'none'
  }));

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 0.5,
      renderCell: (params) => <Box sx={{ textAlign: 'center' }}>{params.value}</Box>,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: `firstName`,
      headerName: 'Name',
      flex: 1,
      renderCell: (params) => <Box>{params.row.firstName + ' ' + params.row.lastName}</Box>
    },
    { field: 'phoneNumber', headerName: 'Phone', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1, renderCell: (params) => <Box>{params.row.address}</Box> },
    { field: 'idCardType', headerName: 'ID Card Type', flex: 1, renderCell: (params) => <Box>{params.row.idCardType}</Box> },
    { field: 'idCardNumber', headerName: 'ID Card Number', flex: 1, renderCell: (params) => <Box>{params.row.idcardNumber}</Box> },
    {
      field: 'serviceType',
      headerName: 'Service Type',
      flex: 1,
      renderCell: (params) => {
        console.log(params.row, 'this is for services ');
        //  return   <Box>
        //         { params.row.serviceId ? ( Array.isArray( params.row.serviceId ) ? 'Package' : 'Service' ) : 'Unknown' }
        //     </Box>
      }
    },
    {
      field: 'paymentStatus',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        const currentStatus = params.row.status;
        const handleStatusChange = async (_id, status) => {
          try {
            const hotel = JSON.parse(localStorage.getItem('hotelData'));

            const data = { _id, status,hotelId:hotel?._id };
            await patchApi(`api/spa/bookings/status/${_id}`, data);
            fetchData();
            toast.success('Status updated successfully!');
          } catch (error) {
            console.error('Failed to update status', error);
          }
        };
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <select
              value={currentStatus}
              onChange={(event) => handleStatusChange(params.row._id, event.target.value)}
              style={{
                padding: '5px 8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: currentStatus === 'Completed' ? '#e6f7e6' : currentStatus === 'Cancelled' ? '#ffdddd' : '#fff3e0',
                color: currentStatus === 'Completed' ? '#2e7d32' : currentStatus === 'Cancelled' ? '#d32f2f' : '#f99649',
                fontWeight: 500,
                cursor: 'pointer',
                height: 'fit-content'
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </Box>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1.5,
      minWidth: 170,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const isCompleted = params.row.status === 'Completed';
        return (
          <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%" sx={{ gap: '4px' }}>
            <IconButton
              aria-label="View Customer"
              size="small"
              onClick={() => handleOpenViewCustomer(params.row)}
              sx={{ color: '#2196f3' }}
              title="View Details"
            >
              <VisibilityIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="Edit Customer"
              size="small"
              onClick={() => handleOpenEditCustomer(params.row)}
              sx={{ color: '#ff9800' }}
              title="Edit Customer"
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="Delete Customer"
              size="small"
              onClick={() => handleOpenDeleteCustomer(params.row._id)}
              sx={{ color: '#f44336' }}
              title="Delete Customer"
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>

            {/* Conditionally render Invoice Icon */}
            {isCompleted ? (
              <IconButton
                aria-label="Generate Invoice"
                size="small"
                onClick={() => handleOpenInvoice(params.row)}
                sx={{ color: '#4caf50' }}
                title="Generate Invoice"
              >
                <ReceiptIcon fontSize="inherit" />
              </IconButton>
            ) : (
              <Box sx={{ width: 34, height: 34 }} />
            )}
          </Box>
        );
      }
    }
  ];

  return (
    <Container maxWidth="100%" sx={{ padding: { xs: 1, sm: 0 }, margin: 0 }}>
      {/* Header with filters */}
      <Box
        sx={{
          backgroundColor: 'transparent',
          fontSize: '16px',
          fontWeight: '500',
          padding: '0px 0px',
          borderRadius: '0px',
          marginBottom: '0px',
          boxShadow: 'none',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120, backgroundColor: '#fff', borderRadius: '6px', marginRight: '8px' }}>
          <Select
            labelId="filter-label"
            id="filter"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            displayEmpty
            sx={{
              '& .MuiSelect-select': {
                borderRadius: '5px',
                padding: '8px 12px',
                fontSize: '0.875rem',
                color: '#121926',
                fontWeight: '500',
                backgroundColor: 'white',
                border: '1px solid #ccc'
              },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        {/* Guest Type Filter */}
        <FormControl size="small" sx={{ minWidth: 120, backgroundColor: '#fff', borderRadius: '6px' }}>
          <Select
            labelId="guest-type-filter-label"
            id="guest-type-filter"
            value={guestTypeValue}
            onChange={(e) => setGuestTypeValue(e.target.value)}
            displayEmpty
            sx={{
              '& .MuiSelect-select': {
                borderRadius: '5px',
                padding: '8px 12px',
                fontSize: '0.875rem',
                color: '#121926',
                fontWeight: '500',
                backgroundColor: 'white',
                border: '1px solid #ccc'
              },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
          >
            <MenuItem value="all">All Guest Types</MenuItem>
            <MenuItem value="Room">Room Reservation</MenuItem>
            <MenuItem value="Guest">Guest</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box width="100%" sx={{ padding: 0, margin: 0 }}>
        <CustomTableStyle>
          <Card
            sx={{
              minWidth: '100%',
              boxShadow: '0 2px 4px -1px rgba(0,0,0,0.06), 0 4px 5px 0px rgba(0,0,0,0.04)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {customerData && (
              <DataGrid
                rows={filteredData?.map((row, index) => ({ ...row, id: row._id, serialNo: index + 1 }))}
                columns={columns}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { disableToolbarButton: true }
                  }
                }}
                sx={{
                  border: 'none',
                  minHeight: 400,
                  ...paginationStyle,
                  fontSize: '0.875rem',
                  '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0', fontWeight: '600' },
                  '& .MuiDataGrid-cell': { borderBottom: '1px solid #e0e0e0', padding: '0 8px', display: 'flex', alignItems: 'center' },
                  '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
                  '& .MuiDataGrid-toolbarContainer': { padding: '8px 16px', borderBottom: '1px solid #e0e0e0' },
                  '& .MuiInputBase-root': { fontSize: '0.875rem' }
                }}
                density="compact"
                autoHeight
                initialState={{
                  pagination: { paginationModel: { pageSize: 25 } }
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                disableRowSelectionOnClick
              />
            )}
          </Card>
        </CustomTableStyle>
      </Box>

      {/* Modals */}
      {rowData && (
        <>
          <EditCustomer
            open={openEdit}
            handleClose={handleCloseEditCustomer}
            customerData={rowData}
            updateCustomer={handleUpdateCustomer}
          />
          <DeleteCustomer
            open={openDelete}
            handleClose={handleCloseDeleteCustomer}
            customerData={rowData}
            deleteCustomer={handleDeleteCustomer}
          />
          <ViewCustomer open={openView} handleClose={handleCloseViewCustomer} customerData={rowData} />
          <SpaInvoice open={openInvoice} handleClose={handleCloseInvoice} customerData={rowData} />
        </>
      )}
    </Container>
  );
};

export default Customers;
