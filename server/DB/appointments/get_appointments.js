const appointment = require("../../model/appointment");
const holiday = require("../../model/holiday");

const get_appointments = async (month, year) => {
	if (month != 12) {
		let appointments = await appointment
			.find({
				timeSlot: {
					$gte: `${year}-${month}-1`,
					$lt: `${year}-${month + 1}-1`,
				},
			})
			.sort({ timeSlot: 1 });
		let holidays = await holiday
			.find({
				date: {
					$gte: `${year}-${month}-1`,
					$lt: `${year}-${month + 1}-1`,
				},
			})
			.sort({ date: 1 });
		let data = []
		// console.log(holidays)
		// console.log(appointments)
		// data = await data.push(holidays);
		data = await holidays.concat(appointments);
		// console.log(data)
		return data;
	} else {
		let appointments = await appointment
			.find({
				timeSlot: {
					$gte: `${year}-${month}-1`,
					$lt: `${year + 1}-${1}-1`,
				},
			})
			.sort({ timeSlot: 1 });
		let holidays = await holiday
			.find({
				date: {
					$gte: `${year}-${month}-1`,
					$lt: `${year + 1}-${1}-1`,
				},
			})
			.sort({ date: 1 });
		let data = []
		data = holidays.push(appointments);
		return data;
	}
};

module.exports = get_appointments;
