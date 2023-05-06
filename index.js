const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors')

connectToMongo();
const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

//our routes endpoints
app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes' , require('./routes/notes'))

app.listen(port, () => {
  console.log(`veerZa Notebook Backend started at http://localhost:${port}`)
})