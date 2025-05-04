const express = require("express");
const hotel = require("./hotel");
const auth = require("../../middelwares/auth");

const router = express.Router();

router.post("/register", hotel.register);
router.post("/login", hotel.login);
router.get("/viewallhotels", hotel.getAllHotels);
router.get("/viewallhotelreports", hotel.getAllHotelReports);
router.patch("/changehotelstatus/:id", hotel.changeHotelStatus);
router.get("/view/:id", hotel.getSpecificHotel);
// router.patch("/deletehotel/:id", auth, hotel.deleteHotel);
router.patch("/deletehotels/:id", auth, hotel.deleteHotel);

// router.patch("/edit/:id", auth, hotel.upload.single("hotelImage"),  hotel.edit);
router.patch("/edit/:id", auth, hotel.upload.single("hotelImage"), hotel.edit);

router.patch("/changehotelpassword",hotel.ChangeHotelPassword);
router.patch("/editCheckInButtonStatus/:id",hotel.ChangeCheckInButtonStatus);
router.patch("/editCheckOutButtonStatus/:id",hotel.ChangeCheckOutButtonStatus);


module.exports = router;
