const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  idCardType: {
    type: String,
    required: true,
  },
  idcardNumber: {
    type: String,
    required: true,
  },
  idFile: {
    type: String,
    required: true,
  },
  idFile2: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
  },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  reservations: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Customer", customerSchema);
