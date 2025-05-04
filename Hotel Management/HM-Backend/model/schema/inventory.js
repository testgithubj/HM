const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,  // Change this from String to Number
    required: true,
  },
  unitOfMeasure: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  distributed: {
    type: Number,  // Change this from String to Number
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Inventory", InventorySchema);
