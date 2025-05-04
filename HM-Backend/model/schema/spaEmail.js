// model/schema/spaEmail.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const spaEmailSchema = new Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true,
    required: true
  },


 
  emailId: {
    type: String,
    unique: true,
    required: true,
  },

 
  recipientMail: [{
    type: String,
    trim: true
  }],
  
}, {
  timestamps: true
});

// Indexes for better query performance
spaEmailSchema.index({ sender: 1, deleted: 1 });
spaEmailSchema.index({ sentDate: -1 });
spaEmailSchema.index({ status: 1 });
spaEmailSchema.index({ emailId: 1 }, { unique: true });

const SpaEmail = mongoose.model('SpaEmail', spaEmailSchema);

module.exports = SpaEmail;