/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
// @mui
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Card, Container, MenuItem, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { getApi, patchApi, postApi } from '../services/api';
import AddPackages from './AddPackages';
import DeletePackage from './DeletePackage';
import EditPackages from './EditPackages';

// ----------------------------------------------------------------------

const AdminPackages = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [packageData, setPackageData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const navigate = useNavigate();
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
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const addPackagesData = async (data) => {
    const response = await postApi(`api/packages/add`, data);
    if (response && response.status === 201) {
      getAllPackagesData();
    }
  };

  const handleOpenView = (_id) => {
    console.log('_id ==>', _id);
    navigate(`/dashboard/packages/view/${_id}`);
  };

  const getAllPackagesData = async () => {
    setPackageData();

    try {
      const response = await getApi(`api/packages/getAllPackages`);
      console.log('response for packages ======>', response);

      if (response && response.status === 200) {
        setPackageData([]);
        setPackageData(response?.data?.packagesAllData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // edit packages api
  const editPackagesData = async (values) => {
    try {
      const data = values;
      const result = await patchApi(`api/packages/edit/${editData?._id}`, data);

      if (result && result.status === 200) {
        toast.success('Package Modified Successfully');

        getAllPackagesData();
      }
    } catch (error) {
      toast.error('Cannot Modify Package');
    }
  };

  useEffect(() => {
    getAllPackagesData();

    console.log('thsi is  for useEffect');
    // eslint-disable-next-line
  }, [openDelete]);


  const shouldHidePagination = useMemo(() => !packageData?.length || packageData?.length <= 25, [packageData?.length]);

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

  const columns = [
    {
      field: '_id',
      headerName: 'S.No.',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      valueGetter: (index) => index.api.getRowIndexRelativeToVisibleRows(index.row._id) + 1
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        const handleOpenView = () => {
          navigate(`/dashboard/packages/view/${params.row._id}`);
        };
        return <Box onClick={handleOpenView}>{params.value}</Box>;
      }
    },

    {
      field: 'description',
      headerName: 'Description',
      flex: 1
    },

    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      renderCell: (params) => {
        return <Box> ${params.value}</Box>;
      }
    },

    {
      field: 'days',
      headerName: 'Days',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      // eslint-disable-next-line arrow-body-style
      renderCell: (params) => {
        const handleEditClick = async (data) => {
          setEditData(data);
          handleOpenEdit();
        };
        const handleDeleteClick = async (id) => {
          setDeleteId(id);
          handleOpenDelete();
        };
        return (
          <>
            <>
              <MenuItem
                onClick={() => handleOpenView(params?.row._id)}
                disableRipple
                sx={{ padding: 1, '&:hover': { background: 'none' } }}
              >
                <VisibilityIcon style={{ fontSize: '20px' }} />
              </MenuItem>
              <MenuItem onClick={() => handleEditClick(params?.row)} disableRipple>
                <EditIcon />
              </MenuItem>
              <MenuItem onClick={() => handleDeleteClick(params.row._id)} sx={{ color: 'red' }} disableRipple>
                <DeleteIcon />
              </MenuItem>
            </>
          </>
        );
      }
    }
  ];

  return (
    <>
      <EditPackages open={openEdit} editData={editData} handleClose={handleCloseEdit} editPackagesData={editPackagesData} />
      <AddPackages open={openAdd} handleClose={handleCloseAdd} addPackagesData={addPackagesData} />
      <DeletePackage open={openDelete} handleClose={handleCloseDelete} id={deleteId} getAllPackagesData={getAllPackagesData} />
      <Container maxWidth="100%" sx={{ paddingLeft: '0px !important', paddingRight: '0px !important' }}>
        <Stack
          direction="row"
          alignItems="center"
          mb={5}
          justifyContent={'space-between'}
          sx={{
            display: { lg: 'flex', xs: 'block' },
            backgroundColor: '#fff',
            fontSize: '18px',
            fontWeight: '500',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '15px',
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Typography
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', lg: 'flex-start' }
            }}
            variant="h4"
          >
            Packages Lists
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              marginTop: { xs: '10px', md: '0px', lg: '0px' },
              justifyContent: { xs: 'center', lg: 'flex-end' }
            }}
            spacing={2}
          >
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              New Package
            </Button>
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
                  rows={packageData ?? []}
                  columns={columns?.map((col) => ({
                    ...col,
                    flex: 1,
                    ...paginationStyle,
                    // minWidth: isMobile ? 150 : 100,
                    hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false
                  }))}
                  getRowId={(row) => row._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  sx={{
                    ...paginationStyle,
                    minWidth: '800px',
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

export default AdminPackages;
