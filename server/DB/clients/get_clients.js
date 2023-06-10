const client = require("../../model/client");

const get_client = async () => {
	let data = await client.find();
	return data;
};

module.exports = get_client;
