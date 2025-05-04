import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Card, Container, Popover } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { useMediaQuery } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableStyle from 'ui-component/TableStyle.js';
import { getApi } from 'views/services/api';
import ChangeShift from 'views/Staff/ChangeShift';
import DeleteEmployee from './DeleteEmployee';
import EditEmployee from './EditEmployee';
import { styled } from '@mui/system';

const SpaStaff = ( { refreshTrigger } ) => {
  const [ openEdit, setOpenEdit ] = useState( false );
  const [ openDelete, setOpenDelete ] = useState( false );
  const [ openChangeShift, setOpenChangeShift ] = useState( false );
  const [ currentShift, setCurrentShift ] = useState( '' );
  const [ employeeID, setEmployeeId ] = useState( '' );
  const [ staffData, setStaffData ] = useState( [] );
  const [ anchorEl, setAnchorEl ] = useState( null );
  const [ rowData, setRowData ] = useState();
  const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );
  const navigate = useNavigate();
  const isMobile = useMediaQuery( '(max-width:1450px)' );

  const shouldHidePagination = useMemo( () => !staffData?.length || staffData?.length <= 25, [ staffData?.length ] );

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
  // function for the dropdown menu
  const handleClick = ( event, row ) => {
    setAnchorEl( event.currentTarget );
    setRowData( row );
  };

  const handleClose = () => {
    setAnchorEl( null );
  };

  const open = Boolean( anchorEl );

  // function for fetching all the staff data from the db
  const fetchStaffData = async () => {
    try {
      const response = await getApi( `api/spaStaff/viewallspaStaff/${ hotel?.hotelId }` );
      setStaffData( response?.data?.spaStaffData );
    } catch ( error ) {
      console.log( error );
    }
  };

  useEffect( () => {
    fetchStaffData();
  }, [ refreshTrigger, openEdit, openDelete, openChangeShift ] );

  // edit employee dialog
  const handleOpenEditEmployee = ( _id ) => {
    console.log( '_id in handle edit for staff management =>', _id );
    setOpenEdit( true );
  };

  const handleCloseEditEmployee = () => {
    setOpenEdit( false );
    handleClose();
    fetchStaffData();
  };

  // delete employee dialog
  const handleOpenDeleteEmployee = ( _id ) => {
    console.log( '_id in handle delete =>', _id );
    setOpenDelete( true );
  };

  const handleCloseDeleteEmployee = () => {
    setOpenDelete( false );
    handleClose();
    fetchStaffData();
  };

  // view employee
  const handleOpenView = ( _id ) => {
    console.log( '_id ==>', _id );
    navigate( `/dashboard/spaStaff/view/${ _id }` );
  };

  // change shift dialog
  const handleOpenChangeShift = ( employeeData ) => {
    setCurrentShift( employeeData.shift );
    setEmployeeId( employeeData._id );
    setOpenChangeShift( true );
  };

  const handleCloseChangeShift = () => {
    setOpenChangeShift( false );
    fetchStaffData();
  };

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 0.5,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: ( params ) => <Box sx={ { textAlign: 'center', width: '100%' } }>{ params.value }</Box>,
      headerAlign: 'center', // Center-align the header
      align: 'center' // Center-align the cells
    },
    {
      field: 'fullName',
      headerName: 'Employee Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: ( params ) => {
        return <Box onClick={ () => handleOpenView( params?.row._id ) }>{ params?.value }</Box>;
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
    // {
    //   field: 'createdDate',
    //   headerName: 'Joining Date',
    //   flex: 1,
    //   renderCell: (params) => {
    //     return <Box sx={{ whiteSpace: 'nowrap' }}>{moment(params?.value).format('MMMM D, YYYY [at] h:mm A')}</Box>;
    //   }
    // },
    {
      field: 'salary',
      headerName: 'Salary',
      flex: 1,
      renderCell: ( params ) => {
        return <Box>${ params?.value }</Box>;
      }
    },
    // {
    //   field: 'changeShift',
    //   headerName: 'Change Shift',
    //   flex: 1,
    //   renderCell: ( params ) => {
    //     return (
    //       <Button
    //         variant="outlined"
    //         sx={ { minWidth: '120px' } }
    //         size="small"
    //         onClick={ () => handleOpenChangeShift( params.row ) }
    //         startIcon={ <ChangeCircleIcon /> }
    //       >
    //         Change Shift
    //       </Button>
    //     );
    //   }
    // },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: ( params ) => {
        return (
          <>
            <div>
              <IconButton aria-describedby={ params?.row._id } variant="contained" onClick={ ( event ) => handleClick( event, params?.row ) }>
                <MoreVertIcon />
              </IconButton>

              <Popover
                id={ params?.row._id }
                open={ open && rowData?._id === params?.row._id }
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
                <MenuItem onClick={ () => handleOpenView( params?.row._id ) } disableRipple>
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

  return (
    <>
      <DeleteEmployee open={ openDelete } handleClose={ handleCloseDeleteEmployee } employeeID={ rowData?._id } />
      <EditEmployee open={ openEdit } handleClose={ handleCloseEditEmployee } employeeData={ rowData } />
      <ChangeShift open={ openChangeShift } handleClose={ handleCloseChangeShift } employeeID={ employeeID } currentShift={ currentShift } />
      <Container maxWidth="100%" sx={ { paddingLeft: '0px !important', paddingRight: '0px !important' } }>
        <TableStyle>
          <Box>
            <Card
              sx={ {
                minWidth: '100%',
                paddingTop: '15px',
                borderRadius: '5px',
                overflowX: 'auto',
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
              } }
            >
              { staffData && (
                <DataGrid
                  rows={ staffData?.map( ( row, index ) => ( { ...row, serialNo: index + 1 } ) ) }
                  columns={ columns?.map( ( col ) => ( {
                    ...col,
                    flex: 1,
                    minWidth: isMobile ? 150 : 100,
                    hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false
                  } ) ) }
                  components={ { Toolbar: GridToolbar } }
                  getRowId={ ( row ) => row?._id }
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
                      overflowX: 'auto' // Ensure scrollability
                    }
                  } }
                />
              ) }
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default SpaStaff;
