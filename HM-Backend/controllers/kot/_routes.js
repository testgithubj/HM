const express = require("express");
const kot = require("./kot");

const router = express.Router();

router.post("/addKot", kot.addTicket);
router.get("/viewallKot/:hotelId", kot.viewAllTicket);
router.patch("/editKot/:id", kot.editTicket);
router.get("/viewSingleKot/:hotelId/:id", kot.viewSingleTicket);
router.patch("/deleteKot/:id", kot.deleteTicket);
router.post("/updateStatus/:id", kot.updateTicketStatus);

module.exports = router;
