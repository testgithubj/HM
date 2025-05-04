const multer = require("multer");
const fs = require("fs");
const path = require("path");
const customer = require("../../model/schema/customer");
const mongoose = require("mongoose");
const reservation = require("../../model/schema/reservation");
const Room = require("../../model/schema/room");

const { ObjectId } = require("mongoose").Types;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/customer/Idproof";
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uploadDir = "uploads/customer/Idproof";
    const fileName = file.originalname;
    const filePath = path.join(uploadDir, fileName);

    if (fs.existsSync(filePath)) {
      const timestamp = Date.now() + Math.floor(Math.random() * 90);
      const uniqueFileName = `${fileName.split(".")[0]}-${timestamp}.${
        fileName.split(".")[1]
      }`;
      cb(null, uniqueFileName);
    } else {
      cb(null, fileName);
    }
  },
});
const upload = multer({ storage });

const addItems = async (req, res) => {
  try {
    req.body.createdDate = new Date();
    const filePath = `uploads/customer/Idproof/${req.files.idFile[0].filename}`;
    req.body.idFile = filePath;

    if (req.files && req.files.idFile2) {
      const filePath2 = `uploads/customer/Idproof/${req.files.idFile2[0].filename}`;
      req.body.idFile2 = filePath2;
    }

    const isCustomerAlreadyExists = await customer.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (isCustomerAlreadyExists) {
      return res
        .status(400)
        .json({ error: "Please enter a unique phone number" });
    }
    const customerObj = await customer.create(req.body);
    res.status(200).json(customerObj);
  } catch (err) {
    console.error("Failed to add customer:", err);
    res.status(400).json({ error: "Failed to Add customer" });
  }
};

// do reservation api-------------------
const doReservation = async (req, res) => {
  // console.log("in in doreservation controller");
  // console.log("id in req.body.hotelId =>", req.body.hotelId);
  // console.log("req.body =>", req.body);

  const hotelId = new mongoose.Types.ObjectId(req.body.hotelId);
  try {
    const isReservationAlreadyExistsOrPending = await reservation.findOne({
      roomNo: req.body.roomNo,
      $and: [
        {
          checkInDate: { $lte: req.body.checkOutDate },
        },
        {
          checkOutDate: { $gte: req.body.checkInDate },
        },
        {
          status: "active",
        },
      ],
    });

    if (isReservationAlreadyExistsOrPending) {
      return res.status(400).json({
        error: "This room is already reserved on the given checkIn Date",
      });
    }
    /** booking save */
    let reservationObj = new reservation();
    reservationObj.roomNo = req.body.roomNo;
    reservationObj.roomType = req.body.roomType;
    reservationObj.checkInDate = req.body.checkInDate;
    reservationObj.checkOutDate = req.body.checkOutDate;
    reservationObj.advanceAmount = req.body.advanceAmount;
    reservationObj.totalAmount = req.body.totalAmount;
    reservationObj.hotelId = hotelId;
    reservationObj.createdDate = new Date();
    await reservationObj.save();

    // console.log("here reservationObj ===>", reservationObj);

    const customers = await Promise.all(
      JSON.parse(req.body.customers).map(async (customerItem, index) => {
        const check = await customer.findOne({
          phoneNumber: customerItem.phoneNumber,
        });
        // console.log("check==>", check);
        if (check) {
          await customer.updateOne(
            { _id: check._id },
            { $inc: { reservations: 1 } }
          );
          return check._id;
        }

        const filePath = `uploads/customer/Idproof/${req.files[index].filename}`;
        // console.log(
        //   filePath,
        //   "filePath----------------------------------------------------------------------------------"
        // );
        customerItem.idFile = filePath;

        let customerObj = new customer({
          ...customerItem,
          reservations: 1,
          createdDate: new Date(),
          hotelId: hotelId,
        });

        // console.log("customerObj ==>", customerObj);

        await customerObj.save();
        return customerObj._id;
      })
    );

    // console.log("promisses customers ====>", customers);

    await reservation.updateOne({ _id: reservationObj._id }, { customers });
    return res.status(200).json({ reservationObj });
  } catch (err) {
    console.error("Failed to do reservation:", err);
    return res.status(400).json({ error: "Failed to add reservation" });
  }
};

