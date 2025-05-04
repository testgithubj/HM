import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { patchApi, getApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import EditReservation from './EditReservation';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { constant } from 'views/constant';
import axios from 'axios';

const CheckOut = ({ open, handleClose }) => {
  const [reservationData, setReservationData] = useState([]);
  const [editReservationOpen, setEditReservationOpen] = useState(false);
  const params = useParams();
  const reservationId = params.id;
  const hotelData = JSON.parse(localStorage.getItem('hotelData'));
  const FinalCheckOutTime = moment().format('hh:mm A');

  const [hoteldata, sethoteldata] = useState({});

  const fetechReservationData = async () => {
    try {
      const response = await getApi(`api/reservation/view/${reservationId}`);
      setReservationData(response.data.reservationData[0]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetechReservationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editReservationOpen]);

  const sendCheckoutHotelWhatsappMessage = async () => {
    console.log("here sendCheckoutHotelWhatsappMessage api call ..........");
    
    const url = constant.WHATSAPP_MESSAGE_URL;
    const accessToken = constant.WHATSAPP_TOKEN;

    console.log(url, 'WhatsApp message URL');
    console.log(accessToken, 'WhatsApp access token');

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: `+91${reservationData?.customerDetails?.phoneNumber}`,
      type: 'template',
      template: {
        name: 'checkout_hotel_crm',
        language: {
          code: 'en_US'
        },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'text',
                text: `${reservationData?.customerDetails?.firstName}`
              }
            ]
          },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: hotelData?.name || ''
              },
              {
                type: 'text',
                text: hotelData?.checkOutTime || ''
              },
              {
                type: 'text',
                text: hotelData.googleReviewURL || ''
              },
              {
                type: 'text',
                text: hotelData.websiteURL || ''
              },
              {
                type: 'text',
                text: hotelData.contact || ''
              }
            ]
          }
        ]
      }
    };

    console.log('payload here ==>', payload);

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log(response, 'WhatsApp API response');

      console.log('Checkout message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending checkout message:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await getApi(`api/hotel/view/${hotelData._id}`);
      console.log('response 1234 ====>', response);
      sethoteldata(response.data);

      reservationData.FinalCheckOutTime = FinalCheckOutTime;
      let result = await patchApi(`api/reservation/delete/${reservationId}`, reservationData);
      if (result) {
        toast.success('Successfully Checked Out');
        handleClose();
        if (response.data.checkOutButtonStatus === true) {
          sendCheckoutHotelWhatsappMessage();
        }
        // sendCheckoutHotelWhatsappMessage();
      } else {
        toast.error('Cannot Check-out');
      }
    } catch (error) {
      console.log(error);
      toast.error('Cannot Check-out');
    }
  };

  const handleCloseEditReservation = () => {
    setEditReservationOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Check-Out</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to Check-Out?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCheckOut} color="error" variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Reservation Dialog */}
      <EditReservation open={editReservationOpen} handleClose={handleCloseEditReservation} data={reservationData} />
    </>
  );
};

CheckOut.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
export default CheckOut;
