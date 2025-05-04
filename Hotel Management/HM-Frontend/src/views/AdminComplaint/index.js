import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Card, Container, FormControl, InputLabel, MenuItem, Select, Stack, Switch, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getApi, patchApi } from 'views/services/api';
import TableStyle from '../../ui-component/TableStyle';
import DeleteComplain from './DeleteComplaint';

const AdminComplaint = () => {
  const navigate = useNavigate();
  const [complaintData, setcomplaintData] = useState([]);
  const [statusChanged, setStatusChanged] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'resolved'
  const [rowData, setRowData] = useState(null); // Add state to track selected row data

  // function for changing the complaint status ---------------------------------
  const handleToggleStatus = async (complaintId, currentStatus) => {
    try {
      const response = await patchApi(`api/complaint/changecomplaintstatus/${complaintId}`);
      if (response.status === 200) {
        toast.success(currentStatus ? 'Complaint marked as pending' : 'Complaint resolved successfully');
        setStatusChanged((prevStatusChanged) => !prevStatusChanged);
      } else {
        toast.error('Could not update complaint status');
      }
    } catch (e) {
      console.log(e);
      toast.error('Cannot update complaint status');
    }
  };

  // view employee
  const handleOpenView = (_id) => {
    console.log('_id ==>', _id);
    navigate(`/dashboard/complaint/view/${_id}`);
  };

  // Complaint deletion handler
  const handleOpenDeleteComplain = (row) => {
    // Only allow deletion if complaint is resolved
    if (row.status) {
      console.log('row data in handle delete =>', row);
      setRowData(row); // Set the selected row data
      setOpenDelete(true);
    } else {
      toast.warning('Pending complaints cannot be deleted');
    }
  };

  const handleCloseDeleteComplain = () => {
    setOpenDelete(false);
    fetchcomplaintData(); // Refresh data after deletion
  };

  const CustomTableStyle = styled(Box)(({ theme }) => ({
    width: '100%',
    overflowX: 'auto', // Ensures horizontal scrolling is enabled
    whiteSpace: 'nowrap', // Prevents content from wrapping

    // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge)
    '&::-webkit-scrollbar': {
      width: '0', // Hides the scrollbar
      height: '0' // Hides the scrollbar
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent' // Makes the track transparent
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent' // Makes the thumb transparent
    },

    // Firefox scrollbar behavior
    '*': {
      scrollbarWidth: 'none' // Hides the scrollbar in Firefox
    },

    msOverflowStyle: 'none' // Hide scrollbar in IE and Edge
  }));

  // function for fetching all the rooms data from the db
  const fetchcomplaintData = async () => {
    try {
      console.log('url hit ==>', `api/complaint/viewallcomplaints`);
      const response = await getApi(`api/complaint/viewallcomplaints`);
      console.log('response print hereeeeee  =====>', response);
      if (response.status === 204) {
        setcomplaintData([]);
      } else {
        setcomplaintData(response?.data?.mergedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchcomplaintData();
  }, [statusChanged]);

  const filteredComplaintData = complaintData.filter((complaint) => {
    if (statusFilter === 'all') return true;
    return statusFilter === 'pending' ? !complaint.status : complaint.status;
  });

  const shouldHidePagination = useMemo(
    () => !filteredComplaintData?.length || filteredComplaintData?.length <= 25,
    [filteredComplaintData?.length]
  );

  const paginationStyle = useMemo(
    () => ({
      '& .css-6tekhb-MuiTablePagination-root': {
        display: shouldHidePagination ? 'none' : 'block'
      },
      '& .MuiDataGrid-footer': {
        // Add this to hide the footer
        display: shouldHidePagination ? 'none' : 'block'
      }
    }),
    [shouldHidePagination]
  );

  // Custom status toggle switch styling
  const StatusSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#42a142',
      '&:hover': {
        backgroundColor: 'rgba(66, 161, 66, 0.08)'
      }
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#42a142'
    },
    '& .MuiSwitch-switchBase': {
      color: '#d18d28',
      '&:hover': {
        backgroundColor: 'rgba(209, 141, 40, 0.08)'
      }
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#d18d28'
    }
  }));

  const columns = [
    {
      field: 'hotelName',
      headerName: 'Hotel Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        return <Box onClick={() => navigate(`/dashboard/admincomplaint/view/${params.row._id}`)}>{params.value}</Box>;
      }
    },
    {
      field: 'type',
      headerName: 'Complaint Type',
      flex: 1
    },
    {
      field: 'description',
      headerName: 'Complaint Description',
      flex: 1
    },
    {
      field: 'createdDate',
      headerName: 'Created At',
      flex: 1,
      renderCell: (params) => {
        return <Box>{moment(params?.value).format('YYYY-MM-DD ( HH:mm:ss )')}</Box>;
      }
    },

    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="textSecondary">
              {params.row.status ? 'Resolved' : 'Pending'}
            </Typography>
            <StatusSwitch
              checked={params.row.status}
              onChange={() => handleToggleStatus(params.row._id, params.row.status)}
              inputProps={{ 'aria-label': 'toggle complaint status' }}
            />
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <MenuItem onClick={() => handleOpenView(params?.row._id)} disableRipple sx={{ padding: 1, '&:hover': { background: 'none' } }}>
            <VisibilityIcon style={{ fontSize: '20px' }} />
          </MenuItem>
          {/* {params.row.status ? (
            // Only show active delete button if status is resolved (true)
            <MenuItem
              onClick={() => handleOpenDeleteComplain(params.row)}
              sx={{ padding: 0, color: 'red', '&:hover': { background: 'none' } }}
              disableRipple
            >
              <DeleteIcon style={{ color: '#f44336', fontSize: '20px' }} />
            </MenuItem>
          ) : (
            // Show disabled delete button with tooltip when status is pending
            <Tooltip title="Pending complaints cannot be deleted">
              <MenuItem
                sx={{ padding: 0, color: 'gray', opacity: 0.5, cursor: 'not-allowed', '&:hover': { background: 'none' } }}
                disableRipple
              >
                <DeleteIcon style={{ color: '#bdbdbd', fontSize: '20px' }} />
              </MenuItem>
            </Tooltip>
          )} */}
        </div>
      )
    }
  ];

  return (
    <>
      <Container maxWidth="100%" sx={{ paddingLeft: '0px !important', paddingRight: '0px !important' }}>
        <Stack
          direction="row"
          alignItems="center"
          mb={5}
          justifyContent={'space-between'}
          sx={{
            display: { xs: 'block', lg: 'flex' },
            backgroundColor: '#fff',
            fontSize: '18px',
            fontWeight: '500',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '15px',
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Typography variant="h4">Complaint-Management</Typography>
          <Box sx={{ marginTop: { lg: '0px', xs: '10px' }, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">Filter by Status:</Typography>
            <FormControl size="small" sx={{ minWidth: { lg: 150, xs: 120 } }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
        {/* Properly pass the complaintId to DeleteComplain component */}
        <DeleteComplain
          open={openDelete}
          handleClose={handleCloseDeleteComplain}
          complaintID={rowData?._id} // Make sure your DeleteComplain component accepts complaintID prop
        />
        <TableStyle>
          <Box width="100%">
            <Card
              style={{
                height: '600px',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px'
              }}
            >
              <Typography variant="h4" sx={{ margin: '2px 15px' }}>
                Complaints ( {filteredComplaintData?.length} )
              </Typography>
              <CustomTableStyle>
                <DataGrid
                  rows={filteredComplaintData}
                  columns={columns}
                  getRowId={(row) => row?._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  sx={{
                    ...paginationStyle,

                    minWidth: '1200px', // Ensure content is wide enough to cause scrolling

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
                  }}
                />
              </CustomTableStyle>
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default AdminComplaint;
