import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { useState } from 'react';
import { Stack, Button, Container, Typography, Box, Card, MenuItem, Select, Popover, FormControl, InputLabel, useMediaQuery } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';
import { getApi, postApi } from 'views/services/api';
import { useEffect } from 'react';
import moment from 'moment';
import AddKot from './AddKot';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditKot from './EditKot';
import DeleteKot from './DeleteKot';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import './Components/index.css';
import { color, styled } from '@mui/system';
import { useMemo } from 'react';
// ----------------------------------------------------------------------

const KitchenOrderTicket = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [expenseData, setexpenseData] = useState([]);
  const [kotData, setKotData] = useState([]);
  const [filterType, setFilterType] = useState('today');
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [rowData, setRowData] = useState();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width:600px)'); // for mobile devices

  const CustomTableStyle = styled(Box)(({ theme }) => ({
    width: '100%',
    overflowX: 'auto',
  
    // Styling for Webkit browsers (Chrome, Safari, Edge) to *hide* the scrollbar
    '&::-webkit-scrollbar': {
      width: '0',  // Set width to 0 to hide
      height: '0', // Set height to 0 to hide
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',  // Make the track transparent
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent',  // Make the thumb transparent
    },
    // Styling for Firefox to *hide* the scrollbar
    '*': {  // Apply to all elements within
      scrollbarWidth: 'none', // This hides the scrollbar in Firefox
    },
    msOverflowStyle: 'none',  // Hide the scrollbar in IE and Edge (legacy)
  }));

  console.log('kotttt', kotData);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleClick = (event, row) => {
    console.log(event, 'this is for event ');
    console.log('row on click ==>', row);
    setAnchorEl(event.currentTarget);
    setRowData(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleOpenEditRoom = () => {
    setOpenEdit(true);
  };
  const handleCloseEditRoom = () => {
    setOpenEdit(false);
    handleClose();
  };

  // delete room dialog
  const handleOpenDeleteRoomDialog = () => {
    setOpenDelete(true);
  };
  const handleCloseDeleteRoomDialog = () => {
    setOpenDelete(false);
    handleClose();
  };

  const handleOpenDeleteExpense = () => {
    setOpenCloseDialog(true);
  };

  // view
  const handleOpenview = (_id) => {
    console.log('_id ==>', _id);
    navigate(`/dashboard/kot/view/${rowData?._id}`);
  };

  const fetchKOTData = async () => {
    try {
      const response = await getApi(`api/kitchenorderticket/viewallKot/${hotel?.hotelId}`);
      console.log('get all fetchKOTData response ==>', response);

      if (response.status === 204) {
        setKotData([]);
      } else {
        setKotData(response?.data?.mergedData);
      }
    } catch (error) {
      console.log('found error ==>', error);
    }
  };
  console.log('kotData ==>', kotData);

  // controll status value
  const [statusValue, setStatusValue] = React.useState('');

  useEffect(() => {
    fetchKOTData();
  }, [openAdd, openCloseDialog, openEdit, openDelete, statusValue]);

  // handle status
  const handleChange = async (event, id) => {
    setStatusValue(event.target.value);
    // console.log(event.target.value,'this is the value from dropdown ');

    const data = {
      status: event.target.value
    };

    try {
      const response = await postApi(`api/kitchenorderticket/updateStatus/${id}`, data);
      console.log('update response ==>', response);
      if (response.status === 200) {
        // this is for alret when status changed

        toast.success('Status updated successfully');

        console.log(kotData, 'thsi is for kotDAta');
      }
    } catch (error) {
      console.log('found error ==>', error);
    }
    console.log(id, data, 'this is for the che');
  };



  
  const shouldHidePagination = useMemo(() =>!kotData?.length || kotData?.length <=25, [kotData]);

  const paginationStyle = useMemo(
    () => ({
      '& .css-6tekhb-MuiTablePagination-root': {
        display: shouldHidePagination ? 'none' : 'block',
      },
      '& .MuiDataGrid-footer': { // Add this to hide the footer
        display: shouldHidePagination ? 'none' : 'block'
      },
    }),
    [shouldHidePagination]
  );

  // Function to handle filter change
  // const handleFilterChange = (event) => {
  //   setFilterType(event.target.value);
  // };

  // Function to filter the expenses based on the selected filter type
  // const applyFilter = () => {
  //   switch (filterType) {
  //     case 'today':
  //       return kotData.filter((expense) => {
  //         const expenseDate = new Date(expense.createdDate);
  //         const today = new Date();
  //         return moment(expenseDate).isSame(today, 'day');
  //       });
  //     case 'week':
  //       return kotData.filter((expense) => {
  //         const expenseDate = new Date(expense.createdDate);
  //         const startOfWeek = moment().startOf('week').toDate();
  //         const endOfWeek = moment().endOf('week').toDate();
  //         return moment(expenseDate).isBetween(startOfWeek, endOfWeek, 'day', '[]');
  //       });
  //     case 'month':
  //     default:
  //       return expenseData.filter((expense) => {
  //         const expenseDate = new Date(expense.createdDate);
  //         const startOfMonth = moment().startOf('month').toDate();
  //         const endOfMonth = moment().endOf('month').toDate();
  //         return moment(expenseDate).isBetween(startOfMonth, endOfMonth, 'day', '[]');
  //       });
  //   }
  // };

  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'yellow';
      case 'In Progress':
        return 'orange';
      case 'Delivered':
        return 'green';
      default:
        return 'transparent';
    }
  };

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => <Box sx={{ textAlign: 'center', width: '100%' }}>{params.value}</Box>,
      headerAlign: 'center', // Center-align the header
      align: 'center' // Center-align the cells
    },
    {
      field: 'staffName',
      headerName: 'Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1
    },
    {
      field: 'createdDate',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        return <Box>{moment(params.value).format('YYYY-MM-DD')}</Box>;
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Select
              className={`status-select ${params?.row.status}`} // Dynamically apply class
              value={params?.row?.status}
              size="small"
              fullWidth
              sx={{
                maxWidth: '120px',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                '& .MuiSvgIcon-root': {
                  display: 'none'
                }
              }}
              onChange={(event) => handleChange(event, params?.row._id)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In-Progress">In Progress</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </Select>
          </>
        );
      }
    },
    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   flex: 1,

    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <div>
    //           <MenuItem onClick={() => handleOpenDeleteExpense(params.row._id)} sx={{ color: 'red' }} disableRipple>
    //             <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
    //             Delete
    //           </MenuItem>
    //           <MenuItem onClick={() => handleOpenDeleteExpense(params.row._id)} sx={{ color: 'red' }} disableRipple>
    //             <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
    //             Delete
    //           </MenuItem>
    //         </div>
    //       </>
    //     );
    //   }
    // }

    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      // eslint-disable-next-line arrow-body-style
      renderCell: (params) => {
        return (
          <>
            <div style={{position: 'relative'}} >
              <IconButton aria-describedby={params?.row._id} variant="contained" onClick={(event) => handleClick(event, params?.row)}>
                <MoreVertIcon />
              </IconButton>

              <div style={{position:'absolute',top:'0px',left:'0px'}}>

              <Popover
              sx={{position:'absolute'}}
          
                id={params?.row._id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
              >
                <MenuItem onClick={() => handleOpenEditRoom()} disableRipple>
                  <EditIcon style={{ marginRight: '8px', fontSize: '20px' }} />
                </MenuItem>
                <MenuItem onClick={() => handleOpenview(params?.row._id)} disableRipple>
                  <VisibilityIcon style={{ marginRight: '8px', fontSize: '20px' }} />
                </MenuItem>
                <MenuItem onClick={() => handleOpenDeleteRoomDialog()} sx={{ color: 'red' }} disableRipple>
                  <DeleteIcon style={{ marginRight: '8px', color: '#f44336', fontSize: '20px' }} />
                </MenuItem>
              </Popover>

              </div>
             
            </div>
          </>
        );
      }
    }
  ];

  return (
    <>
      <AddKot open={openAdd} handleClose={handleCloseAdd} />
      <DeleteKot open={openDelete} handleClose={handleCloseDeleteRoomDialog} id={rowData?._id} />
      <EditKot open={openEdit} handleClose={handleCloseEditRoom} data={rowData} />
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
          <Typography variant="h4">Kitchen Order Ticket</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAdd}
              sx={{
                fontSize: { xs: '12px', sm: '14px' }, // Reduce font size on small screens
                padding: { xs: '4px 6px', sm: '8px 16px' }, // Adjust padding
                minWidth: 'auto', // Allow button to shrink
                maxWidth: '100%', // Prevent overflow
                whiteSpace: 'nowrap', // Prevent text wrapping
              }}
            >
              New Ticket
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%">
          {/* <CustomTableStyle> */}

          <Card
              sx={{
                minWidth: '100%',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px',
                overflowX: 'auto', // Allow horizontal scrolling
                // Styling for Webkit browsers (Chrome, Safari, Edge) to *hide* the scrollbar
                  '&::-webkit-scrollbar': {
                    width: '0',  // Set width to 0 to hide
                    height: '0', // Set height to 0 to hide
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',  // Make the track transparent
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'transparent',  // Make the thumb transparent
                  },
                  // Styling for Firefox to *hide* the scrollbar
                  '*': {  // Apply to all elements within
                    scrollbarWidth: 'none', // This hides the scrollbar in Firefox
                  },
                  msOverflowStyle: 'none',  // Hide the scrollbar in IE and Edge (legacy)
              }}
            >
              {kotData && (
                <DataGrid
                  rows={kotData.map((row, index) => ({ ...row, serialNo: index + 1 }))}
                  columns={columns.map((col)=>({
                    ...col,
                    flex: 1,
                    minWidth: isMobile?150:50,
                    hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false,
                  }))}
                  getRowId={(row) => row?._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  sx={{
                    ...paginationStyle,

                    minWidth: '900px', // Ensure the table is wider than small screens
                    fontSize: { xs: '12px', sm: '10px',lg:'14px' }, // Reduce font size for mobile
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#f5f5f5',
                      fontSize: { xs: '12px', sm: '14px' }
                    },
                    '& .MuiDataGrid-cell': {
                      padding: { xs: '4px', sm: '8px' } // Adjust padding
                    },
                    '& .MuiDataGrid-root': {
                      overflowX: 'auto' // Ensure scrollability
                    }
                  }}
                />
              )}
            </Card>
            {/* </CustomTableStyle> */}

          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default KitchenOrderTicket;
