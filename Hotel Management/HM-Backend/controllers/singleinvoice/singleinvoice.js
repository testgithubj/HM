const SingleInvoice = require("../../model/schema/singleinvoice");
const mongoose = require("mongoose");
const spaGuestSchema = require("../../model/schema/spaGuestBooking");

const addItems = async (req, res) => {
  try {
    console.log("body data =>", req.body);

    // Convert reservationId and hotelId to ObjectId using `new`
    if (req.body.reservationId) {
      req.body.reservationId = new mongoose.Types.ObjectId(
        req.body.reservationId
      );
    }

    if (req.body.hotelId) {
      req.body.hotelId = new mongoose.Types.ObjectId(req.body.hotelId);
    }

    // Validate required fields manually (if needed)
    const requiredFields = [
      "name",
      "address",
      "paymentMethod",
      "totalRoomAmount",
      "totalFoodAndRoomAmount",
      "invoiceNumber",
      "customerPhoneNumber",
    ];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Add createdDate to the body
    req.body.createdDate = new Date();

    // Create a new invoice using Mongoose model
    const InvoiceObject = await SingleInvoice.create(req.body);

    // Send response back based on success or failure
    if (InvoiceObject) {
      return res.status(200).json(InvoiceObject);
    } else {
      return res.status(400).json({ error: "Failed to Add Invoice" });
    }
  } catch (err) {
    console.error("Failed to add Invoice:", err);
    res
      .status(400)
      .json({ error: "Failed to Add Invoice", message: err.message });
  }
};

//view speciific Invoice api-------------------------
const getSpecificInvoice = async (req, res) => {
  const reservationId = new mongoose.Types.ObjectId(req.params.reservationId);
  try {
    const InvoiceData = await SingleInvoice.aggregate([
      { $match: { reservationId } },
      {
        $lookup: {
          from: "reservations",
          localField: "reservationId",
          foreignField: "_id",
          as: "reservation",
        },
      },
      {
        $addFields: {
          FinalCheckInTime: {
            $arrayElemAt: ["$reservation.FinalCheckInTime", 0],
          },
          FinalCheckOutTime: {
            $arrayElemAt: ["$reservation.FinalCheckOutTime", 0],
          },
        },
      },
      { $unset: "reservation" },
    ]);
    if (InvoiceData.length === 0)
      return res.status(404).json({ message: "no Data Found." });

    console.log(InvoiceData);
    res.status(200).json({ InvoiceData });
  } catch (error) {
    console.error("Failed to fetch Invoice data:", error);
    res.status(400).json({ error: "Failed to fetch Invoice data" });
  }
};

//delete specific item api----------------
const deleteItem = async (req, res) => {
  try {
    const item = await SingleInvoice.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "done", item });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const editItem = async (req, res) => {
  try {
    let result = await Invoice.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to Update Invoice:", err);
    res.status(400).json({ error: "Failed to Update Invoice" });
  }
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Controller function for monthly revenue API
const getMonthlyRevenue = async (req, res) => {
  try {
    // Get revenue from SingleInvoice
    const invoiceRevenue = await SingleInvoice.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$grandTotalAmount" },
        },
      },
    ]);

    // Get revenue from SpaGuest
    const spaRevenue = await spaGuestSchema.aggregate([
      {
        $match: {
          userType: "Guest",
          status: "Completed",
        },
      },
      {
        $group: {
          _id: { $month: "$bookingDateTime" },
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Merge the revenues
    const combinedRevenueMap = new Map();

    invoiceRevenue.forEach((item) => {
      combinedRevenueMap.set(
        item._id,
        (combinedRevenueMap.get(item._id) || 0) + item.revenue
      );
    });

    spaRevenue.forEach((item) => {
      combinedRevenueMap.set(
        item._id,
        (combinedRevenueMap.get(item._id) || 0) + item.revenue
      );
    });

    // Format response
    const result = monthNames.map((month, index) => {
      const monthIndex = index + 1;
      return {
        month,
        revenue: combinedRevenueMap.get(monthIndex) || 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error calculating total monthly revenue:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate monthly revenue",
      error: error.message,
    });
  }
};

module.exports = {
  addItems,
  deleteItem,
  editItem,
  getSpecificInvoice,
  getMonthlyRevenue,
};
