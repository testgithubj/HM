import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, Container, Stack, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getApi } from 'views/services/api';
import TableStyle from '../../../ui-component/TableStyle';

import AddLaundary from 'views/Laundary/AddLaundary';
import DeleteLaundary from 'views/Laundary/DeleteLaundary';
import EditLaundary from 'views/Laundary/EditLaundary';

// ----------------------------------------------------------------------

const ShowAllLaundryItem = ({ openLaundryDialog, onDataChange }) => {
  const [foodId, setFoodId] = useState('');
  const [foodData, setFoodData] = useState('');
  const params = useParams();
  const reservationId = params.id;

  const pathName = useLocation().pathname;

  //
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [laundaryId, setLaundaryId] = useState();
  const [RoomID, setRoomID] = useState();
  const [laundaryData, setLaundaryData] = useState([]);
  const [propsData, setPropsData] = useState([]);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));

  const handleOpenDeleteLaundary = (_id, roomNo) => {
    setLaundaryId(_id);
    setRoomID(roomNo);
    setOpenDelete(true);
  };
  const handleCloseDeleteLaundary = () => setOpenDelete(false);

  const handleOpenAddLaundary = () => setOpenAdd(true);
  const handleCloseLaundary = () => setOpenAdd(false);

  const handleOpenEditLaundary = (data) => {
    setPropsData(data);
    setOpenEdit(true);
  };
  const handleCloseEditLaundary = () => setOpenEdit(false);

  const fetchLaundaryData = async () => {
    try {
      const response = await getApi(`api/reservation/getSpecificLaundaryItems/${reservationId}`);
      setLaundaryData(response?.data?.laundaryItems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLaundaryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAdd, openEdit, openDelete, openLaundryDialog]);

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 0.5,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'roomNo',
      headerName: 'Room No',
      flex: 0.5,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'name',
      headerName: 'Laundary Name',
      flex: 1
    },
    {
      field: 'quantity',
      headerName: 'Laundary Quantity',
      minWidth: 120,
      flex: 1
    },
    {
      field: 'amount',
      headerName: 'Amount / Item',
      flex: 1,
      renderCell: (params) => <Box>${params?.value}</Box>
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
      renderCell: (params) => <Box>${params?.row?.amount * params?.row?.quantity}</Box>
    },

    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => {
        console.log(params, 'this is the params');
        return (
          <>
            <MenuItem onClick={() => handleOpenEditLaundary(params?.row)} disableRipple>
              <EditIcon />
            </MenuItem>
            <MenuItem onClick={() => handleOpenDeleteLaundary(params?.row?._id, params.row.roomNo)} sx={{ color: 'red' }} disableRipple>
              <DeleteIcon />
            </MenuItem>
          </>
        );
      }
    }
  ];

  return (
    <>
      <AddLaundary open={openAdd} handleClose={handleCloseLaundary} />
      <DeleteLaundary pathName={pathName} open={openDelete} handleClose={handleCloseDeleteLaundary} roomId={RoomID} id={laundaryId} />
      <EditLaundary open={openEdit} handleClose={handleCloseEditLaundary} data={propsData} />

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
          <Typography variant="h4">Laundary Management</Typography>
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
              {/* <Typography variant="h4" sx={{ margin: '2px 15px' }}>
                Laundaries ( {laundaryData?.length || 0} )
              </Typography> */}
              {laundaryData && (
                <DataGrid
                  rows={laundaryData.map((row, index) => ({ ...row, serialNo: index + 1 }))}
                  // sx={{ overflowX: 'scroll' }}
                  columns={columns}
                  getRowId={(row) => row?._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
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
export default ShowAllLaundryItem;
