const express = require("express");
const inventory = require("./inventory");

const router = express.Router();

router.post("/add", inventory.addItems);
router.get("/viewallinventories/:hotelId", inventory.getAllItems);
router.get("/viewallFandBitems/:hotelId", inventory.getAllFandBItems);
router.get("/viewallKitchenitems/:hotelId", inventory.getAllKitchenItems);
router.get("/viewallHouseKeepingitems/:hotelId", inventory.getAllHouseKeepingItems);
router.get("/viewallLaundryitems/:hotelId", inventory.getAllLaundryItems);
router.patch("/edit/:id", inventory.editItem);
router.patch("/delete/:id", inventory.deleteItem);


module.exports = router;
