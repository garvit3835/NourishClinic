const express = require("express");
const create_holiday = require("../DB/holidays/create_holiday");
const router = express.Router();

router.post("/create", async (req, res) => {
    console.log("hsdfds")
    let data = await create_holiday(req.body.date, req.body.message);
    console.log(data)
	res.json(data);
});

module.exports = router;