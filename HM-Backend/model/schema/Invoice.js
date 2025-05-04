const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  // Customer information
  name: { type: String, required: [true, "Customer name is required"] },
  address: { type: String, required: [true, "Address is required"] },

  // Invoice type
  type: {
    type: String,
    enum: ["room", "food", "laundary", "spa"],
    required: true,
  },

  // Conditional fields for room types
  roomRent: {
    type: Number,
    required: function () {
      return this.type === "room";
    },
    min: [0, "Room rent cannot be negative"],
  },
  pendingAmount: {
    type: Number,
    required: function () {
      return this.type === "room";
    },
    min: [0, "Pending amount cannot be negative"],
  },
  advanceAmount: {
    type: Number,
    required: function () {
      return this.type === "room";
    },
    min: [0, "Advance amount cannot be negative"],
  },

  // Conditional field for food
  foodAmount: {
    type: Number,
    required: function () {
      return this.type === "food";
    },
    min: [0, "Food amount cannot be negative"],
  },
  
  // Conditional field for laundry
  laundaryAmount: {
    type: Number,
    required: function () {
      return this.type === "laundary";
    },
    min: [0, "Laundary amount cannot be negative"],
  },
  
  // Conditional fields for spa
  spaAmount: {
    type: Number,
    required: function () {
      return this.type === "spa";
    },
    min: [0, "Spa amount cannot be negative"],
  },
 
  serviceId: {
    type: [mongoose.Types.ObjectId],
    required: function () {
      return this.type === "spa";
    }
  }
  ,


  // Common fields
  discount: {
    type: Number,
    min: [0, "Discount cannot be negative"],
    default: 0,
  },

  // GST-related fields
  gstPercentage: {
    type: Number,
    min: [0, "GST percentage cannot be negative"],
    default: 0,
  },
  gstAmount: {
    type: Number,
    min: [0, "GST amount cannot be negative"],
    default: 0,
  },
  gstNumber: {
    type: String,
    validate: {
      validator: function (value) {
        if (this.haveGST) {
          const regex =
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9A-Za-z]{1}$/;
          return regex.test(value);
        }
        return true; // GST number is optional if 'haveGST' is false
      },
      message: "Invalid GST number format",
    },
  },

  // Payment details
  haveGST: { type: Boolean, default: false },
  paymentMethod: {
    type: String,
    required: [true, "Payment Method is required"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
    min: [0, "Total amount cannot be negative"],
  },

  // Other information
  reservationId: { type: mongoose.Types.ObjectId,
    required: [true, "Reservation ID is required"]
   },
  hotelId: { type: mongoose.Types.ObjectId },
  invoiceNumber: { type: String, unique: true },
  customerPhoneNumber: { type: String },
  
  // Check-in/out times (mainly for room type, but can be useful for tracking spa appointments)
  finalCheckInTime: { type: String },
  finalCheckOutTime: { type: String },
  
  createdDate: { type: Date, default: Date.now },
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = Invoice;