'use client'
import { useEffect, useState } from 'react'
import AnimatedNumber from '../ui/AnimatedNumber'

function computeCompatibility(driver) {
  if (!driver) return 0
  const score = (
    0.35 * driver.track_score +
    0.25 * driver.podium_rate +
    0.20 * driver.win_rate * 10 +
    0.20 * (1 - driver.dnf_rate || 1)
  )
  return Math.min(Math.round(score * 100), 99)
}

export default function CompatibilityScore({ driver, teamColor = '#E10600' }) {
  const score = computeCompatibility(driver)
  const confidence = score >= 80 ? 'HIGH' : score >= 60 ? 'MEDIUM' : 'LOW'
  const confColor = score >= 80 ? '#52E252' : score >= 60 ? '#FF8000' : '#888'

  if (!driver) return null

  return (
    <div style={{
      padding: 'var(--space-7)',
      background: '#1a1a1a',
      borderLeft: `4px solid ${teamColor}`,
    }}>
      <div className="eyebrow" style={{ color: teamColor, marginBottom: 'var(--space-4)' }}>
        CIRCUIT COMPATIBILITY
      </div>

      <div className="display" style={{ fontSize: 80, lineHeight: 0.9, color: '#F5F5F5', marginBottom: 'var(--space-4)' }}>
        <AnimatedNumber value={score} />%
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <div className="display" style={{ fontSize: 24, color: teamColor }}>
          {driver.driver.toUpperCase()}
        </div>
        <span className="mono" style={{
          fontSize: 10, color: confColor,
          background: `${confColor}18`, padding: '3px 8px',
        }}>
          {confidence} CONFIDENCE
        </span>
      </div>

      {/* Reasons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {driver.wins > 0 && (
          <div className="mono" style={{ fontSize: 12, color: '#888' }}>
            <span style={{ color: teamColor }}>+</span> {driver.wins} win{driver.wins > 1 ? 's' : ''} at this circuit
          </div>
        )}
        {driver.podium_rate > 0.4 && (
          <div className="mono" style={{ fontSize: 12, color: '#888' }}>
            <span style={{ color: teamColor }}>+</span> High podium conversion rate
          </div>
        )}
        {driver.avg_finish <= 5 && (
          <div className="mono" style={{ fontSize: 12, color: '#888' }}>
            <span style={{ color: teamColor }}>+</span> Strong average finishing position
          </div>
        )}
        {(driver.dnf_rate || 0) < 0.1 && (
          <div className="mono" style={{ fontSize: 12, color: '#888' }}>
            <span style={{ color: teamColor }}>+</span> Exceptional reliability here
          </div>
        )}
      </div>
    </div>
  )
}