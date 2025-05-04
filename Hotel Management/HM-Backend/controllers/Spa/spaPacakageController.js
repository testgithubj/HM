const spaGuestBooking = require("../../model/schema/spaGuestBooking");
const SpaPackage = require( "../../model/schema/spaPackageSchema " );
const SpaService = require( "../../model/schema/spaServiceSchema " );

exports.createPackage = async (req, res) => {
  const {
    services,
    serviceCategory,
    name,
    description,
    price,
    discountType = "none",
    discountValue = 0,
  } = req.body;

  console.log("category", serviceCategory);

  try {
    // Check for duplicate package
    const isExistPackage = await SpaPackage.findOne({ name, services });
    if (isExistPackage) {
      return res
        .status(409)
        .json({ success: false, message: "Package already created!" });
    }

    // Fetch selected services to calculate total
    const selectedServices = await SpaService.find({ _id: { $in: services } });

    if (!selectedServices || selectedServices.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid services found." });
    }

    const servicesTotal = selectedServices.reduce(
      (sum, service) => sum + service.price,
      0
    );

    const newPackage = new SpaPackage({
      name,
      description,
      serviceCategory,
      price,
      services,
      servicesTotal,
      discountType,
      discountValue,
    });

    await newPackage.save();

    res
      .status(200)
      .json({ success: true, message: "Package created successfully." });
  } catch (error) {
    console.error("Error creating spa package:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// exports.createPackage = async (req, res) => {
//   const { services, name, description, price } = req.body;

//   try {
//     // Fetch all service details using the provided ObjectIds
//     const selectedServices = await SpaService.find({
//       _id: { $in: services },
//     });

//     console.log("selectedServices", selectedServices);

//     if (!selectedServices || selectedServices.length === 0) {
//       return res.status(400).json({ error: "No valid services found." });
//     }

//     // Calculate total price
//     const totalPrice = selectedServices.reduce(
//       (sum, service) => sum + service.price,
//       0
//     );

//     console.log("services", services);

//     console.log("selectedServices", selectedServices);

//     console.log("totalPrice", totalPrice);

//     const isExistPackage = await SpaPackage.findOne({ name, services });

//     // check isExists
//     if (isExistPackage) {
//       return res
//         .status(409)
//         .send({ success: false, message: "Package already created!" });
//     }

//     // Create and save new package
//     const newPackage = new SpaPackage({
//       name,
//       description,
//       services,
//       price,
//     });

//     const saved = await newPackage.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await SpaPackage.find()
      .populate("services")
      .sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const updated = await SpaPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePackage = async (req, res) => {
  console.log("hitting this delete");
  try {


     const data =await spaGuestBooking.findOne({serviceId:req.params.id,status:'Pending'});
        console.log(data,'this is for delete service ');
    
        if (data) {
          return res.status(400).json({ message: 'Service is in use and cannot be deleted' });
        }
    await SpaPackage.findByIdAndDelete( req.params.id );
    res.json( { message: "Package deleted successfully" } );
  } catch ( err ) {
    res.status( 500 ).json( { error: err.message } );
  }
};
