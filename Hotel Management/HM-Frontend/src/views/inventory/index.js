import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, FormControl, Select, Popover, useMediaQuery, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { getApi } from 'views/services/api';
import EditLaundary from './EditLaundary';
import AddLaundary from './AddLaundary';
import DeleteLaundary from './DeleteLaundary';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import moment from 'moment';
import { useMemo } from 'react';


// ----------------------------------------------------------------------

const Inventory = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [laundaryId, setLaundaryId] = useState();
  const [laundaryData, setLaundaryData] = useState([]);
  const [propsData, setPropsData] = useState([]);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const [filterValue, setFilterValue] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElMap, setAnchorElMap] = useState({});
  const [rowData, setRowData] = useState();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [rowID, setRowId] = useState('');







  // function for delete dialog/////////////////////////////////////
  const handleOpenDeleteLaundary = (id) => {
    setLaundaryId(id);
    setOpenDelete(true);
    setRowId('')
  };

  const handleClose = (id) => {
    console.log(id, 'this si asfsadfsdffaffaf')

    setAnchorElMap(() => {
      setRowId('')

      return [];
    });
  };

  console.log(anchorElMap, 'this is for anchorElMap')

  const handleCloseDeleteLaundary = () => {
    setRowId('')

    setOpenDelete(false);
    setShouldRefetch((prev) => !prev);
  };

  // function for add dialog/////////////////////////////////////
  const handleOpenAddLaundary = () => setOpenAdd(true);
  const handleCloseLaundary = () => {
    setOpenAdd(false);
    setShouldRefetch((prev) => !prev);
  };

  const handleOpenEditLaundary = (data) => {
    setRowId('')
    setPropsData(data);
    setOpenEdit(true);
  };

  const handleClick = (event, row) => {
    setAnchorElMap((prev) => ({
      ...prev,
      [row._id]: event.currentTarget,
    }));

    console.log(row, 'this is for event ');
    setRowData(row);
    setRowId(row._id);
  };

  const handleCloseEditLaundary = () => {
    setOpenEdit(false);
    setShouldRefetch((prev) => !prev);
    setAnchorElMap({}); // Close the popover when edit modal closes
  };



  const shouldHidePagination = useMemo(() => !laundaryData?.length || laundaryData?.length <=25, [laundaryData]);

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

  //-----------------------------------------------

  // function for fetching all the rooms data from the db
  const fetchLaundaryData = async (selectedFilter) => {
    try {
      let response;
      if (selectedFilter === "all") {
        response = await getApi(`api/inventory/viewallinventories/${hotel.hotelId}`);
      } else if (selectedFilter === "F&B") {
        response = await getApi(`api/inventory/viewallFandBitems/${hotel.hotelId}`);
      } else if (selectedFilter === "House Keeping") {
        response = await getApi(`api/inventory/viewallHouseKeepingitems/${hotel.hotelId}`);
      } else if (selectedFilter === "Kitchen") {
        response = await getApi(`api/inventory/viewallKitchenitems/${hotel.hotelId}`);
      } else if (selectedFilter === "Laundary") {
        response = await getApi(`api/inventory/viewallLaundryitems/${hotel.hotelId}`);
      }
      setLaundaryData(response?.data?.laundaryData || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLaundaryData(filterValue);
  }, [shouldRefetch, filterValue,]);


  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;
    setFilterValue(selectedValue);
    fetchLaundaryData(selectedValue);
  };

  useEffect(() => {
    fetchLaundaryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAdd, openEdit]);
  const isMobile = useMediaQuery('(max-width:1450px)'); // for mobile devices

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: isMobile ? 1 : 0.5,
      // minWidth: 120,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => <Box sx={{ textAlign: 'center', width: '100%' }}>{params.value}</Box>,
      headerAlign: 'center', // Center-align the header
      align: 'center' // Center-align the cells
    },
    {
      field: 'name',
      headerName: 'Item Name',
      flex: 1,
      // minWidth: 120,
      cellClassName: ' name-column--cell--capitalize'
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
      // minWidth: 120,
      cellClassName: ' name-column--cell--capitalize'
    },
    {
      field: 'quantity',
      headerName: 'Total Quantity',
      // minWidth: 120,
      flex: 1
    },
    {
      field: 'unitOfMeasure',
      headerName: 'Unit of Measure',
      flex: 1,
      // minWidth: 120,
      cellClassName: ' name-column--cell--capitalize'
    },
    {
      field: 'amount',
      headerName: 'Amount / Item',
      flex: 1,
      // minWidth: 120,
      renderCell: (params) => {
        return <Box>${params?.value}</Box>;
      }
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
      // minWidth: 120,
      renderCell: (params) => {
        // Calculate total amount by multiplying amount and quantity
        const totalAmount = params?.row?.amount * params?.row?.quantity;
        return <Box>${totalAmount}</Box>;
      }
    },
    {
      field: 'distributed',
      headerName: 'Distributed',
      // minWidth: 120,
      flex: 1
    },
    {
      field: 'remaining',
      headerName: 'Remaining',
      // minWidth: 120,
      flex: 1,
      renderCell: (params) => {
        // Calculate remaining quantity by subtracting distributed from total quantity
        const remaining = params?.row?.quantity - params?.row?.distributed;
        return <Box>{remaining}</Box>;
      }
    },
    {
      field: 'createdDate',
      headerName: 'Date',
      flex: 1,
      // minWidth: 120,
      renderCell: (params) => {
        return params?.value ? <Box>{moment(params?.value).format('YYYY-MM-DD')}</Box> : <Box sx={{ fontSize: '40px' }}>-</Box>;
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => {
        const rowId = params?.row?._id;
        const isOpen = rowId == rowID ? true : false;
        console.log('isOpen ==>', isOpen);

        return (
          <div>
            <IconButton
              aria-describedby={rowId}
              variant="contained"
              onClick={(event) => handleClick(event, params?.row)}
            >
              <MoreVertIcon />
            </IconButton>

            <Popover
              id={rowId}
              open={isOpen}
              anchorEl={anchorElMap[rowId]}
              onClose={() => handleClose(rowId)}
            // anchorOrigin={{
            //   vertical: 'bottom',
            //   horizontal: 'left',
            // }}
            >
              <MenuItem onClick={() => handleOpenEditLaundary(params?.row)} disableRipple>
                <EditIcon />
              </MenuItem>


              <MenuItem onClick={() => handleOpenDeleteLaundary(params.row._id)} sx={{ color: 'red' }} disableRipple>
                <DeleteIcon />
              </MenuItem>

            </Popover>
          </div>
        );
      }
    }
  ];

  return (
    <>
      <AddLaundary open={openAdd} handleClose={handleCloseLaundary} />
      <DeleteLaundary open={openDelete} handleClose={handleCloseDeleteLaundary} id={laundaryId} />
      <EditLaundary open={openEdit} handleClose={handleCloseEditLaundary} data={propsData} />

      <Container maxWidth="100%" sx={{ paddingLeft: '0px !important', paddingRight: '0px !important' }}>
        {/* Responsive Header Section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
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
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '14px', sm: '18px' },
              marginBottom: { xs: '10px', sm: '0px' },
              width: '100%',

            }}
          >
            Inventory Management
          </Typography>

          {/* Filter & Button in One Row on Small Screens */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={1}
            sx={{
              width: '100%',
              flexWrap: 'nowrap', // Prevents wrapping
              overflowX: 'auto', // Enables scrolling if necessary
              gap: { xs: '6px', sm: '12px' },
            }}
          >
            {/* Filter Dropdown */}
            <FormControl
              sx={{
                minWidth: { xs: 80, sm: 120 },
                backgroundColor: '#fff',
                borderRadius: '6px',
              }}
            >
              <Select
                labelId="filter-label"
                id="filter"
                value={filterValue}
                onChange={handleFilterChange}
                sx={{
                  '& .MuiSelect-select': {
                    borderRadius: '5px',
                    padding: { xs: '3px 6px', sm: '6px 12px' },
                    fontSize: { xs: '10px', sm: '14px' },
                    color: '#121926',
                    fontWeight: '500',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid #e0e0e0',
                  },
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="F&B">F&B</MenuItem>
                <MenuItem value="House Keeping">House Keeping</MenuItem>
                <MenuItem value="Kitchen">Kitchen</MenuItem>
                <MenuItem value="Laundary">Laundry</MenuItem>
              </Select>
            </FormControl>

            {/* Add Items Button */}
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAddLaundary}
              sx={{
                fontSize: { xs: '10px', sm: '14px' },
                padding: { xs: '3px 5px', sm: '8px 16px' },
                minWidth: 'auto',
                maxWidth: '100%',
                whiteSpace: 'nowrap',
              }}
            >
              Add Items
            </Button>
          </Stack>
        </Stack>

        {/* Table Section */}
        <TableStyle>
          <Box width="100%"
          >
            <Card
              sx={{
                minWidth: '100%',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px',
                overflowX: 'auto', 
                '&::-webkit-scrollbar': {
                  width: '8px',  
                  height: '8px', 
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f1f1', 
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#c1c1c1',  
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: '#a8a8a8',
                  },
                },
                '*': {  
                  scrollbarWidth: 'thin', 
                  scrollbarColor: '#c1c1c1 #f1f1f1',
                },
                msOverflowStyle: 'auto',  
              }}
            >
            
                <DataGrid
                  rows={laundaryData?.map((row, index) => ({ ...row, serialNo: index + 1 }))}
                  columns={columns?.map((col) => ({
                    ...col,
                    flex: 1,
                    minWidth: isMobile ? 150 : 100,
                    hide: window?.innerWidth < 400 ? col.field !== 'serialNo' : false,
                  }))}
                  getRowId={(row) => row?._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  sx={{
                    minWidth: {xs:'1400px',lg:'auto'}, 
                    ...paginationStyle,
                    fontSize: { xs: '12px', sm: '12px',lg:'14px' }, 
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#f5f5f5',
                      fontSize: { xs: '12px', sm: '14px' }
                    },
                    '& .MuiDataGrid-cell': {
                      padding: { xs: '4px', sm: '8px' } 
                    },
                    '& .MuiDataGrid-root': {
                      overflowX: 'auto' 
                    },
                    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                      width: '8px',
                      height: '8px',
                    },
                    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                      borderRadius: '4px',
                    },
                    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                      backgroundColor: '#c1c1c1',
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: '#a8a8a8',
                      },
                    },
                  }}
                />
             
            </Card>

          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default Inventory;