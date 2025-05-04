const express = require("express");
const Payment = require("./payments");

const router = express.Router();

router.get("/list", Payment.getPayment);
router.get("/totalPayment", Payment.getTotalPayment);
router.get("/list/:id", Payment.getSinglePayment);
router.post("/add", Payment.add);
router.put("/edit/:id", Payment.edit);
router.patch("/delete/:id", Payment.deleteData);

module.exports = router;
