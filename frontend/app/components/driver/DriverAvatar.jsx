'use client'
import { useState } from 'react'

export default function DriverAvatar({ headshotUrl, acronym, size = 48, teamColor = '#E10600' }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      border: `2px solid ${teamColor}`,
      background: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {headshotUrl && !imgError ? (
        <img
          src={headshotUrl}
          alt={acronym}
          width={size}
          height={size}
          style={{ objectFit: 'cover', objectPosition: 'top' }}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="mono" style={{ fontSize: size * 0.28, color: teamColor, fontWeight: 600 }}>
          {acronym || '?'}
        </span>
      )}
    </div>
  )
}