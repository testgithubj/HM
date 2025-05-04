import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { useState } from 'react';
import { Stack, Button, Container, Typography, Box, Card } from '@mui/material';
import * as React from 'react';
import { toast } from 'react-toastify';
import { getApi, patchApi } from 'views/services/api';
import { useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddItems from './AddFoodToReservation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { margin, padding } from '@mui/system';

// ----------------------------------------------------------------------

const Food = () => {
  const params = useParams();
  const navigate = useNavigate();
  const reservationId = params.id;
  const [openAdd, setOpenAdd] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [quantityMap, setQuantityMap] = useState({});
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const [ItemImg, setItemsImg] = useState('');

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const fetchItemsData = async () => {
    try {
      // const response = await getApi(`api/restaurant/viewallitems/${hotel._id}`);
      const response = await getApi(`api/restaurant/viewallitems/${hotel?.hotelId}`);
      console.log('here response ==> ', response);
      // const items = response?.data?.restaurantData || [];

      const formattedData = response?.data?.restaurantData.map((item) => ({
        ...item,
        itemImage: item.itemImage.split('/').pop()
      }));
      setItemsData(formattedData);

      // Initialize quantity map with initial quantity as 0 for each item
      const initialQuantityMap = {};
      formattedData.forEach((item) => {
        initialQuantityMap[item._id] = 0; // Initialize quantity as 0 for each item
      });
      setQuantityMap(initialQuantityMap);
      setItemsData(items);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItemsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAdd]);

  const handleCloseAdd = () => setOpenAdd(false);

  const handleAddButtonClick = async () => {
    const selectedItems = itemsData?.filter((item) => quantityMap[item._id] > 0);
    const foodItems = selectedItems?.map((item) => {
      return {
        id: item._id,
        name: item.itemName,
        price: item.amount,
        quantity: quantityMap[item._id]
      };
    });

    try {
      if (foodItems.length === 0) {
        toast.error('Please select at least one item');
      } else {
        const response = await patchApi(`api/reservation/editfooditems/${reservationId}`, foodItems);
        if (response.status === 200) toast.success('Food Item(s) Added Successfully!');
        navigate(`/dashboard/reservation/view/${reservationId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error('Cannot add food item(s)');
    }
  };

  // Function to handle incrementing quantity for a specific item
  const handleIncrementQuantity = (itemId) => {
    setQuantityMap((prevQuantityMap) => ({
      ...prevQuantityMap,
      [itemId]: (prevQuantityMap[itemId] || 0) + 1
    }));
  };

  // Function to handle decrementing quantity for a specific item
  const handleDecrementQuantity = (itemId) => {
    setQuantityMap((prevQuantityMap) => ({
      ...prevQuantityMap,
      [itemId]: Math.max((prevQuantityMap[itemId] || 0) - 1, 0)
    }));
  };

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 0.5,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => <Box sx={{ textAlign: 'center', width: '100%' }}>{params.value}</Box>
      // headerAlign: 'center', // Center-align the header
      // align: 'center' // Center-align the cells
    },
    // {
    //   field: 'itemImage',
    //   headerName: 'Item Image',
    //   flex:1,
    //   renderCell: (params) => (
    //     <div>
    //       <img
    //         src={`${baseUrl}api/uploads/restaurant/Item/${params.value}`}
    //         alt="item"
    //         style={{ width: '50%', height: '50%', borderRadius: '10px', }}
    //       />
    //     </div>
    //   )
    // },
    {
      field: 'itemImage',
      headerName: 'Item Image',
      flex: 1,
      renderCell: (params) => (
        <div>
          <img
            src={`${baseUrl}api/uploads/restaurant/Item/${params.value}`}
            alt="item"
            style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }}
          />
        </div>
      )
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
      renderCell: (params) => {
        const itemPrice = params.value;
        const itemQuantity = quantityMap[params.row._id] || 0;
        const totalPrice = itemPrice * itemQuantity;
        return <Box>${totalPrice}</Box>;
      }
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => handleIncrementQuantity(params.row._id)}>
            <AddIcon />
          </IconButton>
          {quantityMap[params.row._id] || 0}
          <IconButton onClick={() => handleDecrementQuantity(params.row._id)}>
            <RemoveIcon />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <>
      <AddItems open={openAdd} handleClose={handleCloseAdd} />
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
          <Typography variant="h4">Food Items</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAddButtonClick}>
              Add
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ color: '#673ab7', borderColor: '#673ab7' }}
              onClick={() => navigate(-1)}
            >
              Back
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
              {itemsData && (
                <DataGrid
                  // rows={itemsData}
                  // columns={columns}
                  rows={itemsData?.map((row, index) => ({ ...row, serialNo: index + 1 }))}
                  columns={columns}
                  // checkboxSelection
                  getRowId={(row) => row._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  rowHeight={60}
                  sx={{
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
                  }}
                />
              )}
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default Food;
