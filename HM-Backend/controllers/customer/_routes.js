const express = require("express");
const customer = require("./customer");

const router = express.Router();

router.post(
  "/add",
  customer.upload.fields([
    { name: "idFile", maxCount: 1 },
    { name: "idFile2", maxCount: 1 },
  ]),
  customer.addItems
);
router.post(
  "/doreservation",
  customer.upload.array("idFile"),
  customer.doReservation
);
router.get("/viewallcustomer/:hotelId", customer.getAllItems);
router.get("/viewallcustomer", customer.getAllCustomers);
router.get("/view/:phone", customer.getSpecificCustomer);
router.patch("/delete/:phone", customer.deleteItem);
router.patch(
  "/editcustomer/:id",
  customer.upload.fields([
    { name: "idFile", maxCount: 1 },
    { name: "idFile2", maxCount: 1 },
  ]),
  customer.editcustomer
);
// router.patch("/edit/:id", customer.editShift);

router.get("/history/:customerObjId", customer.reservationHistory);

module.exports = router;
