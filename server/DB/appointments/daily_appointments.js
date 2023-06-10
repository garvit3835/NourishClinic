const appointment = require("../../model/appointment");
const client = require("../../model/client");

const daily_appointments = async (date) => {
	let today = new Date(date);
	let stringToday = today.toDateString();
	let newToday = new Date(stringToday);
	// console.log(newToday);
	let tomorrow = new Date(today.setDate(today.getDate() + 1));
	let stringTomorrow = tomorrow.toDateString();
	let newTomorrow = new Date(stringTomorrow);
	// console.log(newTomorrow);

	let data = await appointment
		.find({
			timeSlot: {
				$gte: newToday,
				$lt: newTomorrow,
			},
		})
		.sort({ timeSlot: 1 });
	// console.log(data)
	const clientIdArray = data.map((record) => record.clientId);
	const clients = await client.find({ _id: { $in: clientIdArray } });
	// console.log(clients)

	const mergedArray = [];

	for (let i = 0; i < clientIdArray.length; i++) {
		const mergedObject = {
			id: data[i]._id,
			clientId: clientIdArray[i],
			timeSlot: data[i].timeSlot.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			payStatus: data[i].payStatus,
			clientType: data[i].clientType,
			description: data[i].description,
			payStatus: data[i].payStatus,
			duration: data[i].duration,
			status: data[i].status,
			amount: data[i].paymentAmount
		};

		for (let j = 0; j < clients.length; j++) {
			if (clients[j]._id.toString() === clientIdArray[i].toString()) {
				mergedObject.name = clients[j].name;
				mergedObject.phone = clients[j].mobile;
				if ((clients[j].reportStatus = 0)) {
					mergedObject.reportStatus = "Pending";
				} else if ((clients[j].reportStatus = 1)) {
					mergedObject.reportStatus = "Incomplete";
				} else {
					mergedObject.reportStatus = "Comlete";
				}
				break;
			}
		}

		mergedArray.push(mergedObject);
	}

	return mergedArray;
};

module.exports = daily_appointments;
