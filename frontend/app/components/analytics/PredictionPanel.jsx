'use client'
import { useEffect, useState } from 'react'
import AnimatedNumber from '../ui/AnimatedNumber'
import { teamColors } from '../../lib/tokens'

function computePredictions(scores) {
  if (!scores?.length) return []

  const total = scores.reduce((sum, d) => sum + d.track_score, 0)

  return scores.slice(0, 5).map(driver => {
    const winProb = Math.round((driver.track_score / total) * 100 * 1.8)
    const podiumProb = Math.min(Math.round(winProb * 2.2), 95)
    return {
      ...driver,
      winProb: Math.min(winProb, 60),
      podiumProb,
    }
  })
}

export default function PredictionPanel({ scores }) {
  const predictions = computePredictions(scores)
  const medals = ['🥇', '🥈', '🥉', '④', '⑤']

  return (
    <div>
      <div className="eyebrow" style={{ color: '#555', marginBottom: 'var(--space-3)' }}>
        PITWALL PREDICTS
      </div>
      <div className="red-bar" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {predictions.map((d, i) => {
          const color = teamColors[d.team] || '#888'
          return (
            <div key={d.driver} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 80px 60px', alignItems: 'center', gap: 'var(--space-4)' }}>
              <span style={{ fontSize: 16 }}>{medals[i]}</span>

              <div>
                <div className="display" style={{ fontSize: 18, color }}>{d.driver.split(' ').pop().toUpperCase()}</div>
              </div>

              {/* Win prob bar */}
              <div>
                <div style={{ height: 2, background: '#1a1a1a', borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: color,
                    width: `${d.winProb}%`,
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>

              <div className="mono" style={{ fontSize: 13, color, textAlign: 'right' }}>
                <AnimatedNumber value={d.winProb} />%
              </div>
            </div>
          )
        })}
      </div>

      <div className="mono" style={{ fontSize: 10, color: '#333', marginTop: 'var(--space-5)' }}>
        * BASED ON HISTORICAL TRACK PERFORMANCE + RECENT FORM
      </div>
    </div>
  )
}