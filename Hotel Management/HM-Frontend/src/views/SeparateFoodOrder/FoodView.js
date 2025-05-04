import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { useState } from 'react';
import { Stack, Button, Container, Typography, Box, Card } from '@mui/material';
import * as React from 'react';
import { toast } from 'react-toastify';
import { getApi } from 'views/services/api';
import { useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FoodInvoiceDialog from './FoodInvoiceDialog';
import { display, margin, useMediaQuery } from '@mui/system';

// ----------------------------------------------------------------------

const SeparateFoodView = () => {
  const [openMakeOrder, setOpenMakeOrder] = useState(false);
  const [selectedFoodItems, setSelectedFoodItems] = useState([]);
  const navigate = useNavigate();
  const [itemsData, setItemsData] = useState([]);
  const [quantityMap, setQuantityMap] = useState({});
  const hotel = JSON.parse(localStorage.getItem('hotelData'));

  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Fetch all the restaurant items data from the db
  const fetchItemsData = async () => {
    try {
      // Fetch data from the API
      const response = await getApi(`api/restaurant/viewallitems/${hotel?.hotelId}`);
      console.log('res =>', response);
  
      // Safely access restaurantData, fallback to an empty array if it's missing or empty
      const restaurantData = response?.data?.restaurantData || [];
      
      // Format the data if there are items
      const formattedData = restaurantData.map((item) => ({
        ...item,
        itemImage: item.itemImage.split('/').pop(), // Extract file name from itemImage
      }));
  
      // Update the state with the formatted data
      setItemsData(formattedData);
  
      // Initialize quantity map with initial quantity as 0 for each item
      const initialQuantityMap = {};
      formattedData.forEach((item) => {
        initialQuantityMap[item._id] = 0; // Initialize quantity as 0
      });
      setQuantityMap(initialQuantityMap);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

    const isMobile = useMediaQuery('(max-width:600px)'); // for mobile devices
  
  
  useEffect(() => {
    fetchItemsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openMakeOrder]);

  // open the dialog box
  const handleMakeOrder = () => {
    setOpenMakeOrder(true);
  };
  const handleCloseMakeOrder = () => {
    setOpenMakeOrder(false);
  };

  const handleAddButtonClick = async () => {
    const selectedItems = itemsData.filter((item) => quantityMap[item._id] > 0);
    const foodItems = selectedItems.map((item) => {
      return {
        id: item._id,
        name: item.itemName,
        price: item.amount,
        quantity: quantityMap[item._id],
      };
    });
  
    try {
      if (foodItems.length === 0) {
        toast.info('Please select any item'); // Display an info message
      } else {
        setSelectedFoodItems(foodItems);
        handleMakeOrder();
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
      renderCell: (params) => <Box sx={{ textAlign: 'center', width: '100%' }}>{params.value}</Box>,
      headerAlign: 'center', // Center-align the header
      align: 'center' // Center-align the cells
    },
    {
      field: 'itemImage',
      headerName: 'Item Image',
      flex: 1,
      // renderCell: (params) => {
      //   return (
      //     <div>
      //       <img src={params?.value} alt="item" style={{ width: '20%', height: '10%', borderRadius: '10px' }} />
      //     </div>
      //   );
      // }
      renderCell: (params) => (
        <div>
          <img
            src={`${baseUrl}api/uploads/restaurant/Item/${params.value}`}
            alt="item"
            style={{ width: '40px', height: '40px', borderRadius: '10px' }}
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
      <FoodInvoiceDialog open={openMakeOrder} handleClose={handleCloseMakeOrder} data={selectedFoodItems} />
      <Container maxWidth="100%" sx={{ paddingLeft: '0px !important', paddingRight: '0px !important' }}>
        <Stack
          direction="row"
          alignItems="center"
          mb={5}
          justifyContent={'space-between'}
          sx={{
            backgroundColor: '#fff',
            display:'flex',
            flexDirection:{xs:'column',md:'row'},
            fontSize: '18px',
            fontWeight: '500',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '15px',
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Typography variant="h4">Food Items</Typography>
          <Stack sx={{display:'flex',flexDirection:{lg:'row',xs:'column'},gap:{xs:'10px',md:'0px'}, marginTop:{xs:'5px',md:'0px'}}} direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ color: '#673ab7', borderColor: '#673ab7' }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button  variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAddButtonClick}>
              Place Order
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%">
            <Card
               sx={{
                minWidth: '100%',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px',
                overflowX: 'auto', 
                  '&::-webkit-scrollbar': {
                    width: '0', 
                    height: '0', 
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',  
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'transparent', 
                  },
                  '*': {  
                    scrollbarWidth: 'none', 
                  },
                  msOverflowStyle: 'none', 
              }}
            >
              {/* <Typography variant="h4" sx={{ margin: '2px 15px' }}>
                Items ( {itemsData?.length} )
              </Typography> */}
              <DataGrid
                 rows={itemsData?.map((row, index) => ({ ...row, serialNo: index + 1 }))}
                 columns={columns?.map((col) => ({
                  ...col,
                  flex: 1,
                  minWidth: isMobile ? 150 : 100,
                  hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false,
                }))}                
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
                    // backgroundColor: '#fff',
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
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default SeparateFoodView;
