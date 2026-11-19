export default function Badge({ label, color = '#E10600', size = 'sm' }) {
  const sizes = { sm: { fontSize: 10, padding: '3px 8px' }, md: { fontSize: 12, padding: '5px 12px' } }
  const s = sizes[size]
  return (
    <span className="mono" style={{
      fontSize: s.fontSize,
      padding: s.padding,
      letterSpacing: '0.12em',
      color,
      background: `${color}18`,
      border: `1px solid ${color}33`,
      borderRadius: 2,
    }}>
      {label}
    </span>
  )
}