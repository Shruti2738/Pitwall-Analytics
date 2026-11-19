'use client'
import { useState } from 'react'
import DriverAvatar from './DriverAvatar'
import AnimatedNumber from '../ui/AnimatedNumber'
import { teamColors, driverAcronyms } from '../../lib/tokens'

export default function DriverCard({ driver, rank, onClick, isSelected, headshotUrl }) {
  const [hovered, setHovered] = useState(false)
  const color = teamColors[driver.team] || '#888'
  const acronym = driverAcronyms[driver.driver] || driver.driver.split(' ').pop().slice(0, 3).toUpperCase()

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '48px 52px 1fr auto',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-5) var(--space-6)',
        borderBottom: '1px solid #111',
        borderLeft: isSelected ? `3px solid ${color}` : hovered ? `3px solid ${color}44` : '3px solid transparent',
        background: isSelected ? '#1a1a1a' : hovered ? '#111' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Rank */}
      <span className="mono" style={{
        fontSize: 13,
        color: rank <= 3 ? '#E10600' : '#444',
        fontWeight: rank <= 3 ? 600 : 400,
      }}>
        {String(rank).padStart(2, '0')}
      </span>

      {/* Avatar */}
      <DriverAvatar headshotUrl={headshotUrl} acronym={acronym} size={40} teamColor={color} />

      {/* Name + team */}
      <div>
        <div className="display" style={{
          fontSize: 20,
          color: isSelected || hovered ? color : '#F5F5F5',
          letterSpacing: '0.03em',
          transition: 'color 0.15s',
        }}>
          {driver.driver.toUpperCase()}
        </div>
        <div className="mono" style={{ fontSize: 10, color: '#444', marginTop: 2 }}>
          {driver.team?.toUpperCase()}
        </div>
      </div>

      {/* Score */}
      <div style={{ textAlign: 'right' }}>
        <div className="mono" style={{ fontSize: 20, color, fontWeight: 600 }}>
          <AnimatedNumber value={driver.track_score * 10} decimals={1} />
        </div>
        <div style={{
          width: 60, height: 2,
          background: `linear-gradient(to right, ${color}, transparent)`,
          marginLeft: 'auto', marginTop: 4,
        }} />
      </div>
    </div>
  )
}