const mongoose = require('mongoose')

const circuitSchema = new mongoose.Schema({
  circuit:           String,
  country:           String,
  full_name:         String,
  round:             Number,
  date:              String,
  status:            String,   // 'completed' | 'next' | 'upcoming' | 'historical'
  in_2026_calendar:  Boolean,
}, { collection: 'circuits' })

module.exports = mongoose.model('Circuit', circuitSchema)