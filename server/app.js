const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
// const appointment = require('./model/appointment')
const appointments = require('./routes/appointments')
const clients = require('./routes/clients')
const cors = require('cors')
const holidays = require('./routes/holiday')
const connect = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/Nourish');
}
connect()

app.use(cors())
app.use(express.json())
app.use('/api/appointments', appointments)
app.use('/api/clients', clients)
app.use('/api/holidays', holidays)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})