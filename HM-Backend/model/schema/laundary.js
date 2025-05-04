const mongoose = require("mongoose");

const laundarySchema = new mongoose.Schema({
  roomNo: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation', // Reference to the Reservation model
    required: true, // Ensures this field is always set
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "complete", "refund"],
    default: "pending",
  },
});

module.exports = mongoose.model("Laundary", laundarySchema);
