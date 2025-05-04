const express = require("express");
const room = require("./rooms");
const auth = require("../../middelwares/auth");

const router = express.Router();

// router.get("/", room.index);
router.get("/viewallrooms/:hotelId", auth, room.getAllRooms);
router.get("/viewallrooms", auth, room.getAllRoomsForAdmin);
router.get(
  "/activroomreservationid/:roomNo",
  auth,
  room.reservedRoomCustomerData
);
// router.get("/viewuserrooms/:createBy", auth, room.getUserrooms);
router.post("/add", auth, room.add);
router.patch("/edit/:id", auth, room.edit);
router.patch("/delete/:id", auth, room.deleteData);
router.patch("/editroomstatus/:roomNo", auth, room.editRoomStatus);
// router.post("/createroom", auth, room.createroom);
// router.get("/view/:id", room.view);
// router.post("/deleteMany", auth, room.deleteMany);
// router.get("/exportroom", room.exportroom);

module.exports = router;
