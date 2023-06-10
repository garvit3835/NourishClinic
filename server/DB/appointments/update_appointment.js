const appointment = require("../../model/appointment")

const update_appointment = async (id, timeSlot, duration, status, description, payStatus) => {
    let data = await appointment.findById(id)
    // console.log(timeSlot)
    timeSlot ? data.timeSlot = timeSlot : data.timeSlot
    duration ? data.duration = duration : data.duration
    status ? data.status = status : data.status
    payStatus ? data.payStatus = payStatus : data.payStatus
    description ? data.description = description : data.description
    // console.log(data)
    await data.save()
    return data
};

module.exports = update_appointment;