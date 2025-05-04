import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Card, Container, useMediaQuery } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import TableStyle from 'ui-component/TableStyle';
import { getApi } from 'views/services/api';
import AddService from './AddService';
import BookService from './components/BookService';
import DeleteService from './DeleteService';
import EditService from './EditService';
import ShowService from './ShowService';

const SpaServices = ({ refreshTrigger }) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openShow, setOpenShow] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openBook, setOpenBook] = useState(false);
  const [spaData, setSpaServices] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [localRefresh, setLocalRefresh] = useState(false); // Local refresh state

  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const isAdmin = hotel?.role === 'admin';
  const isMobile = useMediaQuery('(max-width:1450px)');
  const role = hotel?.role;

  const shouldHidePagination = useMemo(() => !spaData?.length || spaData?.length <= 25, [spaData]);

  const paginationStyle = useMemo(
    () => ({
      '& .css-6tekhb-MuiTablePagination-root': {
        display: shouldHidePagination ? 'none' : 'block'
      },
      '& .MuiDataGrid-footer': {
        display: shouldHidePagination ? 'none' : 'block'
      }
    }),
    [shouldHidePagination]
  );

  
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

  const fetchData = async () => {
    try {
      const response = await getApi('api/spa/services');
      console.log('Fetching spa services data...', response.data);

      if (response?.data) {
        setSpaServices(response.data);
        console.log('Spa services data updated:', response.data);
      } else {
        setSpaServices([]);
        console.log('No spa services data found');
      }
    } catch (error) {
      console.error('Error fetching spa services:', error);
      toast.error('Failed to fetch spa services');
    }
  };

  // Fetch data initially and when any refresh trigger changes
  useEffect(() => {
    fetchData();
  }, [refreshTrigger, localRefresh]);

  // Handlers for Add, Edit, Delete, and Book actions
  const handleOpenAddService = () => setOpenAdd(true);
  const handleCloseAddService = (wasAdded = false) => {
    setOpenAdd(false);
    if (wasAdded) {
      setLocalRefresh((prev) => !prev); // Trigger data refresh
    }
  };

  const handleOpenEditService = (row) => {
    setRowData(row);
    setOpenEdit(true);
  };

  const handleCloseEditService = (wasUpdated = false) => {
    setOpenEdit(false);
    setRowData(null);
    if (wasUpdated) {
      // setLocalRefresh((prev) => !prev); // Trigger data refresh
    }
  };

  const handleOpenDeleteService = (row) => {
    setRowData(row);
    console.log(row, 'this is the id for delete');
    setOpenDelete(true);
  };

  const handleCloseDeleteService = (wasDeleted = false) => {
    setOpenDelete(false);
    setRowData(null);
    fetchData();

    if (wasDeleted) {
      setLocalRefresh((prev) => !prev); // Trigger data refresh
    }
  };

  const handleOpenBookService = (row) => {
    setRowData(row);
    setOpenBook(true);
  };

  const handleCloseBookService = () => {
    setOpenBook(false);
    setRowData(null);
  };

  const handleOpenShowServices = (row) => {
    console.log(row, 'this is the id for show');
    setRowData(row);
    setOpenShow(true);
  };

  const handleCloseShowServices = () => {
    setOpenShow(false);
    setRowData(null);
  };

  const triggerRefresh = () => {
    setLocalRefresh((prev) => !prev);
  };

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
      field: 'name',
      headerName: 'Service Name',
      flex: 1
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 0.7,
      renderCell: (params) => <Box>${params.value?.toFixed(2) || '0.00'}</Box>
    },
    {
      field: 'duration',
      headerName: 'Duration',
      flex: 0.7,
      renderCell: (params) => <Box>{params.value} mins</Box>
    },
    {
      field: 'book',
      headerName: 'Book',
      flex: 1,
      renderCell: (params) => {
        return (
          <Button variant="contained" onClick={() => handleOpenBookService(params.row)} sx={{ borderRadius: '4px' }}>
            Book Service
          </Button>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <MenuItem onClick={() => handleOpenShowServices(params.row)} disableRipple>
            <VisibilityIcon style={{ fontSize: '20px', color: '#1976d2' }} />
          </MenuItem>
          <MenuItem onClick={() => handleOpenEditService(params.row)} disableRipple>
            <EditIcon style={{ fontSize: '20px' }} />
          </MenuItem>
          <MenuItem onClick={() => handleOpenDeleteService(params.row)} sx={{ color: 'red' }} disableRipple>
            <DeleteIcon style={{ color: '#f44336', fontSize: '20px' }} />
          </MenuItem>
        </Box>
      )
    }
  ];

  return (
    <>
      <ShowService open={openShow} handleClose={handleCloseShowServices} data={rowData} />

      <AddService open={openAdd} onClose={handleCloseAddService} onSuccess={triggerRefresh} />

      <EditService open={openEdit} handleClose={handleCloseEditService} data={rowData} onSuccess={triggerRefresh} />

      <DeleteService open={openDelete} handleClose={handleCloseDeleteService} id={rowData?._id} onSuccess={triggerRefresh} />

      <BookService
        serviceText={'Book Spa Service'}
        serviceType={'Service'}
        open={openBook}
        handleClose={handleCloseBookService}
        serviceData={rowData}
      />

      <Container maxWidth="100%" sx={{ paddingLeft: 0, paddingRight: 0 }}>
        <TableStyle>
          <Box width="100%">
            <CustomTableStyle>
              <Card
                sx={{
                  minWidth: '100%',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
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
                }}
              >
                {spaData && (
                  <DataGrid
                    rows={spaData.map((row, index) => ({ ...row, serialNo: index + 1 }))}
                    columns={columns.map((col) => ({
                      ...col,
                      flex: 1,
                      minWidth: isMobile ? 150 : 100,
                      hide: isMobile ? col.field !== 'serialNo' && col.field !== 'name' && col.field !== 'action' : false
                    }))}
                    getRowId={(row) => row._id}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                    sx={{
                      minHeight: 400,
                      minWidth: '1200px',
                      ...paginationStyle,
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
                        textOverflow: 'ellipsis'
                      },
                      '& .MuiDataGrid-root': {
                        overflowX: 'auto'
                      }
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

export default SpaServices;
