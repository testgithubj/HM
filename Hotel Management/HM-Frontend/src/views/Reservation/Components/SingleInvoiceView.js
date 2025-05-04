import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, Button, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { getApi } from 'views/services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SingleInvoiceView = () => {
  const [invoiceData, setInvoiceData] = useState({});
  const [itemsData, setItemsData] = useState([]);
  const [laundryData, setLaundryData] = useState([]);
  const [spaData, setSpaData] = useState([]);
  const [isPrinted, setIsPrinted] = useState(false);
  const [loadingLaundry, setLoadingLaundry] = useState(true);
  const [loadingSpa, setLoadingSpa] = useState(true);

  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const params = useParams();
  const reservationId = params.id;
  const navigate = useNavigate();

  const fetchSingleBillData = async () => {
    try {
      const response = await getApi(`api/singleinvoice/view/${reservationId}`);
      console.log('this is the single invoice ==>', response);
      setInvoiceData(response?.data?.InvoiceData[0]);
    } catch (error) {
      console.log(error);
    }
  };
  console.log('invoice data', invoiceData);
  const calculateLaundryTotal = () => {
    return laundryData.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const calculateSpaTotal = () => {
    return spaData.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  const totalAmount = (invoiceData?.totalRoomAmount || 0) +
    (invoiceData?.totalFoodAmount || 0) +
    calculateLaundryTotal() +
    calculateSpaTotal();

  useEffect(() => {
    fetchSingleBillData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationId]);

  const handlePrint = () => {
    setIsPrinted(true);
    window.print();
  };

  const currentDate = new Date().toLocaleDateString();

  // Fetch food items data
  const fetchItemsData = async () => {
    try {
      const response = await getApi(`api/reservation/getfooditems/${reservationId}`);
      setItemsData(response?.data?.foodItemsData[0]?.foodItems);
    } catch (error) {
      console.log(error);
    }
  };


  console.log('items data', itemsData);

  // Fetch laundry items data
  const fetchLaundryData = async () => {
    try {
      const response = await getApi(`api/laundary/laundrybyreservation/${reservationId}`);
      console.log("Laundry Data Response:", response?.data);

      const transformedData = response?.data?.laundaryData.map((item) => ({
        category: item.category,
        name: item.items[0]?.name || "N/A", // Fetching from nested structure
        quantity: item.items[0]?.quantity || 0, // Quantity mapping
        amount: item.amount,
        totalAmount: item.totalAmount
      }));
      setLaundryData(transformedData || []);
    } catch (error) {
      console.log("Error fetching laundry data:", error);
    } finally {
      setLoadingLaundry(false);
    }
  };

  // Fetch spa data
  const fetchSpaData = async () => {
    try {
      const response = await getApi(`api/spa/spabyreservation/${reservationId}`);
      console.log("Spa Data Response:", response?.data.SpaData[0].items);

      // const transformedData = response?.data?.SpaData[0]?.items.map((item) => ({
      //   category: item.serviceType,
      //   name: item.items[0]?.name || "N/A", // Fetching from nested structure
      //   persons: item.persons|| 1, // Using quantity as person count
      //   amount: item.amount,
      // }));
      setSpaData(response?.data?.SpaData[0]?.items);

      // console.log("Transformed Spa Data:", transformedData);
    } catch (error) {
      console.log("Error fetching spa data:", error);
    } finally {
      setLoadingSpa(false);
    }
  };

  useEffect(() => {
    fetchItemsData();
    fetchLaundryData();
    fetchSpaData();
  }, [reservationId]);

  console.log(laundryData, '=================laundry data');

  return (
    <Grid container justifyContent="center" sx={{ padding: '20px' }}>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ marginLeft: 2, color: '#673ab7', borderColor: '#673ab7', position: 'absolute', right: 10 }}
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Back
        </Button>
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ padding: '20px', maxWidth: '800px', marginTop: '12px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3" align="center" gutterBottom>
                Food + Room + Laundry + Spa Invoice
              </Typography>
              <Typography variant="subtitle1" align="center" gutterBottom>
                Date: {currentDate}
              </Typography>
              <Divider />
            </Grid>

            {/* Hotel Details */}
            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                Hotel Details
              </Typography>
              <Typography variant="subtitle1">{hotel.name}</Typography>
              <Typography variant="subtitle1">{hotel.address}</Typography>
              <Typography variant="subtitle1">{invoiceData?.gstNumber}</Typography>
              <Typography variant="subtitle1">{invoiceData?.invoiceNumber}</Typography>
            </Grid>

            {/* Customer Details */}
            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                Customer Details
              </Typography>
              <Typography variant="subtitle1">{invoiceData?.name}</Typography>
              <Typography variant="subtitle1">{invoiceData?.address}</Typography>
              <Typography variant="subtitle1">{invoiceData?.customerPhoneNumber}</Typography>
              {invoiceData?.haveGST && <Typography variant="subtitle1">{invoiceData?.gstNumber}</Typography>}
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
              {invoiceData?.paymentMethod && (
                <Typography>
                  <b>Payment Method: </b>
                  {invoiceData?.paymentMethod}
                </Typography>
              )}
            </Grid>

            <hr />
            <Grid item xs={12} md={12}>
              <Typography variant="h4" gutterBottom>
                <b>Room Details : </b>
              </Typography>
            </Grid>
            <TableContainer component={Paper} sx={{ margin: '20px', marginLeft: '32px' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Description</b>
                    </TableCell>
                    <TableCell>
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
                      <TableCell>
                        <b>$ {invoiceData.roomRent}</b>
                      </TableCell>
                    </TableRow>
                  )}
                  {invoiceData?.advanceAmount > 0 && (
                    <TableRow>
                      <TableCell>
                        <b>Advance Amount</b>
                      </TableCell>
                      <TableCell>
                        <b>$ {invoiceData.advanceAmount}</b>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell>
                      <b>Discount</b>
                    </TableCell>
                    <TableCell>
                      <b>$ {invoiceData?.roomDiscount ? invoiceData.roomDiscount : 0}</b>
                    </TableCell>
                  </TableRow>
                  {invoiceData?.haveRoomGst && (
                    <TableRow>
                      <TableCell>
                        <b>GST Amount</b>
                      </TableCell>
                      <TableCell>
                        <b>$ {invoiceData.roomGstAmount}</b>
                      </TableCell>
                    </TableRow>
                  )}
                  {invoiceData?.totalRoomAmount && (
                    <TableRow>
                      <TableCell>
                        <b>Total Amount {invoiceData.haveRoomGst ? '( with GST)' : ''}</b>
                      </TableCell>
                      <TableCell>
                        <b>$ {invoiceData.totalRoomAmount}</b>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Food Details */}
            {/* <hr /> */}
            <Grid sx={{padding : '20px', display: `${itemsData ? 'block' : 'none'}`}}>
            
              <Grid item xs={12} md={12}>
                <Typography variant="h4" gutterBottom>
                  <b>Food Details : </b>
                </Typography>
              </Grid>
              <TableContainer component={Paper} sx={{ margin: '20px', marginLeft: '32px' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>Description</b>
                      </TableCell>
                      <TableCell>
                        <b>Price</b>
                      </TableCell>
                      <TableCell>
                        <b>Quantity</b>
                      </TableCell>
                      <TableCell>
                        <b>Amount</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itemsData?.map((foodItem) => (
                      <TableRow key={foodItem._id}>
                        <TableCell>
                          <b>{foodItem.name}</b>
                        </TableCell>
                        <TableCell>
                          <b>{foodItem.price}</b>
                        </TableCell>
                        <TableCell>
                          <b>{foodItem.quantity}</b>
                        </TableCell>
                        <TableCell>
                          <b>$ {foodItem.totalAmountFood}</b>
                        </TableCell>
                      </TableRow>
                    ))}
                    {invoiceData?.foodAmount && (
                      <TableRow>
                        <TableCell>
                          <b>Food Amount</b>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <b>$ {invoiceData.foodAmount}</b>
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>
                        <b>Discount</b>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <b>$ {invoiceData?.foodDiscount ? invoiceData.foodDiscount : 0}</b>
                      </TableCell>
                    </TableRow>
                    {invoiceData?.haveFoodGst && (
                      <TableRow>
                        <TableCell>
                          <b>GST Amount</b>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <b>$ {invoiceData.foodGstAmount}</b>
                        </TableCell>
                      </TableRow>
                    )}
                    {invoiceData?.totalFoodAmount && (
                      <TableRow>
                        <TableCell>
                          <b>Total Amount {invoiceData.haveFoodGst ? '( with GST)' : ''}</b>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <b>$ {invoiceData.totalFoodAmount}</b>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Laundry Details */}
            {/* <hr /> */}
            <Grid sx={{padding:'20px', display: `${laundryData.length > 0 ? 'block' : 'none'}` }}>
              <Grid item xs={12} md={12}>
                <Typography variant="h4" gutterBottom>
                  <b>Laundry Details : </b>
                </Typography>
              </Grid>
              <TableContainer component={Paper} sx={{ margin: '20px', marginLeft: '32px' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>Description</b>
                      </TableCell>
                      <TableCell>
                        <b>Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Quantity</b>
                      </TableCell>
                      <TableCell>
                        <b>Amount</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingLaundry ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <b>Loading laundry details...</b>
                        </TableCell>
                      </TableRow>
                    ) : laundryData.length > 0 ? (
                      laundryData.map((item, index) => (
                        <TableRow key={`laundry-${index}`}>
                          <TableCell><b>{item.category}</b></TableCell>
                          <TableCell><b>{item.name || "N/A"}</b></TableCell>
                          <TableCell><b>{item.quantity || "N/A"}</b></TableCell>
                          <TableCell><b>${item.amount}</b></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <b>No laundry items found.</b>
                        </TableCell>
                      </TableRow>
                    )}
                    {laundryData.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <b>Total Laundry Amount</b>
                        </TableCell>
                        <TableCell>
                          <b>$ {calculateLaundryTotal().toFixed(2)}</b>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

            </Grid>

            {/* Spa Details */}
            {/* <hr /> */}
            <Grid item xs={12} md={12}>
              <Typography variant="h4" gutterBottom>
                <b>Spa Services : </b>
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Wellness and Relaxation Services
              </Typography>
            </Grid>
            <TableContainer component={Paper} sx={{ margin: '20px', marginLeft: '32px' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Service Type</b>
                    </TableCell>
                    <TableCell>
                      <b>Service Name</b>
                    </TableCell>
                    <TableCell>
                      <b>Persons</b>
                    </TableCell>
                    <TableCell>
                      <b>Price</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingSpa ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <b>Loading spa details...</b>
                      </TableCell>
                    </TableRow>
                  ) : spaData.length > 0 ? (
                    spaData?.map((item, index) => {

                      console.log("SpaDatsssssss", spaData)
                      return <TableRow key={`spa-${index}`}>
                        <TableCell><b>{item.serviceType}</b></TableCell>
                        <TableCell><b>{item.name || "N/A"}</b></TableCell>
                        <TableCell><b>{item.persons || "1"}</b></TableCell>
                        <TableCell><b>${item.price}</b></TableCell>
                      </TableRow>
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <b>No spa services found.</b>
                      </TableCell>
                    </TableRow>
                  )}
                  {spaData.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <b>Total Spa Amount</b>
                      </TableCell>
                      <TableCell>
                        <b>$ {calculateSpaTotal().toFixed(2)}</b>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Grid item xs={12} md={12}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: '20px', marginBottom: '10px' }}>
                <b>Total Amount Summary</b>
              </Typography>
              <Typography>
                <span>
                  <b>Total Amount (Room + Food + Laundry + Spa): </b>
                </span>
                $ {totalAmount.toFixed(2)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={12}>
              <Typography sx={{ textAlign: 'end', fontSize: '15px', marginRight: '10px', marginTop: '40px' }} variant="subtitle1">
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
            .back-button {
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

export default SingleInvoiceView;