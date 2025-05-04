const mongoose = require("mongoose");

const spaPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    serviceCategory: {
      type: String,
      require: true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SpaService",
        required: true,
      },
    ],
    servicesTotal: {
      type: Number,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["none", "flat", "percentage"],
      default: "none",
    },
    discountValue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const SpaPackage = mongoose.model("SpaPackage", spaPackageSchema);
module.exports = SpaPackage;
