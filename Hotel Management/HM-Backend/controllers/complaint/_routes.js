const express = require("express");
const complaint = require("./complaint");

const router = express.Router();

router.post("/add", complaint.addItems);
router.get("/viewallcomplaints/:hotelId", complaint.getAllItems);
router.get("/viewallcomplaints", complaint.getAllComplaints);
router.get("/view/:id", complaint.getSpecificComplaint);
router.patch("/delete/:id", complaint.deleteItem);
router.patch("/edit/:id", complaint.editItem);
router.patch("/changecomplaintstatus/:id", complaint.editComplaintStatus);

module.exports = router;
