// import { useNavigate } from 'react-router-dom';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import EditIcon from '@mui/icons-material/Edit';
// import Iconify from '../../ui-component/iconify';
// import TableStyle from '../../ui-component/TableStyle';
// import { useState, useEffect } from 'react';
// import {
//   Stack,
//   Button,
//   Container,
//   Typography,
//   Box,
//   Card,
//   Popover,
//   Checkbox,
//   FormControlLabel,
//   List,
//   ListItem,
// } from '@mui/material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import DeleteIcon from '@mui/icons-material/Delete';
// import * as React from 'react';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import MenuItem from '@mui/material/MenuItem';
// import IconButton from '@mui/material/IconButton';
// import moment from 'moment';
// import { getApi, patchApi } from 'views/services/api';
// import AddProperty from './AddEmployee.js';
// import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
// import ChangeShift from './ChangeShift';
// import EditEmployee from './EditEmployee';
// import DeleteEmployee from './DeleteEmployee';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { border, useMediaQuery } from '@mui/system';
// import { useMemo } from 'react';

// // List of menu items
// const menuItems = [
//   'Analytics',
//   'Room Management',
//   'Reservation',
//   'Staff Management',
//   'Spa Management',
//   'Restaurant',
//   'Customers',
//   'Reports',
//   'Complaint',
//   'Kitchen Order Ticket',
//   'Invoice',
//   'Inventory',
//   'Laundry',
//   'Expenses',
//   'Subscriptions',
//   'Payments',
//   'Hotel Profile'
// ];

// const StaffManagment = () => {
//   const [ openAdd, setOpenAdd ] = useState( false );
//   const [ openEdit, setOpenEdit ] = useState( false );
//   const [ openDelete, setOpenDelete ] = useState( false );
//   const [ openChangeShift, setOpenChangeShift ] = useState( false );
//   const [ currentShift, setCurrentShift ] = useState( '' );
//   const [ employeeID, setEmployeeId ] = useState( '' );
//   const [ staffData, setstaffData ] = useState( [] );
//   const [ anchorEl, setAnchorEl ] = useState( null );
//   const [ rowData, setRowData ] = useState();
//   const [ permissionsAnchorEl, setPermissionsAnchorEl ] = useState( null );
//   const [ selectedPermissions, setSelectedPermissions ] = useState( [] );
//   const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );
//   const navigate = useNavigate();
//   const isMobile = useMediaQuery( '(max-width:1450px)' ); // for mobile devices


//   const shouldHidePagination = useMemo( () => !staffData?.length || staffData?.length <= 25, [ staffData?.length ] );

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


//   console.log( 'staffData ==>', rowData )
//   //function for the dropdowns
//   const handleClick = ( event, row ) => {
//     setAnchorEl( event.currentTarget );
//     setRowData( row );

//   };



//   const handlePermissionsClick = ( event, row ) => {
//     setPermissionsAnchorEl( event.currentTarget );
//     setRowData( row );
//     setSelectedPermissions( row.permissions || [] );
//   };

//   const handleClose = () => {
//     setAnchorEl( null );
//     setPermissionsAnchorEl( null );
//   };

//   const open = Boolean( anchorEl );
//   const openPermissions = Boolean( permissionsAnchorEl );

//   // function for fetching all the contacts data from the db
//   const fetchstaffData = async () => {
//     try {
//       // const response = await getApi(`api/employee/viewallemployee/${hotel._id}`);
//       const response = await getApi( `api/employee/viewallemployee/${ hotel?.hotelId }` );
//       setstaffData( response?.data?.employeeData );
//     } catch ( error ) {
//       console.log( error );
//     }
//   };

//   useEffect( () => {
//     fetchstaffData();
//   }, [ openAdd, openEdit, openDelete, openChangeShift ] );

//   // add employee dialog
//   const handleOpenAdd = () => setOpenAdd( true );
//   const handleCloseAdd = () => setOpenAdd( false );

//   // edit employee dialog
//   const handleOpenEditEmployee = ( _id ) => {
//     console.log( '_id in handle edit for staff management =>', _id );
//     setOpenEdit( true );
//   };
//   const handleCloseEditEmployee = () => {
//     setOpenEdit( false );
//     handleClose();
//   };

