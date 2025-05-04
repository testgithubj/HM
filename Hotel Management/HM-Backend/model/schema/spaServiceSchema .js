const mongoose = require("mongoose");

const spaServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const SpaService = mongoose.model("SpaService", spaServiceSchema);
module.exports = SpaService;
