const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    countryCode: { type: Number, required: true },
    mobile: { type: Number, required: true, unique: true },
    alternateNum: { type: Number },
    reportStatus: { type: Number, default: 0 },
    clientType: { type: String, required: true },   // NR or ReReg or DC
    registerType: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    package: { type: Number },
    appointmentsLeft: { type: Number, default: 0 },
    registerDate: { type: Date },
    billedAmount: { type: Number },
    appointmentType: { type: String, required: true },    // voice call or face time
    isBlacklisted: { type: Boolean, default: false }, 
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);