const express = require("express");
const restaurant = require("./restaurant");
const { rawListeners } = require("../../model/schema/restaurant");

const router = express.Router();

router.post("/add", restaurant.upload.single("itemImage"), restaurant.addItems);
router.get("/viewallitems/:hotelId", restaurant.getAllItems);
router.patch("/delete/:id", restaurant.deleteItem);
router.post("/importitems/:id", restaurant.importItem);

router.patch("/edit/:id",restaurant.upload.single("itemImage"), restaurant.editItem);

router.post("/deletemany",restaurant.deleteManyItem);


module.exports = router;
