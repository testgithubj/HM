import React from 'react';
import SeparateFoodInvView from 'views/SeparateFoodOrder/SeparateFoodInvView';

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const SeparateFoodBillRoute = {
  path: '/separatefoodbill/view/:id',
  element: <SeparateFoodInvView />
};

export default SeparateFoodBillRoute;
