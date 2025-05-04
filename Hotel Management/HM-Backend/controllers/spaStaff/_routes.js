const express = require("express");
const spaStaff = require("./spaStaff");

const router = express.Router();

router.post(
  "/add",
  spaStaff.upload.fields([
    { name: "idFile", maxCount: 1 },
    { name: "idFile2", maxCount: 1 },
  ]),
  spaStaff.addItems
);
router.get("/viewallspaStaff/:hotelId", spaStaff.getAllItems);

router.get("/view/:id", spaStaff.getSpecificSpaStaff);

router.patch("/delete/:id", spaStaff.deleteItem);

router.patch(
  "/editspaStaff/:id",
  spaStaff.upload.fields([
    { name: "idFile", maxCount: 1 },
    { name: "idFile2", maxCount: 1 },
  ]),
  spaStaff.editEmployee
);

router.patch("/edit/:id", spaStaff.editShift);

// router.patch("/addPermissions/:id", spaStaff.addPermissions);

module.exports = router;
