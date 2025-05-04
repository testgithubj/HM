const express = require("express");
const auth = require("../../middelwares/auth");
const reservation = require("./reservation");

const router = express.Router();

router.get(
  "/viewallreservations/:hotelId",
  auth,
  reservation.getAllReservations
);

router.get('/getTotalRevenueForAdmin',reservation.getTotalRevenue)
router.get(
  "/viewallreservation/:status",
  auth,
  reservation.getAllReservationForAdmin
);

router.get("/monthly", auth, reservation.getMonthlyReservationOverview);

router.get(
  "/viewallactivereservations/:hotelId",
  auth,
  reservation.getAllActiveReservations
);
router.get(
  "/viewpendingandactivereservations/:hotelId",
  auth,
  reservation.getAllPendingAndActiveReservation
);
router.get(
  "/viewactiveandcompletedreservation/:hotelId",
  auth,
  reservation.getAllActiveAndCompletedReservation
);
router.get(
  "/viewallpendingreservations/:hotelId",
  auth,
  reservation.getAllPendingReservations
);
router.get(
  "/viewallcompletedreservations/:hotelId",
  auth,
  reservation.getAllCompleteReservation
);
// router.get(
//   "/viewallactivereservationcontacts/:hotelId",
//   auth,
//   reservation.getAllActiveReservationCustomerDetails
// );
router.get(
  "/viewcustomerofactivereservation/:hotelId",
  auth,
  reservation.getAllActiveReservationCustomers
);
router.get("/view/:id", auth, reservation.getSpecificReservation);
router.get("/getfooditems/:id", reservation.getFoodItems);
router.patch("/edit/:id", auth, reservation.editreservation);
router.patch("/updatefoodquantity/:id", auth, reservation.updateFoodQuantity);
router.patch("/editfooditems/:id", auth, reservation.editFoodItems);
router.patch("/delete/:id", reservation.deleteReservation);
router.patch("/deletefooditem/:id", reservation.deleteFoodItems);
router.patch("/checkin/:id", reservation.checkIn);

router.get(
  "/getSpecificLaundaryItems/:id",
  auth,
  reservation.getSpecificLaundaryItems
);

router.get("/adminTotalRevenue", reservation.getMonthlyReservationOverview);

router.get("/adiminOccupancyRate/stats", reservation.getMonthlyReservationStats);


router.get("/viewbydate/:id/:date", reservation.dailyReport);

module.exports = router;
