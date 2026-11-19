const express = require('express')
const router = express.Router()
const TrackScore = require('../models/TrackScore')

// GET /api/scores/:circuit
// Returns all driver scores for a circuit, sorted by rank
router.get('/:circuit', async (req, res) => {
  try {
    const scores = await TrackScore
      .find({ circuit: req.params.circuit })
      .sort({ rank: 1 })

    if (!scores.length) {
      return res.status(404).json({ error: 'No scores found for this circuit' })
    }

    res.json(scores)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router