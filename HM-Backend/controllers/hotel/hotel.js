const bcrypt = require( "bcrypt" );
const jwt = require( "jsonwebtoken" );
const mongoose = require( "mongoose" );
const employee = require( "../../model/schema/employee" );
const Hotel = require( "../../model/schema/hotel" );
const multer = require( "multer" );
const fs = require( "fs" );
const path = require( "path" );

const storage = multer.diskStorage( {
  destination: function ( req, file, cb ) {
    const uploadDir = "uploads/hotel";
    fs.mkdirSync( uploadDir, { recursive: true } );
    cb( null, uploadDir );
  },
  filename: function ( req, file, cb ) {
    const uploadDir = "uploads/hotel";
    const fileName = file.originalname;
    const filePath = path.join( uploadDir, fileName );

    if ( fs.existsSync( filePath ) ) {
      const timestamp = Date.now() + Math.floor( Math.random() * 90 );
      const uniqueFileName = `${ fileName.split( "." )[ 0 ] }-${ timestamp }.${ fileName.split( "." )[ 1 ]
        }`;
      cb( null, uniqueFileName );
    } else {
      cb( null, fileName );
    }
  },
} );

const upload = multer( { storage } );

//Edit Hotel
const edit = async ( req, res ) => {
  console.log( "in edit -------------------------------->" );

  console.log( "req.body ==>", req.body );
  console.log( "req.file ==>", req.file );

  try {
    const updateFields = { ...req.body };

    if ( req.file ) {
      // updateFields.hotelImage = req.file.path;
      updateFields.hotelImage = `uploads/hotel/${ req.file.filename }`;
      console.log( "updateFields.hotelImage ==>", updateFields.hotelImage );
    }

    let result = await Hotel.updateOne(
      { _id: req.params.id },
      { $set: updateFields }
    );

    res.status( 200 ).json( result );
  } catch ( err ) {
    console.error( "Failed to Update Hotel:", err );
    res.status( 400 ).json( { error: "Failed to Update Hotel" } );
  }
};



const register = async ( req, res ) => {
  try {
    const { email, password, name, address, contact, mapurl, role } = req.body;

    // Check if hotel with the email already exists
    const hotelData = await Hotel.findOne( { email: email } );

    if ( hotelData ) {
      return res
        .status( 401 )
        .json( { message: "Hotel already exists, please try another email" } );
    } else {
      const hashedPassword = await bcrypt.hash( password, 10 );

      const hotelObj = new Hotel( {
        email,
        password: hashedPassword,
        role,
        name,
        address,
        contact,
        mapurl,
        createdDate: new Date(),
      } );

      console.log( hotelObj, "Hotel to be saved------------" );
      await hotelObj.save();

      hotelObj.hotelId = hotelObj._id;
      await hotelObj.save();

      res.status( 200 ).json( { message: "Hotel created successfully" } );
    }
  } catch ( error ) {
    console.error( "Error creating hotel:", error );
    res.status( 500 ).json( { error: "Internal server error" } );
  }
};

module.exports = { register };


const login = async ( req, res ) => {
  try {
    console.log( "req.body Data---------- =>", req.body );
    const { email, password } = req.body;

    console.log( "Original Email and Password=====>", email, password );

    const lowerCaseEmail = email.toLowerCase();
    console.log( "Lowercased Email=====>", lowerCaseEmail );

    let user = await Hotel.findOne( { email: lowerCaseEmail, deleted: false } );
    console.log( "user =>", lowerCaseEmail );
    if (!user) {
      user = await employee.findOne({ email });
    }
    console.log( "user =>", user );

    if ( !user ) {
      res.status( 401 ).json( { error: "Authentication failed, invalid email" } );
      return;
    }

    console.log( "user ===>", user );

    const passwordMatch = await bcrypt.compare( password, user.password );
    console.log( "p =>", passwordMatch );

    if ( !passwordMatch ) {
      res
        .status( 401 )
        .json( { error: "Authentication failed, password does not match" } );
      return;
    }

    console.log( "passwordMatch ==>", passwordMatch );

    const token = jwt.sign( { HotelId: user._id }, "secret_key" );
    console.log( "token ==>", token );
    res
      .status( 200 )
      .setHeader( "Authorization", `Bearer ${ token }` )
      .json( { token: token, user } );
  } catch ( error ) {
    console.log( error );
    res.status( 500 ).json( { error: "An error occurred" } );
  }
};

//View All Hotels
const getAllHotels = async ( req, res ) => {
  try {
    let hotelData = await Hotel.find().sort( { createdAt: -1 } );
    console.log( hotelData );
    if ( hotelData.length === 0 )
      return res.status( 404 ).json( { message: "no Data Found." } );
    res.status( 200 ).json( hotelData );
  } catch ( error ) {
    console.log( error );
    res.status( 500 ).json( { error } );
  }
};


