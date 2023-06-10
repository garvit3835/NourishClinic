const appointment = require("../../model/appointment")

const delete_appointment = async (id) => {
    await appointment.findByIdAndDelete(id)
};

module.exports = delete_appointment;