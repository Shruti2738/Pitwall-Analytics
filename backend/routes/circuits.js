const express = require('express')
const router = express.Router()
const Circuit = require('../models/Circuit')

// GET /api/circuits — returns 2026 calendar sorted by round
router.get('/', async (req, res) => {
  try {
    const circuits = await Circuit
      .find({ in_2026_calendar: true })
      .sort({ round: 1 })
    res.json(circuits)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/circuits/historical — non-calendar circuits
router.get('/historical', async (req, res) => {
  try {
    const circuits = await Circuit
      .find({ in_2026_calendar: false })
      .sort({ circuit: 1 })
    res.json(circuits)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/circuits/:name — single circuit
router.get('/:name', async (req, res) => {
  try {
    const circuit = await Circuit.findOne({ circuit: req.params.name })
    if (!circuit) return res.status(404).json({ error: 'Circuit not found' })
    res.json(circuit)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router