//   // delete employee dialog
//   const handleOpenDeleteEmployee = ( _id ) => {
//     console.log( '_id in handle delete =>', _id );
//     setOpenDelete( true );
//   };
//   const handleCloseDeleteEmployee = () => {
//     setOpenDelete( false );
//     handleClose();
//   };

//   // view employee
//   const handleOpenview = ( _id ) => {
//     console.log( '_id ==>', _id );
//     navigate( `/dashboard/employee/view/${ rowData?._id }` );
//   };

//   // change shift dialog
//   const handleOpenChangeShift = ( employeeData ) => {
//     setCurrentShift( employeeData.shift );
//     setEmployeeId( employeeData._id );
//     setOpenChangeShift( true );
//   };
//   const handleCloseChangeShift = () => {
//     setOpenChangeShift( false );
//   };

//   const handlePermissionsChange = ( event ) => {
//     const value = event.target.name;
//     setSelectedPermissions( ( prev ) => ( prev?.includes( value ) ? prev.filter( ( permission ) => permission !== value ) : [ ...prev, value ] ) );
//   };

//   const handleSavePermissions = async () => {
//     console.log( 'rowData._id ===>', rowData._id );
//     console.log( 'selectedPermissions here ======>', selectedPermissions );

//     try {
//       await patchApi( `api/employee/addPermissions/${ rowData._id }`, {
//         permissions: selectedPermissions
//       } );
//       fetchstaffData();
//     } catch ( error ) {
//       console.log( error );
//     }
//     handleClose();
//   };

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

//     {
//       field: 'fullName',
//       headerName: 'Employee Name',
//       flex: 1,
//       cellClassName: 'name-column--cell name-column--cell--capitalize',
//       renderCell: ( params ) => {
//         const handleOpenViewNameClick = () => {
//           navigate( `/dashboard/employee/view/${ params?.row._id }` );
//         };
//         return <Box onClick={ () => handleOpenViewNameClick() }>{ params?.value }</Box>;
//       }
//     },
//     {
//       field: 'employeeType',
//       headerName: 'Employee Type',
//       flex: 1
//     },
//     {
//       field: 'shift',
//       headerName: 'Working Shift',
//       flex: 1
//     },
//     {
//       field: 'createdDate',
//       headerName: 'Joining Date',
//       flex: 1,
//       renderCell: ( params ) => {
//         return <Box sx={ { whiteSpace: 'nowrap' } }>{ moment( params?.value ).format( 'YYYY-MM-DD ( HH:mm:ss )' ) }</Box>;
//       }
//     },
//     {
//       field: 'salary',
//       headerName: 'Salary',
//       flex: 1,
//       renderCell: ( params ) => {
//         return <Box>${ params?.value }</Box>;
//       }
//     },
//     {
//       field: 'permissions',
//       headerName: 'Permissions',
//       flex: 1,

//       renderCell: ( params ) => {
//         console.log( 'params.row ===>', params.row );
//         return (
//           <>
//             <Button
//               variant="outlined"
//               size="small"
//               sx={ { minWidth: '120px' } }
//               onClick={ ( event ) => handlePermissionsClick( event, params.row ) }
//               startIcon={ <AddCircleOutlineIcon /> }
//             >
//               Permissions
//             </Button>
//             <Popover
//               open={ openPermissions && rowData?._id === params.row._id }
//               anchorEl={ permissionsAnchorEl }
//               onClose={ handleClose }
//               anchorOrigin={ {
//                 vertical: 'bottom',
//                 horizontal: 'left'
//               } }
//             >
//               <List>
//                 { menuItems?.map( ( item ) => (
//                   <ListItem
//                     key={ item }

//                   >
//                     <FormControlLabel
//                       sx={ {
//                         backgroundColor: 'white'

//                       } }
//                       control={
//                         <Checkbox
//                           checked={ selectedPermissions?.includes( item ) }
//                           onChange={ handlePermissionsChange }
//                           name={ item }
//                         />
//                       }
//                       label={ item }
//                     />
//                   </ListItem>

