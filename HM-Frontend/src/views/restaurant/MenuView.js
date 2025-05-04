import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { getApi } from 'views/services/api';

const MenuView = () => {
  const [itemsData, setItemsData] = useState([]);

  const hotel = JSON.parse(localStorage.getItem('hotelData'));

  const fetchItemsData = async () => {
    try {
      const response = await getApi(`api/restaurant/viewallitems/${hotel?.hotelId}`);

      // Validate if restaurantData exists and is an array
      const restaurantData = response?.data?.restaurantData || [];

      const formattedData = restaurantData.map((item) => ({
        ...item,
        itemImage: `http://localhost:5000/${item.itemImage}`, // Correct image URL format
      }));

      setItemsData(formattedData);
    } catch (error) {
      console.error('Error fetching items:', error.message || error);
    }
  };

  useEffect(() => {
    fetchItemsData();
  }, []);

  // Group items by category
  const groupedItems = itemsData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <Container
      maxWidth="lg"
      sx={{ paddingLeft: '0px !important', paddingRight: '0px !important' }}
    >
      <Box
        sx={{
          backgroundColor: '#fff',
          fontSize: '18px',
          fontWeight: '500',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '15px',
          boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="h4">Menu List</Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1)',
        }}
      >
        {Object.keys(groupedItems).length > 0 ? (
          Object.entries(groupedItems).map(([category, items]) => (
            <Box key={category} mb={4}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  borderBottom: '2px solid #ddd',
                  paddingBottom: '8px',
                  marginBottom: '16px',
                  color: '#333',
                }}
              >
                {category}
              </Typography>

              <Grid container spacing={2}>
                {items.map((item, index) => (
                  <Grid item xs={12} key={item._id}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 15px',
                        borderBottom: '1px solid #ddd',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: '500',
                          color: '#555',
                        }}
                      >
                        {index + 1}. {item.itemName}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 'bold',
                          color: '#000',
                        }}
                      >
                      ${item.amount} 
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              width: '100%',
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            No items available
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default MenuView;
