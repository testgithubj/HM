const Room = require("../../model/schema/room");
const EmailHistory = require("../../model/schema/email");
const PhoneCall = require("../../model/schema/phoneCall");
const Task = require("../../model/schema/task");
const MeetingHistory = require("../../model/schema/meeting");
const DocumentSchema = require("../../model/schema/document");
const reservation = require("../../model/schema/reservation");

const index = async (req, res) => {
  const query = req.query;
  query.deleted = false;

  // let result = await Room.find(query);

  let allData = await Room.find(query)
    .populate({
      path: "createBy",
      match: { deleted: false }, // Populate only if createBy.deleted is false
    })
    .exec();

  const result = allData.filter((item) => item.createBy !== null);
  res.send(result);
};

//Api for fetching all Rooms based on the hotel id--------------------------
const getAllRooms = async (req, res) => {
  const hotelId = req.params.hotelId;
  try {
    const allRooms = await Room.find({ hotelId }).sort({ createdDate: -1 });

    res.status(200).json(allRooms);
  } catch (err) {
    console.error("Failed to Fetch Room :", err);
    res.status(400).json({ error: "Failed to Fetch Room " });
  }
};
//Api for fetching all Rooms to show counts on the super admin screen--------------------------
const getAllRoomsForAdmin = async (req, res) => {
  try {
    const allRooms = await Room.find().populate("hotelId").exec();
    res.status(200).json(allRooms);
  } catch (err) {
    console.error("Failed to Fetch Room :", err);
    res.status(400).json({ error: "Failed to Fetch Room " });
  }
};
//Api for customer of the booked room --------------------------
const reservedRoomCustomerData = async (req, res) => {
  const roomNo = Number(req.params.roomNo);

  console.log(typeof roomNo, "------------------------------------------->");
  try {
    const pipeline = [
      { $match: { roomNo: roomNo, status: "active" } },
      {
        $project: {
          _id: 0,
          reservationId: "$_id",
        },
      },
    ];

    const result = await reservation.aggregate(pipeline);

    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to Fetch reservation id  :", err);
    res.status(400).json({ error: "Failed to Fetch reservation id" });
  }
};

//Api for fetching specific user Rooms--------------------------
const getUserRooms = async (req, res) => {
  const createBy = req.params;
  try {
    const allRooms = await Room.find(createBy);

    res.status(200).json(allRooms);
  } catch (err) {
    console.error("Failed to Fetch Room :", err);
    res.status(400).json({ error: "Failed to Fetch Room " });
  }
};

//function for adding room----------------------
const add = async (req, res) => {
  try {
    const { roomNo, roomType, hotelId, ac, smoking, description } = req.body;
    req.body.createdDate = new Date();
    req.body.checkIn = "";
    req.body.checkOut = "";
    req.body.bookingStatus = "false";

    const finalRoomNumber = roomNo.toLowerCase();

    const isRoomAlreadyExisted = await Room.find({
      hotelId,
      roomNo: finalRoomNumber,
    });

    if (isRoomAlreadyExisted.length > 0) {
      return res.status(400).json({ error: "Room already exists" });
    }

    req.body.ac = ac && ["AC", "Non-AC"].includes(ac) ? ac : null;
    req.body.smoking =
      smoking && ["Smoking", "Non-Smoking"].includes(smoking) ? smoking : null;
    // req.body.description = description || "";

    const room = new Room(req.body);
    await room.save();
    res.status(200).json(room);
  } catch (err) {
    console.error("Failed to create Room:", err);
    res.status(400).json({ error: "Failed to create Room" });
  }
};

//------------------------------------------------------------------------

const edit = async (req, res) => {
  try {
    let result = await Room.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to Update Room:", err);
    res.status(400).json({ error: "Failed to Update Room" });
  }
};

//------------------------------------------------------------------------

