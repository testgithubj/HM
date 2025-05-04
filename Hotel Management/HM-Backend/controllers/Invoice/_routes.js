const express = require("express");
const Invoice = require("./invoice");

const router = express.Router();

router.post("/add", Invoice.addItems);
router.get("/viewspecificinvoice/:id", Invoice.getInvoiceByInvoiceId);
router.get("/view/:reservationId", Invoice.getSpecificInvoice);
router.patch("/delete/:id", Invoice.deleteItem);
// router.patch("/edit/:id", Invoice.editItem);

router.get("/viewallinvoice/:id",Invoice.viewAllItem);

module.exports = router;
