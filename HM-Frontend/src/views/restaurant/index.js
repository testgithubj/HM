import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getApi, postApi, deleteManyApi } from 'views/services/api';
import DeleteItem from './Components/DeleteItem';
import AddItems from './AddItems';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useNavigate } from 'react-router';
import ShowSeparateFoodBill from './ShowSeparateFoodBill';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import sampleFile from 'assets/sampleFile/sampleFile.xlsx';
import { styled } from '@mui/system';
import { useMemo } from 'react';

const Restaurant = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [firstTabOption, setFirstTabOption] = useState('1');
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const isMobile = useMediaQuery('(max-width:600px)'); // for mobile devices


  const shouldHidePagination = useMemo(() =>!itemsData?.length || itemsData?.length <=25, [itemsData]);

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
  

  const fetchItemsData = async () => {
    try {
      const response = await getApi(`api/restaurant/viewallitems/${hotel?.hotelId}`);
      const formattedData = response?.data?.restaurantData.map((item) => ({
        ...item,
        itemImage: item.itemImage.split('/').pop()
      }));
      setItemsData(formattedData);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItemsData();
  }, [openAdd, openDelete]);

  const handleOpenDeleteItem = (itemId) => {
    setId(itemId);
    setOpenDelete(true);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleCloseDeleteItem = () => {
    setOpenDelete(false);
  };

  const handleMakeOrder = () => {
    navigate('/dashboard/separatefood/addfood');
  };

  const handleFirstTabChange = (event, newValue) => {
    setFirstTabOption(newValue);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Update the selected file name in the state
    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      try {
        const response = await postApi(`api/restaurant/importitems/${hotel?.hotelId}`, jsonData);
        if (response.ok) {
          fetchItemsData();
        } else {
          console.error('Failed to import items');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleOpenMenu = () => {
    const hotelId = hotel?.hotelId;
    console.log('hotel id is: ', hotelId);
    // const menuUrl = `${window.location.origin}/menu.html?hotelId=${hotelId}`;
    // window.open(menuUrl, '_blank');
    navigate(`/dashboard/restaurant/viewmenu`, { state: { hotelId } });
  };

  const handleEditItem = (itemId) => {
    const item = itemsData.find((item) => item._id === itemId);
    setCurrentItem(item);
    setOpenAdd(true);
  };

  const onHandleChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel);
    console.log('Selected newRowSelectionModel:', newRowSelectionModel);
  };

  const handleRowSelectionChange = (newRowSelectionModel) => {
    console.log('=>', newRowSelectionModel);
    onHandleChange(newRowSelectionModel);
  };

  const handleDeleteSelectedItems = () => {
    setOpenConfirmDelete(true);
  };

  const handleConfirmDeleteItems = async () => {
    try {
      const response = await deleteManyApi(`api/restaurant/deletemany`, { data: { ids: rowSelectionModel } });
      console.log('response for many delete ===============>', response);
      toast.success('Item Deleted Successfully');
      fetchItemsData();
    } catch (error) {
      console.error('Failed to delete items', error);
    } finally {
      setOpenConfirmDelete(false);
    }
  };

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 0.5,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => <Box sx={{ textAlign: 'center', width: '100%' }}>{params.value}</Box>,
      headerAlign: 'center', // Center-align the header
      align: 'center' // Center-align the cells
    },
    {
      field: 'itemImage',
      headerName: 'Item Image',
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={`${baseUrl}api/uploads/restaurant/Item/${params.value}`}
            alt="Item"
            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
          />
        </div>
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'itemName',
      headerName: 'Item Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      renderCell: (params) => <Box>${params.value}</Box>
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <>
          <EditIcon onClick={() => handleEditItem(params.row._id)} style={{ marginRight: '8px', color: 'blue', cursor: 'pointer' }} />
          <DeleteIcon
            onClick={() => handleOpenDeleteItem(params.row._id)}
            style={{ marginRight: '8px', color: '#f44336', cursor: 'pointer' }}
          />
        </>
      )
    }
  ];

  const handleOpenImportModal = () => {
    setOpenImportModal(true);
  };
  const handleCloseImportModal = () => {
    setOpenImportModal(false);
    fetchItemsData();
  };

  return (
    <Container maxWidth="100%" sx={{ paddingLeft: '0px !important', paddingRight: '0px !important' }}>
      <AddItems open={openAdd} handleClose={handleCloseAdd} currentItem={currentItem} />
      <DeleteItem open={openDelete} handleClose={handleCloseDeleteItem} id={id} />

      <Dialog open={openConfirmDelete} onClose={() => setOpenConfirmDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete these items?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteItems} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openImportModal} onClose={handleCloseImportModal} sx={{ minWidth: {xs:'300px',md:'500px'}, padding: {md:'20px',xs:'2px'}, borderRadius: '10px' }}>
        <DialogTitle >Download Sample File / Import MenuItems File Form Here</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2}>
            {/* Show selected file name here */}
            {selectedFileName && (
              <Typography variant="body2" color="textSecondary">
                Selected File: {selectedFileName}
              </Typography>
            )}

            <Box sx={{
               display:"flex", flexDirection:{md:'row',xs:'column'}  ,alignItems:"center",gap:'15px' }}>
              <Button variant="contained" component="a" href={sampleFile} download>
                Download Sample File
              </Button>

              <Button sx={{color:'blue'}} variant="contained" component="label">
                Upload File
                <input  type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportModal} color="error">
            Cancel
          </Button>
          <Button onClick={handleCloseImportModal} color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Stack
        direction={{ xs: 'column', sm: 'row' }} // Column for mobile, Row for larger screens
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        sx={{
          backgroundColor: '#fff',
          fontSize: '18px',
          fontWeight: '500',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '10px',
          boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* First Line: Title */}
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '16px', sm: '20px', width: '40%' },
            width:{xs:'100%',lg:'350px'},
            marginBottom: { xs: '10px', sm: '0px' } // Add space below title on mobile
          }}
        >
          Restaurant Management
        </Typography>

        {/* Second Line (Mobile): Buttons */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-end' }, // Center on mobile, right on large screens
            width: '100%',
            gap:1,
            padding: { xs: '10px', sm: '0px' } // Extra space before buttons on mobile
          }}
        >
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleMakeOrder}
            sx={{
              backgroundColor: '#673ab7',
              '&:hover': { backgroundColor: '#563099' },
              fontSize: { xs: '12px', sm: '14px' }, // Adjust text size
              padding: { xs: '5px', sm: '8px' }
            }}
          >
            Make Order
          </Button>

          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenAdd}
            sx={{
              backgroundColor: '#673ab7',
              '&:hover': { backgroundColor: '#563099' },
              fontSize: { xs: '12px', sm: '14px' },
              padding: { xs: '5px', sm: '8px' }
            }}
          >
            New Item
          </Button>

          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenImportModal}
            sx={{
              backgroundColor: '#673ab7',
              '&:hover': { backgroundColor: '#563099' },
              fontSize: { xs: '12px', sm: '14px' },
              padding: { xs: '5px', sm: '8px' }
            }}
          >
            Import
          </Button>

          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:menu-fill" />}
            onClick={handleOpenMenu}
            sx={{
              backgroundColor: '#673ab7',
              '&:hover': { backgroundColor: '#563099' },
              fontSize: { xs: '12px', sm: '14px' },
              padding: { xs: '5px', sm: '8px' }
            }}
          >
            Open Menu
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={rowSelectionModel.length === 0}
            onClick={handleDeleteSelectedItems}
            sx={{
              fontSize: { xs: '12px', sm: '14px' },
              padding: { xs: '5px', sm: '8px' }
            }}
          >
            Delete Selected
          </Button>
        </Stack>
      </Stack>
      <TableStyle>

      <Box width={'100%'}>
      <CustomTableStyle>

        <Card
          style={{
            minWidth:isMobile?'600px':'100%',
            minHeight: '600px',
            paddingTop: '15px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            borderRadius: '5px'
          }}
        >
          <TabContext value={firstTabOption}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                px: 2
              }}
            >
              <TabList onChange={handleFirstTabChange}  aria-label="restaurant tabs" textColor="secondary" indicatorColor="secondary">
                <Tab label="Food Items" value="1" />
                <Tab sx={{maxWidth:{xs:'200px',lg:'100%'}}} label="Restaurant Food Invoice (Separate)" value="2" />
              </TabList>
            </Box>

            <TabPanel value="1" sx={{ p: 2, width: '100%', }}>

              {itemsData && (
                <div >
                  <DataGrid
                    rows={itemsData?.map((row, index) => ({ ...row, serialNo: index + 1 }))}
                    columns={columns.map((col) => ({
                      ...col,
                      flex: 1, // Makes columns responsive
                      minWidth: isMobile?150:50,
                      hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false, // Hides non-essential columns on very small screens
                    }))}
                    getRowId={(row) => row._id}
                    checkboxSelection
                    onRowSelectionModelChange={handleRowSelectionChange}
                    rowSelectionModel={rowSelectionModel}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                    rowHeight={60}
                    sx={{
                      fontSize: { xs: '10px', sm: '12px' },
                      ...paginationStyle,
                      minWidth: '600px', // Prevents table from breaking on very small screens
                      '& .MuiDataGrid-toolbarContainer': {
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '15px',
                        padding: '8px 16px',
                        gap: '8px',
                        '& > *:first-child, & > *:nth-child(3)': { display: 'none' },
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
                        padding: '4px 10px 0px',
                        '& .MuiInputBase-root': {
                          borderRadius: '5px',
                        },
                      },
                      '& .MuiCheckbox-root': {
                        padding: '4px',
                      },
                      '& .name-column--cell--capitalize': {
                        textTransform: 'capitalize',
                      },
                    }}
                  />
                </div>
              )}
            </TabPanel>

            <TabPanel value="2" sx={{ p: 2 }}>
              <ShowSeparateFoodBill />
            </TabPanel>
          </TabContext>
        </Card>
        </CustomTableStyle>

      </Box>
      </TableStyle>

    </Container>
  );
};

export default Restaurant;
