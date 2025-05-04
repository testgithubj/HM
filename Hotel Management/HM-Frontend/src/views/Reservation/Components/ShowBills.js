import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../../ui-component/TableStyle';
import { useState } from 'react';
import { Stack, Container, Typography, Box, Card, Button } from '@mui/material';
import * as React from 'react';
import { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';

import { getApi } from 'views/services/api';
import DeleteInvoice from './DeleteInvoice';

// ----------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------

const ShowBill = () => {
  const [ billData, setbillData ] = useState( [] );
  const [ id, setId ] = useState( '' );
  const [ openDelete, setOpenDelete ] = useState( false );
  const [ invData, SetInvData ] = useState();

  const params = useParams();
  const reservationId = params.id;
  console.log( 'reservationId==>', reservationId );
  const navigate = useNavigate();

  const fetchSingleBillData = async () => {
    try {
      const response = await getApi( `api/singleinvoice/view/${ reservationId }` );
      response.data.InvoiceData && setbillData( ( prevBillData ) => [ ...( prevBillData || [] ), ...response.data.InvoiceData ] );
    } catch ( error ) {
      console.log( error );
    }
  };

  // function for fetching all the contacts data from the db

  const fetchbillData = async () => {
    try {
      const response = await getApi( `api/invoice/view/${ reservationId }` );
      setbillData( response?.data?.InvoiceData );
    } catch ( error ) {
      console.log( error );
    }
  };
  useEffect( () => {
    fetchbillData();
    fetchSingleBillData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  const handleGenerateBill = ( billItem ) => {
    // console.log(billItem, 'billItem')
    if ( billItem.type === 'room' || billItem.type === 'food' ) {
      navigate( `/roombill/view/${ billItem._id }` );
    } else {
      navigate( `/singlebill/view/${ billItem.reservationId }` );
    }
  };

  const handleOpenDeleteItem = ( invData ) => {
    SetInvData( invData );
    setOpenDelete( true );
  };
  const handleCloseDeleteItem = () => setOpenDelete( false );

  //---------------------------------------------------------------------
  const columns = [
    {
      field: `invoiceNumber`,
      headerName: 'Invoice Number',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: ( params ) => {
        return (
          <Box>
            <Box onClick={ () => handleGenerateBill( params?.row ) }>{ params.value }</Box>
          </Box>
        );
      }
    },
    {
      field: `name`,
      headerName: 'Name',
      flex: 1,
      cellClassName: ' name-column--cell--capitalize',

      renderCell: ( params ) => {
        return (
          <Box>
            <Box>{ params.value }</Box>
            <div style={ { marginTop: '4px', fontSize: '12px', color: '#777' } }>{ params.row.customerPhoneNumber }</div>
          </Box>
        );
      }
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1
    },

    {
      field: 'type',
      headerName: 'Invoice Type',
      flex: 1,
      renderCell: ( params ) => {
        return <Box>{ params.row.type ? params.value : 'Food+Room' }</Box>;
      }
    },
    {
      field: 'foodAmount',
      headerName: 'Food Amount',
      flex: 1,
      renderCell: ( params ) => {
        return (
          <Box>
            { params.row.totalFoodAmount
              ? `$ ${ params.row.totalFoodAmount }`
              : params.row.foodAmount
                ? `$ ${ params.row.foodAmount }`
                : 'N/A' }
          </Box>
        );
      }
    },
    {
      field: 'roomRent',
      headerName: 'Room Amount',
      flex: 1,
      renderCell: ( params ) => {
        return (
          <Box>
            { params.row.totalRoomAmount ? `$ ${ params.row.totalRoomAmount }` : params.row.roomRent ? `$ ${ params.row.roomRent }` : 'N/A' }
          </Box>
        );
      }
    },
    {
      field: 'advanceAmount',
      headerName: 'Advance Amount',
      flex: 1,
      renderCell: ( params ) => {
        return (
          <Box>
            { params.row.totalRoomAmount
              ? 'N/A'
              : params.row.advanceAmount
                ? `$ ${ params.row.advanceAmount }`
                : params.row.totalRoomAmount
                  ? 'N/A'
                  : 'N/A' }
          </Box>
        );
      }
    },
    {
      field: 'discount',
      headerName: 'Discount',
      flex: 1,
      renderCell: ( params ) => {
        return <Box>{ params.value ? `$ ${ params.value }` : ' N/A' }</Box>;
      }
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
      renderCell: ( params ) => {
        return <Box>{ params.row.totalAmount ? `$ ${ params.row.totalAmount }` : `$ ${ params.row.totalFoodAndRoomAmount }` }</Box>;
      }
    },

    {
      field: 'action',
      headerName: 'Action',
      flex: 1,

      renderCell: ( params ) => {
        return (
          <>
            <MenuItem onClick={ () => handleOpenDeleteItem( params.row ) } sx={ { color: 'red' } } disableRipple>
              <DeleteIcon style={ { marginRight: '8px', color: '#f44336', fontSize: '20px' } } />
            </MenuItem>
          </>
        );
      }
    }
  ];

  return (
    <>
      <DeleteInvoice open={ openDelete } handleClose={ handleCloseDeleteItem } invData={ invData } />
      <Container maxWidth="100%" sx={ { paddingLeft: '0px !important', paddingRight: '0px !important' } }>
        <Box width="100%">
          <Box sx={ { p: 2 } }>
            <Card elevation={ 0 } sx={ { p: 3, backgroundColor: '#f8f9fa' } }>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={ 2 }>
                <Typography variant="h4">Invoice List ({ billData?.length || 0 })</Typography>
              </Stack>

              <TableStyle>
                <Box sx={ { height: 500, width: '100%' } }>
                  { billData && (
                    <DataGrid
                      rows={ billData }
                      columns={ columns }
                      checkboxSelection
                      getRowId={ ( row ) => row?._id }
                      slots={ { toolbar: GridToolbar } }
                      slotProps={ {
                        toolbar: {
                          showQuickFilter: true,
                          sx: {
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
                            }
                          }
                        }
                      } }
                      sx={ {
                        border: 'none',
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
                          padding: '4px',
                          color: '#673ab7',
                          '&.Mui-checked': {
                            color: '#673ab7'
                          }
                        },
                        '& .MuiDataGrid-cell': {
                          borderBottom: '1px solid #f0f0f0'
                        },
                        '& .MuiDataGrid-columnHeaders': {
                          backgroundColor: '#f8f9fa',
                          color: '#666',
                          fontSize: '0.875rem'
                        },
                        '& .MuiDataGrid-row': {
                          '&:hover': {
                            backgroundColor: '#f8f9fa'
                          }
                        },
                        '& .name-column--cell--capitalize': {
                          textTransform: 'capitalize'
                        }
                      } }
                    />
                  ) }
                </Box>
              </TableStyle>
            </Card>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ShowBill;
