import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, Button, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { getApi } from 'views/services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const LaundaryInvoice = () => {
  const [invoiceData, setInvoiceData] = useState({});
  const [itemsData, setitemsData] = useState([]);
  const [isPrinted, setIsPrinted] = useState(false);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const params = useParams();
  const _id = params.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await getApi(`api/invoice/viewspecificinvoice/${_id}`);
        console.log('view specific invoice ==>', response);

        setInvoiceData(response?.data?.InvoiceData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInvoiceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  const handlePrint = () => {
    setIsPrinted(true);
    window.print();
  };

  const currentDate = new Date().toLocaleDateString();

  // Function for fetching all the restaurant items data from the db
  const fetchitemsData = async () => {
    try {
      const response = await getApi(`api/reservation/getfooditems/${invoiceData.reservationId}`);
      setitemsData(response?.data?.foodItemsData[0]?.foodItems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (invoiceData.type === 'food') {
      fetchitemsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceData.type]);

  return (
    <Grid container justifyContent="center" sx={{ padding: '20px' }}>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ marginLeft: 2, color: '#673ab7', borderColor: '#673ab7', position: 'absolute', right: 10 }}
          onClick={() => navigate(-1)}
          // className={`back-button ${isPrinted ? '' : 'hidden'}`}
          className={`back-button`}
        >
          Back
        </Button>
        <Divider />
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ padding: '20px', maxWidth: '800px', marginTop: '12px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3" align="center" gutterBottom>
                {invoiceData?.type?.charAt(0).toUpperCase() + invoiceData?.type?.slice(1)} Invoice
              </Typography>
              <Typography variant="subtitle1" align="center" gutterBottom>
                Date: {currentDate}
              </Typography>
              <Divider />
            </Grid>

            {/* Hotel Details */}
            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                Hotel Details sumon
              </Typography>
              <Typography variant="subtitle1">{hotel?.name}</Typography>
              <Typography variant="subtitle1">{hotel?.address}</Typography>
              <Typography variant="subtitle1">{invoiceData?.invoiceNumber}</Typography>
              <Typography variant="subtitle1">{invoiceData?.gstNumber}</Typography>
            </Grid>

            {/* Customer Details */}
            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                Customer Details
              </Typography>
              <Typography variant="subtitle1">{invoiceData?.name}</Typography>
              <Typography variant="subtitle1">{invoiceData?.address}</Typography>
              <Typography variant="subtitle1">{invoiceData?.customerPhoneNumber}</Typography>
              {/* {invoiceData.haveGST && <Typography variant="subtitle1">{invoiceData?.gstNumber}</Typography>} */}
            </Grid>

            {/* Check-in/Check-out Times and Payment Method */}
            <Grid item xs={12} md={4}>
              {invoiceData?.FinalCheckInTime && (
                <Typography>
                  <b>Customer Check-In Time: </b>
                  {invoiceData?.FinalCheckInTime}
                </Typography>
              )}
              {invoiceData?.FinalCheckOutTime && (
                <Typography>
                  <b>Customer Check-Out Time: </b>
                  {invoiceData?.FinalCheckOutTime}
                </Typography>
              )}
              {invoiceData.paymentMethod && (
                <Typography>
                  <b>Payment Method: </b>
                  {invoiceData?.paymentMethod}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="h4" gutterBottom>
                Invoice Details
              </Typography>

              <TableContainer component={Paper} sx={{ margin: '5px' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>Description</b>
                      </TableCell>
                      {invoiceData.type === 'food' && (
                        <>
                          <TableCell>
                            <b>Price</b>
                          </TableCell>
                          <TableCell>
                            <b>Quantity</b>
                          </TableCell>
                        </>
                      )}
                      <TableCell align="right">
                        <b>Amount</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {invoiceData?.roomRent && (
                      <TableRow>
                        <TableCell>
                          <b>Room Rent</b>
                        </TableCell>
                        {invoiceData.type === 'food' && <TableCell colSpan={2}></TableCell>}
                        <TableCell align="right">
                          <b>${invoiceData.roomRent}</b>
                        </TableCell>
                      </TableRow>
                    )}

                    {invoiceData.type === 'food' &&
                      itemsData?.map((foodItem) => (
                        <TableRow key={foodItem._id}>
                          <TableCell>
                            <b>{foodItem.name}</b>
                          </TableCell>
                          <TableCell>{foodItem.price}</TableCell>
                          <TableCell>{foodItem.quantity}</TableCell>
                          <TableCell align="right">
                            <b>${foodItem.totalAmountFood}</b>
                          </TableCell>
                        </TableRow>
                      ))}

                    {invoiceData.foodAmount && (
                      <TableRow>
                        <TableCell>
                          <b>Food Amount</b>
                        </TableCell>
                        {invoiceData.type === 'food' && <TableCell colSpan={2}></TableCell>}
                        <TableCell align="right">
                          <b>${invoiceData.foodAmount}</b>
                        </TableCell>
                      </TableRow>
                    )}

                    {invoiceData?.advanceAmount && (
                      <TableRow>
                        <TableCell>
                          <b>Advance Amount</b>
                        </TableCell>
                        {invoiceData.type === 'food' && <TableCell colSpan={2}></TableCell>}
                        <TableCell align="right">
                          <b>${invoiceData.advanceAmount}</b>
                        </TableCell>
                      </TableRow>
                    )}

                    <TableRow>
                      <TableCell>
                        <b>Discount</b>
                      </TableCell>
                      {invoiceData.type === 'food' && <TableCell colSpan={2}></TableCell>}
                      <TableCell align="right">
                        <b>${invoiceData.discount ? invoiceData.discount : 0}</b>
                      </TableCell>
                    </TableRow>

                    {invoiceData.haveGST && (
                      <TableRow>
                        <TableCell>
                          <b>GST Amount</b>
                        </TableCell>
                        {invoiceData.type === 'food' && <TableCell colSpan={2}></TableCell>}
                        <TableCell align="right">
                          <b>${invoiceData.gstAmount}</b>
                        </TableCell>
                      </TableRow>
                    )}

                    {invoiceData.totalAmount && (
                      <TableRow>
                        <TableCell>
                          <b>Total Amount {invoiceData.haveGST ? '(with GST)' : ''}</b>
                        </TableCell>
                        {invoiceData.type === 'food' && <TableCell colSpan={2}></TableCell>}
                        <TableCell align="right">
                          <b>${invoiceData.totalAmount}</b>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'end', marginTop: 2 }}>
              <Typography sx={{ fontSize: '15px' }} variant="subtitle1">
                Signature
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <style>
        {`
          @media print {
            .print-button,
            .back-button{
              display: none;
            }
          }
        `}
      </style>

      <Grid item xs={12} md={1} sx={{ marginTop: '20px' }} className="print-button">
        <Button variant="contained" onClick={handlePrint} fullWidth>
          Print
        </Button>
      </Grid>
    </Grid>
  );
};

export default LaundaryInvoice;
