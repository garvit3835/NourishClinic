const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const HolidaySchema = new mongoose.Schema(
	{
		date: { type: Date, required: true },
		message: { type: String, required: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Holiday", HolidaySchema);