//                 ) ) }
//                 <ListItem>
//                   <Button variant="contained" onClick={ handleSavePermissions }>
//                     Save Permissions
//                   </Button>
//                 </ListItem>
//               </List>
//             </Popover>
//           </>
//         );
//       }
//     },

//     {
//       field: 'changeShift',
//       headerName: 'Change Shift',
//       flex: 1,
//       renderCell: ( params ) => {
//         return (
//           <Button variant="outlined" sx={ { minWidth: '120px' } }
//             size="small" onClick={ () => handleOpenChangeShift( params.row ) } startIcon={ <ChangeCircleIcon /> }>
//             Change Shift
//           </Button>
//         );
//       }
//     },
//     {
//       field: 'action',
//       headerName: 'Action',
//       flex: 1,
//       renderCell: ( params ) => {
//         return (
//           <>
//             <div  >
//               <IconButton aria-describedby={ params?.row._id } variant="contained" onClick={ ( event ) => handleClick( event, params?.row ) }>
//                 <MoreVertIcon />
//               </IconButton>

//               <Popover


//                 id={ params?.row._id }
//                 open={ open }
//                 anchorEl={ anchorEl }
//                 onClose={ handleClose }
//                 anchorOrigin={ {
//                   vertical: 'bottom',
//                   horizontal: 'left'
//                 } }
//               >
//                 <MenuItem onClick={ () => handleOpenEditEmployee( params?.row._id ) } disableRipple>
//                   <EditIcon style={ { marginRight: '8px', fontSize: '20px' } } />
//                 </MenuItem>
//                 <MenuItem onClick={ () => handleOpenview( params?.row._id ) } disableRipple>
//                   <VisibilityIcon style={ { marginRight: '8px', fontSize: '20px' } } />
//                 </MenuItem>
//                 <MenuItem onClick={ () => handleOpenDeleteEmployee( params?.row._id ) } sx={ { color: 'red' } } disableRipple>
//                   <DeleteIcon style={ { marginRight: '8px', color: '#f44336', fontSize: '20px' } } />
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
//       <AddProperty open={ openAdd } handleClose={ handleCloseAdd } />
//       <DeleteEmployee open={ openDelete } handleClose={ handleCloseDeleteEmployee } employeeID={ rowData?._id } />
//       <EditEmployee open={ openEdit } handleClose={ handleCloseEditEmployee } employeeData={ rowData } />
//       <ChangeShift open={ openChangeShift } handleClose={ handleCloseChangeShift } employeeID={ employeeID } currentShift={ currentShift } />
//       <Container maxWidth="100%" sx={ { paddingLeft: '0px !important', paddingRight: '0px !important' } }>
//         <Stack
//           direction="row"
//           alignItems="center"
//           mb={ 5 }
//           justifyContent={ 'space-between' }
//           sx={ {
//             backgroundColor: '#fff',
//             fontSize: '18px',
//             fontWeight: '500',
//             padding: '15px',
//             borderRadius: '5px',
//             marginBottom: '15px',
//             boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)'
//           } }
//         >
//           <Typography variant="h4">Employee List</Typography>
//           <Button
//             variant="contained"
//             startIcon={ <Iconify icon="eva:plus-fill" /> }
//             onClick={ handleOpenAdd }
//             sx={ {
//               fontSize: { xs: '12px', sm: '14px' }, // Reduce font size on small screens
//               padding: { xs: '4px 6px', sm: '8px 16px' }, // Adjust padding
//               minWidth: 'auto', // Allow button to shrink
//               maxWidth: '100%', // Prevent overflow
//               whiteSpace: 'nowrap', // Prevent text wrapping
//             } }
//           >
//             Add Employee
//           </Button>
//         </Stack>
//         <TableStyle>
//           <Box >

//             <Card
//               sx={ {
//                 minWidth: '100%',
//                 paddingTop: '15px',
//                 boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
//                 borderRadius: '5px',
//                 overflowX: 'auto',
//                 '&::-webkit-scrollbar': {
//                   width: '0',
//                   height: '0',
//                 },
//                 '&::-webkit-scrollbar-track': {
//                   backgroundColor: 'transparent',
//                 },
//                 '&::-webkit-scrollbar-thumb': {
//                   backgroundColor: 'transparent',
//                 },
//                 '*': {
//                   scrollbarWidth: 'none',
//                 },
//                 msOverflowStyle: 'none',
//               } }
//             >

