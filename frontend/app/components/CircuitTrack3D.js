'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const CIRCUIT_CSV_MAP = {
  'Monza':             '/tracks/Monza.csv',
  'Silverstone':       '/tracks/Silverstone.csv',
  'Spa-Francorchamps': '/tracks/Spa.csv',
  'Melbourne':         '/tracks/Melbourne.csv',
  'Suzuka':            '/tracks/Suzuka.csv',
  'Sakhir':            '/tracks/Sakhir.csv',
  'Shanghai':          '/tracks/Shanghai.csv',
  'Catalunya':         '/tracks/Catalunya.csv',
  'Montreal':          '/tracks/Montreal.csv',
  'Spielberg':         '/tracks/Spielberg.csv',
  'Hungaroring':       '/tracks/Budapest.csv',
  'Interlagos':        '/tracks/SaoPaulo.csv',
  'Austin':            '/tracks/Austin.csv',
  'Mexico City':       '/tracks/MexicoCity.csv',
  'Yas Marina Circuit':'/tracks/YasMarina.csv',
  'Zandvoort':         '/tracks/Zandvoort.csv',
}

const FALLBACK_PATHS = {
  'Monaco': [
    [0.52,0.00],[0.65,0.02],[0.80,0.08],[0.92,0.18],[1.00,0.30],[0.98,0.42],
    [0.90,0.48],[0.78,0.45],[0.68,0.38],[0.60,0.42],[0.55,0.52],[0.58,0.62],
    [0.65,0.70],[0.70,0.80],[0.65,0.90],[0.55,0.98],[0.42,1.00],[0.28,0.96],
    [0.15,0.88],[0.05,0.76],[0.00,0.62],[0.02,0.48],[0.10,0.36],[0.20,0.26],
    [0.30,0.18],[0.40,0.10],[0.52,0.00],
  ],
  'Jeddah': [
    [0.50,0.00],[0.70,0.02],[0.85,0.08],[0.95,0.18],[1.00,0.30],[0.98,0.44],
    [0.92,0.55],[0.85,0.62],[0.88,0.70],[0.95,0.76],[1.00,0.84],[0.95,0.92],
    [0.82,0.98],[0.65,1.00],[0.48,0.98],[0.35,0.90],[0.25,0.80],[0.15,0.70],
    [0.05,0.60],[0.00,0.48],[0.02,0.35],[0.08,0.22],[0.18,0.12],[0.32,0.05],[0.50,0.00],
  ],
  'Singapore': [
    [0.40,0.00],[0.60,0.00],[0.78,0.05],[0.90,0.14],[0.98,0.26],[1.00,0.40],
    [0.95,0.52],[0.85,0.58],[0.75,0.55],[0.65,0.62],[0.60,0.72],[0.62,0.82],
    [0.68,0.90],[0.65,0.98],[0.50,1.00],[0.35,0.96],[0.22,0.88],[0.12,0.76],
    [0.05,0.62],[0.00,0.48],[0.05,0.34],[0.14,0.20],[0.26,0.10],[0.40,0.00],
  ],
  'Baku': [
    [0.50,0.00],[0.75,0.00],[0.92,0.05],[1.00,0.15],[1.00,0.30],[0.95,0.42],
    [0.88,0.48],[0.80,0.46],[0.72,0.50],[0.68,0.60],[0.70,0.70],[0.76,0.78],
    [0.80,0.86],[0.78,0.94],[0.68,1.00],[0.50,1.00],[0.32,1.00],[0.20,0.95],
    [0.10,0.86],[0.04,0.74],[0.00,0.60],[0.02,0.44],[0.08,0.30],[0.18,0.18],
    [0.30,0.08],[0.50,0.00],
  ],
  'Las Vegas': [
    [0.10,0.10],[0.90,0.10],[0.95,0.15],[0.95,0.85],[0.90,0.90],
    [0.10,0.90],[0.05,0.85],[0.05,0.55],[0.12,0.50],[0.05,0.45],
    [0.05,0.15],[0.10,0.10],
  ],
  'Miami': [
    [0.30,0.05],[0.65,0.05],[0.80,0.12],[0.88,0.24],[0.92,0.38],[0.88,0.52],
    [0.78,0.60],[0.65,0.62],[0.55,0.58],[0.45,0.60],[0.38,0.70],[0.40,0.80],
    [0.48,0.88],[0.50,0.96],[0.40,1.00],[0.25,0.98],[0.12,0.90],[0.04,0.78],
    [0.00,0.62],[0.02,0.46],[0.10,0.32],[0.18,0.20],[0.30,0.05],
  ],
  'Lusail': [
    [0.50,0.00],[0.72,0.04],[0.88,0.14],[0.98,0.28],[1.00,0.44],[0.94,0.58],
    [0.82,0.66],[0.68,0.68],[0.56,0.62],[0.46,0.64],[0.38,0.74],[0.36,0.86],
    [0.42,0.96],[0.50,1.00],[0.58,0.96],[0.62,0.86],[0.58,0.76],[0.46,0.72],
    [0.34,0.68],[0.20,0.60],[0.08,0.48],[0.02,0.34],[0.04,0.20],[0.14,0.08],[0.50,0.00],
  ],
  'Imola': [
    [0.50,0.00],[0.70,0.04],[0.84,0.14],[0.92,0.28],[0.90,0.42],[0.80,0.50],
    [0.68,0.52],[0.60,0.60],[0.62,0.72],[0.70,0.80],[0.72,0.90],[0.64,0.98],
    [0.50,1.00],[0.36,0.96],[0.26,0.86],[0.22,0.72],[0.28,0.60],[0.38,0.52],
    [0.30,0.42],[0.18,0.34],[0.08,0.22],[0.06,0.10],[0.18,0.02],[0.50,0.00],
  ],
}

