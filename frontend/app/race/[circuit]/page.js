'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

import TrackMap          from '../../components/circuit/TrackMap'
import CircuitDNA        from '../../components/circuit/CircuitDNA'
import DriverCard        from '../../components/driver/DriverCard'
import DriverForm        from '../../components/driver/DriverForm'
import CompatibilityScore from '../../components/analytics/CompatibilityScore'
import PredictionPanel   from '../../components/analytics/PredictionPanel'
import SectionHeader     from '../../components/layout/SectionHeader'
import Badge             from '../../components/ui/Badge'
import { teamColors, countryFlags, driverAcronyms } from '../../lib/tokens'

function buildRadarData(driver) {
  return [
    { metric: 'AVG FINISH',  value: Math.round((1 - (driver.avg_finish - 1) / 19) * 100) },
    { metric: 'PODIUM RATE', value: Math.round(driver.podium_rate * 100) },
    { metric: 'WIN RATE',    value: Math.round(driver.win_rate * 100) },
    { metric: 'CONSISTENCY', value: Math.round((1 - (driver.avg_finish / 20)) * 100) },
    { metric: 'EXPERIENCE',  value: Math.min(Math.round((driver.races_at_circuit / 8) * 100), 100) },
  ]
}

export default function RacePage() {
  const { circuit } = useParams()
  const router = useRouter()
  const [scores, setScores]       = useState([])
  const [circuitInfo, setCircuitInfo] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)
  const [compareMode, setCompareMode] = useState(false)
  const [compareDrivers, setCompareDrivers] = useState([])
  const [drivers, setDrivers]     = useState([])

  const decodedCircuit = decodeURIComponent(circuit || '')

  useEffect(() => {
    if (!circuit) return
    setLoading(true)

    // Fetch headshots from OpenF1
    fetch('https://api.openf1.org/v1/drivers?session_key=latest')
      .then(r => r.json())
      .then(data => {
        const seen = {}
        for (const d of data) seen[d.driver_number] = d
        setDrivers(Object.values(seen))
      })
      .catch(() => {})

    Promise.all([
      fetch(`http://localhost:4000/api/scores/${decodedCircuit}`).then(r => r.json()),
      fetch(`http://localhost:4000/api/circuits/${decodedCircuit}`).then(r => r.json()),
    ]).then(([s, c]) => {
      setScores(s)
      setCircuitInfo(c)
      setSelected(s[0])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [circuit])

  function getHeadshot(driverName) {
    if (!drivers.length) return null
    const found = drivers.find(d =>
      d.full_name?.toLowerCase().includes(driverName.split(' ')[1]?.toLowerCase())
    )
    return found?.headshot_url || null
  }

  function toggleCompare(driver) {
    setCompareDrivers(prev => {
      const exists = prev.find(d => d.driver === driver.driver)
      if (exists) return prev.filter(d => d.driver !== driver.driver)
      if (prev.length >= 2) return [prev[1], driver]
      return [...prev, driver]
    })
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="display" style={{ fontSize: 48, color: '#E10600' }}>LOADING</div>
    </div>
  )

  const selectedColor = selected ? (teamColors[selected.team] || '#E10600') : '#E10600'
  const flag = countryFlags[circuitInfo?.country] || '🏁'

  return (
    <main style={{ minHeight: '100vh', background: '#080808', paddingBottom: 'var(--space-10)' }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--space-5) var(--space-7)',
        borderBottom: '1px solid #1a1a1a',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(16px)',
      }}>
        <button onClick={() => router.push('/')} style={{
          background: 'none', border: 'none', color: '#555', cursor: 'pointer',
          fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.1em',
        }}>← CALENDAR</button>

        <span className="display" style={{ fontSize: 18, letterSpacing: '0.15em' }}>PITWALL</span>

        <button onClick={() => { setCompareMode(m => !m); setCompareDrivers([]) }} style={{
          background: compareMode ? '#E10600' : 'transparent',
          border: `1px solid ${compareMode ? '#E10600' : '#333'}`,
          color: 'white', padding: 'var(--space-2) var(--space-5)',
          fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          {compareMode ? 'EXIT COMPARE' : 'COMPARE'}
        </button>
      </nav>

      {/* HERO — two column layout */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 0, minHeight: '80vh',
      }}>
        {/* Left: circuit info */}
        <div style={{

          padding: 'var(--space-9) var(--space-7)',
          borderRight: '1px solid #1a1a1a',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(225,6,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(225,6,0,0.02) 1px, transparent 1px)`,
            backgroundSize: '48px 48px', zIndex: 0,
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="eyebrow" style={{ color: '#E10600', marginBottom: 'var(--space-5)' }}>
              {flag} ROUND {circuitInfo?.round} · 2026
            </div>

            <h1 className="display" style={{
              fontSize: 'clamp(48px, 7vw, 96px)',
              lineHeight: 0.88, color: '#F5F5F5', marginBottom: 'var(--space-4)',
            }}>
              {decodedCircuit.toUpperCase()}
            </h1>

            <p style={{ color: '#555', fontSize: 13, marginBottom: 'var(--space-8)' }}>
              {circuitInfo?.full_name} · {circuitInfo?.country}
            </p>

            {circuitInfo?.date && (
              <div className="mono" style={{ fontSize: 12, color: '#E10600', marginBottom: 'var(--space-8)' }}>
                {new Date(circuitInfo.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            )}

            {/* Top driver callout */}
            {scores[0] && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--space-5)',
                borderLeft: `3px solid ${teamColors[scores[0].team] || '#E10600'}`,
                paddingLeft: 'var(--space-5)',
              }}>
                <div>
                  <div className="eyebrow" style={{ color: '#444', marginBottom: 4 }}>CIRCUIT SPECIALIST</div>
                  <div className="display" style={{
                    fontSize: 32,
                    color: teamColors[scores[0].team] || '#F5F5F5',
                  }}>
                    {scores[0].driver.toUpperCase()}
                  </div>
                </div>
                <div className="mono" style={{ fontSize: 28, color: '#E10600' }}>
                  {(scores[0].track_score * 10).toFixed(1)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: track map */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 'var(--space-9) var(--space-7)',
          background: '#0c0c0c',
        }}>
          <TrackMap circuit={decodedCircuit} teamColor={selectedColor} height={340} />
          <div className="eyebrow" style={{ color: '#333', marginTop: 'var(--space-5)' }}>
            {decodedCircuit.toUpperCase()} CIRCUIT LAYOUT
          </div>
        </div>
      </section>

      <div style={{ padding: '0 var(--space-7)' }}>

        {/* MAIN 3-COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0, marginTop: 0 }}>

          {/* LEFT: Leaderboard */}
          <div style={{ borderRight: '1px solid #1a1a1a' }}>
            <div style={{ padding: 'var(--space-9) var(--space-7) var(--space-6)' }}>
              <SectionHeader
                eyebrow="DRIVER × CIRCUIT"
                title="PERFORMANCE RANKING"
                subtitle={compareMode ? 'Click two drivers to compare' : 'Click any driver for full breakdown'}
              />
            </div>

            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '48px 52px 1fr auto',
              gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-7)',
              borderBottom: '1px solid #1a1a1a', borderTop: '1px solid #1a1a1a',
            }}>
              {['RNK', 'DRV', 'DRIVER', 'SCORE'].map(h => (
                <span key={h} className="eyebrow" style={{ color: '#333', fontSize: 10 }}>{h}</span>
              ))}
            </div>

            {scores.map((driver, i) => (
              <motion.div
                key={driver.driver}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <DriverCard
                  driver={driver}
                  rank={driver.rank}
                  isSelected={selected?.driver === driver.driver}
                  headshotUrl={getHeadshot(driver.driver)}
                  onClick={() => compareMode ? toggleCompare(driver) : setSelected(
                    selected?.driver === driver.driver ? null : driver
                  )}
                />
              </motion.div>
            ))}
          </div>

          {/* RIGHT: Detail panel */}
          <div style={{ padding: 'var(--space-8) var(--space-6)', position: 'sticky', top: 64, height: 'fit-content' }}>

            {!compareMode && selected && (
              <>
                {/* Driver detail */}
                <div style={{ marginBottom: 'var(--space-7)' }}>
                  <div className="eyebrow" style={{ color: teamColors[selected.team] || '#E10600', marginBottom: 'var(--space-2)' }}>
                    {selected.team?.toUpperCase()}
                  </div>
                  <div className="display" style={{ fontSize: 36, color: '#F5F5F5', marginBottom: 'var(--space-5)' }}>
                    {selected.driver.toUpperCase()}
                  </div>

                  {/* Quick stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                    {[
                      { label: 'RACES',   value: selected.races_at_circuit },
                      { label: 'AVG POS', value: `P${selected.avg_finish}` },
                      { label: 'WINS',    value: selected.wins },
                      { label: 'PODIUMS', value: selected.podiums },
                    ].map(s => (
                      <div key={s.label} style={{ background: '#111', padding: 'var(--space-3) var(--space-4)', borderRadius: 2 }}>
                        <div className="eyebrow" style={{ color: '#444', fontSize: 9, marginBottom: 4 }}>{s.label}</div>
                        <div className="mono" style={{
                          fontSize: 20,
                          color: s.label === 'WINS' && s.value > 0 ? '#E10600' :
                                 s.label === 'PODIUMS' && s.value > 0 ? teamColors[selected.team] : '#F5F5F5',
                        }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <DriverForm driver={selected.driver} />
                </div>

                <div className="divider" />

                {/* Radar */}
                <div style={{ marginBottom: 'var(--space-7)' }}>
                  <div className="eyebrow" style={{ color: '#333', marginBottom: 'var(--space-4)' }}>PERFORMANCE RADAR</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={buildRadarData(selected)}>
                      <PolarGrid stroke="#1a1a1a" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#444', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                      <Radar dataKey="value"
                        stroke={selectedColor} fill={selectedColor} fillOpacity={0.15} />
                      <Tooltip contentStyle={{ background: '#111', border: 'none', fontSize: 11 }} formatter={v => [`${v}%`]} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="divider" />
                <CompatibilityScore driver={selected} teamColor={selectedColor} />
              </>
            )}

            {compareMode && compareDrivers.length === 2 && (
              <div>
                <div className="eyebrow" style={{ color: '#E10600', marginBottom: 'var(--space-5)' }}>HEAD TO HEAD</div>
                {compareDrivers.map(d => (
                  <div key={d.driver} style={{ marginBottom: 'var(--space-7)' }}>
                    <div className="display" style={{ fontSize: 22, color: teamColors[d.team] || '#F5F5F5', marginBottom: 'var(--space-4)' }}>
                      {d.driver.split(' ').pop().toUpperCase()}
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <RadarChart data={buildRadarData(d)}>
                        <PolarGrid stroke="#1a1a1a" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#333', fontSize: 8, fontFamily: 'JetBrains Mono' }} />
                        <Radar dataKey="value" stroke={teamColors[d.team] || '#E10600'} fill={teamColors[d.team] || '#E10600'} fillOpacity={0.15} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM SECTIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: '1px solid #1a1a1a' }}>

          {/* Circuit DNA */}
          <div style={{ padding: 'var(--space-9) var(--space-7)', borderRight: '1px solid #1a1a1a' }}>
            <SectionHeader eyebrow="CIRCUIT" title="TRACK DNA" />
            <CircuitDNA circuit={decodedCircuit} teamColor={selectedColor} />
          </div>

          {/* Prediction */}
          <div style={{ padding: 'var(--space-9) var(--space-7)' }}>
            <SectionHeader eyebrow="INTELLIGENCE" title="PITWALL PREDICTS" />
            <PredictionPanel scores={scores} />
          </div>

        </div>

      </div>
    </main>
  )
}