import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { Box, Card, useMediaQuery } from '@mui/material';
import { getApi } from 'views/services/api';
import { useNavigate } from 'react-router-dom';

const DashboardHotelList = () => {
  const [hotelData, sethotelData] = useState([]);
  const navigate = useNavigate();

  const fetchhotelData = async () => {
    try {
      const response = await getApi('api/hotel/viewallhotels');
      sethotelData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
    const isMobile = useMediaQuery('(max-width:600px)'); // for mobile devices
  

  useEffect(() => {
    fetchhotelData();
  }, []);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
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
      flex: 1
    },
    {
      field: 'contact',
      headerName: 'Contact',
      flex: 1
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1
    }
  ];

  return (
    <Box width="100%">
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
        <DataGrid
          rows={hotelData || []}
          columns={columns.map((col)=>({
            ...col,
            flex: 1,
            minWidth: isMobile?150:50,
            hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false,
          }))}          getRowId={(row) => row?._id}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableRowSelectionOnClick
          disableColumnMenu
          hideFooter
          sx={{
            minWidth: '600px', 
            fontSize: { xs: '12px', sm: '10px' },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontSize: { xs: '12px', sm: '14px' }
            },
            '& .MuiDataGrid-cell': {
              padding: { xs: '4px', sm: '8px' }
            },
            '& .MuiDataGrid-root': {
              overflowX: 'auto' 
            }
          }}
        />
      </Card>
    </Box>
  );
};

export default DashboardHotelList;
