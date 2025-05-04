const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomNo: String,
  roomType: String,
  amount: Number,
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel", // Ensure this matches the model name exactly
  },
  bookingStatus: String,
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  ac: {
    type: String,
    enum: ["AC", "Non-AC"],
    default: null,
  },
  smoking: {
    type: String,
    enum: ["Smoking", "Non-Smoking"],
    default: null,
  },
  // description: {
  //   type: String,
  //   default: ''
  // },
});

const Room = mongoose.model("Rooms", RoomSchema);

module.exports = Room;
