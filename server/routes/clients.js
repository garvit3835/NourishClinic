const express = require("express");
const get_clients = require("../DB/clients/get_clients");
const create_client = require("../DB/clients/create_client");
const client_by_email = require("../DB/clients/client_by_email");
const router = express.Router();

router.get("/get", async (req, res) => {
	let data = await get_clients();
	res.json(data);
});

router.get("/client_by_email/:email", async (req, res) => {
	let data = await client_by_email(req.params.email);
	res.json(data);
});

router.post("/create", async (req, res) => {
	let {
		name,
		email,
		countryCode,
		mobile,
		alternateNum,
		reportStatus,
		clientType,
		registerType,
		registerDate,
		gender,
		age,
		package,
		appointmentsLeft,
		billedAmount,
		appointmentType,
  } = req.body;
  
	let data = await create_client(
		name,
		email,
		countryCode,
		mobile,
		alternateNum,
		reportStatus,
		clientType,
		registerType,
		registerDate,
		gender,
		age,
		package,
		appointmentsLeft,
		billedAmount,
		appointmentType
	);
	res.json(data);
});

module.exports = router;
