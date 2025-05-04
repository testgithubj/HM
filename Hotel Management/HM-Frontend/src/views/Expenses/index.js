import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { useState } from 'react';
import { Stack, Button, Popover, Container, Typography, Box, Card, MenuItem, Select } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import * as React from 'react';
import { getApi } from 'views/services/api';
import { useEffect } from 'react';
import moment from 'moment';
import AddExpenses from './AddExpenses';
import DeleteExpenses from './DeleteExpenses';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditExpenses from './EditExpenses';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const Tasks = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [DeleteExpenseId, setDeleteExpenseId] = useState(null);
  const [EditExpenseId, setEditExpenseId] = useState(null);
  const [expenseData, setexpenseData] = useState([]);
  const [filterType, setFilterType] = useState('today');
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState();
  const [permissionsAnchorEl, setPermissionsAnchorEl] = useState(null);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const navigate = useNavigate();
  const [anchorElMap, setAnchorElMap] = useState({});



  
  const shouldHidePagination = useMemo(() => !expenseData?.length || expenseData?.length <=25, [expenseData]);

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

  // delete expense open handler
  const handleOpenDeleteExpense = (id) => {
    console.log('in handleOpenDeleteExpense for expenses ==>', id);
    setDeleteExpenseId(id);
    setOpenCloseDialog(true);
  };

  const handleClose = (id) => {
    setAnchorElMap((prev) => {
      const updatedMap = { ...prev };
      delete updatedMap[id];
      return updatedMap;
    });
  };
  const handlePermissionsClick = (event, row) => {
    setPermissionsAnchorEl(event.currentTarget);
    setRowData(row);
    setSelectedPermissions(row.permissions || []);
  };
  const handleClick = (event, row) => {
    setAnchorElMap((prev) => ({
      ...prev,
      [row._id]: event.currentTarget,
    }));
    setRowData(row);
  };

  // delete expense close handler
  const handleCloseDeleteExpense = () => {
    setOpenCloseDialog(false);
  };

  const handleOpenAdd = () => setOpenAdd(true);

  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenEdit = (id) => {
    setOpenEdit(true);
    setEditExpenseId(id);
    console.log('id', id);
  };

  const handleCloseEdit = () => setOpenEdit(false);
  const open = Boolean(anchorEl);
  const openPermissions = Boolean(permissionsAnchorEl);

  // Function for fetching all the expenses data from the db
  const fetchExpenseData = async () => {
    try {
      // const response = await getApi(`api/expenses/viewallexpenses/${hotel._id}`);
      const response = await getApi(`api/expenses/viewallexpenses/${hotel?.hotelId}`);
      console.log('response ==>', response);

      if (response.status === 204) {
        setexpenseData([]);
      } else {
        setexpenseData(response?.data?.expensesData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAdd, openCloseDialog, openEdit]);

  // Function to handle filter change
  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  // Function to filter the expenses based on the selected filter type
  const applyFilter = () => {
    switch (filterType) {
      case 'today':
        return expenseData.filter((expense) => {
          const expenseDate = new Date(expense.createdDate);
          const today = new Date();
          return moment(expenseDate).isSame(today, 'day');
        });
      case 'week':
        return expenseData.filter((expense) => {
          const expenseDate = new Date(expense.createdDate);
          const startOfWeek = moment().startOf('week').toDate();
          const endOfWeek = moment().endOf('week').toDate();
          return moment(expenseDate).isBetween(startOfWeek, endOfWeek, 'day', '[]');
        });
      case 'month':
      default:
        return expenseData.filter((expense) => {
          const expenseDate = new Date(expense.createdDate);
          const startOfMonth = moment().startOf('month').toDate();
          const endOfMonth = moment().endOf('month').toDate();
          return moment(expenseDate).isBetween(startOfMonth, endOfMonth, 'day', '[]');
        });
    }
  };
  const handleViewExpense = (id, hotelId) => {
    navigate(`/dashboard/expense/view/${hotelId}/${id}`);
  };

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => <Box sx={{ textAlign: 'center', width: '100%' }}>{params.value}</Box>,
      headerAlign: 'center', // Center-align the header
      align: 'center' // Center-align the cells
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1
    },
    {
      field: 'amount',
      headerName: 'Expense Amount',
      flex: 1,
      renderCell: (params) => {
        return <Box>${params?.value}</Box>;
      }
    },
    {
      field: 'createdDate',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        return <Box>{moment(params.value).format('YYYY-MM-DD')}</Box>;
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => {
        const rowId = params?.row._id;
        const isOpen = Boolean(anchorElMap[rowId]);

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
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={() => handleOpenEdit(params.row._id)} disableRipple>
                <EditIcon style={{ fontSize: '20px' }} />
              </MenuItem>
              <MenuItem onClick={() => handleViewExpense(params.row._id, params.row.hotelId)} disableRipple>
                <VisibilityIcon fontSize="small" />
              </MenuItem>
              <MenuItem onClick={() => handleOpenDeleteExpense(params.row._id)} sx={{ color: 'red' }} disableRipple>
                <DeleteIcon style={{ color: '#f44336', fontSize: '20px', marginRight: '40px' }} />
              </MenuItem>
            </Popover>
          </div>
        );
      }
    }

  ];

  return (
    <>
      {/* New Expense form and Delete Expense dialog */}
      <AddExpenses open={openAdd} handleClose={handleCloseAdd} />
      <EditExpenses open={openEdit} handleClose={handleCloseEdit} id={EditExpenseId} />
      <DeleteExpenses open={openCloseDialog} handleClose={handleCloseDeleteExpense} id={DeleteExpenseId} />

      <Container
        maxWidth="100%"
        sx={{
          paddingLeft: '0px !important',
          paddingRight: '0px !important',
        }}
      >
        {/* --- Header Section (Title + Filter + Button) --- */}
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
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '16px', sm: '20px' },
            }}
          >
            Expenses
          </Typography>

          {/* Filter + New Expense Button */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={1.5}
            sx={{
              flexWrap: 'wrap', // allows wrapping if space is insufficient
            }}
          >
            {/* Select Filter */}
            <Select
              value={filterType}
              onChange={handleFilterChange}
              sx={{
                '& .MuiSelect-select': {
                  borderRadius: '4px',
                  padding: { xs: '4px 8px', sm: '8px 16px' },
                  fontSize: { xs: '12px', sm: '14px' },
                  color: '#616161',
                  fontWeight: 'bold',
                },
                '& .MuiListItem-root': {
                  fontSize: { xs: '12px', sm: '14px' },
                  color: '#616161',
                  fontWeight: 'bold',
                },
                '& .MuiSvgIcon-root': {
                  fill: '#121926',
                },
              }}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>

            {/* New Expense Button */}
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAdd}
              sx={{
                fontSize: { xs: '12px', sm: '14px' },
                padding: { xs: '4px 8px', sm: '6px 12px' },
                textTransform: 'none',
              }}
            >
              New Expense
            </Button>
          </Stack>
        </Stack>

        {/* --- Table Section --- */}
        <TableStyle >   
          
                <Box width="100%" >
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
            {expenseData && (
              <DataGrid
                rows={applyFilter()?.map((row, index) => ({ ...row, serialNo: index + 1 }))}
                columns={columns}
                getRowId={(row) => row?._id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                sx={{
                  ...paginationStyle,
                  minWidth: '900px', 
                  fontSize: { xs: '12px', sm: '12px' ,lg:'14px'}, 
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
            )}
          </Card>
        </Box>
        </TableStyle>
      </Container>
    </>
  );

};

export default Tasks;
