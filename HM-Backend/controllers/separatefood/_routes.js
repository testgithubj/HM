const express = require("express");
const Invoice = require("./invoice");

const router = express.Router();

router.post("/add", Invoice.addItems);
router.get("/viewspecificinvoice/:id", Invoice.getInvoiceByInvoiceId);
router.get("/view/:hotelId", Invoice.getAllInvoices);

module.exports = router;