function parseCSV(text) {
  return text.trim().split('\n')
    .filter(line => line && !line.startsWith('#') && !line.startsWith('x') && !line.startsWith('X'))
    .map(line => {
      const parts = line.trim().split(',')
      return [parseFloat(parts[0]), parseFloat(parts[1])]
    })
    .filter(([x, y]) => !isNaN(x) && !isNaN(y))
}

function normalizePoints(rawPoints) {
  const xs = rawPoints.map(p => p[0])
  const ys = rawPoints.map(p => p[1])
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const range = Math.max(maxX - minX, maxY - minY)
  const offX = ((maxX - minX) / range) / 2
  const offY = ((maxY - minY) / range) / 2
  return rawPoints.map(([x, y]) => [
    (x - minX) / range - offX + 0.5,
    (y - minY) / range - offY + 0.5,
  ])
}

export default function CircuitTrack3D({ circuitName, teamColor = '#E10600' }) {
  const wrapperRef = useRef(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    // Wait one frame so the DOM has laid out and offsetWidth/Height are real
    let frameId
    let cleanupFn

    const raf = requestAnimationFrame(async () => {
      const W = wrapper.offsetWidth
      const H = wrapper.offsetHeight
      if (W === 0 || H === 0) return

      const name = decodeURIComponent(circuitName)
      let points2d = null

      for (const [key, path] of Object.entries(CIRCUIT_CSV_MAP)) {
        if (name.toLowerCase().includes(key.toLowerCase()) ||
            key.toLowerCase().includes(name.toLowerCase())) {
          try {
            const res = await fetch(path)
            if (res.ok) {
              const raw = parseCSV(await res.text())
              if (raw.length > 20) { points2d = normalizePoints(raw); break }
            }
          } catch (e) {}
        }
      }

      if (!points2d) {
        for (const [key, pts] of Object.entries(FALLBACK_PATHS)) {
          if (name.toLowerCase().includes(key.toLowerCase()) ||
              key.toLowerCase().includes(name.toLowerCase())) {
            points2d = pts; break
          }
        }
      }

      if (!points2d) {
        points2d = Array.from({ length: 60 }, (_, i) => {
          const t = (i / 60) * Math.PI * 2
          return [0.5 + 0.42 * Math.cos(t), 0.5 + 0.28 * Math.sin(t)]
        })
      }

      // Scene setup
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100)
      camera.position.set(0, 5.5, 0.8)
      camera.lookAt(0, 0, 0)

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      wrapper.appendChild(renderer.domElement)

      const scale = 2.4
      const path3d = points2d.map(([x, y]) =>
        new THREE.Vector3((x - 0.5) * scale, 0, (y - 0.5) * scale)
      )
      const curve = new THREE.CatmullRomCurve3(path3d, true, 'catmullrom', 0.4)

      const kerbMesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 400, 0.065, 8, true),
        new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 1 })
      )
      const trackMesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 400, 0.050, 8, true),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
      )
      const glowMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(teamColor),
        emissive: new THREE.Color(teamColor),
        emissiveIntensity: 1.8,
        roughness: 0.2, metalness: 0.8,
      })
      const glowMesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 400, 0.013, 6, true),
        glowMat
      )
      glowMesh.position.y = 0.055

      const grid = new THREE.GridHelper(8, 24, 0x161616, 0x0f0f0f)
      grid.position.y = -0.06

      const pivot = new THREE.Group()
      pivot.add(kerbMesh, trackMesh, glowMesh, grid)
      pivot.rotation.x = 0.12   // slight tilt so it reads as 3D
      pivot.rotation.y = 0.0
      scene.add(pivot)

      scene.add(new THREE.AmbientLight(0xffffff, 0.6))
      const key = new THREE.DirectionalLight(0xffffff, 1.2)
      key.position.set(3, 6, 3)
      scene.add(key)
      const glowLight = new THREE.PointLight(new THREE.Color(teamColor), 3, 8)
      glowLight.position.set(0, 2, 0)
      scene.add(glowLight)

      setStatus('ready')

      // Horizontal-only spin on drag/touch
      let dragging = false
      let prevX = 0
      let rotY = 0

      const onMouseDown = e => { dragging = true; prevX = e.clientX }
      const onMouseUp   = () => { dragging = false }
      const onMouseMove = e => {
        if (!dragging) return
        rotY += (e.clientX - prevX) * 0.007
        prevX = e.clientX
        pivot.rotation.y = rotY
      }
      const onTouchStart = e => { dragging = true; prevX = e.touches[0].clientX }
      const onTouchEnd   = () => { dragging = false }
      const onTouchMove  = e => {
        if (!dragging) return
        rotY += (e.touches[0].clientX - prevX) * 0.007
        prevX = e.touches[0].clientX
        pivot.rotation.y = rotY
      }

      wrapper.addEventListener('mousedown', onMouseDown)
      window.addEventListener('mouseup', onMouseUp)
      window.addEventListener('mousemove', onMouseMove)
      wrapper.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchend', onTouchEnd)
      window.addEventListener('touchmove', onTouchMove, { passive: true })

      let t = 0
      function animate() {
        frameId = requestAnimationFrame(animate)
        t += 0.004
        glowMat.emissiveIntensity = 1.6 + Math.sin(t * 1.8) * 0.4
        glowLight.intensity = 2.5 + Math.sin(t * 1.8) * 0.8
        renderer.render(scene, camera)
      }
      animate()

      const onResize = () => {
        const W2 = wrapper.offsetWidth
        const H2 = wrapper.offsetHeight
        camera.aspect = W2 / H2
        camera.updateProjectionMatrix()
        renderer.setSize(W2, H2)
      }
      window.addEventListener('resize', onResize)

      cleanupFn = () => {
        cancelAnimationFrame(frameId)
        wrapper.removeEventListener('mousedown', onMouseDown)
        window.removeEventListener('mouseup', onMouseUp)
        window.removeEventListener('mousemove', onMouseMove)
        wrapper.removeEventListener('touchstart', onTouchStart)
        window.removeEventListener('touchend', onTouchEnd)
        window.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('resize', onResize)
        renderer.dispose()
        if (wrapper.contains(renderer.domElement)) wrapper.removeChild(renderer.domElement)
      }
    })

    return () => {
      cancelAnimationFrame(raf)
      cleanupFn?.()
    }
  }, [circuitName, teamColor])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {status === 'loading' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          color: '#333', letterSpacing: '0.15em',
        }}>
          LOADING TRACK...
        </div>
      )}
      <div
        ref={wrapperRef}
        style={{ position: 'absolute', inset: 0, cursor: 'ew-resize' }}
      />
    </div>
  )
}