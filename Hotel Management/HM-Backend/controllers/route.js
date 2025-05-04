const express = require("express");
const router = express.Router();

const roomRoute = require("./room/_routes");
const userRoute = require("./user/_routes");

const roleAccessRoute = require("./roleAccess/_routes");
const restaurant = require("./Restaurant/_routes");
const laundary = require("./laundary/_routes");
const inventory = require("./inventory/_routes");
const complaint = require("./complaint/_routes");
const expense = require("./expenses/_routes");
const employee = require("./employee/_routes");
const customer = require("./customer/_routes");
const reservation = require("./reservation/_routes");
const invoice = require("./Invoice/_routes");
const singleinvoice = require("./singleinvoice/_routes");
const hotel = require("./hotel/_routes");
const packages = require("./packages/_routes");
const payments = require("./payments/_routes");
const visitors = require("./visitors/_routes");
const separatefoodinvoice = require("./separatefood/_routes");
const spa = require("./Spa/_routes");
const spaStaff = require("./spaStaff/_routes");
const kot = require("./kot/_routes");

router.use("/room", roomRoute);
router.use("/spaStaff", spaStaff);
router.use("/customer", customer);
router.use("/restaurant", restaurant);
router.use("/laundary", laundary);
router.use("/inventory", inventory);
router.use("/complaint", complaint);
router.use("/expenses", expense);
router.use("/employee", employee);
router.use("/reservation", reservation);
router.use("/invoice", invoice);
router.use("/singleinvoice", singleinvoice);
router.use("/hotel", hotel);
router.use("/user", userRoute);
router.use("/packages", packages);
router.use("/payments", payments);
router.use("/visitors", visitors);
router.use("/separatefoodinvoice", separatefoodinvoice);
router.use("/kitchenorderticket", kot);
router.use("/spa", spa);
//--------------------------------------------------

router.use("/role-access", roleAccessRoute);

module.exports = router;
