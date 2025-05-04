import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getApi } from 'views/services/api';
import AddComplaint from './AddComplaint';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteComplaint from './DeleteComplaint';
import { styled } from '@mui/system';
import { useMemo } from 'react';

const Complaint = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [complaintId, setComplaintId] = useState();
  const [complaintData, setComplaintData] = useState([]);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'resolved'
  const isMobile = useMediaQuery('(max-width:1400px)'); // for mobile devices



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

  
  const handleOpenDeleteComplaint = (id) => {
    setComplaintId(id);
    setOpenDelete(true);
  };
  const handleCloseDeleteComplaint = () => setOpenDelete(false);

  const handleOpenAddComplaint = () => setOpenAdd(true);
  const handleCloseAddComplaint = () => setOpenAdd(false);

  const handleOpenView = (complaintId) => {
    navigate(`/dashboard/complaint/view/${complaintId}`);
  };

  const fetchComplaintData = async () => {
    try {
      const response = await getApi(`api/complaint/viewallcomplaints/${hotel?.hotelId}`);
      setComplaintData(response?.data?.complaintData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComplaintData();
  }, [openAdd, openDelete]);

  const filteredComplaintData = complaintData.filter((complaint) => {
    if (statusFilter === 'all') return true;
    return statusFilter === 'pending' ? !complaint.status : complaint.status;
  });


  // this is for controll pagination
  const shouldHidePagination = useMemo(() =>!filteredComplaintData?.length || filteredComplaintData?.length <=25, [filteredComplaintData]);

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

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => <Box sx={{ textAlign: 'center' }}>{params.value}</Box>,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'type',
      headerName: 'Complaint Type',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
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
      renderCell: (params) => moment(params?.value).format('YYYY-MM-DD ( HH:mm:ss )')
    },
    {
      field: 'status',
      headerName: 'Complaint Status',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ backgroundColor: params.value ? '#42a142' : '#f44336', color: 'white', padding: '10px', borderRadius: '10px' }}>
          {params.value ? 'Resolved' : 'Pending'}
        </Box>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <MenuItem onClick={() => handleOpenView(params.row._id)} disableRipple>
            <VisibilityIcon style={{ marginRight: '8px', fontSize: '20px' }} />
          </MenuItem>
          <MenuItem onClick={() => handleOpenDeleteComplaint(params.row._id)} sx={{ color: 'red' }} disableRipple>
            <DeleteIcon style={{ marginRight: '8px', color: '#f44336', fontSize: '20px' }} />
          </MenuItem>
        </Box>
      )
    }
  ];

  return (
    <>
      <AddComplaint open={openAdd} handleClose={handleCloseAddComplaint} />
      <DeleteComplaint open={openDelete} handleClose={handleCloseDeleteComplaint} id={complaintId} />
  
      <Container
        maxWidth="100%"
        sx={{
          paddingLeft: '0px !important',
          paddingRight: '0px !important',
        }}
      >
        {/* Responsive Header Section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }} // Column on mobile, row on larger screens
          alignItems={{ xs: 'center', sm: 'center' }}
          justifyContent={{ xs: 'center', sm: 'space-between' }}
          sx={{
            backgroundColor: '#fff',
            fontSize: '16px',
            fontWeight: '500',
            padding: '12px',
            borderRadius: '5px',
            marginBottom: '12px',
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '14px', sm: '18px' },
              marginBottom: { xs: '10px', sm: '0px' },
            }}
          >
            Complaint Management
          </Typography>
  
          {/* Filter and Add Complaint Button Container */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems="center"
            justifyContent={{ xs: 'center', sm: 'flex-end' }}
            spacing={1.5}
            sx={{

              flexWrap: 'wrap',
            }}
          >
            {/* Filter Dropdown */}
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <Typography
                variant="body2"
                sx={{
                  marginRight: '10px',
                  fontSize: { xs: '12px', sm: '14px' },
                }}
              >
                Filter by Status:
              </Typography>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '5px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: '12px',
                }}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </Box>
  
            {/* Add Complaint Button */}
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAddComplaint}
              sx={{
                fontSize: { xs: '12px', sm: '14px' },
                padding: { xs: '4px 6px', sm: '8px 16px' },
                minWidth: 'auto',
                maxWidth: '100%',
                whiteSpace: 'nowrap',
              }}
            >
              Add Complaint
            </Button>
          </Stack>
        </Stack>
  
        {/* Table Section */}
        <TableStyle>
          <Box width="100%"
         >
          <CustomTableStyle>

            <Card
              sx={{
                overflow:'scroll',
                minWidth:'650px',
                height: 'auto',
                padding: '10px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px',
              }}
            >
              {complaintData && (
                <DataGrid
                  rows={filteredComplaintData.map((row, index) => ({ ...row, serialNo: index + 1 }))}
                  columns={columns.map((col)=>({
                    ...col,
                    flex: 1,
                    minWidth: isMobile?200:50,
                    hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false,
                  }))}
                  getRowId={(row) => row?._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  sx={{
                    ...paginationStyle,
                    fontSize: { xs: '10px', sm: '12px' },
                    '& .MuiDataGrid-columnHeaders': {
                      fontSize: { xs: '11px', sm: '13px' },
                     
                    },
                    '& .MuiDataGrid-toolbarContainer': {
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginBottom: '10px',
                      padding: '6px 12px',
                      gap: '6px',
                      '& > *:first-child': { display: 'none' },
                      '& > *:nth-child(3)': { display: 'none' },
                    },
                    '& .MuiButton-root': {
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      color: '#121926',
                      fontSize: { xs: '10px', sm: '12px' },
                      fontWeight: '500',
                      padding: { xs: '4px 6px', sm: '6px 12px' },
                      borderRadius: '5px',
                      textTransform: 'none',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      '&:hover': {
                        backgroundColor: '#f8f9fa',
                        borderColor: '#d0d0d0',
                      },
                    },
                    '& .MuiFormControl-root': {
                      fontSize: { xs: '10px', sm: '12px' },
                      padding: '2px 8px 0px',
                      '& .MuiInputBase-root': {
                        borderRadius: '5px',
                      },
                    },
                    '& .MuiCheckbox-root': {
                      padding: '3px',
                    },
                    '& .name-column--cell--capitalize': {
                      
                      textTransform: 'capitalize',
                    },
                  }}
                />
              )}
            </Card>
          </CustomTableStyle>

          </Box>
        </TableStyle>
      </Container>
    </>
  );  
};

export default Complaint;
