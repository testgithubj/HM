/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
// @mui
import { Stack, Container, Typography, Card, Box, CardContent, CardActions, Button, Grid } from '@mui/material';
import { getApi, postApi } from 'service/api';
import PaymentModel from '../../ui-component/Paymentmodle';
import { toast } from 'react-toastify';

const SubscriptionDetails = () => {
  const user_id = localStorage.getItem('user_id');
  const userRole = localStorage.getItem('userRole');

  const [subscriptionData, setSubscriptionData] = useState([]);
  const [openPayment, setOpenPayment] = useState(false);
  const [purchaseData, setPurchaseData] = useState('');
  const [successfulPayments, setSuccessfulPayments] = useState([]);

  const handleOpenPayment = () => setOpenPayment(true);
  const handleClosePayment = () => setOpenPayment(false);

  const getAllSubscriptionData = async () => {
    const response = await getApi(userRole === 'admin' ? `packages/list` : `packages/list/?createdBy=${user_id}`);
    if (response && response.status === 200) {
      setSubscriptionData(response?.data?.packagesAllData);
    }
  };

  const getAllPaymentsDetails = async () => {
    const response = await getApi(userRole === 'admin' ? `payments/list` : `payments/list/?createdBy=${user_id}`);
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
      createdBy: user_id
    };
    const data = paymentPayload;
    const result = await postApi('payments/add', data);
    if (result && result.status === 201) {
      toast.success('Payments Done successfully');
      await getAllPaymentsDetails();
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
    return successfulPayments.some((payment) => payment.subscription_id === itemId);
  };

  return (
    <>
      <PaymentModel
        openPayment={openPayment}
        handleClosePayment={handleClosePayment}
        purchaseData={purchaseData}
        addPayments={addPayments}
      />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Subscription Details</Typography>
        </Stack>

        <Grid container spacing={5}>
          {subscriptionData.map((item) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <Grid item md={3} xs={12} key={item._id}>
                <Card style={{ height: '250px', backgroundColor: '#D6E4FF', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography sx={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold', mb: 2 }} variant="h5" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }} variant="h4">
                        {`Rs.${item.amount}/${item.days}`}
                      </Typography>
                      <Box sx={{ paddingTop: '20px', textAlign: 'center' }}>
                        <Typography color="text.secondary" variant="body1" gutterBottom>
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={() => handleBuyNowClick(item)}
                      disabled={isPaymentSuccessful(item._id)}
                    >
                      {isPaymentSuccessful(item._id) ? 'Purchased' : 'Buy Now'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
};

export default SubscriptionDetails;