//               { staffData && <DataGrid
//                 rows={ staffData?.map( ( row, index ) => ( { ...row, serialNo: index + 1 } ) ) }
//                 columns={ columns?.map( ( col ) => ( {
//                   ...col,
//                   flex: 1,
//                   minWidth: isMobile ? 150 : 100,
//                   hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false,
//                 } ) ) }
//                 components={ { Toolbar: GridToolbar } }
//                 getRowId={ ( row ) => row?._id }
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
//                     wordBreak: 'break-word',// prevent text overflow in cells
//                     whiteSpace: 'nowrap',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',

//                   },
//                   '& .MuiDataGrid-root': {
//                     overflowX: 'auto' // Ensure scrollability
//                   }
//                 } }
//               /> }
//             </Card>

//           </Box>
//         </TableStyle>
//       </Container>
//     </>
//   );
// };
// export default StaffManagment;
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Popover,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import moment from 'moment';
import { getApi, patchApi } from 'views/services/api';
import AddProperty from './AddEmployee.js';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ChangeShift from './ChangeShift';
import EditEmployee from './EditEmployee';
import DeleteEmployee from './DeleteEmployee';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useMediaQuery } from '@mui/system';
import { useMemo } from 'react';

// List of menu items
const menuItems = [
  'Analytics',
  'Room Management',
  'Reservation',
  'Staff Management',
  'Spa Management',
  'Restaurant',
  'Customers',
  'Reports',
  'Complaint',
  'Kitchen Order Ticket',
  'Invoice',
  'Inventory',
  'Laundry',
  'Expenses',
  'Subscriptions',
  'Payments',
  'Hotel Profile'
];

