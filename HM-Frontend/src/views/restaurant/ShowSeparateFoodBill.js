import { Box, Card, Container, Stack, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApi } from 'views/services/api';
import TableStyle from '../../ui-component/TableStyle';

// ----------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------

const ShowSeparateFoodBill = () => {
  const [billData, setbillData] = useState([]);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));

  const navigate = useNavigate();

  const fetchbillData = async () => {
    try {
      // const response = await getApi(`api/separatefoodinvoice/view/${hotel._id}`);
      const response = await getApi(`api/separatefoodinvoice/view/${hotel?.hotelId}`);
      setbillData(response?.data?.InvoiceData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchbillData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateBill = (billId) => {
    navigate(`/separatefoodbill/view/${billId}`);
  };

  //---------------------------------------------------------------------
  const columns = [
    {
      field: `invoiceNumber`,
      headerName: 'Invoice Number',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box>
            <Box onClick={() => handleGenerateBill(params?.row?._id)}>{params.value}</Box>
          </Box>
        );
      }
    },
    {
      field: `name`,
      headerName: 'Name',
      flex: 1,
      cellClassName: ' name-column--cell--capitalize',

      renderCell: (params) => {
        return (
          <Box>
            <Box>{params.value}</Box>
            <div style={{ marginTop: '4px', fontSize: '12px', color: '#777' }}>{params.row.customerPhoneNumber}</div>
          </Box>
        );
      }
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1
    },
    // {
    //   field: 'customerPhoneNumber',
    //   headerName: 'Phone Number ',
    //   flex: 1
    // },
    {
      field: 'type',
      headerName: 'Invoice Type',
      flex: 1,
      renderCell: (params) => {
        return <Box>{params.row.type ? params.value : 'Food+Room'}</Box>;
      }
    },
    {
      field: 'foodAmount',
      headerName: 'Food Amount',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            {params.row.totalFoodAmount ? `$${params.row.totalFoodAmount}` : params.row.foodAmount ? `$${params.row.foodAmount}` : 'N/A'}
          </Box>
        );
      }
    },

    {
      field: 'discount',
      headerName: 'Discount',
      flex: 1,
      renderCell: (params) => {
        return <Box>{params.value ? `$${params.value}` : 'N/A'}</Box>;
      }
    },
    {
      field: 'gstAmount',
      headerName: 'Gst Amount',
      flex: 1,
      renderCell: (params) => {
        return <Box>{params.value ? `$${params.value}` : 'N/A'}</Box>;
      }
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
      renderCell: (params) => {
        return <Box>{params.row.totalAmount ? `$${params.row.totalAmount}` : `$${params.row.totalFoodAndRoomAmount}`}</Box>;
      }
    }

    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Button type="submit" variant="contained" color="primary" onClick={() => handleGenerateBill(params?.row?._id)}>
    //         View
    //       </Button>
    //     );
    //   }
    // }
  ];

  return (
    <>
      <Container maxWidth="100%" sx={{ padding: '0px !important' }}>
        <Stack direction="row" alignItems="center" mb={1} justifyContent={'space-between'}>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
        </Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <Typography variant="h4" sx={{ margin: '2px 15px' }}>
                Invoices ( {billData?.length || 0} )
              </Typography>
              {billData && (
                <>
                  <DataGrid
                    rows={billData}
                    columns={columns}
                    checkboxSelection
                    getRowId={(row) => row?._id}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                  />
                </>
              )}
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default ShowSeparateFoodBill;
