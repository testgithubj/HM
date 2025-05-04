import mongoose from "mongoose";

const spaBookingSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ["Guest", "Room"],
    required: true,
  },
  spaItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SpaPackage",
    required: true,
  },

  // Customer Info
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
  },
  address: {
    type: String,
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
  },

  // Room Booking Info
  roomNumber: Number,
  numberOfPersons: {
    type: Number,
    default: 1,
  },

  // Common
  totalPrice: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: new Date(),
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
  invoiceUrl: String,
});

const SpaBooking = mongoose.model("SpaBooking", spaBookingSchema);

export default SpaBooking;