//View All Hotels for the admin reports section
const getAllHotelReports = async ( req, res ) => {
  try {
    const now = new Date();

    const getDateRange = ( months ) => {
      const endDate = new Date( now );
      endDate.setHours( 23, 59, 59, 999 );

      const startDate = new Date( now );
      startDate.setMonth( now.getMonth() - months );
      startDate.setDate( 1 );
      startDate.setHours( 0, 0, 0, 0 );

      return { startDate, endDate };
    };

    const { startDate: startOfMonth, endDate: endOfMonth } = getDateRange( 0 );
    const { startDate: startOf3Months, endDate: endOf3Months } =
      getDateRange( 3 );
    const { startDate: startOf6Months, endDate: endOf6Months } =
      getDateRange( 6 );
    const { startDate: startOf1Year, endDate: endOf1Year } = getDateRange( 12 );

    console.log( "Date Ranges:", {
      startOfMonth,
      endOfMonth,
      startOf3Months,
      endOf3Months,
      startOf6Months,
      endOf6Months,
      startOf1Year,
      endOf1Year,
    } );

    let hotelData = await Hotel.aggregate( [
      {
        $lookup: {
          from: "invoices",
          localField: "_id",
          foreignField: "hotelId",
          as: "invoiceInfo",
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "hotelId",
          as: "roomInfo",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "hotelId",
          as: "customer",
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "createdBy",
          as: "subscriptionInfo",
        },
      },
      {
        $addFields: {
          invoiceInfo: {
            $ifNull: [ "$invoiceInfo", [] ],
          },
          roomInfo: {
            $ifNull: [ "$roomInfo", [] ],
          },
          customer: {
            $ifNull: [ "$customer", [] ],
          },
          totalIncome1Year: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$invoiceInfo",
                    as: "invoice",
                    cond: {
                      $and: [
                        { $gte: [ "$$invoice.createdDate", startOf1Year ] },
                        { $lte: [ "$$invoice.createdDate", endOf1Year ] },
                      ],
                    },
                  },
                },
                as: "filteredInvoice",
                in: "$$filteredInvoice.totalAmount",
              },
            },
          },
          totalIncome6Months: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$invoiceInfo",
                    as: "invoice",
                    cond: {
                      $and: [
                        { $gte: [ "$$invoice.createdDate", startOf6Months ] },
                        { $lte: [ "$$invoice.createdDate", endOf6Months ] },
                      ],
                    },
                  },
                },
                as: "filteredInvoice",
                in: "$$filteredInvoice.totalAmount",
              },
            },
          },
          totalIncome3Months: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$invoiceInfo",
                    as: "invoice",
                    cond: {
                      $and: [
                        { $gte: [ "$$invoice.createdDate", startOf3Months ] },
                        { $lte: [ "$$invoice.createdDate", endOf3Months ] },
                      ],
                    },
                  },
                },
                as: "filteredInvoice",
                in: "$$filteredInvoice.totalAmount",
              },
            },
          },
          totalIncomeCurrentMonth: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$invoiceInfo",
                    as: "invoice",
                    cond: {
                      $and: [
                        { $gte: [ "$$invoice.createdDate", startOfMonth ] },
                        { $lte: [ "$$invoice.createdDate", endOfMonth ] },
                      ],
                    },
                  },
                },
                as: "filteredInvoice",
                in: "$$filteredInvoice.totalAmount",
              },
            },
          },
          roomCount: {
            $size: "$roomInfo",
          },
          customerCount: {
            $size: "$customer",
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalIncome1Year: 1,
          totalIncome6Months: 1,
          totalIncome3Months: 1,
          totalIncomeCurrentMonth: 1,
          roomCount: 1,
          customerCount: 1,
          subscriptionInfo: 1,
          planName: "$subscriptionInfo.title",
          planStatus: "$subscriptionInfo.status",
          days: "$subscriptionInfo.days",
        },
      },
    ] );

    console.log( "hotelData ================>", hotelData );
    if ( hotelData.length === 0 )
      return res.status( 204 ).json( { message: "No Data Found." } );
    res.status( 200 ).json( hotelData );
  } catch ( error ) {
    console.log( error );
    res.status( 500 ).json( { error } );
  }
};

//View Specific Hotel
const getSpecificHotel = async ( req, res ) => {
  try {
    let hotelData = await Hotel.findOne( { _id: req.params.id } );
    if ( !hotelData ) return res.status( 404 ).json( { message: "no Data Found." } );
    res.status( 200 ).json( hotelData );
  } catch ( error ) {
    res.status( 500 ).json( { error } );
  }
};



