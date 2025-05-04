const express = require( "express" );
const laundary = require( "./laundary" );

const router = express.Router();

router.post( "/add", laundary.addItems );
router.get( "/viewalllaundaries/:hotelId", laundary.getAllItems );
router.get( "/viewlaundaryexpenses/:hotelId", laundary.getAllLaundaryExpenses );
router.get( "/laundrybyreservation/:reservationId", laundary.getLaundryByReservationId );
router.patch( "/delete/:id", laundary.deleteItem );
router.patch( "/edit/:id", laundary.editItem );
router.patch( "/edit/status/:id", laundary.updateStatus );

module.exports = router;
