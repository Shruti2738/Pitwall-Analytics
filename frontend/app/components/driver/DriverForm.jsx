'use client'
import { useEffect, useState } from 'react'

const positionColor = (p) => {
  if (p === 1) return '#FFD700'
  if (p <= 3) return '#E10600'
  if (p <= 10) return '#888'
  return '#444'
}

export default function DriverForm({ driver }) {
  const [form, setForm] = useState([])

  useEffect(() => {
    if (!driver) return
    fetch(`http://localhost:4000/api/results/form/${encodeURIComponent(driver)}`)
      .then(r => r.json())
      .then(setForm)
      .catch(() => {})
  }, [driver])

  if (!form.length) return null

  return (
    <div>
      <div className="eyebrow" style={{ color: '#555', marginBottom: 'var(--space-3)' }}>LAST 5 RACES</div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
        {form.slice(-5).map((race, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              width: 32, height: 32,
              background: positionColor(race.position),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 2,
            }}>
              <span className="mono" style={{ fontSize: 12, color: '#080808', fontWeight: 600 }}>
                P{race.position}
              </span>
            </div>
            <div style={{ fontSize: 9, color: '#444', marginTop: 4, fontFamily: 'JetBrains Mono' }}>
              {race.circuit?.slice(0, 3).toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}