const connectToMongoose = require('./db')
const express = require('express')
var cors = require('cors')
connectToMongoose();

const app = express()
const port = 3000
app.use(cors())
app.use(express.json())

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/note'))

app.listen(port, () => {
  console.log(`myNotebook backend app listening on port ${port}`)
})
