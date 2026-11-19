'use client'
import { useEffect, useRef, useState } from 'react'

export default function AnimatedNumber({ value, duration = 1000, decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const start = performance.now()
    const from = 0
    const to = parseFloat(value)

    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay((from + (to - from) * eased).toFixed(decimals))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, duration, decimals])

  return <span>{display}</span>
}