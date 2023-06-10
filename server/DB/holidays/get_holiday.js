const holiday = require("../../model/holiday");

const get_holiday = async (date) => {
	let data = await holiday.findOne({
		date: new Date(date),
	});
	return data;
};

module.exports = get_holiday;