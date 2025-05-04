const express = require("express");
const employee = require("./employee");

const router = express.Router();

router.post(
  "/add",
  employee.upload.fields([
    { name: "idFile", maxCount: 1 },
    { name: "idFile2", maxCount: 1 },
  ]),
  employee.addItems
);
router.get("/viewallemployee/:hotelId", employee.getAllItems);
router.get("/view/:id", employee.getSpecificEmployee);
router.patch("/delete/:id", employee.deleteItem);
router.patch(
  "/editemployee/:id",
  employee.upload.fields([
    { name: "idFile", maxCount: 1 },
    { name: "idFile2", maxCount: 1 },
  ]),
  employee.editEmployee
);
router.patch("/edit/:id", employee.editShift);
router.patch("/addPermissions/:id", employee.addPermissions);
router.patch("/changeEmployePassword", employee.changePasswordForStaff);



module.exports = router;
