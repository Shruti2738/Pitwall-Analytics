'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'

const countryFlags = {
  'Bahrain':      '🇧🇭', 'Saudi Arabia': '🇸🇦', 'Australia':   '🇦🇺',
  'Japan':        '🇯🇵', 'China':        '🇨🇳', 'USA':         '🇺🇸',
  'Italy':        '🇮🇹', 'Monaco':       '🇲🇨', 'Spain':       '🇪🇸',
  'Canada':       '🇨🇦', 'Austria':      '🇦🇹', 'UK':          '🇬🇧',
  'Hungary':      '🇭🇺', 'Belgium':      '🇧🇪', 'Netherlands': '🇳🇱',
  'Azerbaijan':   '🇦🇿', 'Singapore':    '🇸🇬', 'Mexico':      '🇲🇽',
  'Brazil':       '🇧🇷', 'Qatar':        '🇶🇦', 'UAE':         '🇦🇪',
}

const statusConfig = {
  completed: { label: 'DONE',     color: '#555',    bg: 'rgba(255,255,255,0.05)' },
  next:      { label: 'NEXT UP',  color: '#E10600', bg: 'rgba(225,6,0,0.12)'    },
  upcoming:  { label: 'UPCOMING', color: '#888',    bg: 'transparent'            },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function Home() {
  const router = useRouter()
  const [circuits, setCircuits]         = useState([])
  const [historical, setHistorical]     = useState([])
  const [loading, setLoading]           = useState(true)
  const [showHistorical, setShowHistorical] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:4000/api/circuits').then(r => r.json()),
      fetch('http://localhost:4000/api/circuits/historical').then(r => r.json()),
    ]).then(([cal, hist]) => {
      setCircuits(cal)
      setHistorical(hist)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!titleRef.current) return
    titleRef.current.style.opacity = '0'
    titleRef.current.style.transform = 'translateY(40px)'
    setTimeout(() => {
      titleRef.current.style.transition = 'all 0.9s cubic-bezier(0.16,1,0.3,1)'
      titleRef.current.style.opacity = '1'
      titleRef.current.style.transform = 'translateY(0)'
    }, 100)
  }, [])

  const nextRace = circuits.find(c => c.status === 'next')
  const completedCount = circuits.filter(c => c.status === 'completed').length

  return (
    <main style={{ minHeight: '100vh', background: '#080808' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid #1a1a1a',
        background: 'rgba(8,8,8,0.9)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E10600' }} />
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: '0.15em', color: '#F5F5F5' }}>
            PITWALL
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#555' }}>
            2026 SEASON
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#E10600' }}>
            R{completedCount} / 24
          </span>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 48px', paddingTop: 100,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(225,6,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(225,6,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
        <div style={{
          position: 'absolute', top: '10%', right: '-5%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(225,6,0,0.08) 0%, transparent 70%)',
          zIndex: 0, pointerEvents: 'none',
        }} />

        <div style={{
          backgroundImage: 'url(/backgrounds/hero-wave.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          position: 'absolute', inset: 0, opacity: 0.3, zIndex: 0,
        }} />

        <div ref={titleRef} style={{ position: 'relative', zIndex: 1, maxWidth: 900 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 2, background: '#E10600' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#E10600', letterSpacing: '0.2em' }}>
              F1 PRE-RACE INTELLIGENCE · 2026
            </span>
          </div>

          <motion.h1
            className="display"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(64px, 12vw, 140px)',
              lineHeight: 0.9, color: '#F5F5F5', marginBottom: 32,
            }}
          >
            KNOW THE<br />
            <span style={{ color: '#E10600' }}>CIRCUIT.</span><br />
            KNOW THE<br />DRIVER.
          </motion.h1>

          <p style={{
            fontSize: 18, color: '#888', maxWidth: 520,
            lineHeight: 1.7, marginBottom: 48, fontWeight: 300,
          }}>
            Historical driver performance at every circuit on the 2026 calendar.
            Track scores, podium rates, avg finishing positions — all in one place.
          </p>

          <button
            onClick={() => document.getElementById('calendar').scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: '#E10600', color: 'white', border: 'none',
              padding: '18px 48px', fontSize: 14,
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.target.style.background = '#ff1a00'}
            onMouseLeave={e => e.target.style.background = '#E10600'}
          >
            VIEW RACE GUIDE →
          </button>
        </div>

        {/* Next race callout */}
        {nextRace && (
          <div style={{
            position: 'absolute', bottom: 48, right: 48, zIndex: 1,
            textAlign: 'right',
            padding: '20px 24px',
            background: 'rgba(225,6,0,0.08)',
            borderRight: '3px solid #E10600',
          }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#E10600', marginBottom: 8, letterSpacing: '0.15em' }}>
              ⬤ NEXT RACE
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#F5F5F5' }}>
              {countryFlags[nextRace.country] || '🏁'} {nextRace.country.toUpperCase()} GP
            </div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
              {nextRace.full_name}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#E10600', marginTop: 8 }}>
              {formatDate(nextRace.date)} · ROUND {nextRace.round}
            </div>
          </div>
        )}

        <div style={{ position: 'absolute', bottom: 48, left: 48 }}>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, #E10600, transparent)', marginBottom: 8 }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#555', letterSpacing: '0.1em' }}>
            SCROLL
          </span>
        </div>
      </section>

      {/* 2026 CALENDAR */}
      <section id="calendar" style={{ padding: '100px 48px' }}>
        <div style={{ marginBottom: 64 }}>
          <div style={{ width: 40, height: 3, background: '#E10600', marginBottom: 12 }} />
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 56, color: '#F5F5F5' }}>
            2026 SEASON CALENDAR
          </h2>
          <p style={{ color: '#888', marginTop: 8 }}>
            {completedCount} of 24 races completed · Select any circuit for full analytics
          </p>
        </div>

        {loading && (
          <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#555', fontSize: 14 }}>
            LOADING CIRCUITS...
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
          {circuits.map((circuit) => {
            const sc = statusConfig[circuit.status] || statusConfig.upcoming
            const isNext = circuit.status === 'next'

            return (
              <div
                key={circuit.circuit}
                onClick={() => router.push(`/race/${circuit.circuit}`)}
                style={{
                  background: isNext ? 'rgba(225,6,0,0.06)' : '#1a1a1a',
                  padding: '28px 32px',
                  cursor: 'pointer',
                  borderLeft: `3px solid ${isNext ? '#E10600' : 'transparent'}`,
                  transition: 'all 0.2s',
                  position: 'relative',
                  opacity: circuit.status === 'completed' ? 0.6 : 1,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderLeftColor = '#E10600'
                  e.currentTarget.style.background = isNext ? 'rgba(225,6,0,0.1)' : '#222'
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderLeftColor = isNext ? '#E10600' : 'transparent'
                  e.currentTarget.style.background = isNext ? 'rgba(225,6,0,0.06)' : '#1a1a1a'
                  e.currentTarget.style.opacity = circuit.status === 'completed' ? '0.6' : '1'
                }}
              >
                {/* Round + status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#555' }}>
                    R{String(circuit.round).padStart(2, '0')}
                  </span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    color: sc.color, letterSpacing: '0.1em',
                    background: isNext ? 'rgba(225,6,0,0.15)' : 'transparent',
                    padding: isNext ? '3px 8px' : '0',
                  }}>
                    {sc.label}
                  </span>
                </div>

                <div style={{ fontSize: 28, marginBottom: 8 }}>
                  {countryFlags[circuit.country] || '🏁'}
                </div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: '#F5F5F5', marginBottom: 4 }}>
                  {circuit.country.toUpperCase()} GP
                </div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>
                  {circuit.full_name}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#555' }}>
                  {formatDate(circuit.date)}
                </div>

                <div style={{
                  marginTop: 20, fontSize: 12, color: '#E10600',
                  fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em',
                }}>
                  ANALYSE →
                </div>
              </div>
            )
          })}
        </div>

        {/* HISTORICAL CIRCUITS SECTION */}
        <div style={{ marginTop: 80 }}>
          <button
            onClick={() => setShowHistorical(h => !h)}
            style={{
              background: 'none', border: '1px solid #2a2a2a',
              color: '#888', padding: '12px 24px', cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              letterSpacing: '0.1em', marginBottom: 32,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#E10600'; e.target.style.color = '#E10600' }}
            onMouseLeave={e => { e.target.style.borderColor = '#2a2a2a'; e.target.style.color = '#888' }}
          >
            {showHistorical ? '▲ HIDE' : '▼ SHOW'} HISTORICAL CIRCUITS ({historical.length})
          </button>

          {showHistorical && historical.length > 0 && (
            <>
              <div style={{ marginBottom: 32 }}>
                <div style={{ width: 40, height: 3, background: '#333', marginBottom: 12 }} />
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#555' }}>
                  HISTORICAL CIRCUITS
                </h3>
                <p style={{ color: '#444', fontSize: 13, marginTop: 4 }}>
                  Not on the 2026 calendar — historical data still available
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
                {historical.map(circuit => (
                  <div
                    key={circuit.circuit}
                    onClick={() => router.push(`/race/${circuit.circuit}`)}
                    style={{
                      background: '#111', padding: '28px 32px',
                      cursor: 'pointer', opacity: 0.5,
                      borderLeft: '3px solid transparent',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderLeftColor = '#555'
                      e.currentTarget.style.opacity = '0.8'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderLeftColor = 'transparent'
                      e.currentTarget.style.opacity = '0.5'
                    }}
                  >
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#555', marginBottom: 4 }}>
                      {circuit.country.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 12, color: '#333', marginBottom: 16 }}>
                      {circuit.full_name}
                    </div>
                    <div style={{ fontSize: 11, color: '#555', fontFamily: 'JetBrains Mono, monospace' }}>
                      VIEW HISTORY →
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #1a1a1a', padding: '32px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: '#333' }}>
          PITWALL ANALYTICS
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#333' }}>
          DATA: OPENF1 · 2023–2026
        </span>
      </footer>

    </main>
  )
}