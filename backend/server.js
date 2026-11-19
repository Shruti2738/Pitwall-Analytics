const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// ── middleware ────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── routes ────────────────────────────────────────────────────────────────
app.use('/api/circuits', require('./routes/circuits'))
app.use('/api/scores',   require('./routes/scores'))
app.use('/api/results',  require('./routes/results'))

// Health check — visit this to confirm the server is running
app.get('/', (req, res) => {
  res.json({ status: 'PitWall API running', version: '1.0' })
})

// ── database connection ───────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server running on http://localhost:${process.env.PORT || 4000}`)
    })
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })