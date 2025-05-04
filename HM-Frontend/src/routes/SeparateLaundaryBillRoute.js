import React from 'react';
import SeparateLaundaryInvView from 'views/SeparateLaundaryOrder/SeparateLaundaryInvView';

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const SeparateLaundaryBillRoute = {
  path: '/separatelaundarybill/view/:id',
  element: <SeparateLaundaryInvView />
};

export default SeparateLaundaryBillRoute;
