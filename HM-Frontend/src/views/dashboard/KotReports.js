import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, TextField, MenuItem } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { getApi } from 'views/services/api';
import moment from 'moment';
import TableStyle from '../../ui-component/TableStyle';
import { useNavigate } from 'react-router';
import { styled, useMediaQuery } from '@mui/system';
import { useMemo } from 'react';


const KotReports = () => {
  const [originalKotData, setOriginalKotData] = useState([]);
  const [kotData, setKotData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rowData, setRowData] = useState();


    const isMobile = useMediaQuery('(max-width:600px)'); // for mobile devices
  
  
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const navigate = useNavigate();

  const CustomTableStyle = styled(Box)(({ theme }) => ({
    width: '100%',
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
  }));

  
  const shouldHidePagination = useMemo(() => !kotData?.length || kotData?.length <=25, [kotData]);

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

  const fetchKOTData = async () => {
    try {
      const response = await getApi(`api/kitchenorderticket/viewallKot/${hotel?.hotelId}`);
      if (response.status === 204) {
        setKotData([]);
        setOriginalKotData([]);
      } else {
        setKotData(response?.data?.mergedData);
        setOriginalKotData(response?.data?.mergedData);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const handleFilter = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      alert('Please select valid start and end dates.');
      return;
    }

    end.setHours(23, 59, 59, 999);

    const filteredData = originalKotData.filter((item) => {
      const createdDate = new Date(item.createdDate);
      return createdDate >= start && createdDate <= end;
    });

    setKotData(filteredData);
  };
  // view
  const handleOpenview = (_id) => {
    console.log('_id ==>', _id);
    navigate(`/dashboard/kot/view/${_id}`);
  };

  const handleViewCustomer = (phoneNumber) => {
    alert(`Viewing details for customer with phone number: ${phoneNumber}`);
  };

  useEffect(() => {
    fetchKOTData();
  }, []);

  const columns = [
    { field: 'staffName', headerName: 'Name', flex: 1, cellClassName: 'name-column--cell--capitalize' },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'createdDate',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => <Box>{moment(params.value).format('YYYY-MM-DD')}</Box>
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <MenuItem onClick={() => handleOpenview(params?.row._id)} disableRipple>
                  <VisibilityIcon style={{ marginRight: '8px', fontSize: '20px' }} />
          </MenuItem>
        </Box>
      )
    }
  ];

  return (
    <Container
      maxWidth="100%"
      sx={{
        paddingLeft: '0px !important',
        paddingRight: '0px !important',
      }}
    >
      {/* Header Section */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }} // Column on mobile, row on larger screens
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={{ xs: 2, sm: 0 }}
        sx={{
          backgroundColor: '#fff',
          fontSize: '16px',
          fontWeight: '500',
          padding: { xs: '10px', sm: '15px' },
          borderRadius: '5px',
          marginBottom: { xs: '10px', sm: '15px' },
          boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '16px', sm: '20px' },
          }}
        >
          KOT Report
        </Typography>
  
        {/* Filter Controls */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="flex-end"
          spacing={1.5}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            flexWrap: 'wrap',
          }}
        >
          {/* Start Date */}
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '5px',
              },
              width: { xs: '100%', sm: 'auto' },
            }}
          />
  
          {/* End Date */}
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '5px',
              },
              width: { xs: '100%', sm: 'auto' },
            }}
          />
  
          {/* Filter Button */}
          <Button
            variant="contained"
            onClick={handleFilter}
            sx={{
              fontSize: { xs: '12px', sm: '14px' },
              padding: { xs: '4px 8px', sm: '6px 12px' },
              width: { xs: '100%', sm: 'auto' },
              textTransform: 'none',
            }}
          >
            Filter
          </Button>
        </Stack>
      </Stack>
  
      {/* Table Section */}
      <TableStyle>
        <Box width="100%">

        <CustomTableStyle>
          <Card
            sx={{
              height: '600px',
              paddingTop: '15px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
              borderRadius: '5px',
            }}
          >
            {kotData && (
              <DataGrid
                rows={kotData}
                columns={columns.map((col)=>({
                  ...col,
                  flex: 1,
                  minWidth: isMobile?150:50,
                  hide: window.innerWidth < 400 ? col.field !== 'serialNo' : false,
                }))}
                getRowId={(row) => row?._id}
                slotProps={{ toolbar: { showQuickFilter: true } }}
                sx={{
                  ...paginationStyle,
                  fontSize: { xs: '12px', sm: '14px' },
                  '& .MuiDataGrid-toolbarContainer': {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '15px',
                    padding: '8px 16px',
                    gap: '8px',
                    flexWrap: 'wrap', // Ensures proper wrapping on smaller screens
                    '& > *:first-child': { display: 'none' },
                    '& > *:nth-child(3)': { display: 'none' },
                  },
                  '& .MuiButton-root': {
                    border: '1px solid #e0e0e0',
                    color: '#121926',
                    fontSize: { xs: '12px', sm: '14px' },
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
                    fontSize: { xs: '12px', sm: '14px' },
                    fontWeight: '400',
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
            )}
          </Card>

          </CustomTableStyle>
        </Box>
      </TableStyle>
    </Container>
  );
  
  
};

export default KotReports;
