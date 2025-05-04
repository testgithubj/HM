import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { useState } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Select, useMediaQuery } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { getApi } from 'views/services/api';
import { useEffect } from 'react';
import EditLaundary from './EditLaundary';
import AddLaundary from './AddLaundary';
import DeleteLaundary from './DeleteLaundary';
import moment from 'moment';
import { patchApi } from 'views/services/api'; // A
import { toast } from 'react-toastify';
import './laundary.css';
import { useLocation } from 'react-router';
import { styled } from '@mui/system';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const Laundary = () => {
  const [ openAdd, setOpenAdd ] = useState( false );
  const [ openEdit, setOpenEdit ] = useState( false );
  const [ openDelete, setOpenDelete ] = useState( false );
  const [ laundaryId, setLaundaryId ] = useState();
  const [ RoomID, setRoomID ] = useState();
  const [ laundaryData, setLaundaryData ] = useState( [] );
  const [ propsData, setPropsData ] = useState( [] );
  const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );

  // console.log('ll', laundaryData);

  // function for  delete dialog/////////////////////////////////////


  // Create a styled Box component for custom scrollbar styling
  const CustomTableStyle = styled(Box)(({ theme }) => ({
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





  const shouldHidePagination = useMemo( () => !laundaryData?.length || laundaryData?.length <= 25, [ laundaryData ] );

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

  const pathName = useLocation().pathname
  const handleOpenDeleteLaundary = ( _id, roomNo ) => {

    console.log( _id, roomNo, 'this is for laundary id in delete dialog' );
    setLaundaryId( _id );
    setRoomID( roomNo );
    setOpenDelete( true );
  };
  const handleCloseDeleteLaundary = () => setOpenDelete( false );

  // function for add dialog/////////////////////////////////////

  const handleOpenAddLaundary = () => setOpenAdd( true );
  const handleCloseLaundary = () => setOpenAdd( false );

  const handleOpenEditLaundary = ( data ) => {
    setPropsData( data );
    setOpenEdit( true );
  };
  const handleCloseEditLaundary = () => setOpenEdit( false );
  //-----------------------------------------------

  // function for fetching all the rooms data from the db

  const fetchLaundaryData = async () => {
    try {
      console.log( hotel.hotelId, 'this is for hotelId' )

      console.log( 'this is for cheee' )
      // const response = await getApi(`api/laundary/viewalllaundaries/${hotel._id}`);
      // const response = await getApi(`api/laundary/viewalllaundaries/${hotel?.hotelId}`);
      const response = await getApi( `api/laundary/viewalllaundaries/${ hotel?.hotelId }` )
      console.log( response.data, 'this is for response' );
      // const response = await getApi(`api/reservation/viewLaundary`);
      setLaundaryData( response?.data?.laundaryData );
    } catch ( error ) {
      console.log( error );
    }
  };

  // handle status change
  const handleStatusChange = async ( rowData, newStatus ) => {
    try {
      const data = {
        id: rowData._id, // Assuming you have an '_id' for each laundry item
        status: newStatus,
        roomNo: rowData.roomNo
      };

      console.log( rowData, data, 'this is for laundary data status' );


      await patchApi( `api/laundary/edit/status/${ rowData._id }`, data );
      fetchLaundaryData(); // Refresh the table after updating
      toast.success( 'Status updated successfully!' );
    } catch ( error ) {
      console.error( 'Failed to update status', error );
    }
  };

  useEffect( () => {
    fetchLaundaryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ openAdd, openEdit, openDelete ] );

  const isMobile = useMediaQuery( '(max-width:1450px)' ); // for mobile devices

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: isMobile ? 1 : 0.5,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'roomNo',
      headerName: 'Room No',
      flex: 0.5,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'name',
      headerName: 'Laundary Name',
      flex: 1
    },
    {
      field: 'quantity',
      headerName: 'Laundary Quantity',
      minWidth: 120,
      flex: 1
    },
    {
      field: 'amount',
      headerName: 'Amount / Item',
      flex: 1,
      renderCell: ( params ) => <Box>${ params?.value }</Box>
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
      renderCell: ( params ) => <Box>${ params?.row?.amount * params?.row?.quantity }</Box>
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      renderCell: ( params ) =>
        params?.value ? <Box>{ moment( params?.value ).format( 'YYYY-MM-DD' ) }</Box> : <Box sx={ { fontSize: '40px' } }>-</Box>
    },
    {
      field: 'status',
      headerName: 'Laundary Status',
      flex: 2,
      renderCell: ( params ) => {
        console.log( params )


        return (
          <Select
            value={ params?.value }
            onChange={ ( event ) => handleStatusChange( params.row, event.target.value ) }
            size="small"
            fullWidth
            className={ `status-select ${ params?.value }` } // Dynamically apply class
          >
            <MenuItem value="pending">pending</MenuItem>
            <MenuItem value="complete">complete</MenuItem>
            <MenuItem value="refund">Refund</MenuItem>
          </Select>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.5,
      renderCell: ( params ) => {
        console.log( params, 'this is the params' )
        return (
          <>
            <MenuItem onClick={ () => handleOpenEditLaundary( params?.row ) } disableRipple>
              <EditIcon />
            </MenuItem>
            <MenuItem onClick={ () => handleOpenDeleteLaundary( params?.row?._id, params.row.roomNo ) } sx={ { color: 'red' } } disableRipple>
              <DeleteIcon />
            </MenuItem>
          </>
        );
      }
    }
  ];

  return (
    <>
      <AddLaundary open={ openAdd } handleClose={ handleCloseLaundary } />
      <DeleteLaundary pathName={ pathName } open={ openDelete } handleClose={ handleCloseDeleteLaundary } roomId={ RoomID } id={ laundaryId } />
      <EditLaundary open={ openEdit } handleClose={ handleCloseEditLaundary } data={ propsData } />

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
          <Typography variant="h4">Laundary Management</Typography>
          <Stack direction="row" alignItems="center" justifyContent={ 'flex-end' } spacing={ 2 }>
            <Button
              variant="contained"
              startIcon={ <Iconify icon="eva:plus-fill" /> }
              onClick={ handleOpenAddLaundary }
              sx={ {
                fontSize: { xs: '12px', sm: '14px' }, // Reduce font size on small screens
                padding: { xs: '4px 6px', sm: '8px 16px' }, // Adjust padding
                minWidth: 'auto', // Allow button to shrink
                maxWidth: '100%', // Prevent overflow
                whiteSpace: 'nowrap', // Prevent text wrapping
              } }
            >
              Add Laundry
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
          <Box
          > <CustomTableStyle>

              <Card
                style={ {

                  height: '600px',
                  paddingTop: '15px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                  borderRadius: '5px'
                } }
              >

                { laundaryData && (
                  <DataGrid
                    rows={ laundaryData.map( ( row, index ) => ( { ...row, serialNo: index + 1 } ) ) }
                    columns={ columns?.map( ( col ) => ( {
                      ...col,
                      flex: 1,
                      minWidth: isMobile ? 150 : 50,
                      hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false,
                    } ) ) }


                    getRowId={ ( row ) => row?._id }
                    slots={ { toolbar: GridToolbar } }
                    slotProps={ { toolbar: { showQuickFilter: true } } }
                    sx={ {
                      ...paginationStyle,
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
                        backgroundColor: '#fff',
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

export default Laundary;
