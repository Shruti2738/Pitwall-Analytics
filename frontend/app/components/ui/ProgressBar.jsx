'use client'
import { useEffect, useState } from 'react'

export default function ProgressBar({ value, max = 10, color = '#E10600', label, showValue = true, delay = 0 }) {
  const [width, setWidth] = useState(0)
  const pct = (value / max) * 100

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay)
    return () => clearTimeout(t)
  }, [pct, delay])

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span className="eyebrow" style={{ color: '#666', fontSize: 10 }}>{label}</span>
          {showValue && (
            <span className="mono" style={{ fontSize: 12, color }}>{value.toFixed(1)}</span>
          )}
        </div>
      )}
      <div style={{ height: 3, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: color,
          borderRadius: 2,
          transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>
    </div>
  )
}