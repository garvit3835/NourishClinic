const appointment = require("../../model/appointment")
const mongoose = require('mongoose')

const create_appointment = async (clientId, timeSlot, clientType, appointmentFor, paymentAmount) => {
    let data = await appointment.create({
        clientId: new mongoose.Types.ObjectId(clientId),
        timeSlot: timeSlot,
        clientType: clientType,
        appointmentFor: appointmentFor,
        paymentAmount: paymentAmount
    })
    // console.log(data)
	return data;
};

module.exports = create_appointment;