const editRoomStatus = async (req, res) => {
  try {
    let result = await Room.updateOne(
      { roomNo: req.params.roomNo },
      { $set: req.body }
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to Update Room:", err);
    res.status(400).json({ error: "Failed to Update Room" });
  }
};

const view = async (req, res) => {
  let Room = await Room.findOne({ _id: req.params.id });
  if (!Room) return res.status(404).json({ message: "no Data Found." });

  // let query = req.query;
  // console.log(req.query, "query+++++");
  // if (query.sender) {
  //   query.sender = new mongoose.Types.ObjectId(query.sender);
  // }
  // query.createByRoom = req.params.id;
  console.log(Room._id, "Room id +++");
  // view email for Room
  let Email = await EmailHistory.aggregate([
    { $match: { createByRoom: Room._id } },
    {
      $lookup: {
        from: "Rooms",
        localField: "createByRoom",
        foreignField: "_id",
        as: "createByrefRoom",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$createByRef", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$createByrefRoom", preserveNullAndEmptyArrays: true } },
    { $match: { "users.deleted": false } },
    {
      $addFields: {
        senderName: { $concat: ["$users.firstName", " ", "$users.lastName"] },
        deleted: {
          $cond: [
            { $eq: ["$createByRef.deleted", false] },
            "$createByRef.deleted",
            { $ifNull: ["$createByrefRoom.deleted", false] },
          ],
        },
        createByName: {
          $cond: {
            if: "$createByRef",
            then: {
              $concat: [
                "$createByRef.title",
                " ",
                "$createByRef.firstName",
                " ",
                "$createByRef.lastName",
              ],
            },
            else: { $concat: ["$createByrefRoom.RoomName"] },
          },
        },
      },
    },
    {
      $project: {
        createByRef: 0,
        createByrefRoom: 0,
        users: 0,
      },
    },
  ]);

  let phoneCall = await PhoneCall.aggregate([
    { $match: { createByRoom: Room._id } },
    {
      $lookup: {
        from: "Rooms", // Assuming this is the collection name for 'Rooms'
        localField: "createByRoom",
        foreignField: "_id",
        as: "createByrefRoom",
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$createByrefRoom", preserveNullAndEmptyArrays: true } },
    { $match: { "users.deleted": false } },
    {
      $addFields: {
        senderName: { $concat: ["$users.firstName", " ", "$users.lastName"] },
        deleted: "$createByrefRoom.deleted",
        createByName: "$createByrefRoom.RoomName",
      },
    },
    { $project: { createByrefRoom: 0, users: 0 } },
  ]);

  let task = await Task.aggregate([
    { $match: { assignmentToRoom: Room._id } },
    {
      $lookup: {
        from: "Room",
        localField: "assignmentToRoom",
        foreignField: "_id",
        as: "Room",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createBy",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: { path: "$Room", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        assignmentToName: Room.RoomName,
        createByName: "$users.username",
      },
    },
    { $project: { Room: 0, users: 0 } },
  ]);

  let meeting = await MeetingHistory.aggregate([
    {
      $match: {
        $expr: {
          $and: [{ $in: [Room._id, "$attendesRoom"] }],
        },
      },
    },
    {
      $lookup: {
        from: "Room",
        localField: "assignmentToRoom",
        foreignField: "_id",
        as: "Room",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        attendesArray: "$Room.RoomEmail",
        createdByName: "$users.username",
      },
    },
    {
      $project: {
        users: 0,
      },
    },
  ]);

  const Document = await DocumentSchema.aggregate([
    { $unwind: "$file" },
    { $match: { "file.deleted": false, "file.linkRoom": Room._id } },
    {
      $lookup: {
        from: "users", // Replace 'users' with the actual name of your users collection
        localField: "createBy",
        foreignField: "_id", // Assuming the 'createBy' field in DocumentSchema corresponds to '_id' in the 'users' collection
        as: "creatorInfo",
      },
    },
    { $unwind: { path: "$creatorInfo", preserveNullAndEmptyArrays: true } },
    { $match: { "creatorInfo.deleted": false } },
    {
      $group: {
        _id: "$_id", // Group by the document _id (folder's _id)
        folderName: { $first: "$folderName" }, // Get the folderName (assuming it's the same for all files in the folder)
        createByName: {
          $first: {
            $concat: ["$creatorInfo.firstName", " ", "$creatorInfo.lastName"],
          },
        },
        files: { $push: "$file" }, // Push the matching files back into an array
      },
    },
    { $project: { creatorInfo: 0 } },
  ]);

  res.status(200).json({ Room, Email, phoneCall, task, meeting, Document });
};

const deleteData = async (req, res) => {
  try {
    const room = await Room.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "done", room });
  } catch (err) {
    res.status(404).json({ message: "error", err });
    console.log(err);
  }
};

const deleteMany = async (req, res) => {
  try {
    const Room = await Room.updateMany(
      { _id: { $in: req.body } },
      { $set: { deleted: true } }
    );
    res.status(200).json({ message: "done", Room });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const exportRoom = async (req, res) => {};

module.exports = {
  index,
  add,
  getUserRooms,
  getAllRooms,
  view,
  edit,
  deleteData,
  deleteMany,
  exportRoom,
  editRoomStatus,
  reservedRoomCustomerData,
  getAllRoomsForAdmin,
};
