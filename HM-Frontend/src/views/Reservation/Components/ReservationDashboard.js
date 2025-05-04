import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import Iconify from 'ui-component/iconify';
import Visitor from 'views/VisitorInformation';
import { constant } from 'views/constant';
import { getApi } from 'views/services/api';
import AddReservation from '../AddReservations';
import CheckInReservation from '../CheckInReservation';
import CheckOut from '../CheckOutReservation';
import EditReservation from '../EditReservation';
import AddLaundaryDialog from './AddLaundaryDialog';
import FoodInvoiceDialog from './FoodInvoiceDialog';
import LaundaryInvoiceDialog from './LaundaryInvoiceDialog';
import RoomInvoiceDialog from './RoomInvoiceDialog';
import ShowBill from './ShowBills';
import SingleInvoiceDialog from './SingleInvoiceDialog';
import SpaInvoiceDialog from './SpaInvoiceDialog';
import ShowAllFoodItem from './showAllFoodItem';
import ShowAllLaundryItem from './showAllLaundryItem';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary
}));

export default function ReservationDashboard() {
  const navigate = useNavigate();

  const [openEdit, setOpenEdit] = useState(false);
  const [tabOption, setTabOption] = React.useState('1');
  const [firstTabOption, setFirstTabOption] = React.useState('1');
  const [openAdd, setOpenAdd] = useState(false);
  const [openGenerateInv, setOpenGenerateInv] = useState(false);
  const [openFoodInv, setOpenFoodInv] = useState(false);
  const [openSpaInv, setOpenSpaInv] = useState(false);
  const [openLaundaryInv, setOpenLaundaryInv] = useState(false);
  const [openSingleInv, setOpenSingleInv] = useState(false);
  const [totalFoodAmount, setTotalFoodAmount] = useState(0);
  const [totalLaundaryAmount, setTotalLaundaryAmount] = useState(0);
  const [totalSpaAmount, setTotalSpaAmount] = useState(0); // New state for spa amount
  const [openDelete, setOpenDelete] = useState(false);
  const [openCheckIn, setOpenCheckIn] = useState(false);
  const [reservationData, setReservationData] = useState([]);
  const [spaData, setSpaData] = useState([]);
  const [refreshIndicator, setRefreshIndicator] = useState(0);
  const params = useParams();

  // eslint-disable-next-line
  const [isRoomStatusPending, setisRoomStatusPending] = useState(false);

  const [isRoomCheckedIn, setIsRoomCheckedIn] = useState(false);
  const [billData, setbillData] = useState([]);
  const [singleBillData, setSingleBillData] = useState([]);
  const [isRoomCheckedOut, setIsRoomCheckedOut] = useState(false);
  const [openLaundryDialog, setOpenLaundryDialog] = useState(false);

  const reservationId = params.id;

  const FinalCheckInTime = moment().format('hh:mm A');
  const hotelData = JSON.parse(localStorage.getItem('hotelData'));

  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenEditlead = () => setOpenEdit(true);
  const handleCloseEditReservation = () => setOpenEdit(false);

  const handleOpenLaundry = () => {
    setOpenLaundryDialog(true);
  };

  const handleCloseLaundry = () => {
    setOpenLaundryDialog(false);
  };
  const handleOpenGenerateRoomDialog = () => {
    setOpenGenerateInv(true);
  };

  const handleCloseGenerateRoomInvoiceDialog = () => {
    setOpenGenerateInv(false);
  };

  const handleOpenFoodInvoice = () => {
    setOpenFoodInv(true);
  };
  const handleOpenSpaInvoice = () => {
    setOpenSpaInv(true);
  };

  const handleCloseFoodInvoice = () => {
    setOpenFoodInv(false);
  };
  const handleCloseSpaInvoice = () => {
    setOpenSpaInv(false);
  };

  const handleOpeonLaundaryInvoice = () => {
    setOpenLaundaryInv(true);
  };

  const handleCloseLaundaryInvoice = () => {
    setOpenLaundaryInv(false);
  };

  const handleOpenSingleInvoice = () => {
    setOpenSingleInv(true);
  };

  const handleCloseSingleInvoice = () => {
    setOpenSingleInv(false);
  };

  const handleOpenCheckOut = () => {
    const checkOutDate = new Date(reservationData?.checkOutDate).getDate();
    const currentDate = new Date().getDate();
    if (currentDate !== checkOutDate) {
      toast.error('Cannot Check-Out Today. Please check Check-Out Date.');
    } else {
      setOpenDelete(true);
    }
  };
  const handleCloseCheckout = () => {
    setOpenDelete(false);
  };

  const handleOpenCheckIn = () => {
    setOpenCheckIn(true);
  };
  const handleCloseCheckIn = () => setOpenCheckIn(false);

  // ----------------------------------------------------------------------

  const fetchbillData = async () => {
    try {
      const response = await getApi(`api/invoice/view/${reservationId}`);
      setbillData(response?.data?.InvoiceData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSingleBillData = async () => {
    try {
      const response = await getApi(`api/singleinvoice/view/${reservationId}`);
      setSingleBillData(response?.data?.InvoiceData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetechReservationData = async () => {
    try {
      console.log('---->', reservationId);

      const response = await getApi(`api/reservation/view/${reservationId}`);

      console.log('response.single invoice', response.data);
      setReservationData(response.data.reservationData[0]);

      console.log('herehere gere =>', response.data);
      //conditionaly showing buttons
      if (response.data.reservationData[0].status === 'pending') {
        setisRoomStatusPending(true);
      } else if (response.data.reservationData[0].status === 'active') {
        setIsRoomCheckedIn(true);
      } else {
        setIsRoomCheckedOut(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchbillData();
    fetchSingleBillData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openGenerateInv, openFoodInv, openSingleInv]);

  useEffect(() => {
    fetechReservationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAdd, openEdit, openDelete, openCheckIn, openGenerateInv, openFoodInv, openSingleInv, openLaundryDialog, refreshIndicator]);

  const refreshReservationData = () => {
    setRefreshIndicator((prev) => prev + 1);
  };

  const calculateTotalFoodAmount = () => {
    if (!reservationData || !reservationData.foodItems) {
      return 0;
    }

    const totalFoodAmount = reservationData.foodItems.reduce((total, foodData) => {
      return total + foodData.quantity * foodData.price;
    }, 0);

    return totalFoodAmount;
  };

  const calculateTotalLaundaryAmount = () => {
    if (!reservationData || !reservationData.laundryDetails) {
      return 0;
    }
    const totalLaundaryAmount = reservationData?.laundryDetails?.reduce((total, laundary) => {
      return total + laundary.quantity * laundary.amount;
    }, 0);

    return totalLaundaryAmount;
  };

  const calculateTotalSpaAmount = () => {
    if (!reservationData || !reservationData.spaDetails) {
      return 0;
    }

    // Assuming you only have one spa detail and want its price
    const spaPrice = reservationData.spaDetails[0]?.price || 0;
    return spaPrice;
  };

  useEffect(() => {
    setTotalFoodAmount(calculateTotalFoodAmount());
    setTotalLaundaryAmount(calculateTotalLaundaryAmount());
    setTotalSpaAmount(calculateTotalSpaAmount());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationData]);

  //handle add food
  const handleAddFoodClick = () => {
    navigate(`/dashboard/reservation/addfood/${reservationId}`);
  };

  const handleTabChange = (event, newValue) => {
    setTabOption(newValue);
  };

  const handleFirstTabChange = (event, newValue) => {
    setFirstTabOption(newValue);
  };
  useEffect(() => {
    if (tabOption === '1') {
      setTabOption('2');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SingleInvoiceDialog, FoodInvoiceDialog, RoomInvoiceDialog]);

  console.log(singleBillData);

  const handleCheckIn = async () => {
    try {
      if (!isCheckInDateValid()) {
        toast.error('Cannot Check-In Today. Please Do another reservation or Edit Check-In Date.');
        return;
      } else {
        reservationData.FinalCheckInTime = FinalCheckInTime;
        sendWelcomeWhatsAppMessage();
        // let result = await patchApi(`api/reservation/checkin/${reservationId || reservationData._id}`, reservationData);
        // if (result.status === 200) {
        //   toast.success('Successfully Checked In');
        //   sendWelcomeWhatsAppMessage();
        //   handleClose();
        // }
        // else {
        //   toast.error(result?.response?.data?.error);
        // }
      }
    } catch (error) {
      console.log(error);
      toast.error('Cannot Check-In');
    }
  };

  const isCheckInDateValid = () => {
    const checkInDate = moment(reservationData?.checkInDate).format('YYYY-MM-DD');
    const today = moment().format('YYYY-MM-DD');

    const isSameAsToday = checkInDate === today;

    return isSameAsToday;
  };

  const sendWelcomeWhatsAppMessage = async () => {
    console.log('in sendWelcomeWhatsAppMessage');
    const url = constant.WHATSAPP_MESSAGE_URL;
    const accessToken = constant.WHATSAPP_TOKEN;

    console.log(url, 'url');
    console.log(accessToken, 'accessToken');
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: `+91${reservationData?.customerDetails?.phoneNumber}`,
      type: 'template',
      template: {
        name: 'welcome_msg_hotel_crm',
        language: {
          code: 'en_US'
        },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'text',
                text: hotelData?.name
              }
            ]
          },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: hotelData?.contact
              },
              {
                type: 'text',
                text: hotelData?.mapurl
              },
              {
                type: 'text',
                text: hotelData?.name
              }
            ]
          }
        ]
      }
    };

    try {
      console.log('in try =>');
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <CheckOut open={openDelete} handleClose={handleCloseCheckout} data={reservationData} />
      <CheckInReservation open={openCheckIn} handleClose={handleCloseCheckIn} data={reservationData} />
      <AddReservation open={openAdd} handleClose={handleCloseAdd} />
      <EditReservation open={openEdit} handleClose={handleCloseEditReservation} data={reservationData} />
      <RoomInvoiceDialog open={openGenerateInv} handleClose={handleCloseGenerateRoomInvoiceDialog} data={reservationData} />
      <FoodInvoiceDialog open={openFoodInv} handleClose={handleCloseFoodInvoice} data={reservationData} />
      <SpaInvoiceDialog open={openSpaInv} handleClose={handleCloseSpaInvoice} data={reservationData} />
      <LaundaryInvoiceDialog open={openLaundaryInv} handleClose={handleCloseLaundaryInvoice} data={reservationData} />
      <SingleInvoiceDialog open={openSingleInv} handleClose={handleCloseSingleInvoice} data={reservationData} />
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
          <Typography variant="h4">Reservation Details</Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#673ab7',
              borderColor: '#673ab7',
              '&:hover': {
                borderColor: '#563099'
              }
            }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Stack>

        <Box width="100%">
          <Card
            style={{
              minHeight: '600px',
              paddingTop: '15px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
              borderRadius: '5px'
            }}
          >
            <TabContext value={firstTabOption}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  px: 2
                }}
              >
                <TabList onChange={handleFirstTabChange} aria-label="lab API tabs example" textColor="secondary" indicatorColor="secondary">
                  <Tab label="Information" value="1" />
                  <Tab label="Visitors" value="2" />
                </TabList>
              </Box>

              <TabPanel value="1">
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                        <Typography variant="h4" sx={{ mb: 3 }}>
                          Room Information
                        </Typography>
                        <Grid container spacing={3}>
                          {/* Room Information fields with updated styling */}
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Room Number
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>{reservationData?.roomNo || 'N/A'}</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Room Rent
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                $ {reservationData?.totalPayment ? reservationData?.totalPayment : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Advance Amount
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                $ {reservationData?.advanceAmount ? reservationData?.advanceAmount : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Remaining Amount
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                $ {reservationData?.totalAmount ? reservationData?.totalAmount : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Check-In
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {reservationData?.checkInDate ? moment(reservationData?.checkInDate).format('YYYY-MM-DD') : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Check-Out
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {reservationData?.checkOutDate ? moment(reservationData?.checkOutDate).format('YYYY-MM-DD') : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Total Days
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {reservationData?.totalDays ? reservationData?.totalDays : 'N/A'} day(s)
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Total Restaurant Expense
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                $ {totalFoodAmount ? totalFoodAmount : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          {/* New field for Laundry Expense */}
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Total Laundry Expense
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                $ {totalLaundaryAmount ? totalLaundaryAmount : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          {/* New field for Spa Expense */}
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Total Spa Expense
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>$ {totalSpaAmount ? totalSpaAmount : 'N/A'}</Typography>
                            </Box>
                          </Grid>
                          {/* Updated Total Amount Calculation */}
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Total Amount ( Room + Restaurant + Laundry + Spa )
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                ${' '}
                                {(reservationData?.totalPayment || 0) +
                                  (totalFoodAmount || 0) +
                                  (totalLaundaryAmount || 0) +
                                  (totalSpaAmount || 0)}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                        <Typography variant="h4" sx={{ mb: 3 }}>
                          Customer Information
                        </Typography>
                        <Grid container spacing={3}>
                          {/* Customer Information fields with updated styling */}
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Name
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>{reservationData?.fullName || 'N/A'}</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Email
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {reservationData?.customerDetails?.email ? reservationData?.customerDetails?.email : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Phone Number
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {reservationData?.customerDetails?.phoneNumber ? reservationData?.customerDetails?.phoneNumber : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                Address
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {reservationData?.customerDetails?.address ? reservationData?.customerDetails?.address : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                {reservationData?.customerDetails?.idCardType} Number
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                                {reservationData?.customerDetails?.idcardNumber ? reservationData?.customerDetails?.idcardNumber : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} display="flex" justifyContent={{ xs: 'center', sm: 'start' }}>
                            <Box sx={{ mb: 2, textAlign: { xs: 'center', sm: 'left' } }}>
                              <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                                ID Proof
                              </Typography>
                              <Typography sx={{ color: '#000', fontSize: '1rem', marginTop: '7px' }}>
                                <a href={reservationData?.idFile} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                  <Button
                                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                                    startIcon={<VisibilityIcon />}
                                    variant="contained"
                                    color="primary"
                                  >
                                    View ID Proof
                                  </Button>
                                </a>
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                  {/* Action Buttons */}
                  <Box
                    sx={{
                      mt: 3,
                      display: { lg: 'flex', xs: 'block' },
                      gap: 2,
                      justifyContent: 'space-between'
                    }}
                  >
                    {' '}
                    <Box>
                      {/* Left side buttons (Add Food & Add Laundry) */}
                      {isRoomCheckedIn && !isRoomCheckedOut && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {' '}
                          {/* Added flex & gap */}
                          <Button
                            variant="outlined"
                            sx={{
                              color: '#673ab7',
                              borderColor: '#673ab7',
                              '&:hover': { borderColor: '#563099' }
                            }}
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            onClick={handleAddFoodClick}
                          >
                            Add Food
                          </Button>
                          <Button
                            variant="outlined"
                            sx={{
                              color: '#673ab7',
                              borderColor: '#673ab7',
                              '&:hover': { borderColor: '#563099' }
                            }}
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            onClick={handleOpenLaundry}
                          >
                            Add Laundry
                          </Button>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ display: { lg: 'flex', xs: 'inline-block' } }}>
                      {/* Right side buttons (Invoice, Check-in/out, Edit) */}
                      {isRoomCheckedOut &&
                        (reservationData?.foodItems?.length > 0 ||
                          reservationData?.spaDetails[0]?.status === 'Completed' ||
                          reservationData?.laundryDetails?.length > 0) &&
                        !singleBillData && (
                          <Button
                            variant="outlined"
                            sx={{ marginRight: 2, color: '#673ab7', borderColor: '#673ab7' }}
                            onClick={() => handleOpenSingleInvoice()}
                          >
                            Generate Single Invoice
                          </Button>
                        )}

                      {!billData?.some((item) => item.type === 'room') && isRoomCheckedOut && (
                        <Button
                          variant="outlined"
                          sx={{ marginRight: 2, color: '#673ab7', borderColor: '#673ab7' }}
                          onClick={() => handleOpenGenerateRoomDialog()}
                        >
                          Generate Room Invoice
                        </Button>
                      )}

                      {!billData?.some((item) => item.type === 'food') && isRoomCheckedOut && reservationData?.foodItems?.length > 0 && (
                        <Button
                          variant="outlined"
                          sx={{ marginRight: 2, color: '#673ab7', borderColor: '#673ab7' }}
                          onClick={() => handleOpenFoodInvoice()}
                        >
                          Generate Food Invoice
                        </Button>
                      )}
                      {!billData?.some((item) => item.type === 'spa') &&
                        isRoomCheckedOut &&
                        reservationData?.spaDetails[0]?.status === 'Completed' &&
                        reservationData?.spaDetails.length > 0 && (
                          <Button
                            variant="outlined"
                            sx={{ marginRight: 2, color: '#673ab7', borderColor: '#673ab7' }}
                            onClick={() => handleOpenSpaInvoice()}
                          >
                            Generate Spa Invoice
                          </Button>
                        )}

                      {!billData?.some((item) => item.type === 'laundary') && isRoomCheckedOut && reservationData?.laundry?.length > 0 && (
                        <Button
                          variant="outlined"
                          sx={{ marginRight: 2, color: '#673ab7', borderColor: '#673ab7' }}
                          onClick={() => handleOpeonLaundaryInvoice()}
                        >
                          Generate Laundry Invoice
                        </Button>
                      )}

                      {!isRoomCheckedIn && !isRoomCheckedOut ? (
                        <Button
                          variant="outlined"
                          sx={{ marginRight: 2, color: '#673ab7', borderColor: '#673ab7' }}
                          onClick={() => handleOpenCheckIn()}
                        >
                          Final Check-In
                        </Button>
                      ) : (
                        ''
                      )}

                      {setisRoomStatusPending === true ? (
                        <Button
                          variant="outlined"
                          sx={{ marginRight: 2, marginTop: { lg: 0, xs: 1 } }}
                          color="error"
                          onClick={() => handleOpenCheckOut()}
                        >
                          Final Check-Out
                        </Button>
                      ) : isRoomCheckedIn && !isRoomCheckedOut ? (
                        <Button
                          variant="outlined"
                          sx={{ marginRight: 2, marginTop: { lg: 0, xs: 1 } }}
                          color="error"
                          onClick={() => handleOpenCheckOut()}
                        >
                          Final Check-Out
                        </Button>
                      ) : (
                        <></>
                      )}
                      {!isRoomCheckedOut ? (
                        <Button
                          startIcon={<EditIcon />}
                          variant="outlined"
                          sx={{ marginRight: 2, marginTop: { lg: 0, xs: 1 }, color: '#673ab7', borderColor: '#673ab7' }}
                          onClick={handleOpenEditlead}
                        >
                          Edit
                        </Button>
                      ) : (
                        ''
                      )}
                    </Box>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel value="2">
                <Box sx={{ p: 2 }}>
                  <Visitor isRoomCheckedOut={isRoomCheckedOut} />
                </Box>
              </TabPanel>
            </TabContext>
          </Card>
        </Box>

        {/* Second TabContext for Foods and Invoices */}
        <Box sx={{ width: '100%', mt: 3 }}>
          <Card
            style={{
              minHeight: '400px',
              paddingTop: '15px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
              borderRadius: '5px'
            }}
          >
            <TabContext value={tabOption}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  px: 2
                }}
              >
                <TabList onChange={handleTabChange} aria-label="lab API tabs example" textColor="secondary" indicatorColor="secondary">
                  <Tab label="Foods" value="1" />
                  <Tab label="Laundries" value="2" />
                  <Tab label="Invoices" value="3" />
                </TabList>
              </Box>

              <TabPanel value="1">
                <Box sx={{ p: 2 }}>
                  <ShowAllFoodItem />
                </Box>
              </TabPanel>

              <TabPanel value="2">
                <Box sx={{ p: 2 }}>
                  <ShowAllLaundryItem openLaundryDialog={openLaundryDialog} onDataChange={refreshReservationData} />
                </Box>
              </TabPanel>

              <TabPanel value="3">
                <Box sx={{ p: 2 }}>
                  <ShowBill />
                </Box>
              </TabPanel>
            </TabContext>
          </Card>
        </Box>
      </Container>
      <AddLaundaryDialog open={openLaundryDialog} handleClose={handleCloseLaundry} reservationData={reservationData} />
    </>
  );
}
