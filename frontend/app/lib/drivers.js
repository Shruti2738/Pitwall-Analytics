let driverCache = null

export async function fetchDrivers(sessionKey = 'latest') {
  if (driverCache) return driverCache
  const res = await fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`)
  const data = await res.json()
  // Deduplicate by driver number, keep most recent
  const seen = {}
  for (const d of data) {
    seen[d.driver_number] = d
  }
  driverCache = Object.values(seen)
  return driverCache
}

export function getDriverByName(drivers, fullName) {
  const normalized = fullName.toLowerCase()
  return drivers.find(d =>
    d.full_name?.toLowerCase() === normalized ||
    d.broadcast_name?.toLowerCase().includes(normalized.split(' ')[1]?.toLowerCase())
  )
}