const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const AppointmentSchema = new mongoose.Schema({
    clientId: { type: ObjectId, required: true },
    status: { type: String, default: "" },
    description: { type: String, default: "" },
    timeSlot: { type: Date, required: true },
    clientTrack: { type: String },                      // check-in or check-out
    clientType: { type: String },   // nr, rr, dc, face
    appointmentFor: { type: String, required: true },   // celeb, pvt, normal, vip
    paymentAmount: { type: Number, required: true },
    duration: { type: Number, default: 0 },
    payStatus: { type: String, default: 'Unpaid' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);