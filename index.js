const connectToMongoose = require('./db')
const express = require('express')
connectToMongoose();

const app = express()
const port = 5000
app.use(express.json())

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/note'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
