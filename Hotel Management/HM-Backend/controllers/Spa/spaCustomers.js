const mongoose = require('mongoose');
const spaGuestBooking = require( "../../model/schema/spaGuestBooking" );
const SpaService = require('../../model/schema/spaServiceSchema ');

exports.deleteCustomer = async ( req, res ) => {
  try {
    console.log( req.params.id, 'this is id for delete ' );

    const deletedCustomer = await spaGuestBooking.findByIdAndDelete( req.params.id );
    console.log( deletedCustomer );
    res.status( 200 ).json( { message: 'Customer deleted successfully' } );

  } catch ( error ) {
  }
};

// controllers/spaController.js


// Update SPA customer details
exports. updateCustomer = async (req, res) => {



  console.log(req.body, 'this is req.body for update customer');
  try {
    const customerData = req.body;
    const customerId = customerData._id;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ success: false, message: 'Invalid customer ID' });
    }

    // Create a combined date/time from the separate fields
    let bookingDateTime;
    if (customerData.bookingDate && customerData.bookingTime) {
      const bookingDate = new Date(customerData.bookingDate);
      const bookingTime = new Date(customerData.bookingTime);
      
      bookingDateTime = new Date(
        bookingDate.getFullYear(),
        bookingDate.getMonth(),
        bookingDate.getDate(),
        bookingTime.getHours(),
        bookingTime.getMinutes()
      );
    }

    // Determine if it's a service or package booking
    const isService = customerData.serviceOrPackage === 'Service' || customerData.serviceOrPackage === 'Package';
    const serviceId = isService ? customerData.serviceId : null;
   

    // Prepare update data based on schema
    const updateData = {
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      phoneNumber: customerData.phoneNumber,
      email: customerData.email,
      idCardType: customerData.idCardType,
      idcardNumber: customerData.idCardNumber, // Note: schema has "idcardNumber" but your frontend uses "idCardNumber"
      address: customerData.address,
      userType: customerData.userType,
      // Use the correct ID based on service type
      serviceId: serviceId ,
      serviceType: customerData.serviceOrPackage,
      numberOfPersons: customerData.numberOfPersons,
      bookingDateTime: bookingDateTime,
      price: customerData.price,
      duration: isService ? customerData.duration : 0,
      notes: customerData.notes,
      updatedAt: new Date(),
      totalAmount: customerData.totalAmount
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    // Update the customer
    const updatedCustomer = await spaGuestBooking.findByIdAndUpdate(
      customerId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }


    console.log('Customer updated successfully:', updatedCustomer);
    return res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error updating customer',
      error: error.message +'asdfsad'
    });
  }
};

exports.getSpaByReservationId = async ( req, res ) => {
  const reservationId = req.params.reservationId;


  console.log( reservationId, 'this is reservation id' );

  try {
    let SpaData = await spaGuestBooking.find( { reservationId, status: { $in: [ "Completed" ] } } );

    console.log( SpaData, 'this is spa data' );

    if ( !SpaData || SpaData.length === 0 ) {
      return res.status( 404 ).json( { message: "No spa data found for this reservation." } );
    }

    const SpaDataGroupedByDate = {};
    SpaData.forEach( ( item ) => {
      const dateKey = item.createdAt.toISOString().split( "T" )[ 0 ];
      if ( !SpaDataGroupedByDate[ dateKey ] ) {
        SpaDataGroupedByDate[ dateKey ] = {
          amount: 0,
          persons: item.numberOfPersons,
          createdDate: item.createdAt,
          totalAmount: item.totalAmount,
          items: []
        };
      }

      const amount = item.price;
      SpaDataGroupedByDate[ dateKey ].amount += amount;

      SpaDataGroupedByDate[ dateKey ].items.push( {
        name: item.serviceName,
        serviceType: item.serviceType,
        price: Number( item.price ),
        persons: item.numberOfPersons
      } );
    } );

    const result = Object.values( SpaDataGroupedByDate );

    res.status( 200 ).json( { SpaData: result } );
  } catch ( error ) {
    console.error( "Failed to fetch Laundry data:", error );
    res.status( 400 ).json( { error: "Failed to fetch Laundry data" } );
  }
};