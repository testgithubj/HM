const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const spaGuestSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true  
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  idCardType: {
    type: String,
    required: true,
  },
  idcardNumber: {
    type: String,
    // required: true,
  },
  idFile: {
    type: String,
    required: true,
  },
  idFile2: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
  },
  userType: {
    type: String,
    required: true,
  },
  roomNo: {
    type: Number,
    required: function() {
      return this.userType === 'Room';
    }
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['Service', 'Package']
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'serviceTypeModel',
    required: true,
  },
  serviceTypeModel: {
    type: String,
    required: true,
    enum: ['SpaService', 'SpaPackage'],
    default: function() {
      return this.serviceType === 'Service' ? 'SpaService' : 'SpaPackage';
    }
  },
  serviceName: {
    type: String,
    required: true,
  },
  numberOfPersons: {
    type: Number,
    min: 1,
  },
  bookingDateTime: { 
    type: Date, 
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  notes: {
    type: String
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
  },
  totalAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

spaGuestSchema.pre('save', function(next) {
  if (this.serviceType === 'Service') {
    this.serviceTypeModel = 'SpaService';
  } else if (this.serviceType === 'Package') {
    this.serviceTypeModel = 'SpaPackage';
  }
  next();
});

module.exports = mongoose.model('SpaGuest', spaGuestSchema);