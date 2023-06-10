const client = require("../../model/client");

const client_by_email = async (email) => {
	let data = await client.findOne({ email: email });
	return data;
};

module.exports = client_by_email;