const deleteHotel = async ( req, res ) => {


  try {
    const _id = req.params.id;
    // Validate if id is a valid MongoDB ObjectId
    if ( !mongoose.Types.ObjectId.isValid( _id ) ) {
      return res.status( 400 ).json( {
        success: false,
        message: "Invalid hotel ID format",
      } );
    }

    const hotelData = await Hotel.findById( _id );
    if ( !hotelData ) {
      return res.status( 404 ).json( {
        success: false,
        message: "Hotel not found",
      } );
    }

    // First delete all employees associated with this hotel
    // Make sure to import the Employee model at the top of your file
    // const Employee = require('../models/path/to/your/Employee');

    console.log( "data ki asche?", _id );
    const deletedEmployees = await employee.deleteMany( { hotelId: req.params.id } );
    console.log( `Deleted ${ deletedEmployees.deletedCount } employees associated with hotel ${ _id }` );

    // Then delete the hotel
    await Hotel.findByIdAndDelete( _id );

    return res.status( 200 ).json( {
      success: true,
      message: "Hotel and all associated employees deleted successfully",
      deletedEmployeeCount: deletedEmployees.deletedCount
    } );
  } catch ( error ) {
    console.error( "Error deleting hotel:", error );
    return res.status( 500 ).json( {
      success: false,
      message: "Error deleting hotel",
      error: error.message,
    } );
  }
};



//Edit Specific Hotel
const changeHotelStatus = async ( req, res ) => {
  const _id = new mongoose.Types.ObjectId( req.params.id );

  try {
    // Fetch the user data
    const hotelData = await Hotel.findOne( { _id } );

    if ( !hotelData ) {
      return res.status( 404 ).json( { error: "Hotel not found" } );
    }

    const updatedDeletedValue = !hotelData.deleted;

    // Update the user document
    const result = await Hotel.updateOne(
      { _id: _id },
      { $set: { deleted: updatedDeletedValue } }
    );

    res.status( 200 ).json( result );
  } catch ( err ) {
    console.error( "Failed to change status :", err );
    res.status( 400 ).json( { error: "Failed to change status" } );
  }
};

//Change Password Hotel
const ChangeHotelPassword = async ( req, res ) => {
  console.log( "req.body ==>", req.body );
  try {
    console.log( "in try ChangeHotelPassword..." );
    const hashedPassword = await bcrypt.hash( req.body.password, 10 );
    console.log( "hashedPassword =>", hashedPassword );

    const result = await Hotel.updateOne(
      { email: req.body.email },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    console.log( "result =>", result );
    res.status( 200 ).json( result );
  } catch ( err ) {
    console.error( "Failed to change password :", err );
    res.status( 400 ).json( { error: "Failed to change password" } );
  }
};

const ChangeCheckInButtonStatus = async ( req, res ) => {
  console.error( "req.params.id ==>", req.params.id );
  const _id = new mongoose.Types.ObjectId( req.params.id );
  console.error( "req.body ==>", req.body );
  console.error( "req.body ==>", req.body.status );
  try {
    console.error( "In try ChangeCheckInButtonStatus" );

    const result = await Hotel.updateOne(
      { _id: _id },
      {
        $set: {
          checkInButtonStatus: req.body.status,
        },
      }
    );
    console.log( "status here result -------------------->", result );
  } catch ( err ) {
    console.error( "Failed to change Status :", err );
    res.status( 400 ).json( { error: "Failed to change Status" } );
  }
};

const ChangeCheckOutButtonStatus = async ( req, res ) => {
  console.error( "req.params.id ==>", req.params.id );
  const _id = new mongoose.Types.ObjectId( req.params.id );
  console.error( "req.body ==>", req.body );
  console.error( "req.body ==>", req.body.status );
  try {
    console.error( "In try ChangeCheckOutButtonStatus" );

    const result = await Hotel.updateOne(
      { _id: _id },
      {
        $set: {
          checkOutButtonStatus: req.body.status,
        },
      }
    );
    console.log( "status here result -------------------->", result );
  } catch ( err ) {
    console.error( "Failed to change Status :", err );
    res.status( 400 ).json( { error: "Failed to change Status" } );
  }
};

module.exports = {
  upload,
  register,
  login,
  getSpecificHotel,
  getAllHotels,
  edit,
  deleteHotel,
  changeHotelStatus,
  getAllHotelReports,
  ChangeHotelPassword,
  ChangeCheckInButtonStatus,
  ChangeCheckOutButtonStatus,
};