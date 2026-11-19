import ProgressBar from '../ui/ProgressBar'
import { circuitDNA } from '../../lib/tokens'

export default function CircuitDNA({ circuit, teamColor = '#E10600' }) {
  const dna = circuitDNA[circuit]

  if (!dna) return null

  const metrics = [
    { label: 'DOWNFORCE LEVEL',        value: dna.downforce,        max: 10 },
    { label: 'OVERTAKING',             value: dna.overtaking,       max: 10 },
    { label: 'TYRE DEGRADATION',       value: dna.tyreDeg,          max: 10 },
    { label: 'QUALIFYING IMPORTANCE',  value: dna.qualiImportance,  max: 10 },
    { label: 'SAFETY CAR PROBABILITY', value: dna.safetyCarProb * 10, max: 10 },
  ]

  return (
    <div>
      <div className="eyebrow" style={{ color: '#555', marginBottom: 'var(--space-6)' }}>CIRCUIT DNA</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {metrics.map((m, i) => (
          <ProgressBar
            key={m.label}
            label={m.label}
            value={m.value}
            max={m.max}
            color={teamColor}
            delay={i * 120}
          />
        ))}
      </div>
      {dna.street && (
        <div style={{ marginTop: 'var(--space-5)' }}>
          <span className="mono" style={{
            fontSize: 10, color: '#E10600',
            background: 'rgba(225,6,0,0.1)',
            padding: '4px 10px', letterSpacing: '0.15em',
          }}>
            STREET CIRCUIT
          </span>
        </div>
      )}
    </div>
  )
}