const holiday = require("../../model/holiday");
const mongoose = require("mongoose");
const get_holiday = require("./get_holiday");

const create_holiday = async (date, message) => {
	let data = await get_holiday(date);
	if (data) {
		data.message = message;
		await data.save();
	} else {
		data = await holiday.create({
			date: new Date(date),
			message: message,
		});
	}

	// console.log(data)
	return data;
};

module.exports = create_holiday;
