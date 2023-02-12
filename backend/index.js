const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();
const app = express() 
app.use(cors())
const port = 5000

app.use(express.json())

// Avalaible routes 

app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello Sharib!')
})

app.listen(port, () => {
  console.log(`myNotebook backend listening on port ${port}`)
})