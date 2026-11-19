'use client'
import { useEffect, useRef, useState } from 'react'
import { trackFiles } from '../../lib/tokens'

export default function TrackMap({ circuit, teamColor = '#E10600', height = 280 }) {
  const containerRef = useRef(null)
  const [svgContent, setSvgContent] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const filename = trackFiles[circuit]

  useEffect(() => {
    if (!filename) return
    setLoaded(false)
    setSvgContent(null)

    fetch(`/tracks/${filename}.svg`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.text() })
      .then(text => {
        // Clean the SVG and inject our styling
        const cleaned = text
          .replace(/width="[^"]*"/, 'width="100%"')
          .replace(/height="[^"]*"/, `height="${height}"`)
          .replace(/stroke="[^"]*"/g, `stroke="${teamColor}"`)
          .replace(/fill="[^"]*"/g, 'fill="none"')
          .replace(/<style>[\s\S]*?<\/style>/g, '')
        setSvgContent(cleaned)
        setLoaded(true)
      })
      .catch(() => setSvgContent(null))
  }, [filename, teamColor, height])

  // Draw animation after SVG mounts
  useEffect(() => {
    if (!loaded || !containerRef.current) return

    setTimeout(() => {
      const paths = containerRef.current.querySelectorAll('path')
      paths.forEach((path, i) => {
        try {
          const length = path.getTotalLength()
          path.style.strokeDasharray = length
          path.style.strokeDashoffset = length
          path.style.stroke = teamColor
          path.style.strokeWidth = '5'
          path.style.fill = 'none'
          path.style.filter = `drop-shadow(0 0 6px ${teamColor}80)`
          path.style.transition = `stroke-dashoffset 2.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.1}s`

          requestAnimationFrame(() => {
            setTimeout(() => { path.style.strokeDashoffset = '0' }, 50)
          })
        } catch (e) {}
      })
    }, 100)
  }, [loaded, teamColor])

  if (!filename || !svgContent) {
    return (
      <div style={{
        height,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid #1a1a1a', color: '#333',
      }}>
        <span className="mono" style={{ fontSize: 11 }}>TRACK MAP UNAVAILABLE</span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height, overflow: 'hidden' }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}