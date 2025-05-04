// const mongoose = require("mongoose");

// const reservation = new mongoose.Schema({
//   roomNo: Number,
//   totalAmount: Number,
//   advanceAmount: Number,
//   checkInDate: Date,
//   checkOutDate: Date,
//   FinalCheckInTime: String,
//   FinalCheckOutTime: String,
//   hotelId: mongoose.Schema.Types.ObjectId,
//   foodItems: [],
//   customers: [],
//   laundry: {
//     type: Array,
//     default: [],
//   },
//   createdDate: {
//     type: Date,
//   },
//   status: {
//     type: String,
//     default: "pending",
//   },
// });

// module.exports = mongoose.model("reservation", reservation);

const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  roomNo: Number,
  totalAmount: Number,
  advanceAmount: Number,
  checkInDate: Date,
  checkOutDate: Date,
  FinalCheckInTime: String,
  FinalCheckOutTime: String,
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
  foodItems: [],
  customers: [],
  laundry: [],
  spa:[],
  createdDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending",
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