//view all customers api based on the hotel id-------------------------
const getAllItems = async (req, res) => {
  const hotelId = req.params.hotelId;
  // console.log("hotelId=>", hotelId);

  try {
    let customerData = await customer.aggregate([
      {
        $match: {
          hotelId: new mongoose.Types.ObjectId(hotelId), // Ensure correct ObjectId conversion
        },
      },
      {
        $addFields: {
          idFile: { $concat: [process.env.BASE_URL, "$idFile"] },
          idFile2: { $concat: [process.env.BASE_URL, "$idFile2"] },
          fullName: { $concat: ["$firstName", " ", "$lastName"] },
        },
      },
      {
        $lookup: {
          from: "hotels", // Correct collection name
          localField: "hotelId", // ✅ Fixed: Use hotelId, NOT firstHotelId
          foreignField: "_id",
          as: "hotelDetails",
        },
      },
      {
        $unwind: {
          path: "$hotelDetails",
          preserveNullAndEmptyArrays: true, // Keep customers even if no matching hotel
        },
      },
      {
        $sort: { createdDate: -1 }, // Sorting by latest createdDate
      },
    ]);

    if (!customerData || customerData.length === 0)
      return res.status(404).json({ message: "No data found." });

    // console.log("customerData ==========>", customerData);
    res.status(200).json({ customerData });
  } catch (error) {
    console.error("Failed to fetch item data:", error);
    res.status(400).json({ error: "Failed to fetch item data" });
  }
};

//view all customer api-------------------------
const getAllCustomers = async (req, res) => {
  try {
    const customerData = await customer.find().populate("hotelId").exec();
    // const customerData = await customer.find().sort({ createdDate: -1 });

    if (customerData.length === 0)
      return res.status(404).json({ message: "no Data Found." });
    res.status(200).json({ customerData });
  } catch (error) {
    console.error("Failed to fetch customer data:", error);
    res.status(400).json({ error: "Failed to fetch customer data" });
  }
};

const getSpecificCustomer = async (req, res) => {
  const phoneNumber = req.params.phone;
  const hotelId = req.query.hotelId;

  // console.log("phoneNumber and hotelId ===>", phoneNumber, "==>", hotelId);

  try {
    let customerData = await customer.aggregate([
      {
        $match: {
          phoneNumber: phoneNumber,
          hotelId: new mongoose.Types.ObjectId(hotelId),
        },
      },
      {
        $addFields: {
          idFile: { $concat: [process.env.BASE_URL, "$idFile"] },
          idFile2: { $concat: [process.env.BASE_URL, "$idFile2"] },
          fullName: {
            $concat: ["$firstName", " ", "$lastName"],
          },
        },
      },
    ]);

    if (customerData.length === 0)
      return res.status(404).json({ message: "No data found." });
    res.status(200).json({ customerData });
  } catch (error) {
    console.error("Failed to fetch customer data:", error);
    res.status(500).json({ error: "Failed to fetch customer data" });
  }
};

//delete specific item api----------------
const deleteItem = async (req, res) => {
  try {
    const item = await customer.deleteOne({ phoneNumber: req.params.phone });
    res.status(200).json({ message: "done", item });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const editShift = async (req, res) => {
  try {
    let result = await customer.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to Update shift:", err);
    res.status(400).json({ error: "Failed to Update shift" });
  }
};
const editcustomer = async (req, res) => {
  try {
    const customerRecord = await customer.findById(req.params.id);
    if (!customerRecord) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // console.log(req.files, "req.files");
    if (req.files && req.files.idFile) {
      const filePath = `uploads/customer/Idproof/${req.files.idFile[0].filename}`;
      req.body.idFile = filePath;
    }

    if (req.files && req.files.idFile2) {
      const filePath2 = `uploads/customer/Idproof/${req.files.idFile2[0].filename}`;
      req.body.idFile2 = filePath2;
    }

    // console.log(req.body);
    let result = await customer.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    // Respond with success message
    res.status(200).json({ message: "Customer updated successfully" });
  } catch (err) {
    console.error("Failed to update customer:", err);
    res.status(400).json({ error: "Failed to update customer" });
  }
};

const reservationHistory = async (req, res) => {
  const { customerObjId } = req.params;
  const { hotelId } = req.query;

  // console.log("Customer ObjId ==>", customerObjId);
  // console.log("hotelId ==>", hotelId);

  try {
    // Ensure customerObjId is converted to ObjectId
    const customerObjectId = new ObjectId(customerObjId);
    // console.log("customerObjectId converted ==>", customerObjectId);

    const hisreservations = await reservation.find({
      customers: customerObjectId,
      hotelId: hotelId,
    });

    console.log("Reservations fetched ==>", hisreservations);
    res.status(200).json(hisreservations);
  } catch (error) {
    console.error("Failed to get customer history:", error);
    res.status(500).json({ error: "Failed to get customer history" });
  }
};

module.exports = {
  addItems,
  deleteItem,
  upload,
  getAllItems,
  editShift,
  editcustomer,
  getAllCustomers,
  getSpecificCustomer,
  doReservation,
  reservationHistory,
};
