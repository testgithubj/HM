import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { getApi } from 'views/services/api';

// --- Helper Functions ---
const formatDateSafe = (dateInput, formatString = 'PP') => {
  if (!dateInput) return 'N/A';
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (date instanceof Date && !isNaN(date)) {
      return format(date, formatString);
    }
    return 'Invalid Date';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

const formatTimeSafe = (dateInput) => {
  if (!dateInput) return 'N/A';
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (date instanceof Date && !isNaN(date)) {
      return format(date, 'h:mm a');
    }
    return 'Invalid Time';
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'N/A';
  }
};

const SpaInvoice = ({ open, handleClose, customerData }) => {
  console.log('customer data:', customerData);
  const [hotelInfoData, setHotelInfoData] = useState(null);
  const [serviceData, setServiceData] = useState(null);

  // --- Invoice Details ---
  const invoiceDate = new Date();
  const invoiceNumber = `SPA-INV-${customerData?._id?.substring(0, 5) || '000'}-${format(invoiceDate, 'yyyyMMdd')}`;

  // Get hotel data
  const getHotelData = async () => {
    const hotelInfoData = await getApi(`api/hotel/view/${customerData?.hotelId}`);
    return hotelInfoData;
  };

  // Get service data if needed
  const getServiceData = async () => {
    if (customerData?.serviceId) {
      const serviceInfoData = await getApi(`api/spa/service/${customerData.serviceId}`);
      return serviceInfoData;
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (customerData?.hotelId) {
        const hotelData = await getHotelData();
        setHotelInfoData(hotelData?.data);
      }

      if (customerData?.serviceId) {
        const serviceInfo = await getServiceData();
        setServiceData(serviceInfo?.data);
      }
    };

    if (customerData) {
      fetchData();
    }
  }, [customerData]);

  // Hotel info
  const hotelInfo = {
    name: hotelInfoData?.name || 'Spa & Wellness Center',
    address: hotelInfoData?.address || 'N/A',
    gstNumber: hotelInfoData?.gstNumber || 'GSTIN12345XYZ'
  };

  // Customer details
  const customerDetails = {
    name: `${customerData?.firstName || ''} ${customerData?.lastName || ''}`.trim() || 'N/A',
    address: customerData?.address || 'N/A',
    phoneNumber: customerData?.phoneNumber || 'N/A',
    email: customerData?.email || 'N/A'
  };

  // Service details
  const serviceDetails = {
    name: customerData?.serviceName || 'N/A',
    type: customerData?.serviceType || 'Service',
    price: customerData?.price || 0,
    persons: customerData?.numberOfPersons || 1,
    duration: customerData?.duration || 0,
    date: customerData?.bookingDateTime || new Date(),
    status: customerData?.status || 'Completed',
    roomNo: customerData?.roomNo || '-'
  };

  // Calculate total (without GST)
  const totalAmount = serviceDetails.price * serviceDetails.persons;

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-print-area');
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=50,top=50,width=800,height=600');

    if (printWindow && printContent) {
      printWindow.document.write('<html><head><title>Spa Service Invoice</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        @media print { .no-print { display: none !important; } }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; margin: 20px; font-size: 10pt; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; vertical-align: top; }
        th { background-color: #f2f2f2; font-weight: 600; }
        h1, h2, h3, h4, h5, h6 { margin-top: 1em; margin-bottom: 0.5em; font-weight: 600; }
        h3 { font-size: 1.5em; text-align: center; }
        h4 { font-size: 1.1em; margin-top: 1.5em; }
        address { font-style: normal; line-height: 1.4; }
        .text-right { text-align: right; }
        .total-cell { font-weight: bold; }
        hr { border: none; border-top: 1px solid #eee; margin: 20px 0; }
        .subtle { color: #555; }
      `);
      printWindow.document.write('</style></head><body>');
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      alert("Could not open print window. Please check your browser's popup settings.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth scroll="paper" aria-labelledby="spa-invoice-dialog-title">
      <DialogTitle id="spa-invoice-dialog-title" sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Spa Service Invoice</Typography>
          <IconButton onClick={handleClose} size="small" aria-label="close" className="no-print">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content Area for Printing */}
      <DialogContent dividers id="invoice-print-area" sx={{ backgroundColor: '#fff' }}>
        {customerData ? (
          <Paper elevation={0} sx={{ padding: { xs: 1, sm: 2 }, border: 'none' }}>
            <Grid container spacing={2}>
              {/* Header */}
              <Grid item xs={12} sx={{ mb: 1 }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem' } }}>
                  Spa Service Invoice
                </Typography>
                <Typography variant="subtitle1" align="center" gutterBottom className="subtle">
                  Date Issued: {formatDateSafe(invoiceDate)}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Hotel Details */}
              <Grid item xs={12} md={4}>
                <Typography variant="h4" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 1 }}>
                  Hotel Details
                </Typography>
                <Typography variant="body2" component="address">
                  <strong>{hotelInfo.name}</strong>
                  <br />
                  Room No: {serviceDetails.roomNo}
                  <br />
                  Invoice #: {invoiceNumber}
                </Typography>
              </Grid>

              {/* Customer Details */}
              <Grid item xs={12} md={4}>
                <Typography variant="h4" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 1 }}>
                  Customer Details
                </Typography>
                <Typography variant="body2" component="div">
                  <strong>{customerDetails.name}</strong>
                  <br />
                  <Box component="address" sx={{ whiteSpace: 'pre-line', my: 0.5 }}>
                    {customerDetails.address}
                  </Box>
                  Phone: {customerDetails.phoneNumber}
                  <br />
                  Email: {customerDetails.email}
                  <br />
                </Typography>
              </Grid>

              {/* Service Date/Info */}
              <Grid item xs={12} md={4}>
                <Typography variant="h4" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 1 }}>
                  Service Information
                </Typography>
                <Typography variant="body2">
                  <strong>Service Date:</strong> {formatDateSafe(serviceDetails.date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Service Time:</strong> {formatTimeSafe(serviceDetails.date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {serviceDetails.status}
                </Typography>
              </Grid>

              {/* --- Spa Service Details Section --- */}
              <Grid item xs={12} mt={2}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={12} mt={1}>
                <Typography variant="h4" sx={{ fontSize: '1.1rem', fontWeight: 'bold', mb: 1 }}>
                  Spa Service Details
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper} elevation={0} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell align="center">Duration (min)</TableCell>
                        <TableCell align="center">Persons</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          {serviceDetails.name} ({serviceDetails.type})
                        </TableCell>
                        <TableCell align="center">{serviceDetails.duration}</TableCell>
                        <TableCell align="center">{serviceDetails.persons}</TableCell>
                        <TableCell align="right">${serviceDetails.price.toFixed(2)}</TableCell>
                        <TableCell align="right">${totalAmount.toFixed(2)}</TableCell>
                      </TableRow>

                      <TableRow sx={{ '& td': { fontWeight: 'bold', borderTop: '2px solid #ddd' } }}>
                        <TableCell colSpan={4} align="right">
                          Total Amount
                        </TableCell>
                        <TableCell align="right">${totalAmount.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Notes Section */}
              {customerData.notes && (
                <>
                  <Grid item xs={12} mt={2}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} mt={1}>
                    <Typography variant="h4" sx={{ fontSize: '1.1rem', fontWeight: 'bold', mb: 1 }}>
                      Notes
                    </Typography>
                    <Typography variant="body2">{customerData.notes}</Typography>
                  </Grid>
                </>
              )}

              {/* --- Grand Total --- */}
              <Grid item xs={12} mt={2}>
                <Divider sx={{ borderStyle: 'dashed' }} />
              </Grid>
              <Grid item xs={12} mt={1} sx={{ textAlign: 'right' }}>
                <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                  Grand Total: ${totalAmount.toFixed(2)}
                </Typography>
              </Grid>

              {/* Terms and Conditions */}
              <Grid item xs={12} mt={3}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', color: '#555' }}>
                  Thank you for choosing our spa services. We hope you enjoyed your experience.
                </Typography>
              </Grid>

              {/* Signature */}
              <Grid item xs={12} mt={4} mb={2}>
                <Typography sx={{ textAlign: 'right', fontSize: '0.9rem', marginRight: '10px' }} variant="body1">
                  Authorized Signature
                </Typography>
                <Box sx={{ height: '40px', borderBottom: '1px solid #555', width: '180px', float: 'right', marginRight: '10px' }}></Box>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Typography>No customer data available.</Typography>
        )}
      </DialogContent>

      {/* Actions outside the printable area */}
      <DialogActions sx={{ padding: '12px 24px', borderTop: '1px solid rgba(0, 0, 0, 0.12)' }} className="no-print">
        <Button onClick={handlePrint} variant="contained" color="secondary">
          Print Invoice
        </Button>
        <Button onClick={handleClose} variant="outlined" color="primary">
          Close
        </Button>
      </DialogActions>
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            /* Ensure dialog content takes up page */
            body, html { margin: 0; padding: 0; }
            #invoice-print-area { padding: 0 !important; margin: 0 !important; border: none !important; }
            .MuiPaper-root { box-shadow: none !important; border: none !important; padding: 0 !important; }
          }
        `}
      </style>
    </Dialog>
  );
};

export default SpaInvoice;
