const spaGuestBooking = require('../../model/schema/spaGuestBooking');
const SpaService = require('../../model/schema/spaServiceSchema ');

exports.createService = async (req, res) => {
  try {
    console.log("this is the body", req.body);
    const newService = new SpaService(req.body);
    const saved = await newService.save();

    console.log(saved, "this is the saved what i want to see");
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await SpaService.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    console.log("this is id for update ", req.params.id);
    const updated = await SpaService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {

    console.log('this is id for delete ',req.params.id);
    const data =await spaGuestBooking.findOne({serviceId:req.params.id,status:'Pending'});
    console.log(data,'this is for delete service ');

    if (data) {
      return res.status(400).json({ message: 'Service is in use and cannot be deleted' });
    }
    await SpaService.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
