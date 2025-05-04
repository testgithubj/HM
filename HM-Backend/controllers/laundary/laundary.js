const laundary = require( "../../model/schema/laundary" );
const Reservation = require( "../../model/schema/reservation" );
const mongoose = require( "mongoose" );

const addItems = async ( req, res ) => {
  try {
    console.log( "===== Incoming Request =====" );
    console.log( "Request body received:", req.body );

    // Validate the request body
    if ( !req.body || Object.keys( req.body ).length === 0 ) {
      console.log( "Error: Request body is empty" );
      return res.status( 400 ).json( { error: "Request body is empty" } );
    }

    if ( !req.body.roomNo ) {
      console.log( "Error: Missing roomNo in request" );
      return res.status( 400 ).json( { error: "roomNo is required" } );
    }

    console.log( "Searching for active reservation with roomNo:", req.body.roomNo );

    // Find the active reservation linked to the roomNo
    const reservation = await Reservation.findOne( {
      roomNo: req.body.roomNo,
      status: "active", // Only active reservations
    } );

    console.log( "Reservation found:", reservation );

    if ( !reservation ) {
      console.log( "No active reservation found for room:", req.body.roomNo );
      return res.status( 404 ).json( { error: "Active reservation not found" } );
    }

    // Check if the reservation has a laundry array
    if ( !Array.isArray( reservation.laundry ) ) {
      console.log( "Error: reservation.laundry is not an array. Current value:", reservation.laundry );
      return res.status( 500 ).json( { error: "Reservation structure is incorrect" } );
    }

    // Add the reservationId dynamically
    req.body.reservationId = reservation._id;
    req.body.createdDate = new Date();

    console.log( "Creating new laundry item with data:", req.body );

    // Create the laundry item with reservationId
    const laundaryObject = await laundary.create( req.body );
    console.log( "Laundry item created successfully:", laundaryObject );

    if ( !laundaryObject ) {
      console.log( "Failed to create laundry item." );
      return res.status( 400 ).json( { error: "Failed to add laundry item" } );
    }

    // Add laundry item ID to the reservation
    console.log( "Adding laundry ID to reservation:", laundaryObject._id );
    reservation.laundry.push( laundaryObject._id );

    // Save updated reservation
    await reservation.save();
    console.log( "Reservation updated successfully:", reservation );

    res.status( 200 ).json( { message: "Laundry added and reservation updated successfully", laundaryObject } );

  } catch ( err ) {
    console.error( "Error during addItems:", err );
    res.status( 400 ).json( { error: "Failed to add laundry item" } );
  }
};




//view all item api-------------------------
const getAllItems = async ( req, res ) => {
  const hotelId = req.params.hotelId;

  try {
    const laundaryData = await laundary
      .find( { hotelId } )
      .sort( { createdDate: -1 } );
    if ( !laundaryData )
      return res.status( 404 ).json( { message: "no Data Found." } );
    res.status( 200 ).json( { laundaryData } );
  } catch ( error ) {
    console.error( "Failed to fetch Laundary data:", error );
    res.status( 400 ).json( { error: "Failed to fetch Laundary data" } );
  }
};
const getAllLaundaryExpenses = async ( req, res ) => {
  const hotelId = req.params.hotelId;

  try {
    let laundaryData = await laundary.find( { hotelId, status: true } );

    if ( !laundaryData || laundaryData.length === 0 ) {
      return res.status( 404 ).json( { message: "No Data Found." } );
    }

    // Group laundary expenses by date and calculate total amount for each date
    const laundaryDataGroupedByDate = {};
    laundaryData.forEach( ( item ) => {
      const dateKey = item.createdDate.toISOString().split( "T" )[ 0 ]; // Extract date without time
      if ( !laundaryDataGroupedByDate[ dateKey ] ) {
        laundaryDataGroupedByDate[ dateKey ] = {
          category: "laundary",
          amount: 0,
          createdDate: item.createdDate,
        };
      }
      const amount = item.quantity * item.amount;
      laundaryDataGroupedByDate[ dateKey ].amount += amount;
    } );

    // Convert object to array of values
    const result = Object.values( laundaryDataGroupedByDate );

    res.status( 200 ).json( { laundaryData: result } );
  } catch ( error ) {
    console.error( "Failed to fetch Laundary data:", error );
    res.status( 400 ).json( { error: "Failed to fetch Laundary data" } );
  }
};

