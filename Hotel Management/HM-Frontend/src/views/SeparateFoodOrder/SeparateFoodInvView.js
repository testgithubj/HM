import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, Button, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getApi } from 'views/services/api';
import { Stack, Container, Box, Card } from '@mui/material';

const InvoiceDetails = ({ value }) => (
  <Typography variant="subtitle1">{value}</Typography>
);

const InvoiceTable = ({ items }) => (
  <TableContainer component={Paper} sx={{marginY : 2}}>
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell><b>Description</b></TableCell>
          <TableCell><b>Price</b></TableCell>
          <TableCell><b>Quantity</b></TableCell>
          <TableCell><b>Amount</b></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item._id}>
            <TableCell><b>{item.name}</b></TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>${item.price * item.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const SeparateFoodInvView = () => {
  const [invoiceData, setInvoiceData] = useState({});
  const [isPrinted, setIsPrinted] = useState(false);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await getApi(`api/separatefoodinvoice/viewspecificinvoice/${id}`);
        setInvoiceData(response?.data?.InvoiceData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInvoiceData();
  }, [id]);

  const handlePrint = () => {
    setIsPrinted(true);
    window.print();
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <Container maxWidth="100%" sx={{ paddingLeft: '0px !important', paddingRight: '0px !important' }}>
       <Stack
    direction="row"
    alignItems="center"
    justifyContent="center"  // This will center both horizontally and vertically
    mb={5}
    sx={{
      backgroundColor: '#fff',
      fontSize: '18px',
      fontWeight: '500',
      padding: '15px',
      borderRadius: '5px',
      marginBottom: '15px',
      boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
    }}>
    <Typography variant="h4" sx={{ textAlign: 'center', flexGrow: 1 }}>
      Restaurant Invoice
    </Typography>

    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      sx={{ color: '#673ab7', borderColor: '#673ab7' }}
      onClick={() => navigate(-1)}
      className={`back-button ${isPrinted ? 'hidden' : ''}`}
    >
      Back
    </Button>
  </Stack>
      <Box width="100%">
        <Card style={{
          padding: '20px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
          borderRadius: '5px',
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" align="center" gutterBottom>
                Date: {currentDate}
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} md={4} >
              <Typography variant="h4" gutterBottom>
                Hotel Details
              </Typography>
              <InvoiceDetails   value={hotel.name} />
              <InvoiceDetails  value={hotel.address} />

              <br/>
              <Typography variant="h4" gutterBottom>
                Customer Details
              </Typography>
              <InvoiceDetails value={invoiceData?.name} />
              <InvoiceDetails value={invoiceData?.address} />
              <InvoiceDetails value={invoiceData?.customerPhoneNumber} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h4">Invoice Number</Typography> 
              <Typography variant="subtitle1">{invoiceData?.invoiceNumber}</Typography> 
              <br/>

              <Typography variant="h4">GST Number</Typography> 
              <Typography variant="subtitle1">{invoiceData?.gstNumber}</Typography>    
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h4">Payment Method</Typography> 
              <Typography variant="subtitle1">{invoiceData?.paymentMethod}</Typography>    
            </Grid>

            <Grid item xs={12}>
              <InvoiceTable items={invoiceData?.foodItems || []} />
            </Grid>

            <Grid item xs={12} sx={{ marginTop: '20px' }}>
              <Divider />
              <Typography sx={{ textAlign: 'left', marginTop: '20px' }}>
                <b>Discount:</b> ${invoiceData?.discount || 0}
              </Typography>
              {invoiceData?.haveGST && (
                <Typography sx={{ textAlign: 'left', marginTop: '10px' }}>
                  <b>GST Amount:</b> ${invoiceData?.gstAmount}
                </Typography>
              )}
              {invoiceData?.totalAmount && (
                <Typography sx={{ textAlign: 'left', marginTop: '10px' }}>
                  <b>Total Amount {invoiceData?.haveGST ? '(with GST)' : ''}:</b> ${invoiceData?.totalAmount}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'end', marginTop: '20px' }}>
              <Typography sx={{ fontSize: '15px' }} variant="subtitle1">
                Signature
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Box>
      <style>
        {`
          @media print {
            .print-button,
            .back-button.hidden {
              display: none;
            }
          }
        `}
      </style>
      <Grid item xs={12} sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }} className="print-button">
        <Button variant="contained" onClick={handlePrint}>
          Print
        </Button>
      </Grid>
    </Container>
  );
};

export default SeparateFoodInvView;

