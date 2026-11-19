const mongoose = require('mongoose')

const raceResultSchema = new mongoose.Schema({
  year: Number,
  circuit: String,
  country: String,
  date: String,
  driver: String,
  team: String,
  position: Number,
}, { collection: 'race_results' })

module.exports = mongoose.model('RaceResult', raceResultSchema)