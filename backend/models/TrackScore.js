const mongoose = require('mongoose')

const trackScoreSchema = new mongoose.Schema({
  circuit: String,
  driver: String,
  team: String,
  rank: Number,
  races_at_circuit: Number,
  avg_finish: Number,
  wins: Number,
  podiums: Number,
  win_rate: Number,
  podium_rate: Number,
  track_score: Number,
}, { collection: 'track_scores' })

module.exports = mongoose.model('TrackScore', trackScoreSchema)