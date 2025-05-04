const express = require("express");
const router = express.Router();

// Import spa service controllers
const {
  createService,
  getAllServices,
  updateService,
  deleteService,
} = require("./spaServiceController");

// Import spa package controllers
const {
  createPackage,
  getAllPackages,
  updatePackage,
  deletePackage,
} = require("./spaPacakageController");

// Import spa booking controllers with all the new functions
const { 
  createBooking, 
  getAllGuestBookings, 
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getRoomBookings,
  upload 
} = require("./spaBooking");
const { deleteCustomer, updateCustomer, getSpaByReservationId } = require("./spaCustomers");
const { sendEmail, sendSimpleEmail } = require("./spaMail");

// Spa single services routes
router.post('/services', createService);
router.get('/services', getAllServices);
router.patch('/updateServices/:id', updateService);
router.patch('/services/:id', deleteService);

// Spa packages routes
router.post("/packages", createPackage);
router.get("/packages", getAllPackages);
router.patch("/packages/update/:id", updatePackage);
router.patch("/packages/:id", deletePackage);


router.post(
  "/service-booking/add", 
  upload.fields([
    { name: "idFile", maxCount: 1 },
    { name: "idFile2", maxCount: 1 },
  ]),
  createBooking
);

// Get all guest bookings with optional filtering
router.get("/get-guest-bookings/:hotelId", getAllGuestBookings);

// Get spa bookings for room guests
router.get("/room-bookings", getRoomBookings);

// Get specific booking by ID
router.get("/bookings/:id", getBookingById);

// Update booking status
router.patch("/bookings/status/:id", updateBookingStatus);

// Delete booking
router.patch("/spaCustomerDelete/:id", deleteCustomer);

// update customer
router.patch("/spaCustomerUpdate", updateCustomer)

router.get( "/spabyreservation/:reservationId", getSpaByReservationId );


// this is for send mail for spa booking
router.post('/send', sendSimpleEmail);

module.exports = router;
