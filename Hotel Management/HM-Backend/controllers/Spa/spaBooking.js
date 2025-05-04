const multer = require("multer");
const customer = require("../../model/schema/customer");
const Reservation = require("../../model/schema/reservation");
const spaGuestBooking = require("../../model/schema/spaGuestBooking");
const hotelSchema = require("../../model/schema/hotel");
const fs = require("fs");
const path = require("path");
const { id } = require("date-fns/locale");

const mongoose = require("mongoose");
const axios = require("axios");

// Set up storage for ID files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/spaBookingService/Idproof";
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uploadDir = "uploads/spaBookingService/Idproof";
    const fileName = file.originalname;
    const filePath = path.join(uploadDir, fileName);

    if (fs.existsSync(filePath)) {
      const timestamp = Date.now() + Math.floor(Math.random() * 90);
      const uniqueFileName = `${fileName.split(".")[0]}-${timestamp}.${fileName.split(".")[1]
        }`;
      cb(null, uniqueFileName);
    } else {
      cb(null, fileName);
    }
  },
});

// Configure multer upload with file fields
exports.upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Create new spa service booking
exports.createBooking = async (req, res) => {
  try {
    const {
      userType,
      serviceId,
      serviceName,
      numberOfPersons,
      notes,
      status,
      price,
      duration,
      hotelId,
      roomNo,
      bookingDateTime,
      firstName,
      lastName,
      email,
      phoneNumber,
      idCardType,
      idCardNumber,
      address,
      serviceType,
      totalAmount,
    } = req.body;


    const hotelDetails = await hotelSchema.findById(hotelId);




    // console.log("Request body:", req.body);
    // console.log("Request files:", req.files);

    // Common data for both booking types
    const bookingDataForRoom = {
      serviceId,
      serviceName,
      numberOfPersons: parseInt(numberOfPersons),
      notes,
      totalAmount,
      status,
      price: parseFloat(price),
      duration: parseInt(duration),
      hotelId,
      bookingDateTime: new Date(bookingDateTime),
      bookedAt: new Date(),
    };

    const guestBookingData = {
      ...bookingDataForRoom,
      userType,
      firstName,
      lastName,
      email,
      phoneNumber,
      idCardType,
      idcardNumber: idCardNumber,
      address,
      serviceType,
    };

    if (req.files && req.files.idFile && req.files.idFile[0]) {
      guestBookingData.idFile = `uploads/spaBookingService/Idproof/${req.files.idFile[0].filename}`;
    }

    if (req.files && req.files.idFile2 && req.files.idFile2[0]) {
      guestBookingData.idFile2 = `uploads/spaBookingService/Idproof/${req.files.idFile2[0].filename}`;
    }

    // Handle different booking types
    if (userType === "Room") {
      const { roomNumber } = req.body;

      // Find active reservation for the room
      const reservation = await Reservation.findOne({
        roomNo: roomNumber,
        status: "active",
      });

      // console.log(reservation, 'this is for reservation')

      if (!reservation) {
        return res.status(404).json({
          error: "Active reservation not found for this room number.",
        });
      }

      const existingCustomer = await customer.findOne({
        _id: new mongoose.Types.ObjectId(reservation.customers[0]),
      });

      guestBookingData.firstName = existingCustomer.firstName;
      guestBookingData.lastName = existingCustomer.lastName;
      guestBookingData.email = existingCustomer.email;
      guestBookingData.phoneNumber = existingCustomer.phoneNumber;
      guestBookingData.idCardType = existingCustomer.idCardType;
      guestBookingData.idcardNumber = existingCustomer.idcardNumber;
      guestBookingData.idFile = existingCustomer.idFile;
      guestBookingData.idFile2 = existingCustomer.idFile2;
      guestBookingData.address = existingCustomer.address;
      guestBookingData.reservationId = reservation._id;
      guestBookingData.roomNo = roomNumber;

      const newSpaBooking = new spaGuestBooking(guestBookingData);
      const savedBooking = await newSpaBooking.save();

      // console.log(savedBooking, 'this is for saved booking')
      const _id = savedBooking._id;

      // console.log(_id, 'this is id for spa guest booking')

      // Add spa booking to reservation

      reservation.spa.push(_id);
      await reservation.save();
    } else {
      // Guest user booking

      // Handle file uploads

      // Save spa guest booking

      // Check if customer already exists

      // Create customer record if doesn't exist
      const customerData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        idCardType,
        hotelId,
        idcardNumber: idCardNumber,
        idFile: guestBookingData.idFile,
        idFile2: guestBookingData.idFile2,
        address,
        createdDate: new Date(),
      };

      await customer.create(customerData);

      // console.log(guestBookingData, 'this is for guest booking data')
      const newSpaBooking = new spaGuestBooking(guestBookingData);
      const savedBooking = await newSpaBooking.save();
    }

    res.status(201).json({
      message: "Spa service booked successfully for guest.",
      // data: savedBooking,
    });

    const htmlMessage = `
    <p>Hi ${guestBookingData.firstName} ${guestBookingData.lastName},</p>
  
    <p>Thank you for your booking! We look forward to providing you with a relaxing <strong>${serviceName}</strong> experience.</p>
  
    <div>
      <p>✨ <strong>Booking Details:</strong></p>
      <p>• <strong>${serviceType === "Service" ? "Service" : "Package"}:</strong> ${serviceName}</p>
      <p>• <strong>Number of Guests:</strong> ${numberOfPersons}</p>
      <p>• <strong>Date: </strong> ${new Date(bookingDateTime).toLocaleDateString("en-US")}</p>
      <p>• <strong>Total Price:</strong> $${numberOfPersons * price}</p>
    </div>
  
    <div style="margin-top: 16px;">
      <p>🏨 <strong>Hotel Name:</strong> ${hotelDetails.name}</p>
      <p>📍 <strong>Address:</strong> ${hotelDetails.address}</p>
      <p>✉️ <strong>Email:</strong> <a href="mailto:${hotelDetails.email}">${hotelDetails.email}</a></p>
    </div>
  
    <p>We look forward to giving you a relaxing and refreshing experience. Please arrive 10–15 minutes early to settle in and enjoy every moment.</p>
  
    <p>See you soon! 🌿</p>
    <p><strong>Spa Booking Team</strong></p>
  `;

    await axios.post(`${process.env.BASE_URL}/spa/send`, {
      to: guestBookingData.email,
      subject: "Your Spa Booking is Confirmed!",
      name: `${guestBookingData.firstName} ${guestBookingData.lastName}`,
      message: htmlMessage,
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
    return res.status(500).json({
      error:
        error.message || "An error occurred while booking the spa service.",
    });
  }
};

// Get all spa guest bookings
exports.getAllGuestBookings = async (req, res) => {
  try {
    const { hotelId } = req.params;

    // console.log(hotelId, 'this is hotel id');

    const query = {};

    if (hotelId) {
      query.hotelId = hotelId;
    }

    const spaBookings = await spaGuestBooking
      .find(query)
      .sort({ bookingDateTime: -1 })
      .populate("serviceId");

    // console.log("spaBookings all data ==>", spaBookings);

    return res.status(200).json({
      spaBookings,
    });
  } catch (error) {
    console.error("Error in getAllGuestBookings:", error);
    return res.status(500).json({
      error: error.message || "An error occurred while fetching spa bookings.",
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await spaGuestBooking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error("Error in getBookingById:", error);
    return res.status(500).json({
      error: error.message || "An error occurred while fetching the booking.",
    });
  }
};

// Update booking status
// exports.updateBookingStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     // console.log(status, id, 'this is status');
//     const validStatuses = ["Pending", "Completed", "Cancelled"];

//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         error:
//           "Invalid status. Must be one of: Pending, Confirmed, Completed, Cancelled",
//       });
//     }

//     const booking = await spaGuestBooking.findByIdAndUpdate(
//       id,
//       { status, updatedAt: new Date() },
//       { new: true }
//     );

//     console.log(booking, "this is booking status change");

//     if (!booking) {
//       return res.status(404).json({ error: "Booking not found." });
//     }

//     res.status(200).json({
//       message: "Booking status updated successfully.",
//       data: booking,
//     });

//     if (booking.status === "Completed") {
//       const htmlMessage = `<p>Dear ${
//         booking.firstName + " " + booking.lastName
//       },</p>
//       <p>We hope you had a relaxing and rejuvenating experience with our <strong>${
//         booking.serviceName
//       }</strong> service.</p>

//       <p>Your appointment on <strong>${new Date(
//         booking.bookingDateTime
//       ).toLocaleDateString(
//         "en-US"
//       )}</strong> has been successfully completed.</p>

//       <p>If you enjoyed your time with us, we’d love to hear your feedback! We look forward to welcoming you again soon for more pampering and care.</p>

//       <p>Warm regards,<br/>  

//       <em>The Spa Team</em></p>

//     `;

//       return await axios.post(`${process.env.BASE_URL}/spa/send`, {
//         to: booking.email,
//         subject: `Your Relaxation Journey with ${booking.serviceName} Has Been Completed`,
//         name: `${booking.firstName} ${booking.lastName}`,
//         message: htmlMessage,
//       });
//     }
//   } catch (error) {
//     console.error("Error in updateBookingStatus:", error);
//     return res.status(500).json({
//       error:
//         error.message || "An error occurred while updating the booking status.",
//     });
//   }
// };
// here this is one is previous one  stastus update code 

const { sendEmail } = require('./emailHelper');
const { getInvoicePdf } = require('./pdfHelper');

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, hotelId } = req.body;


    console.log(req.body, 'this is for status for spa booking')

    const hotelDetails = await hotelSchema.findById(hotelId);
    console.log(hotelDetails, 'this is for spa booking')

    const validStatuses = ["Pending", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const booking = await spaGuestBooking.findByIdAndUpdate(id, {
      status, updatedAt: new Date(),
    }, { new: true });



    if (!booking) return res.status(404).json({ error: "Booking not found." });

    res.status(200).json({ message: "Booking status updated", data: booking });

    // 📨 Send Email if completed
    if (status === "Completed") {


      // Only guests receive invoices
      if (booking.userType === 'Guest') {

        const htmlMessage = `<p>Dear ${booking.firstName} ${booking.lastName},</p>
        <p>Thank you for using our <strong>${booking.serviceName}</strong> service on <strong>${new Date(
          booking.bookingDateTime).toLocaleDateString("en-US")}</strong>.</p>
        <p>Attached is your invoice. We hope to see you again!</p>
        <p>Warm regards,<br/>The Spa Team</p>`;
        const pdfBuffer = await getInvoicePdf(booking, hotelDetails);
        await sendEmail({
          to: booking.email,
          subject: `Your Invoice for ${booking.serviceName}`,
          html: htmlMessage,
          pdfBuffer,
          filename: `Spa-Invoice-${booking._id}.pdf`,
        });
      } else {

        const htmlMessage = `<p>Dear ${booking.firstName + " " + booking.lastName
          },</p>
        <p>We hope you had a relaxing and rejuvenating experience with our <strong>${booking.serviceName
          }</strong> service.</p>
   
        <p>Your appointment on <strong>${new Date(
            booking.bookingDateTime
          ).toLocaleDateString(
            "en-US"
          )}</strong> has been successfully completed.</p>
   
        <p>If you enjoyed your time with us, we’d love to hear your feedback! We look forward to welcoming you again soon for more pampering and care.</p>
   
        <p>Warm regards,<br/>  
       
        <em>The Spa Team</em></p>`;



        await sendEmail({
          to: booking.email,
          subject: `Your Relaxation with ${booking.serviceName} is Complete`,
          html: htmlMessage,
        });
      }
    }

  } catch (error) {
    console.error("Error in updateBookingStatus:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};


// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await spaGuestBooking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    // Delete associated files if they exist
    if (booking.idFile) {
      const filePath = path.join(process.cwd(), booking.idFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (booking.idFile2) {
      const filePath = path.join(process.cwd(), booking.idFile2);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await spaGuestBooking.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteBooking:", error);
    return res.status(500).json({
      error: error.message || "An error occurred while deleting the booking.",
    });
  }
};

// Get room bookings
exports.getRoomBookings = async (req, res) => {
  try {
    const { hotelId, roomNumber } = req.query;

    const query = { status: "active" };

    if (hotelId) {
      query.hotelId = hotelId;
    }

    if (roomNumber) {
      query.roomNo = roomNumber;
    }

    const reservations = await Reservation.find(query).select(
      "roomNo guestName checkInDate checkOutDate spa"
    );

    // Extract spa bookings from reservations
    const spaBookings = [];

    reservations.forEach((reservation) => {
      if (reservation.spa && reservation.spa.length > 0) {
        reservation.spa.forEach((booking) => {
          spaBookings.push({
            ...booking.toObject(),
            roomNo: reservation.roomNo,
            guestName: reservation.guestName,
            checkInDate: reservation.checkInDate,
            checkOutDate: reservation.checkOutDate,
            reservationId: reservation._id,
          });
        });
      }
    });

    return res.status(200).json({
      count: spaBookings.length,
      data: spaBookings,
    });
  } catch (error) {
    console.error("Error in getRoomBookings:", error);
    return res.status(500).json({
      error: error.message || "An error occurred while fetching room bookings.",
    });
  }
};
