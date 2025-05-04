const reservation = require("../../model/schema/reservation");
const mongoose = require("mongoose");
const Room = require("../../model/schema/room");
const laundarySchema = require("../../model/schema/laundary");

const { ObjectId } = require("mongoose").Types;
const moment = require("moment");
const spaGuestBooking = require("../../model/schema/spaGuestBooking");

//view all empployee api-------------------------
const getAllReservations = async (req, res) => {
  const hotelId = req.params.hotelId;
  try {
    let reservationData = await reservation.aggregate([
      {
        $match: {
          hotelId: new mongoose.Types.ObjectId(hotelId),
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: {
          path: "$customerDetails",
        },
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              "$customerDetails.firstName",
              " ",
              "$customerDetails.lastName",
            ],
          },
          idFile: {
            $concat: [process.env.BASE_URL, "$customerDetails.idFile"],
          },
          totalPayment: {
            $sum: ["$totalAmount", "$advanceAmount"],
          },
          totalDays: {
            $divide: [
              {
                $subtract: ["$checkOutDate", "$checkInDate"],
              },
              1000 * 60 * 60 * 24,
            ],
          },
          phoneNumber: "$customerDetails.phoneNumber",
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
      {
        // Sort by createdDate in descending order
        $sort: { createdDate: -1 },
      },
    ]);

    if (!reservationData || reservationData.length === 0)
      return res.status(404).json({ message: "No Data Found." });
    res.status(200).json({ reservationData });
  } catch (error) {
    console.error("Failed to fetch reservation data:", error);
    res.status(400).json({ error: "Failed to fetch reservation data" });
  }
};

const getTotalRevenue = async (req, res) => {
  try {

    const spaData= await spaGuestBooking.aggregate([
      {$match:{
        status:"Completed",
      }}
    ])
    console.log(spaData,'this is spa data for total revenue'); 
 const   reservationData = await reservation.aggregate([
      {
        $match: {
          status: { $in: ["active", "checked-out"] },
        },
      },
      {
        $addFields: {
          firstCustomerId: { $arrayElemAt: ["$customers", 0] },
          firstHotelId: "$hotelId", // Extracting hotelId
        },
      },
      {
        $lookup:{
          from: "laundaries",
          localField: "laundry",
          foreignField: "_id",
          as: "laundryDetails",
        }
      },
      {
        $lookup:{
          from:"spaguests",
          localField:"spa",
          foreignField:"_id",
          as:"spaDetails"
        }
      },
      {
        $lookup: {
          from: "customers",
          localField: "firstCustomerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "firstHotelId",
          foreignField: "_id",
          as: "hotelIdDetails",
        },
      },
      {
        $unwind: "$customerDetails",
      },
      {
        $unwind: {
          path: "$hotelIdDetails",
          preserveNullAndEmptyArrays: true, // Prevent errors if no match is found
        },
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              "$customerDetails.firstName",
              " ",
              "$customerDetails.lastName",
            ],
          },
          idFile: {
            $concat: [process.env.BASE_URL, "$customerDetails.idFile"],
          },
          totalPayment: {
            $sum: ["$totalAmount", "$advanceAmount"],
          },
          totalDays: {
            $divide: [
              { $subtract: ["$checkOutDate", "$checkInDate"] },
              1000 * 60 * 60 * 24,
            ],
          },
          phoneNumber: "$customerDetails.phoneNumber",
          hotelName: "$hotelIdDetails.name", // Assuming hotel has a "name" field
        },
      },
      {
        $project: {
          __v: 0,
          firstCustomerId: 0,
          firstHotelId: 0,
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);
  
    console.log(reservationData, "this is for reservation data for total revenue in admin dashboard");
  
    if (!reservationData || reservationData.length === 0)
      return res.status(404).json({ message: "No Data Found." });
  


    res.status(200).json({ reservationData,spaData });
  
  } catch (error) {
    console.error("Failed to fetch reservation data:", error);
    res.status(400).json({ error: "Failed to fetch reservation data" });
  }
  
  };
  



