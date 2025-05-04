import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Card, Container, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getApi, patchApi } from 'views/services/api';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddHotel from './AddHotel';
import ChangePassword from './ChangePassword';
import DeleteHotel from './DeleteHotel';
import EditHotel from './EditHotel';

// ----------------------------------------------------------------------

const HotelManagement = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [hotelData, sethotelData] = useState([]);
  const [filteredHotelData, setFilteredHotelData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const navigate = useNavigate();

  const shouldHidePagination = useMemo(() => !filteredHotelData?.length || filteredHotelData?.length <= 25, [filteredHotelData?.length]);

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

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenChangePassword = (email) => {
    setSelectedEmail(email);
    setOpenChangePasswordModal(true);
  };

  const handleCloseChangePasswordModal = () => {
    setOpenChangePasswordModal(false);
    setSelectedEmail('');
  };

  const handleChangePassword = async (newPassword) => {
    try {
      const response = await patchApi('api/hotel/changehotelpassword', { email: selectedEmail, password: newPassword });
      if (response.status === 200) {
        toast.success('Password changed successfully');
      } else {
        toast.error('Failed to change password');
      }
      handleCloseChangePasswordModal();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error changing password');
    }
  };

  const handleOpenChangeStatus = async (hotelId) => {
    try {
      const response = await patchApi(`api/hotel/changehotelstatus/${hotelId}`);
      if (response.status === 200) {
        toast.success('Status Changed Successfully');
        setStatusChanged((prevStatusChanged) => !prevStatusChanged);
      } else {
        setStatusChanged(false);
        toast.error('Cannot change status');
      }
    } catch (e) {
      setStatusChanged(false);
      console.log(e);
      toast.error('Cannot change status');
    }
  };

  const fetchhotelData = async () => {
    try {
      const response = await getApi('api/hotel/viewallhotels');
      sethotelData(response?.data);
      filterData(response?.data, statusFilter); // Filter data after fetching
    } catch (error) {
      console.log(error);
    }
  };

  const filterData = (data, filter) => {
    if (filter === 'active') {
      setFilteredHotelData(data.filter((hotel) => hotel.deleted === false));
    } else if (filter === 'inactive') {
      setFilteredHotelData(data.filter((hotel) => hotel.deleted === true));
    } else {
      setFilteredHotelData(data); // Show all data
    }
  };

  useEffect(() => {
    fetchhotelData();
  }, [statusChanged, openAdd, openChangePasswordModal]);

  useEffect(() => {
    filterData(hotelData, statusFilter); // Re-filter data when statusFilter changes
  }, [statusFilter]);

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const handleOpenEdit = (hotel) => {
    setSelectedHotel(hotel);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedHotel(null);
    fetchhotelData();
  };

  const handleOpenDelete = (hotel) => {
    setSelectedHotel(hotel);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedHotel(null);
    fetchhotelData();
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1.5,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        const handleOpenView = () => {
          navigate(`/dashboard/hotel/view/${params.row._id}`);
        };
        return <Box onClick={handleOpenView}>{params.value}</Box>;
      }
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.5
    },
    {
      field: 'contact',
      headerName: 'Contact',
      flex: 1
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1.5
    },
    {
      field: 'deleted',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={
            params?.value === false
              ? {
                  backgroundColor: '#01B574',
                  color: 'white',
                  padding: '4px',
                  borderRadius: '5px'
                }
              : {
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '4px',
                  borderRadius: '5px'
                }
          }
        >
          {params?.value === false ? 'Active' : 'Inactive'}
        </Box>
      )
    },
    {
      field: 'changePassword',
      headerName: 'Change Password',
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button
            sx={{
              fontSize: { xs: '10px', sm: '11px' },
              color: '#fff !important',
              padding: { xs: '4px 8px', sm: '6px 12px' },
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              '& .MuiButton-startIcon': {
                marginRight: { xs: '4px', sm: '8px' }
              }
            }}
            variant="contained"
            startIcon={<ChangeCircleIcon />}
            onClick={() => handleOpenChangePassword(params.row.email)}
          >
            Change Password
          </Button>
        </Box>
      )
    },
    {
      field: 'Change Status',
      headerName: 'Change Status',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button
            sx={{
              fontSize: { xs: '10px', sm: '11px' },
              color: '#fff !important',
              padding: { xs: '4px 8px', sm: '6px 12px' },
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              '& .MuiButton-startIcon': {
                marginRight: { xs: '4px', sm: '8px' }
              }
            }}
            variant="contained"
            startIcon={<ChangeCircleIcon />}
            onClick={() => handleOpenChangeStatus(params.row._id)}
          >
            Change Status
          </Button>
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <MenuItem onClick={() => handleOpenEdit(params.row)} disableRipple sx={{ padding: 1, '&:hover': { background: 'none' } }}>
            <EditIcon style={{ fontSize: '20px' }} />
          </MenuItem>
          <MenuItem
            onClick={() => handleOpenDelete(params.row)}
            sx={{ padding: 0, color: 'red', '&:hover': { background: 'none' } }}
            disableRipple
          >
            <DeleteIcon style={{ color: '#f44336', fontSize: '20px' }} />
          </MenuItem>
        </div>
      )
    }
  ];

  return (
    <>
      <AddHotel open={openAdd} handleClose={handleCloseAdd} />
      <ChangePassword
        open={openChangePasswordModal}
        handleClose={handleCloseChangePasswordModal}
        email={selectedEmail}
        onChangePassword={handleChangePassword}
      />
      <EditHotel open={openEdit} handleClose={handleCloseEdit} data={selectedHotel} />
      <DeleteHotel open={openDelete} handleClose={handleCloseDelete} id={selectedHotel?._id} />
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
          <Typography variant="h4">Hotel Management </Typography>
          <Stack sx={{ marginTop: { xs: '10px', lg: '0px' } }} direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button
              sx={{ fontSize: { xs: '12px', lg: '16px' } }}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAdd}
            >
              Add Hotel
            </Button>
            <FormControl size="small" sx={{ minWidth: { xs: 100, lg: 120 } }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
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
              <CustomTableStyle>
                <DataGrid
                  rows={filteredHotelData || []}
                  columns={columns}
                  getRowId={(row) => row?._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  sx={{
                    ...paginationStyle,
                    minWidth: '1200px' // Ensure content is wide enough to cause scrolling
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

export default HotelManagement;
