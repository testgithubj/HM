import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { useState } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Popover } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import { useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import { getApi } from 'views/services/api';
import DeleteCustomer from './DeleteVisitor';
import AddCustomer from './AddVisitor.js';
import EditCustomer from './EditVisitors';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const Visitor = ({ isRoomCheckedOut }) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [visitorData, setvisitorData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const navigate = useNavigate();

  const [rowData, setRowData] = useState();

  //function for the dropdowns

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setRowData(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // function for fetching all the customers data from the db

  const fetchvisitorData = async () => {
    try {
      // const response = await getApi(`api/visitors/viewallvisitors/${hotel._id}`);
      const response = await getApi(`api/visitors/viewallvisitors/${hotel?.hotelId}`);
      setvisitorData(response?.data?.visitorsData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchvisitorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAdd, openEdit, openDelete]);

  //functions for dialog boxes----------------------------------
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  // edit customer dialog
  const handleOpenEditCustomer = () => {
    setOpenEdit(true);
  };
  const handleCloseEditCustomer = () => {
    setOpenEdit(false);
    handleClose();
  };

  // delete customer dialog
  const handleOpenDeleteCustomer = () => {
    setOpenDelete(true);
  };
  const handleCloseDeleteCustomer = () => {
    setOpenDelete(false);
    handleClose();
  };

  // open view customers
  const handleOpenview = () => {
    navigate(`/dashboard/visitor/view/${rowData?.phoneNumber}`);
  };

  //---------------------------------------------------------------------
  const columns = [
    {
      field: `fullName`,
      headerName: 'Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box
            onClick={() => navigate(`/dashboard/visitor/view/${params.row.phoneNumber}`)}
          >{`${params.row.firstName}  ${params.row.lastName}`}</Box>
        );
      }
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number ',
      flex: 1
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1
    },
    {
      field: 'idCardType',
      headerName: 'Id Card Type',
      flex: 1
    },
    {
      field: 'idcardNumber',
      headerName: 'Id Card Number',
      flex: 1
    },

    {
      field: 'action',
      headerName: 'Action',
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            <div>
              <IconButton aria-describedby={params?.row._id} variant="contained" onClick={(event) => handleClick(event, params?.row)}>
                <MoreVertIcon />
              </IconButton>
              <Popover
                id={params?.row._id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
              >
                <MenuItem onClick={() => handleOpenEditCustomer()} disableRipple>
                  <EditIcon style={{ marginRight: '8px', fontSize: '20px' }} />
                </MenuItem>
                <MenuItem onClick={() => handleOpenview(params.row._id)} disableRipple>
                  <VisibilityIcon style={{ marginRight: '8px', fontSize: '20px' }} />
                </MenuItem>
                <MenuItem onClick={() => handleOpenDeleteCustomer()} sx={{ color: 'red' }} disableRipple>
                  <DeleteIcon style={{ marginRight: '8px', color: '#f44336', fontSize: '20px' }} />
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
      <AddCustomer open={openAdd} handleClose={handleCloseAdd} />
      <DeleteCustomer open={openDelete} handleClose={handleCloseDeleteCustomer} id={rowData?.phoneNumber} />
      <EditCustomer open={openEdit} handleClose={handleCloseEditCustomer} data={rowData} />

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
          <Typography variant="h4">Visitors Information</Typography>
          {!isRoomCheckedOut && (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAdd}
              sx={{
                color: '#673ab7',
                borderColor: '#673ab7',
                '&:hover': {
                  borderColor: '#563099'
                }
              }}
            >
              New Visitor
            </Button>
          )}
        </Stack>

        <Box width="100%">
          <Card
            style={{
              minHeight: '600px',
              paddingTop: '15px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
              borderRadius: '5px'
            }}
          >
            <Box sx={{ p: 2 }}>
              <Card elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h4">Visitor List ({visitorData?.length || 0})</Typography>
                </Stack>

                <TableStyle>
                  <Box sx={{ height: 500, width: '100%' }}>
                    {visitorData && (
                      <DataGrid
                        rows={visitorData}
                        columns={columns}
                        checkboxSelection
                        getRowId={(row) => row?._id}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                          toolbar: {
                            showQuickFilter: true,
                            sx: {
                              '& .MuiButton-root': {
                                color: '#673ab7'
                              },
                              '& .MuiFormControl-root': {
                                '& .MuiInput-root': {
                                  '&:before, &:after': {
                                    borderBottom: '2px solid #673ab7'
                                  }
                                },
                                '& .MuiInputBase-root': {
                                  color: '#673ab7'
                                }
                              }
                            }
                          }
                        }}
                        sx={{
                          border: 'none',
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
                          },
                          '& .MuiDataGrid-toolbarContainer': {
                            padding: '8px 24px'
                          },
                          '& .MuiCheckbox-root': {
                            color: '#673ab7',
                            '&.Mui-checked': {
                              color: '#673ab7'
                            }
                          }
                        }}
                      />
                    )}
                  </Box>
                </TableStyle>
              </Card>
            </Box>
          </Card>
        </Box>
      </Container>
    </>
  );
};
Visitor.propTypes = {
  isRoomCheckedOut: PropTypes.bool.isRequired
};

export default Visitor;