// view all reservations to show for admin
const getAllReservationForAdmin = async (req, res) => {
  const status = req.params.status;

  try {
    let reservationData;
    if (status === "all") {
      reservationData = await reservation.aggregate([
        {
          $match: {
            status: { $in: ["active", "pending"] },
          },
        },
        {
          $addFields: {
            firstCustomerId: { $arrayElemAt: ["$customers", 0] },
            firstHotelId: "$hotelId", // Extracting hotelId
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "firstCustomerId",
            foreignField: "_id",
            as: "customerDetails",
          },
        },
        {
          $lookup: {
            from: "hotels",
            localField: "firstHotelId",
            foreignField: "_id",
            as: "hotelIdDetails",
          },
        },
        {
          $unwind: "$customerDetails",
        },
        {
          $unwind: {
            path: "$hotelIdDetails",
            preserveNullAndEmptyArrays: true, // Prevent errors if no match is found
          },
        },
        {
          $addFields: {
            fullName: {
              $concat: [
                "$customerDetails.firstName",
                " ",
                "$customerDetails.lastName",
              ],
            },
            idFile: {
              $concat: [process.env.BASE_URL, "$customerDetails.idFile"],
            },
            totalPayment: {
              $sum: ["$totalAmount", "$advanceAmount"],
            },
            totalDays: {
              $divide: [
                { $subtract: ["$checkOutDate", "$checkInDate"] },
                1000 * 60 * 60 * 24,
              ],
            },
            phoneNumber: "$customerDetails.phoneNumber",
            hotelName: "$hotelIdDetails.name", // Assuming hotel has a "name" field
          },
        },
        {
          $project: {
            __v: 0,
            firstCustomerId: 0,
            firstHotelId: 0,
          },
        },
        {
          $sort: { _id: -1 },
        },
      ]);
    } else {
      reservationData = await reservation.aggregate([
        {
          $match: {
            status: status,
          },
        },
        {
          $addFields: {
            firstCustomerId: { $arrayElemAt: ["$customers", 0] },
            firstHotelId: "$hotelId", // Extracting hotelId
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "firstCustomerId",
            foreignField: "_id",
            as: "customerDetails",
          },
        },
        {
          $lookup: {
            from: "hotels",
            localField: "firstHotelId",
            foreignField: "_id",
            as: "hotelIdDetails",
          },
        },
        {
          $unwind: "$customerDetails",
        },
        {
          $unwind: {
            path: "$hotelIdDetails",
            preserveNullAndEmptyArrays: true, // Prevent errors if no match is found
          },
        },
        {
          $addFields: {
            fullName: {
              $concat: [
                "$customerDetails.firstName",
                " ",
                "$customerDetails.lastName",
              ],
            },
            idFile: {
              $concat: [process.env.BASE_URL, "$customerDetails.idFile"],
            },
            totalPayment: {
              $sum: ["$totalAmount", "$advanceAmount"],
            },
            totalDays: {
              $divide: [
                { $subtract: ["$checkOutDate", "$checkInDate"] },
                1000 * 60 * 60 * 24,
              ],
            },
            phoneNumber: "$customerDetails.phoneNumber",
            hotelName: "$hotelIdDetails.name", // Assuming hotel has a "name" field
          },
        },
        {
          $project: {
            __v: 0,
            firstCustomerId: 0,
            firstHotelId: 0,
          },
        },
        {
          $sort: { _id: -1 },
        },
      ]);
    }

    if (!reservationData || reservationData.length === 0)
      return res.status(404).json({ message: "No data found." });
    res.status(200).json({ reservationData });
  } catch (error) {
    console.error("Failed to fetch reservation data:", error);
    res.status(400).json({ error: "Failed to fetch reservation data" });
  }
};

