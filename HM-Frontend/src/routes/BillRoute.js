import RoomInvoice from 'views/Reservation/Components/RoomInvoiceView';

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const BillRoute = {
  path: '/roombill/view/:id',
  element: <RoomInvoice />
};

export default BillRoute;
