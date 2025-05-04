import { useParams } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../../ui-component/TableStyle';
import { useState } from 'react';
import { Stack, Container, Typography, Box, Card } from '@mui/material';
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { getApi } from 'views/services/api';
import { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddItems from 'views/restaurant/AddItems';
import DeleteFoodItem from './DeleteItem';
import EditIcon from '@mui/icons-material/Edit';
import EditQuantity from './EditQuantity';

// ----------------------------------------------------------------------

const ShowAllFoodItem = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [itemsData, setitemsData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [foodId, setFoodId] = useState('');
  const [foodData, setFoodData] = useState('');
  const params = useParams();
  const reservationId = params.id;

  // // function for fetching all the restaurant items data from the db
  const fetchitemsData = async () => {
    try {
      const response = await getApi(`api/reservation/getfooditems/${reservationId}`);
      console.log('yyyyy =>', response);

      setitemsData(response?.data?.foodItemsData[0]?.foodItems);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchitemsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAdd, openDelete, openEdit]);

  // function for opening dialogs---------------------------
  const handleOpenDeleteItem = (itemId) => {
    setFoodId(itemId);
    setOpenDelete(true);
  };
  const handleCloseAdd = () => setOpenAdd(false);
  const handleCloseDeleteItem = () => setOpenDelete(false);

  const handleOpenEditQuantity = (foodData) => {
    setFoodData(foodData);
    setOpenEdit(true);
  };

  const handleCloseEditQuantity = () => {
    setOpenEdit(false);
  };
  //-----------------------------------------------

  const columns = [
    {
      field: 'itemImage',
      headerName: 'Item Image',
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <img src={params?.value} alt="item" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
          </div>
        );
      }
    },
    {
      field: 'name',
      headerName: 'Item Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },

    {
      field: 'price',
      headerName: 'Amount',
      flex: 1,
      renderCell: (params) => {
        return <Box>${params?.value}</Box>;
      }
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1
    },
    {
      field: 'totalAmountFood',
      headerName: 'Total Amount',
      flex: 1,
      renderCell: (params) => {
        return <Box>${params?.value}</Box>;
      }
    },

    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <MenuItem onClick={() => handleOpenEditQuantity(params?.row)} disableRipple>
              <EditIcon style={{ marginRight: '8px', fontSize: '20px' }} />
            </MenuItem>
            <MenuItem onClick={() => handleOpenDeleteItem(params?.row?.id)} sx={{ color: 'red' }} disableRipple>
              <DeleteIcon style={{ marginRight: '8px', color: '#f44336', fontSize: '20px' }} />
            </MenuItem>
          </>
        );
      }
    }
  ];

  return (
    <>
      <EditQuantity open={openEdit} handleClose={handleCloseEditQuantity} data={foodData} />
      <AddItems open={openAdd} handleClose={handleCloseAdd} />
      <DeleteFoodItem open={openDelete} handleClose={handleCloseDeleteItem} data={foodId} />

      <Container maxWidth="100%" sx={{ paddingLeft: '0px !important', paddingRight: '0px !important' }}>
        <Box width="100%">
          <Box sx={{ p: 2 }}>
            <Card elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              {itemsData?.length > 0 && (
                <DataGrid
                  rows={itemsData}
                  columns={columns}
                  getRowId={(row) => row.id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                      sx: {
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
                        }
                      }
                    }
                  }}
                  sx={{
                    border: 'none',
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
                    '& .MuiFormControl-root': {
                      color: '#121926',
                      fontSize: '14px',
                      fontWeight: '400',
                      padding: '4px 10px 0px',
                      '& .MuiInputBase-root': {
                        borderRadius: '5px'
                      }
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid #f0f0f0'
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#f8f9fa',
                      color: '#666',
                      fontSize: '0.875rem'
                    },
                    '& .MuiDataGrid-row': {
                      '&:hover': {
                        backgroundColor: '#f8f9fa'
                      }
                    },
                    '& .name-column--cell--capitalize': {
                      textTransform: 'capitalize'
                    },
                    '& .MuiCheckbox-root': {
                      padding: '4px',
                      color: '#673ab7',
                      '&.Mui-checked': {
                        color: '#673ab7'
                      }
                    }
                  }}
                  rowHeight={60}
                />
              )}
            </Card>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ShowAllFoodItem;