const StaffManagment = () => {
  const [ openAdd, setOpenAdd ] = useState( false );
  const [ openEdit, setOpenEdit ] = useState( false );
  const [ openDelete, setOpenDelete ] = useState( false );
  const [ openChangeShift, setOpenChangeShift ] = useState( false );
  const [ currentShift, setCurrentShift ] = useState( '' );
  const [ employeeID, setEmployeeId ] = useState( '' );
  const [ staffData, setstaffData ] = useState( [] );
  const [ anchorEl, setAnchorEl ] = useState( null );
  const [ rowData, setRowData ] = useState();
  const [ permissionsAnchorEl, setPermissionsAnchorEl ] = useState( null );
  const [ selectedPermissions, setSelectedPermissions ] = useState( [] );
  const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );
  const navigate = useNavigate();

  // Media query breakpoints
  const isMobile = useMediaQuery( '(max-width:600px)' );
  const isLaptop = useMediaQuery( '(min-width:601px) and (max-width:1450px)' );
  const isLargeScreen = useMediaQuery( '(min-width:1451px)' );

  const shouldHidePagination = useMemo( () => !staffData?.length || staffData?.length <= 25, [ staffData?.length ] );

  const paginationStyle = useMemo(
    () => ( {
      '& .css-6tekhb-MuiTablePagination-root': {
        display: shouldHidePagination ? 'none' : 'block',
      },
      '& .MuiDataGrid-footer': {
        display: shouldHidePagination ? 'none' : 'block'
      },
    } ),
    [ shouldHidePagination ]
  );

  //function for the dropdowns
  const handleClick = ( event, row ) => {
    setAnchorEl( event.currentTarget );
    setRowData( row );
  };

  const handlePermissionsClick = ( event, row ) => {
    setPermissionsAnchorEl( event.currentTarget );
    setRowData( row );
    setSelectedPermissions( row.permissions || [] );
  };

  const handleClose = () => {
    setAnchorEl( null );
    setPermissionsAnchorEl( null );
  };

  const open = Boolean( anchorEl );
  const openPermissions = Boolean( permissionsAnchorEl );

  // function for fetching all the contacts data from the db
  const fetchstaffData = async () => {
    try {
      const response = await getApi( `api/employee/viewallemployee/${ hotel?.hotelId }` );
      setstaffData( response?.data?.employeeData );
    } catch ( error ) {
      console.log( error );
    }
  };

  useEffect( () => {
    fetchstaffData();
  }, [ openAdd, openEdit, openDelete, openChangeShift ] );

  // add employee dialog
  const handleOpenAdd = () => setOpenAdd( true );
  const handleCloseAdd = () => setOpenAdd( false );

  // edit employee dialog
  const handleOpenEditEmployee = ( _id ) => {
    setOpenEdit( true );
  };
  const handleCloseEditEmployee = () => {
    setOpenEdit( false );
    handleClose();
  };

  // delete employee dialog
  const handleOpenDeleteEmployee = ( _id ) => {
    setOpenDelete( true );
  };
  const handleCloseDeleteEmployee = () => {
    setOpenDelete( false );
    handleClose();
  };

  // view employee
  const handleOpenview = ( _id ) => {
    navigate( `/dashboard/employee/view/${ rowData?._id }` );
  };

  // change shift dialog
  const handleOpenChangeShift = ( employeeData ) => {
    setCurrentShift( employeeData.shift );
    setEmployeeId( employeeData._id );
    setOpenChangeShift( true );
  };
  const handleCloseChangeShift = () => {
    setOpenChangeShift( false );
  };

  const handlePermissionsChange = ( event ) => {
    const value = event.target.name;
    setSelectedPermissions( ( prev ) => ( prev?.includes( value ) ? prev.filter( ( permission ) => permission !== value ) : [ ...prev, value ] ) );
  };

  const handleSavePermissions = async () => {
    try {
      await patchApi( `api/employee/addPermissions/${ rowData._id }`, {
        permissions: selectedPermissions
      } );
      fetchstaffData();
    } catch ( error ) {
      console.log( error );
    }
    handleClose();
  };

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 0.5,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: ( params ) => <Box sx={ { textAlign: 'center', width: '100%' } }>{ params.value }</Box>,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'fullName',
      headerName: 'Employee Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: ( params ) => {
        const handleOpenViewNameClick = () => {
          navigate( `/dashboard/employee/view/${ params?.row._id }` );
        };
        return <Box onClick={ () => handleOpenViewNameClick() }>{ params?.value }</Box>;
      }
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
      renderCell: ( params ) => {
        return <Box sx={ { whiteSpace: 'nowrap' } }>{ moment( params?.value ).format( 'YYYY-MM-DD ( HH:mm:ss )' ) }</Box>;
      }
    },
    {
      field: 'salary',
      headerName: 'Salary',
      flex: 1,
      renderCell: ( params ) => {
        return <Box>${ params?.value }</Box>;
      }
    },
    {
      field: 'permissions',
      headerName: 'Permissions',
      flex: 1,
      renderCell: ( params ) => {
        return (
          <>
            <Button
              variant="outlined"
              size="small"
              sx={ { minWidth: '120px' } }
              onClick={ ( event ) => handlePermissionsClick( event, params.row ) }
              startIcon={ <AddCircleOutlineIcon /> }
            >
              Permissions
            </Button>
            <Popover
              open={ openPermissions && rowData?._id === params.row._id }
              anchorEl={ permissionsAnchorEl }
              onClose={ handleClose }
              anchorOrigin={ {
                vertical: 'bottom',
                horizontal: 'left'
              } }
            >
              <List>
                { menuItems?.map( ( item ) => (
                  <ListItem key={ item }>
                    <FormControlLabel
                      sx={ { backgroundColor: 'white' } }
                      control={
                        <Checkbox
                          checked={ selectedPermissions?.includes( item ) }
                          onChange={ handlePermissionsChange }
                          name={ item }
                        />
                      }
                      label={ item }
                    />
                  </ListItem>
                ) ) }
                <ListItem>
                  <Button variant="contained" onClick={ handleSavePermissions }>
                    Save Permissions
                  </Button>
                </ListItem>
              </List>
            </Popover>
          </>
        );
      }
    },
    {
      field: 'changeShift',
      headerName: 'Change Shift',
      flex: 1,
      renderCell: ( params ) => {
        return (
          <Button
            variant="outlined"
            sx={ { minWidth: '120px' } }
            size="small"
            onClick={ () => handleOpenChangeShift( params.row ) }
            startIcon={ <ChangeCircleIcon /> }
          >
            Change Shift
          </Button>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: ( params ) => {
        return (
          <>
            <div>
              <IconButton
                aria-describedby={ params?.row._id }
                variant="contained"
                onClick={ ( event ) => handleClick( event, params?.row ) }
              >
                <MoreVertIcon />
              </IconButton>
              <Popover
                id={ params?.row._id }
                open={ open }
                anchorEl={ anchorEl }
                onClose={ handleClose }
                anchorOrigin={ {
                  vertical: 'bottom',
                  horizontal: 'left'
                } }
              >
                <MenuItem onClick={ () => handleOpenEditEmployee( params?.row._id ) } disableRipple>
                  <EditIcon style={ { marginRight: '8px', fontSize: '20px' } } />
                </MenuItem>
                <MenuItem onClick={ () => handleOpenview( params?.row._id ) } disableRipple>
                  <VisibilityIcon style={ { marginRight: '8px', fontSize: '20px' } } />
                </MenuItem>
                <MenuItem onClick={ () => handleOpenDeleteEmployee( params?.row._id ) } sx={ { color: 'red' } } disableRipple>
                  <DeleteIcon style={ { marginRight: '8px', color: '#f44336', fontSize: '20px' } } />
                </MenuItem>
              </Popover>
            </div>
          </>
        );
      }
    }
  ];

  // Configure scroll behavior based on device type
  const tableContainerStyle = useMemo( () => {
    if ( isLaptop ) {
      return {
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '8px',
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555',
        },
      };
    } else if ( isMobile ) {
      return {
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
      };
    } else {
      // Large screens
      return {
        overflowX: 'visible',
      };
    }
  }, [ isLaptop, isMobile ] );

  return (
    <>
      <AddProperty open={ openAdd } handleClose={ handleCloseAdd } />
      <DeleteEmployee open={ openDelete } handleClose={ handleCloseDeleteEmployee } employeeID={ rowData?._id } />
      <EditEmployee open={ openEdit } handleClose={ handleCloseEditEmployee } employeeData={ rowData } />
      <ChangeShift open={ openChangeShift } handleClose={ handleCloseChangeShift } employeeID={ employeeID } currentShift={ currentShift } />
      <Container maxWidth="100%" sx={ { paddingLeft: '0px !important', paddingRight: '0px !important' } }>
        <Stack
          direction="row"
          alignItems="center"
          mb={ 5 }
          justifyContent={ 'space-between' }
          sx={ {
            backgroundColor: '#fff',
            fontSize: '18px',
            fontWeight: '500',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '15px',
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)'
          } }
        >
          <Typography variant="h4">Employee List</Typography>
          <Button
            variant="contained"
            startIcon={ <Iconify icon="eva:plus-fill" /> }
            onClick={ handleOpenAdd }
            sx={ {
              fontSize: { xs: '12px', sm: '14px' },
              padding: { xs: '4px 6px', sm: '8px 16px' },
              minWidth: 'auto',
              maxWidth: '100%',
              whiteSpace: 'nowrap',
            } }
          >
            Add Employee
          </Button>
        </Stack>
        <TableStyle>
          <Box sx={ tableContainerStyle }>
            <Card
              sx={ {
                minWidth: '100%',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px',
                ...( isLaptop && { minWidth: '1200px' } ),
                msOverflowStyle: isLaptop ? 'scrollbar' : 'none',
              } }
            >
              { staffData && <DataGrid
                rows={ staffData?.map( ( row, index ) => ( { ...row, serialNo: index + 1 } ) ) }
                columns={ columns?.map( ( col ) => ( {
                  ...col,
                  flex: 1,
                  minWidth: isMobile ? 150 : 100,
                  hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false,
                } ) ) }
                components={ { Toolbar: GridToolbar } }
                getRowId={ ( row ) => row?._id }
                sx={ {
                  minHeight: 400,
                  fontSize: { xs: '12px', sm: '12px', lg: '14px' },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    fontSize: { xs: '12px', sm: '14px' }
                  },
                  '& .MuiDataGrid-cell': {
                    padding: { xs: '4px', sm: '8px' },
                    wordBreak: 'break-word',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  ...paginationStyle,
                } }
              /> }
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default StaffManagment;