import { Box, Button, Card, CardActions, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PaymentModel from '../../ui-component/PaymentModel';
import TableStyle from '../../ui-component/TableStyle';
import { getApi, postApi } from '../services/api';

const HotelSubscriptionsDetails = () => {
  const hotelId = JSON.parse(localStorage.getItem('hotelData'))._id;

  const [subscriptionData, setSubscriptionData] = useState([]);
  const [openPayment, setOpenPayment] = useState(false);
  const [purchaseData, setPurchaseData] = useState('');
  const [successfulPayments, setSuccessfulPayments] = useState([]);

  console.log('successfulPayments', successfulPayments);

  const handleOpenPayment = () => setOpenPayment(true);
  const handleClosePayment = () => setOpenPayment(false);

  // fetch all subscription data
  const getAllSubscriptionData = async () => {
    const response = await getApi(`api/packages/getAllPackages`);
    if (response && response.status === 200) {
      setSubscriptionData(response?.data?.packagesAllData);
    } else {
      setSubscriptionData([]);
    }
  };

  // fetch all payment data
  const getAllPaymentsDetails = async () => {
    const response = await getApi(`api/payments/list/?createdBy=${hotelId}`);
    if (response && response.status === 200) {
      setSuccessfulPayments(response?.data?.paymentsData);
    }
  };

  // add payment api
  const addPayments = async (values) => {
    const paymentPayload = {
      subscription_id: values._id,
      title: values.title,
      days: values.days,
      amount: values.amount,
      description: values.description,
      createdBy: hotelId
    };

    const data = paymentPayload;

    try {
      const isAlreadyPurchased = successfulPayments.some((payment) => payment.status === 'active' || payment.status === 'expires soon');
      if (isAlreadyPurchased) {
        toast.error('Cannot Buy Plan, You Already have Purchased One');
      } else {
        const result = await postApi('api/payments/add', data);
        if (result && result.status === 201) {
          toast.success('Plan Purchased successfully');
          await getAllPaymentsDetails();
        } else {
          toast.error('Cannot Buy Plan');
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Cannot Buy Plan');
    }
  };

  const handleBuyNowClick = async (data) => {
    setPurchaseData(data);
    handleOpenPayment();
  };

  useEffect(() => {
    getAllSubscriptionData();
    getAllPaymentsDetails();
    // eslint-disable-next-line
  }, []);

  const isPaymentSuccessful = (itemId) => {
    return successfulPayments.some(
      (payment) =>
        (payment.subscription_id === itemId && payment.status === 'active') ||
        (payment.subscription_id === itemId && payment.status === 'expires soon')
    );
  };

  return (
    <>
      <PaymentModel
        openPayment={openPayment}
        handleClosePayment={handleClosePayment}
        purchaseData={purchaseData}
        addPayments={addPayments}
      />
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
          <Typography variant="h4">Subscription Details</Typography>
        </Stack>

        <TableStyle>
          <Box width="100%">
            <Card
              style={{
                minHeight: '600px',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px'
              }}
            >
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {subscriptionData?.map((item) => (
                    <Grid item md={3} xs={12} key={item._id}>
                      <Card
                        style={{
                          height: '100%',
                          backgroundColor: '#fff',
                          borderRadius: '10px',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ fontSize: 20, fontWeight: 'bold' }} variant="h5">
                              {item.title}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold' }} variant="h4">
                              {`$${item.amount}/${item.days} Days`}
                            </Typography>
                            <Typography color="text.secondary" variant="body1">
                              {item.description}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions sx={{ p: 2 }}>
                          <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            onClick={() => handleBuyNowClick(item)}
                            disabled={isPaymentSuccessful(item._id)}
                            sx={{
                              backgroundColor: isPaymentSuccessful(item._id) ? '#e0e0e0' : '#1976d2',
                              '&:hover': {
                                backgroundColor: isPaymentSuccessful(item._id) ? '#e0e0e0' : '#1565c0'
                              }
                            }}
                          >
                            {isPaymentSuccessful(item._id) ? 'Purchased' : 'Buy Now'}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default HotelSubscriptionsDetails;
