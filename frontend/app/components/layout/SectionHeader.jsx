export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div style={{ marginBottom: 'var(--space-8)' }}>
      {eyebrow && (
        <span className="eyebrow" style={{ color: '#E10600', display: 'block', marginBottom: 'var(--space-3)' }}>
          {eyebrow}
        </span>
      )}
      <span className="red-bar" />
      <h2 className="display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F5F5', lineHeight: 0.95 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: '#666', marginTop: 'var(--space-3)', fontSize: 14 }}>{subtitle}</p>
      )}
    </div>
  )
}