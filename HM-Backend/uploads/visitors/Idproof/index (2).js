/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
// @mui
import { Stack, Container, Typography, Card, Box } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getApi } from 'service/api';

const PaymentDetails = () => {
  const user_id = localStorage.getItem('user_id');
  const userRole = localStorage.getItem('userRole');

  const [paymentData, setPaymentData] = useState([]);

  const getAllPaymentsDetails = async () => {
    const response = await getApi(userRole === 'admin' ? `payments/list` : `payments/list/?createdBy=${user_id}`);
    if (response && response.status === 200) {
      setPaymentData(response?.data?.paymentsData);
    }
  };

  useEffect(() => {
    getAllPaymentsDetails();
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      field: '_id',
      headerName: 'S.No.',
      flex: 0.5,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      valueGetter: (index) => index.api.getRowIndexRelativeToVisibleRows(index.row._id) + 1
    },
    {
      field: 'title',
      headerName: 'Package Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'days',
      headerName: 'Duration',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'createdOn',
      headerName: ' Start Date',
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleString(undefined, dateOptions);
      }
    }
  ];

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Payments Details Lists</Typography>
        </Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={paymentData ?? []}
                columns={columns}
                getRowId={(row) => row._id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
              />
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default PaymentDetails;
