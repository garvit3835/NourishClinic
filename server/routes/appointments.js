const express = require("express");
const get_appointments = require("../DB/appointments/get_appointments");
const create_appointment = require("../DB/appointments/create_appointment");
const daily_appointments = require("../DB/appointments/daily_appointments");
const delete_appointment = require("../DB/appointments/delete_appointment");
const update_appointment = require("../DB/appointments/update_appointment");
const create_holiday = require("../DB/holidays/create_holiday");
const appointment_by_id = require("../DB/appointments/appointment_by_id");
const router = express.Router();

router.post("/getAll", async (req, res) => {
	let data = await get_appointments(req.body.month, req.body.year);
	res.json(data);
});

router.post("/create", async (req, res) => {
	// console.log(req.body)
	await create_appointment(
		req.body.clientId,
		req.body.timeSlot,
		req.body.clientType,
		req.body.appointmentFor,
		req.body.paymentAmount
	);
	let data = await get_appointments(req.body.month, req.body.year)
	res.json(data)
});

router.get("/getDaily/:date", async (req, res) => {
	let data = await daily_appointments(req.params.date);
	res.json(data);
});

router.delete("/delete/:date/:id", async (req, res) => {
	await delete_appointment(req.params.id);
	let data = await daily_appointments(req.params.date);
	res.json(data);
});

router.put("/update/:date/:id", async (req, res) => {
	console.log(req.body)
	await update_appointment(
		req.params.id,
		req.body.timeSlot,
		req.body.duration,
		req.body.status,
		req.body.description,
		req.body.payStatus
	);
	let data = await daily_appointments(req.params.date);
	res.json(data);
});

router.get("/appointment_by_id/:id", async (req, res) => {
	// console.log(req.params.id)
	let data = await appointment_by_id(req.params.id)
	// console.log(data)
	res.json(data)
})

module.exports = router;
