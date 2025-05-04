import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { patchApi } from 'views/services/api';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import moment from 'moment';
import PropTypes from 'prop-types';
import { constant } from 'views/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { getApi } from 'views/services/api';
import { useState } from 'react';

const CheckInReservation = ({ open, handleClose, data }) => {
  const params = useParams();
  const reservationId = params.id;
  const hotelData = JSON.parse(localStorage.getItem('hotelData'));
  console.log('hotelData  here ------------------>', hotelData);

  const [hoteldata, sethoteldata] = useState({});

  const FinalCheckInTime = moment().format('hh:mm A');

  const isCheckInDateValid = () => {
    const checkInDate = moment(data?.checkInDate).format('YYYY-MM-DD');
    const today = moment().format('YYYY-MM-DD');

    const isSameAsToday = checkInDate === today;

    return isSameAsToday;
  };

  const sendWelcomeWhatsAppMessage = async () => {

    console.log("here sendWelcomeWhatsAppMessage api is call........");
    
    const url = constant.WHATSAPP_MESSAGE_URL;
    const accessToken = constant.WHATSAPP_TOKEN;

    console.log(url, 'url');
    console.log(accessToken, 'accessToken');
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: `+91${data?.customerDetails?.phoneNumber}`,
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
                text: hotelData?.contact || ''
              },
              {
                type: 'text',
                text: hotelData?.mapurl || ''
              },
              {
                type: 'text',
                text: hotelData?.name || ''
              }
            ]
          }
        ]
      }
    };

    console.log('open hotelData =>', hotelData);

    console.log('payload here ==>', payload);

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });

      console.log(response, 'response');

      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //handle delete function-------------
  const handleCheckIn = async () => {
    try {
      if (!isCheckInDateValid()) {
        toast.error('Cannot Check-In Today. Please Do another reservation or Edit Check-In Date.');
        return;
      } else {
        const response = await getApi(`api/hotel/view/${hotelData._id}`);
        console.log('response 1234 ====>', response);
        sethoteldata(response.data);

        data.FinalCheckInTime = FinalCheckInTime;
        let result = await patchApi(`api/reservation/checkin/${reservationId || data._id}`, data);
        if (result.status === 200) {
          toast.success('Successfully Checked In');
          handleClose();
          if (response.data.checkInButtonStatus === true) {
            sendWelcomeWhatsAppMessage();
          }
          // sendWelcomeWhatsAppMessage();
        } else {
          toast.error(result?.response?.data?.error);
          toast.error('Cannot Check-In');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Check-In</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to Check-In?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCheckIn} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
CheckInReservation.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object
};

export default CheckInReservation;