//delete specific item api----------------
const deleteItem = async ( req, res ) => {
  try {
    const item = await laundary.deleteOne( { _id: req.params.id } );
    res.status( 200 ).json( { message: "done", item } );
  } catch ( err ) {
    res.status( 404 ).json( { message: "error", err } );
  }
};

const updateStatus = async ( req, res ) => {
  // console.log( "in editItem controller ..... ======>", req.params.id );
  console.log( "req.body ..... ======>", req.body );

  try {
    let result = await laundary.updateOne(
      { _id: req.params.id  },
      { status: req.body.status }
    );
    res.status( 200 ).json( result );
  } catch ( err ) {
    console.error( "Failed to Update Laundary:", err );
    res.status( 400 ).json( { error: "Failed to Update Laundary" } );
  }
};

const editItem = async ( req, res ) => {
  console.log( "in editItem controller ..... ======>", req.params.id );
  console.log( "req.body ..... ======>", req.body );

  try {
    let result = await laundary.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status( 200 ).json( result );
  } catch ( err ) {
    console.error( "Failed to Update Laundary:", err );
    res.status( 400 ).json( { error: "Failed to Update Laundary" } );
  }
};

// const getLaundryByReservationId = async ( req, res ) => {
//   const reservationId = req.params.reservationId;

//   try {
//     // Find all laundry items with the given reservationId
//     const laundaryData = await laundary.find( { reservationId } );

//     if ( !laundaryData || laundaryData.length === 0 ) {
//       return res.status( 404 ).json( { message: "No laundry items found for this reservation." } );
//     }

//     res.status( 200 ).json( { laundaryData } );
//   } catch ( error ) {
//     console.error( "Failed to fetch Laundry data:", error );
//     res.status( 400 ).json( { error: "Failed to fetch Laundry data" } );
//   }
// };
const getLaundryByReservationId = async ( req, res ) => {
  const reservationId = req.params.reservationId;

  try {
    let laundaryData = await laundary.find( { reservationId, status: { $in: [ "pending", "checked-out" ] } } );

    if ( !laundaryData || laundaryData.length === 0 ) {
      return res.status( 404 ).json( { message: "No laundry data found for this reservation." } );
    }

    const laundaryDataGroupedByDate = {};
    laundaryData.forEach( ( item ) => {
      const dateKey = item.createdDate.toISOString().split( "T" )[ 0 ];
      if ( !laundaryDataGroupedByDate[ dateKey ] ) {
        laundaryDataGroupedByDate[ dateKey ] = {
          category: "laundary",
          amount: 0,
          createdDate: item.createdDate,
          items: []
        };
      }

      const amount = item.quantity * item.amount;
      laundaryDataGroupedByDate[ dateKey ].amount += amount;

      laundaryDataGroupedByDate[ dateKey ].items.push( {
        name: item.name,
        quantity: Number( item.quantity )
      } );
    } );

    const result = Object.values( laundaryDataGroupedByDate );

    res.status( 200 ).json( { laundaryData: result } );
  } catch ( error ) {
    console.error( "Failed to fetch Laundry data:", error );
    res.status( 400 ).json( { error: "Failed to fetch Laundry data" } );
  }
};

module.exports = {
  addItems,
  deleteItem,
  getAllItems,
  editItem,
  updateStatus,
  getAllLaundaryExpenses,
  getLaundryByReservationId,
};