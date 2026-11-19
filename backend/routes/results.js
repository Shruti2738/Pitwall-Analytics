const express = require('express')
const router = express.Router()
const RaceResult = require('../models/RaceResult')

// GET /api/results/:circuit
// Returns all historical race results at a circuit
router.get('/:circuit', async (req, res) => {
  try {
    const results = await RaceResult
      .find({ circuit: req.params.circuit })
      .sort({ year: -1, position: 1 })

    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/results/:circuit/:driver
// Returns a specific driver's results at a circuit
router.get('/:circuit/:driver', async (req, res) => {
  try {
    const results = await RaceResult
      .find({
        circuit: req.params.circuit,
        driver: decodeURIComponent(req.params.driver)
      })
      .sort({ year: 1 })

    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/results/form/:driver — last 5 race results
router.get('/form/:driver', async (req, res) => {
  try {
    const results = await RaceResult
      .find({ driver: decodeURIComponent(req.params.driver) })
      .sort({ year: -1, date: -1 })
      .limit(5)
    res.json(results.reverse())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router