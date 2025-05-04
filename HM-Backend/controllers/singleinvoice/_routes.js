const express = require("express");
const Invoice = require("./singleinvoice");

const router = express.Router();

router.post("/add", Invoice.addItems);
router.get("/view/:reservationId", Invoice.getSpecificInvoice);
router.get("/revenue", Invoice.getMonthlyRevenue);
router.patch("/delete/:id", Invoice.deleteItem);

module.exports = router;
