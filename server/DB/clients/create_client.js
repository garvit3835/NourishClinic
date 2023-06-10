const client = require("../../model/client");
const mongoose = require("mongoose");

const create_client = async (
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
) => {
	let data = await client.create({
		name: name,
        email: email,
        countryCode: countryCode,
        mobile: mobile,
        alternateNum: alternateNum,
        reportStatus: reportStatus,
        clientType: clientType,
        registerType: registerType,
        registerDate: registerDate,
        gender: gender,
        age: age,
        package: package,
        appointmentsLeft: appointmentsLeft,
        billedAmount: billedAmount,
        appointmentType: appointmentType
	});
	return data;
};

module.exports = create_client;
