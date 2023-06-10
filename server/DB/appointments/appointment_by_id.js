const appointment = require("../../model/appointment");
const client = require("../../model/client");

const appointment_by_id = async (id) => {
    let appointmentInfo = await appointment.findById(id)
    let clientInfo = await client.findById(appointmentInfo.clientId)
    const mergedObject = {
        appointmentId: id,
        clientId: clientInfo._id,
        name: clientInfo.name,
        email: clientInfo.email,
        mobile: clientInfo.mobile,
        alternateNum: clientInfo.alternateNum,
        countryCode: clientInfo.countryCode,
        appointmentFor: appointmentInfo.appointmentFor,
        clientType: appointmentInfo.clientType
    }

	return mergedObject;
};

module.exports = appointment_by_id;