// getMonthlyReservationOverview
const getMonthlyReservationOverview = async (req, res) => {
  try {
    const result = await reservation.aggregate([
      {
        $match: {
          status: { $in: ["active", "pending", "completed"] }, // Only include relevant reservations
        },
      },
      {
        $project: {
          // month: { $month: "$createdAt" },
          month: { $month: "$createdDate" },
          status: 1,
        },
      },
      {
        $group: {
          _id: "$month",
          reservations: { $sum: 1 },
          occupancy: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Month names array
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

    // Create a full array with default 0 values
    const fullData = monthNames.map((name, index) => {
      const monthData = result.find((r) => r._id === index + 1);
      return {
        month: name,
        reservations: monthData ? monthData.reservations : 0,
        occupancy: monthData ? monthData.occupancy : 0,
      };
    });

    res.status(200).json({ graphData: fullData });
  } catch (error) {
    console.error("Error generating monthly reservation overview:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//view all active reservations api-------------------------
const getAllActiveReservations = async (req, res) => {
  const hotelId = req.params.hotelId;
  try {
    let reservationData = await reservation.aggregate([
      {
        $match: {
          hotelId: new mongoose.Types.ObjectId(hotelId),
          status: "active",
        },
      },
      {
        $addFields: {
          firstCustomerId: { $arrayElemAt: ["$customers", 0] },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "firstCustomerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: {
          path: "$customerDetails",
        },
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              "$customerDetails.firstName",
              " ",
              "$customerDetails.lastName",
            ],
          },
          idFile: {
            $concat: [process.env.BASE_URL, "$customerDetails.idFile"],
          },
          totalPayment: {
            $sum: ["$totalAmount", "$advanceAmount"],
          },
          totalDays: {
            $divide: [
              {
                $subtract: ["$checkOutDate", "$checkInDate"],
              },
              1000 * 60 * 60 * 24,
            ],
          },
          phoneNumber: "$customerDetails.phoneNumber",
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
      {
        $sort: { _id: -1 }, // Sort by _id in descending order (latest first)
      },
    ]);

    if (!reservationData || reservationData.length === 0)
      return res.status(404).json({ message: "No data found." });
    res.status(200).json({ reservationData });
  } catch (error) {
    console.error("Failed to fetch reservation data:", error);
    res.status(400).json({ error: "Failed to fetch reservation data" });
  }
};

//view all active reservations api-------------------------
const getAllActiveReservationCustomers = async (req, res) => {
  const hotelId = req.params.hotelId;
  try {
    let reservationData = await reservation.aggregate([
      [
        {
          $match: {
            hotelId: new mongoose.Types.ObjectId(hotelId),
            status: "active",
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "customers",
            foreignField: "_id",
            as: "customerDetails",
          },
        },
        {
          $addFields: {
            customerDetails: {
              $map: {
                input: "$customerDetails",
                as: "customer",
                in: {
                  $mergeObjects: [
                    "$$customer",
                    {
                      idFile: {
                        $concat: [process.env.BASE_URL, "$$customer.idFile"],
                      },
                      fullName: {
                        $concat: [
                          "$$customer.firstName",
                          " ",
                          "$$customer.lastName",
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            customerDetails: 1,
          },
        },
      ],
    ]);

    const allCustomerDetails = reservationData.flatMap(
      (data) => data.customerDetails
    );

    console.log("==>", allCustomerDetails);
    res.json(allCustomerDetails);
  } catch (error) {
    console.error("Failed to fetch reservation data:", error);
    res.status(400).json({ error: "Failed to fetch reservation data" });
  }
};

//view all pending active reservations api------------------
const getAllPendingAndActiveReservation = async (req, res) => {
  const hotelId = req.params.hotelId;
  try {
    let reservationData = await reservation.aggregate([
      {
        $match: {
          hotelId: new mongoose.Types.ObjectId(hotelId),
          status: { $in: ["active", "pending"] },
        },
      },
      {
        $addFields: {
          firstCustomerId: { $arrayElemAt: ["$customers", 0] },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "firstCustomerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: "$customerDetails",
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              "$customerDetails.firstName",
              " ",
              "$customerDetails.lastName",
            ],
          },
          idFile: {
            $concat: [process.env.BASE_URL, "$customerDetails.idFile"],
          },
          totalPayment: {
            $sum: ["$totalAmount", "$advanceAmount"],
          },
          totalDays: {
            $divide: [
              { $subtract: ["$checkOutDate", "$checkInDate"] },
              1000 * 60 * 60 * 24,
            ],
          },
          phoneNumber: "$customerDetails.phoneNumber",
        },
      },
      {
        $project: {
          __v: 0,
          firstCustomerId: 0, // Exclude the intermediate field
        },
      },
      {
        $sort: { _id: -1 }, // Sort by _id in descending order (latest first)
      },
    ]);
    console.log("reservationData data =>", reservationData);

    if (!reservationData || reservationData.length === 0)
      return res.status(404).json({ message: "No data found." });
    res.status(200).json({ reservationData });
  } catch (error) {
    console.error("Failed to fetch reservation data:", error);
    res.status(400).json({ error: "Failed to fetch reservation data" });
  }
};

//view all active and completed reservations api-------------
const getAllActiveAndCompletedReservation = async (req, res) => {
  const hotelId = req.params.hotelId;
  try {
    let reservationData = await reservation.aggregate([
      [
        {
          $match: {
            hotelId: new mongoose.Types.ObjectId(hotelId),
          },
        },
        {
          $addFields: {
            firstCustomerId: { $arrayElemAt: ["$customers", 0] },
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "firstCustomerId",
            foreignField: "_id",
            as: "customerDetails",
          },
        },
        {
          $unwind: {
            path: "$customerDetails",
          },
        },
        {
          $addFields: {
            fullName: {
              $concat: [
                "$customerDetails.firstName",
                " ",
                "$customerDetails.lastName",
              ],
            },
            idFile: {
              $concat: [process.env.BASE_URL, "$customerDetails.idFile"],
            },
            totalPayment: {
              $sum: ["$totalAmount", "$advanceAmount"],
            },
            totalDays: {
              $divide: [
                {
                  $subtract: ["$checkOutDate", "$checkInDate"],
                },
                1000 * 60 * 60 * 24,
              ],
            },
            phoneNumber: "$customerDetails.phoneNumber",
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ],
    ]);

    if (!reservationData)
      return res.status(404).json({ message: "no Data Found." });
    res.status(200).json({ reservationData });
  } catch (error) {
    console.error("Failed to fetch reservation data:", error);
    res.status(400).json({ error: "Failed to fetch reservation data" });
  }
};

//view all pending reservations api-------------------------
const getAllPendingReservations = async (req, res) => {
  const hotelId = req.params.hotelId;
  try {
    let reservationData = await reservation.aggregate([
      {
        $match: {
          hotelId: new mongoose.Types.ObjectId(hotelId),
          status: "pending",
        },
      },
      {
        $addFields: {
          firstCustomerId: { $arrayElemAt: ["$customers", 0] },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "firstCustomerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: {
          path: "$customerDetails",
        },
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              "$customerDetails.firstName",
              " ",
              "$customerDetails.lastName",
            ],
          },
          idFile: {
            $concat: [process.env.BASE_URL, "$customerDetails.idFile"],
          },
          totalPayment: {
            $sum: ["$totalAmount", "$advanceAmount"],
          },
          totalDays: {
            $divide: [
              {
                $subtract: ["$checkOutDate", "$checkInDate"],
              },
              1000 * 60 * 60 * 24,
            ],
          },
          phoneNumber: "$customerDetails.phoneNumber",
        },
      },
      {
        $sort: { _id: -1 }, // Sort by _id in descending order (latest first)
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);

    if (!reservationData || reservationData.length === 0) {
      return res.status(404).json({ message: "No data found." });
    }

    res.status(200).json({ reservationData });
  } catch (error) {
    console.error("Failed to fetch reservation data:", error);
    res.status(400).json({ error: "Failed to fetch reservation data" });
  }
};

//view all completed reservations api-------------------------
const getAllCompleteReservation = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;

    let reservationData = await reservation.aggregate([
      {
        $match: {
          hotelId: new mongoose.Types.ObjectId(hotelId),
          status: "checked-out",
        },
      },
      {
        $lookup: {
          from: "invoices",
          localField: "hotelId",
          foreignField: "hotelId",
          as: "invoiceInformation",
        },
      },
      {
        $addFields: {
          firstCustomerId: { $arrayElemAt: ["$customers", 0] },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "firstCustomerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $lookup: {
          from: "laundaries",
          localField: "laundry",
          foreignField: "_id",
          as: "laundarieDetails",
        },
      },
      {
        $lookup: {
          from: "spaguests",
          localField: "spa",
          foreignField: "_id",
          as: "spaGuest",
        },
      },
      {
        $unwind: {
          path: "$customerDetails",
        },
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              "$customerDetails.firstName",
              " ",
              "$customerDetails.lastName",
            ],
          },
          idFile: {
            $concat: [process.env.BASE_URL, "$customerDetails.idFile"],
          },
          totalPayment: {
            $sum: ["$totalAmount", "$advanceAmount"],
          },
          totalDays: {
            $divide: [
              {
                $subtract: ["$checkOutDate", "$checkInDate"],
              },
              1000 * 60 * 60 * 24,
            ],
          },
          phoneNumber: "$customerDetails.phoneNumber",
        },
      },
      {
        $sort: { _id: -1 }, // Sort by _id in descending order (latest first)
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);

    if (!reservationData || reservationData.length === 0) {
      return res.status(404).json({ message: "No data found." });
    }

    const spaGuestData = await spaGuestBooking.find({
      hotelId,
      status: "Completed",
      userType: "Guest",
    });

    res.status(200).json({ reservationData, spaGuestData });
  } catch (error) {
    console.error("Failed to fetch reservation data:", error);
    res.status(400).json({ error: "Failed to fetch reservation data" });
  }
};

//view specific reservation api-------------------------
const getSpecificReservation = async (req, res) => {
  try {
    let reservationData = await reservation.aggregate([
      [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $addFields: {
            firstCustomerId: { $arrayElemAt: ["$customers", 0] },
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "firstCustomerId",
            foreignField: "_id",
            as: "customerDetails",
          },
        },
        {
          $lookup: {
            from: "laundaries", // Referencing laundaries collection
            localField: "laundry", // Array of ObjectIds
            foreignField: "_id", // Corresponding field in laundaries collection
            as: "laundryDetails", // Alias for the populated field
          },
        },
        {
          $lookup: {
            from: "spaguests", // Referencing laundaries collection
            localField: "spa", // Array of ObjectIds
            foreignField: "_id", // Corresponding field in laundaries collection
            as: "spaDetails", // Alias for the populated field
          },
        },
        {
          $unwind: {
            path: "$customerDetails",
          },
        },
        {
          $addFields: {
            fullName: {
              $concat: [
                "$customerDetails.firstName",
                " ",
                "$customerDetails.lastName",
              ],
            },
            idFile: {
              $concat: [process.env.BASE_URL, "$customerDetails.idFile"],
            },
            totalPayment: {
              $sum: ["$totalAmount", "$advanceAmount"],
            },
            totalDays: {
              $divide: [
                {
                  $subtract: ["$checkOutDate", "$checkInDate"],
                },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ],
    ]);

    if (!reservationData)
      return res.status(404).json({ message: "no Data Found." });
    res.status(200).json({ reservationData });
  } catch (error) {
    console.error("Failed to fetch reservation data:", error);
    res.status(400).json({ error: "Failed to fetch reservation data" });
  }
};

//delete specific item api----------------
const deleteReservation = async (req, res) => {
  const hotelId = new mongoose.Types.ObjectId(req.body.hotelId);

  const reservationId = new mongoose.Types.ObjectId(req.params.id);
  try {
    const isReservationDeleted = await reservation.updateOne(
      {
        _id: reservationId,
      },
      {
        $set: {
          status: "checked-out",
          FinalCheckOutTime: req.body.FinalCheckOutTime,
        },
      }
    );

    if (isReservationDeleted) {
      console.log(
        "room No--------------------------------------------------",
        req.body.roomNo
      );
      let updateRoom = await Room.updateOne(
        { roomNo: req.body.roomNo, hotelId },
        {
          $set: {
            bookingStatus: "false",
            checkIn: null,
            checkOut: null,
          },
        }
      );
      console.log(updateRoom);
      res.status(200).json({ message: "done", isReservationDeleted });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "error", err });
  }
};
//chekcin specific room api----------------
const checkIn = async (req, res) => {
  const hotelId = new mongoose.Types.ObjectId(req.body.hotelId);

  const reservationId = new mongoose.Types.ObjectId(req.params.id);
  try {
    const isRoomAlreadyReserved = await reservation.find({
      roomNo: req.body.roomNo,
      hotelId,
    });

    const activeReservation = isRoomAlreadyReserved.find(
      (reservation) => reservation.status === "active"
    );

    if (activeReservation) {
      return res.status(409).json({ error: "Room already reserved" });
    }

    const isCheckedIn = await reservation.updateOne(
      { _id: reservationId },
      {
        $set: {
          status: "active",
          FinalCheckInTime: req.body.FinalCheckInTime,
        },
      }
    );

    if (isCheckedIn) {
      const updateRoom = await Room.updateOne(
        { roomNo: req.body.roomNo, hotelId },
        {
          $set: {
            bookingStatus: "active",
            checkIn: req.body.checkInDate,
            checkOut: req.body.checkOutDate,
          },
        }
      );

      if (updateRoom) {
        return res.status(200).json({ message: "Check-in successful" });
      } else {
        throw new Error("Failed to update room");
      }
    } else {
      throw new Error("Failed to check in");
    }
  } catch (err) {
    console.error("Error during check-in:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const editreservation = async (req, res) => {
  console.log(
    "in reservation edit ------------->editreservation ------------->"
  );
  console.log("editreservation req.params.id ==>", req.params.id);
  console.log("editreservation req.body ==>", req.body);

  try {
    let result = await reservation.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to Update reservation:", err);
    res.status(400).json({ error: "Failed to Update reservation" });
  }
};
const editFoodItems = async (req, res) => {
  try {
    const foodItems = req.body;
    console.log(foodItems.length, "food items to add");

    if (!Array.isArray(foodItems) || foodItems.length === 0) {
      return res.status(400).json({ error: "No food items to add provided" });
    }
    for (const item of foodItems) {
      const existingItem = await reservation.findOne({
        _id: req.params.id,
        "foodItems.name": item.name,
      });

      if (existingItem) {
        await reservation.updateOne(
          {
            _id: req.params.id,
            "foodItems.name": item.name,
          },
          {
            $inc: { "foodItems.$.quantity": item.quantity },
          }
        );
      } else {
        await reservation.updateOne(
          { _id: new mongoose.Types.ObjectId(req.params.id) },
          {
            $push: {
              foodItems: {
                id: new mongoose.Types.ObjectId(item.id),
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              },
            },
          }
        );
      }
    }

    res.status(200).json({ message: "Food items updated successfully" });
  } catch (err) {
    console.error("Failed to update food items:", err);
    res.status(400).json({ error: "Failed to update food items" });
  }
};

// function for editing food quantity----------------------------------------------
const updateFoodQuantity = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const id = new mongoose.Types.ObjectId(foodId);

    // Find the reservation document
    const reservationDoc = await reservation.findOne({ _id: req.params.id });

    if (!reservationDoc) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const isQuantityUpdated = await reservation.updateOne(
      {
        _id: req.params.id,
        "foodItems.id": id,
      },
      {
        $set: { "foodItems.$.quantity": quantity },
      }
    );

    res
      .status(200)
      .json({ isQuantityUpdated, message: "Quantity updated successfully" });
  } catch (err) {
    console.error("Failed to update quantity:", err);
    res.status(400).json({ error: "Failed to update quantity" });
  }
};
//  for getting all the food items for a specific organisation
const getFoodItems = async (req, res) => {
  console.log(req.params);
  try {
    let foodItemsData = await reservation.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },

      {
        $unwind: {
          path: "$foodItems",
        },
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "foodItems.id",
          foreignField: "_id",
          as: "foodData",
        },
      },
      {
        $unwind: {
          path: "$foodData",
        },
      },
      {
        $group: {
          _id: "$_id",
          foodData: { $push: "$foodData" },
          foodItems: { $push: "$foodItems" },
        },
      },
      {
        $project: {
          _id: 1,
          foodItems: {
            $map: {
              input: "$foodItems",
              as: "item",
              in: {
                id: "$$item.id",
                name: "$$item.name",
                price: "$$item.price",
                quantity: "$$item.quantity",
                itemInformation: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$foodData",
                        as: "food",
                        cond: { $eq: ["$$food._id", "$$item.id"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          foodItems: {
            $map: {
              input: "$foodItems",
              as: "item",
              in: {
                id: "$$item.id",
                name: "$$item.name",
                price: "$$item.price",
                quantity: "$$item.quantity",
                totalAmountFood: {
                  $multiply: ["$$item.price", "$$item.quantity"],
                },
                itemImage: {
                  $concat: [
                    process.env.BASE_URL,
                    "$$item.itemInformation.itemImage",
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    if (foodItemsData.length === 0)
      return res.status(404).json({ message: "no Data Found." });
    res.status(200).json({ foodItemsData });
  } catch (error) {
    console.error("Failed to fetch item data:", error);
    res.status(400).json({ error: "Failed to fetch item data" });
  }
};

//function to delete food items
//delete specific item api----------------
const deleteFoodItems = async (req, res) => {
  const reservationId = req.params.id;
  const itemIdToDelete = new mongoose.Types.ObjectId(req.body.data);

  try {
    console.log(
      "---------------------------------------------------------------------"
    );
    console.log("Reservation ID:", reservationId);
    console.log("Item ID to delete:", itemIdToDelete);
    console.log(
      "---------------------------------------------------------------------"
    );
    const result = await reservation.updateOne(
      { _id: reservationId },
      { $pull: { foodItems: { id: itemIdToDelete } } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Item deleted successfully" });
    } else {
      res.status(404).json({ message: "Item not found or already deleted" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete item data" });
  }
};

const dailyReport = async (req, res) => {
  console.log("In dailyReport data ==>", req.params);
  try {
    let matchedData = [];

    console.log("In try block---------------------");
    const hotelId = new ObjectId(req.params.id);
    console.log("hotelId ==>", hotelId);

    const data = await reservation.find({
      hotelId: hotelId,
    });
    console.log(" Data here ==>", data);

    if (data && data.length > 0) {
      const selectedDate = new Date(req.params.date);
      console.log("selectedDate ==>", selectedDate);

      const formattedSelectedDate = moment(selectedDate).format("YYYY-MM-DD");
      console.log("formattedSelectedDate ==>", formattedSelectedDate);

      for (let item of data) {
        const itemDate = moment(item.checkInDate);
        const formattedItemDate = itemDate.format("YYYY-MM-DD");
        console.log("formattedItemDate ==>", formattedItemDate);

        if (formattedItemDate === formattedSelectedDate) {
          matchedData.push(item);
          console.log("checkInDate is the same as selectedDate");
        } else {
          console.log("checkInDate is not the same as selectedDate");
        }
      }
      console.log("matchedData======>", matchedData);
    }

    res
      .status(200)
      .json({ message: "Successfully found data", matchedData: matchedData });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch reservation data" });
  }
};

const getSpecificLaundaryItems = async (req, res) => {
  const { id } = req.params;
  try {
    const laundaryItems = await laundarySchema.find({ reservationId: id });
    if (laundaryItems.length > 0) {
      console.log(laundaryItems, "thsi is for laundaryItems");

      return res.status(200).json({ laundaryItems });
    } else {
      return res
        .status(404)
        .json({ message: "No laundry records found for this reservation" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getMonthlyReservationStats = async (req, res) => {
  try {
    const now = new Date();

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);


    const previousMonthCheckoutCount = await reservation.countDocuments({
      checkOutDate: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
      status: "checked-out",
    });

    const currentMonthActiveCount = await reservation.countDocuments({
      checkInDate: { $gte: startOfCurrentMonth },
      status: "active",
    });

    res.status(200).json({
      previousMonthCheckoutCount,
      currentMonthActiveCount,
    });
  } catch (error) {
    console.error("Error getting reservation stats:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  deleteReservation,
  editreservation,
  getSpecificReservation,
  getAllReservations,
  editFoodItems,
  getFoodItems,
  deleteFoodItems,
  getMonthlyReservationOverview,
  updateFoodQuantity,
  checkIn,
  getAllActiveReservations,
  getAllPendingReservations,
  getAllCompleteReservation,
  getAllReservationForAdmin,
  getAllPendingAndActiveReservation,
  getAllActiveAndCompletedReservation,
  getAllActiveReservationCustomers,
  getMonthlyReservationStats,
  dailyReport,
  getSpecificLaundaryItems,
  getTotalRevenue

};
