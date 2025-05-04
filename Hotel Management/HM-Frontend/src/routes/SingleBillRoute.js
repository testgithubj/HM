import React from 'react';
import SingleInvoiceView from 'views/Reservation/Components/SingleInvoiceView';

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const SingleBillRoute = {
  path: '/singlebill/view/:id',
  element: <SingleInvoiceView />
};

export default SingleBillRoute;
