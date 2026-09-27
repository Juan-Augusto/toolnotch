'use client'
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// ─── Face texture generation ────────────────────────────────────────────────

const pipTextureCache = new Map<number, THREE.CanvasTexture>()

function createPipTexture(value: number): THREE.CanvasTexture {
  if (pipTextureCache.has(value)) {
    return pipTextureCache.get(value)!
  }

  if (typeof document === 'undefined') {
    const tex = new THREE.CanvasTexture({} as HTMLCanvasElement)
    pipTextureCache.set(value, tex)
    return tex
  }

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    const tex = new THREE.CanvasTexture(canvas)
    pipTextureCache.set(value, tex)
    return tex
  }

  // White rounded square background
  ctx.fillStyle = '#f8fafc'
  ctx.beginPath()
  ctx.roundRect(4, 4, 120, 120, 14)
  ctx.fill()

  // Dark border
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 2
  ctx.stroke()

  // Pip positions per value
  const pipSets: Record<number, [number, number][]> = {
    1: [[64, 64]],
    2: [[38, 38], [90, 90]],
    3: [[38, 38], [64, 64], [90, 90]],
    4: [[38, 38], [90, 38], [38, 90], [90, 90]],
    5: [[38, 38], [90, 38], [64, 64], [38, 90], [90, 90]],
    6: [[38, 34], [90, 34], [38, 64], [90, 64], [38, 94], [90, 94]],
  }

  ctx.fillStyle = '#1e293b'
  for (const [x, y] of (pipSets[value] ?? [])) {
    ctx.beginPath()
    ctx.arc(x, y, 11, 0, Math.PI * 2)
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  pipTextureCache.set(value, tex)
  return tex
}

// ─── Number texture generation for polyhedral dice ──────────────────────────

interface DecalStyle {
  bg: string
  text: string
  ring: string
}

function getDieDecalStyle(sides: number, value: number): DecalStyle {
  if (sides === 20) {
    if (value === 20) return { bg: '#14532d', text: '#fef08a', ring: '#4ade80' } // Critical 20: Emerald & Gold
    if (value === 1) return { bg: '#7f1d1d', text: '#fca5a5', ring: '#ef4444' } // Critical 1: Crimson
    return { bg: '#78350f', text: '#fef9c3', ring: '#fbbf24' } // Amber Gold
  }
  switch (sides) {
    case 4:
      return { bg: '#4c1d95', text: '#fef08a', ring: '#c084fc' } // Purple & Gold
    case 8:
      return { bg: '#0369a1', text: '#ffffff', ring: '#38bdf8' } // Sapphire Cyan
    case 10:
      return { bg: '#064e3b', text: '#fef08a', ring: '#34d399' } // Emerald Mint
    case 12:
      return { bg: '#7f1d1d', text: '#ffffff', ring: '#f87171' } // Ruby
    case 100:
      return { bg: '#0f172a', text: '#f8fafc', ring: '#94a3b8' } // Titanium Slate
    default:
      return { bg: '#1e293b', text: '#ffffff', ring: '#64748b' }
  }
}

const numberTextureCache = new Map<string, THREE.CanvasTexture>()

function createNumberTexture(value: number, sides: number): THREE.CanvasTexture {
  const cacheKey = `${sides}_${value}`
  if (numberTextureCache.has(cacheKey)) {
    return numberTextureCache.get(cacheKey)!
  }

  if (typeof document === 'undefined') {
    const tex = new THREE.CanvasTexture({} as HTMLCanvasElement)
    numberTextureCache.set(cacheKey, tex)
    return tex
  }

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    const tex = new THREE.CanvasTexture(canvas)
    numberTextureCache.set(cacheKey, tex)
    return tex
  }

  const style = getDieDecalStyle(sides, value)

  // Circular background badge
  ctx.beginPath()
  ctx.arc(64, 64, 56, 0, Math.PI * 2)
  ctx.fillStyle = style.bg
  ctx.fill()

  // Outer border ring
  ctx.lineWidth = 4
  ctx.strokeStyle = style.ring
  ctx.stroke()

  // Inner subtle highlight ring
  ctx.beginPath()
  ctx.arc(64, 64, 50, 0, Math.PI * 2)
  ctx.lineWidth = 1.5
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
  ctx.stroke()

  // Draw number
  ctx.fillStyle = style.text
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const str = String(value)
  if (str.length >= 3) {
    ctx.font = '900 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    ctx.fillText(str, 64, 65)
  } else if (str.length === 2) {
    ctx.font = '900 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    ctx.fillText(str, 64, 65)
  } else {
    ctx.font = '900 66px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    ctx.fillText(str, 64, 65)
  }

  // Underline for 6 and 9 (standard RPG dice rule)
  if (value === 6 || value === 9) {
    ctx.fillStyle = style.text
    ctx.fillRect(48, 92, 32, 4)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  numberTextureCache.set(cacheKey, texture)
  return texture
}

// ─── Target quaternion for d6 face N to face up ─────────────────────────────

// BoxGeometry material group order: +X(0), -X(1), +Y(2), -Y(3), +Z(4), -Z(5)
// Face assignment: +X=4, -X=3, +Y=6, -Y=1, +Z=2, -Z=5
const D6_FACE_NORMALS: Record<number, THREE.Vector3> = {
  1: new THREE.Vector3(0, -1, 0),
  2: new THREE.Vector3(0, 0, 1),
  3: new THREE.Vector3(-1, 0, 0),
  4: new THREE.Vector3(1, 0, 0),
  5: new THREE.Vector3(0, 0, -1),
  6: new THREE.Vector3(0, 1, 0),
}

function getD6TargetQuat(value: number): THREE.Quaternion {
  const up = new THREE.Vector3(0, 1, 0)
  return new THREE.Quaternion().setFromUnitVectors(D6_FACE_NORMALS[value] ?? up, up)
}

function addTumble(base: THREE.Quaternion, spins = 3): THREE.Quaternion {
  const tumble = new THREE.Quaternion().setFromEuler(new THREE.Euler(
    Math.random() * Math.PI * 2 * spins,
    Math.random() * Math.PI * 2 * spins,
    Math.random() * Math.PI * 2 * spins,
  ))
  return tumble.multiply(base)
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Realistic 3-stage vertical bounce physics curve
function getDiceBounceY(t: number): number {
  if (t >= 1) return 0
  // Arc 1: Throw into the air and slam onto the table (0 to 0.45)
  if (t < 0.45) {
    const p = t / 0.45
    return 4 * p * (1 - p) * 1.55
  }
  // Arc 2: First strong table rebound (0.45 to 0.74)
  if (t < 0.74) {
    const p = (t - 0.45) / 0.29
    return 4 * p * (1 - p) * 0.58
  }
  // Arc 3: Second micro bounce (0.74 to 0.90)
  if (t < 0.9) {
    const p = (t - 0.74) / 0.16
    return 4 * p * (1 - p) * 0.16
  }
  return 0
}

// ─── D6 component ───────────────────────────────────────────────────────────

interface D6Props {
  result: number
  rolling: boolean
  onDone: () => void
  position?: [number, number, number]
  index?: number
  scale?: number
}

function D6({ result, rolling, onDone, position = [0, 0, 0], index = 0, scale = 1.35 }: D6Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const startTime = useRef(-1)
  const startQuat = useRef(new THREE.Quaternion())
  const targetQuat = useRef(new THREE.Quaternion())
  const lateralX = useRef(0)
  const lateralZ = useRef(0)
  const done = useRef(false)
  const DURATION = 1200

  const materials = useMemo(() => {
    // order: +X(4), -X(3), +Y(6), -Y(1), +Z(2), -Z(5)
    return [4, 3, 6, 1, 2, 5].map((v) => {
      const tex = createPipTexture(v)
      return new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.25,
        metalness: 0.05,
      })
    })
  }, [])

  useEffect(() => {
    // Target quaternion is the exact face pointing up (+Y)
    const finalTarget = getD6TargetQuat(result)
    targetQuat.current = finalTarget

    if (!rolling) {
      if (meshRef.current?.quaternion?.copy) {
        meshRef.current.quaternion.copy(finalTarget)
      }
      return
    }

    done.current = false
    startTime.current = -1

    // Initial random lateral scattering
    lateralX.current = ((index % 2 === 0 ? 0.3 : -0.3) * (1 + (index * 0.1)))
    lateralZ.current = (Math.random() - 0.5) * 0.4

    if (prefersReducedMotion()) {
      startQuat.current = finalTarget
      if (meshRef.current?.quaternion?.copy) {
        meshRef.current.quaternion.copy(finalTarget)
      }
      if (meshRef.current?.position) meshRef.current.position.y = position[1]
      onDone()
    } else {
      // Start with tumbling rotation that settles into finalTarget
      startQuat.current = addTumble(finalTarget, 4)
    }
  }, [rolling, result, onDone, position, index])

  useFrame(({ clock }) => {
    if (!rolling || done.current || !meshRef.current) return
    const now = clock.getElapsedTime() * 1000
    if (startTime.current < 0) startTime.current = now
    const t = Math.min((now - startTime.current) / DURATION, 1)

    // Physics bounce on Y axis
    if (meshRef.current?.position) {
      meshRef.current.position.y = position[1] + getDiceBounceY(t)
      if ('x' in meshRef.current.position) {
        meshRef.current.position.x = position[0] + lateralX.current * (1 - easeOutCubic(t))
      }
      if ('z' in meshRef.current.position) {
        meshRef.current.position.z = position[2] + lateralZ.current * (1 - easeOutCubic(t))
      }
    }

    // Quaternion slerp from tumble to exact landing face
    if (meshRef.current?.quaternion?.slerpQuaternions) {
      meshRef.current.quaternion.slerpQuaternions(
        startQuat.current,
        targetQuat.current,
        easeOutCubic(t),
      )
    }

    if (t >= 1 && !done.current) {
      done.current = true
      onDone()
    }
  })

  return (
    <mesh ref={meshRef} material={materials} position={position} scale={scale} castShadow>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  )
}

// ─── Polyhedral Face Definitions ─────────────────────────────────────────────

type DieSides = 4 | 6 | 8 | 10 | 12 | 20 | 100

interface FaceDef {
  nx: number
  ny: number
  nz: number
  cx?: number
  cy?: number
  cz?: number
  dist: number
  radius: number
}

const C_SQRT3 = 1 / Math.sqrt(3)

const D4_FACES: FaceDef[] = [
  { nx: -C_SQRT3, ny: C_SQRT3, nz: C_SQRT3, dist: 0.25, radius: 0.2 },
  { nx: C_SQRT3, ny: C_SQRT3, nz: -C_SQRT3, dist: 0.25, radius: 0.2 },
  { nx: C_SQRT3, ny: -C_SQRT3, nz: C_SQRT3, dist: 0.25, radius: 0.2 },
  { nx: -C_SQRT3, ny: -C_SQRT3, nz: -C_SQRT3, dist: 0.25, radius: 0.2 },
]

const D8_FACES: FaceDef[] = [
  { nx: C_SQRT3, ny: C_SQRT3, nz: C_SQRT3, dist: 0.433, radius: 0.18 },
  { nx: C_SQRT3, ny: -C_SQRT3, nz: C_SQRT3, dist: 0.433, radius: 0.18 },
  { nx: C_SQRT3, ny: -C_SQRT3, nz: -C_SQRT3, dist: 0.433, radius: 0.18 },
  { nx: C_SQRT3, ny: C_SQRT3, nz: -C_SQRT3, dist: 0.433, radius: 0.18 },
  { nx: -C_SQRT3, ny: C_SQRT3, nz: -C_SQRT3, dist: 0.433, radius: 0.18 },
  { nx: -C_SQRT3, ny: -C_SQRT3, nz: -C_SQRT3, dist: 0.433, radius: 0.18 },
  { nx: -C_SQRT3, ny: -C_SQRT3, nz: C_SQRT3, dist: 0.433, radius: 0.18 },
  { nx: -C_SQRT3, ny: C_SQRT3, nz: C_SQRT3, dist: 0.433, radius: 0.18 },
]

const D10_FACES: FaceDef[] = [
  { nx: 0.277, ny: 0.4433, nz: 0.8525, cx: 0.1274, cy: -0.2083, cz: 0.392, dist: 0.4618, radius: 0.16 },
  { nx: 0.7252, ny: 0.4433, nz: 0.5269, cx: 0.3334, cy: -0.2083, cz: 0.2422, dist: 0.4618, radius: 0.16 },
  { nx: 0.8964, ny: 0.4433, nz: 0.0, cx: 0.4121, cy: -0.2083, cz: 0.0, dist: 0.4618, radius: 0.16 },
  { nx: 0.7252, ny: 0.4433, nz: -0.5269, cx: 0.3334, cy: -0.2083, cz: -0.2422, dist: 0.4618, radius: 0.16 },
  { nx: 0.277, ny: 0.4433, nz: -0.8525, cx: 0.1274, cy: -0.2083, cz: -0.392, dist: 0.4618, radius: 0.16 },
  { nx: -0.277, ny: 0.4433, nz: -0.8525, cx: -0.1274, cy: -0.2083, cz: -0.392, dist: 0.4618, radius: 0.16 },
  { nx: -0.7252, ny: 0.4433, nz: -0.5269, cx: -0.3334, cy: -0.2083, cz: -0.2422, dist: 0.4618, radius: 0.16 },
  { nx: -0.8964, ny: 0.4433, nz: 0.0, cx: -0.4121, cy: -0.2083, cz: 0.0, dist: 0.4618, radius: 0.16 },
  { nx: -0.7252, ny: 0.4433, nz: 0.5269, cx: -0.3334, cy: -0.2083, cz: 0.2422, dist: 0.4618, radius: 0.16 },
  { nx: -0.277, ny: 0.4433, nz: 0.8525, cx: -0.1274, cy: -0.2083, cz: 0.392, dist: 0.4618, radius: 0.16 },
]

const PHI = (1 + Math.sqrt(5)) / 2
const D12_DENOM = Math.sqrt(1 + PHI * PHI)
const U_D12 = 1 / D12_DENOM
const V_D12 = PHI / D12_DENOM

const D12_FACES: FaceDef[] = [
  { nx: 0.0, ny: V_D12, nz: U_D12, dist: 0.5563, radius: 0.2 },
  { nx: V_D12, ny: U_D12, nz: 0.0, dist: 0.5563, radius: 0.2 },
  { nx: U_D12, ny: 0.0, nz: -V_D12, dist: 0.5563, radius: 0.2 },
  { nx: -U_D12, ny: 0.0, nz: -V_D12, dist: 0.5563, radius: 0.2 },
  { nx: -V_D12, ny: -U_D12, nz: 0.0, dist: 0.5563, radius: 0.2 },
  { nx: 0.0, ny: V_D12, nz: -U_D12, dist: 0.5563, radius: 0.2 },
  { nx: -V_D12, ny: U_D12, nz: 0.0, dist: 0.5563, radius: 0.2 },
  { nx: -U_D12, ny: 0.0, nz: V_D12, dist: 0.5563, radius: 0.2 },
  { nx: 0.0, ny: -V_D12, nz: -U_D12, dist: 0.5563, radius: 0.2 },
  { nx: U_D12, ny: 0.0, nz: V_D12, dist: 0.5563, radius: 0.2 },
  { nx: V_D12, ny: -U_D12, nz: 0.0, dist: 0.5563, radius: 0.2 },
  { nx: 0.0, ny: -V_D12, nz: U_D12, dist: 0.5563, radius: 0.2 },
]

const D20_FACES: FaceDef[] = [
  { nx: -0.5774, ny: 0.5774, nz: 0.5774, dist: 0.596, radius: 0.15 },
  { nx: 0.0, ny: 0.9342, nz: 0.3568, dist: 0.596, radius: 0.15 },
  { nx: 0.0, ny: 0.9342, nz: -0.3568, dist: 0.596, radius: 0.15 },
  { nx: -0.5774, ny: 0.5774, nz: -0.5774, dist: 0.596, radius: 0.15 },
  { nx: -0.9342, ny: 0.3568, nz: 0.0, dist: 0.596, radius: 0.15 },
  { nx: 0.5774, ny: 0.5774, nz: 0.5774, dist: 0.596, radius: 0.15 },
  { nx: -0.3568, ny: 0.0, nz: 0.9342, dist: 0.596, radius: 0.15 },
  { nx: -0.9342, ny: -0.3568, nz: 0.0, dist: 0.596, radius: 0.15 },
  { nx: -0.3568, ny: 0.0, nz: -0.9342, dist: 0.596, radius: 0.15 },
  { nx: 0.5774, ny: 0.5774, nz: -0.5774, dist: 0.596, radius: 0.15 },
  { nx: 0.5774, ny: -0.5774, nz: 0.5774, dist: 0.596, radius: 0.15 },
  { nx: 0.0, ny: -0.9342, nz: 0.3568, dist: 0.596, radius: 0.15 },
  { nx: 0.0, ny: -0.9342, nz: -0.3568, dist: 0.596, radius: 0.15 },
  { nx: 0.5774, ny: -0.5774, nz: -0.5774, dist: 0.596, radius: 0.15 },
  { nx: 0.9342, ny: -0.3568, nz: 0.0, dist: 0.596, radius: 0.15 },
  { nx: 0.3568, ny: 0.0, nz: 0.9342, dist: 0.596, radius: 0.15 },
  { nx: -0.5774, ny: -0.5774, nz: 0.5774, dist: 0.596, radius: 0.15 },
  { nx: -0.5774, ny: -0.5774, nz: -0.5774, dist: 0.596, radius: 0.15 },
  { nx: 0.3568, ny: 0.0, nz: -0.9342, dist: 0.596, radius: 0.15 },
  { nx: 0.9342, ny: 0.3568, nz: 0.0, dist: 0.596, radius: 0.15 },
]

function getD100Faces(): FaceDef[] {
  const faces: FaceDef[] = [
    { nx: 0.0, ny: 1.0, nz: 0.0, dist: 0.702, radius: 0.13 },
    { nx: 0.0, ny: -1.0, nz: 0.0, dist: 0.702, radius: 0.13 },
  ]
  // 8 points around equator
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4
    faces.push({
      nx: Math.cos(angle),
      ny: 0.0,
      nz: Math.sin(angle),
      dist: 0.702,
      radius: 0.13,
    })
  }
  // 4 upper mid-latitude
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2
    faces.push({
      nx: Math.cos(angle) * 0.76,
      ny: 0.65,
      nz: Math.sin(angle) * 0.76,
      dist: 0.702,
      radius: 0.13,
    })
  }
  // 4 lower mid-latitude
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2 + Math.PI / 4
    faces.push({
      nx: Math.cos(angle) * 0.76,
      ny: -0.65,
      nz: Math.sin(angle) * 0.76,
      dist: 0.702,
      radius: 0.13,
    })
  }
  return faces
}

const D100_FACES = getD100Faces()

function getFaceDefs(sides: DieSides): FaceDef[] {
  switch (sides) {
    case 4:
      return D4_FACES
    case 8:
      return D8_FACES
    case 10:
      return D10_FACES
    case 12:
      return D12_FACES
    case 20:
      return D20_FACES
    case 100:
      return D100_FACES
    default:
      return []
  }
}

function getGeometry(sides: DieSides): THREE.BufferGeometry {
  switch (sides) {
    case 4:
      return new THREE.TetrahedronGeometry(0.75)
    case 8:
      return new THREE.OctahedronGeometry(0.75)
    case 10:
      return new THREE.ConeGeometry(0.65, 1.25, 10)
    case 12:
      return new THREE.DodecahedronGeometry(0.7)
    case 20:
      return new THREE.IcosahedronGeometry(0.75)
    case 100:
      return new THREE.SphereGeometry(0.7, 16, 12)
    default:
      return new THREE.BoxGeometry(1, 1, 1)
  }
}

const DIE_COLORS: Record<number, string> = {
  4: '#8b5cf6', // amethyst purple
  8: '#0284c7', // sapphire blue
  10: '#059669', // emerald green
  12: '#dc2626', // ruby red
  20: '#d97706', // amber gold
  100: '#475569', // titanium slate
}

// ─── Generic polyhedral die with numbered facets ─────────────────────────────

interface PolyDieProps {
  sides: DieSides
  result: number
  rolling: boolean
  onDone: () => void
  position?: [number, number, number]
  index?: number
  scale?: number
}

function PolyDie({ sides, result, rolling, onDone, position = [0, 0, 0], index = 0, scale = 1.35 }: PolyDieProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const startTime = useRef(-1)
  const startQuat = useRef(new THREE.Quaternion())
  const targetQuat = useRef(new THREE.Quaternion())
  const lateralX = useRef(0)
  const lateralZ = useRef(0)
  const done = useRef(false)
  const DURATION = 1200

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: DIE_COLORS[sides] ?? '#6366f1',
        roughness: 0.25,
        metalness: 0.15,
      }),
    [sides],
  )

  const geometry = useMemo(() => getGeometry(sides), [sides])
  const faceDefs = useMemo(() => getFaceDefs(sides), [sides])

  // Build decal objects for each face: Face 0 has `result`, remaining faces have other distinct numbers
  const decals = useMemo(() => {
    if (faceDefs.length === 0) return []

    // Construct values array where index 0 is `result`
    const otherValues: number[] = []
    if (sides <= 20) {
      for (let v = 1; v <= sides; v++) {
        if (v !== result) otherValues.push(v)
      }
    } else {
      // For d100, generate diverse remaining values
      for (let i = 1; otherValues.length < faceDefs.length - 1; i++) {
        const val = ((result + i * 17) % 100) || 100
        if (val !== result && !otherValues.includes(val)) otherValues.push(val)
      }
    }

    const upZ = new THREE.Vector3(0, 0, 1)

    return faceDefs.map((face, i) => {
      const val = i === 0 ? result : (otherValues[i - 1] ?? i + 1)
      const nx = face.nx
      const ny = face.ny
      const nz = face.nz
      const normal = new THREE.Vector3(nx, ny, nz)
      const quat = new THREE.Quaternion().setFromUnitVectors(upZ, normal)

      // Slight offset along normal to prevent z-fighting
      const offset = 0.006
      const pos: [number, number, number] = [
        (face.cx ?? nx * face.dist) + nx * offset,
        (face.cy ?? ny * face.dist) + ny * offset,
        (face.cz ?? nz * face.dist) + nz * offset,
      ]

      const texture = createNumberTexture(val, sides)

      return {
        key: i,
        val,
        position: pos,
        quaternion: quat,
        radius: face.radius,
        texture,
      }
    })
  }, [faceDefs, sides, result])

  useEffect(() => {
    const face0 = faceDefs[0]
    const up = new THREE.Vector3(0, 1, 0)
    const face0Normal = face0 ? new THREE.Vector3(face0.nx, face0.ny, face0.nz) : up
    const finalTarget = new THREE.Quaternion().setFromUnitVectors(face0Normal, up)
    targetQuat.current = finalTarget

    if (!rolling) {
      if (meshRef.current?.quaternion?.copy) {
        meshRef.current.quaternion.copy(finalTarget)
      }
      return
    }

    done.current = false
    startTime.current = -1

    lateralX.current = ((index % 2 === 0 ? 0.3 : -0.3) * (1 + (index * 0.1)))
    lateralZ.current = (Math.random() - 0.5) * 0.4

    if (prefersReducedMotion()) {
      startQuat.current = finalTarget
      if (meshRef.current?.quaternion?.copy) {
        meshRef.current.quaternion.copy(finalTarget)
      }
      if (meshRef.current?.rotation?.set) {
        meshRef.current.rotation.set(0, 0, 0)
      }
      if (meshRef.current?.position) {
        meshRef.current.position.y = position[1]
      }
      onDone()
    } else {
      startQuat.current = addTumble(finalTarget, 4)
    }
  }, [rolling, result, onDone, position, index, faceDefs])

  useFrame(({ clock }) => {
    if (!rolling || done.current || !meshRef.current) return
    const now = clock.getElapsedTime() * 1000
    if (startTime.current < 0) startTime.current = now
    const t = Math.min((now - startTime.current) / DURATION, 1)
    const e = easeOutCubic(t)

    // Bounce physics
    if (meshRef.current?.position) {
      meshRef.current.position.y = position[1] + getDiceBounceY(t)
      if ('x' in meshRef.current.position) {
        meshRef.current.position.x = position[0] + lateralX.current * (1 - e)
      }
      if ('z' in meshRef.current.position) {
        meshRef.current.position.z = position[2] + lateralZ.current * (1 - e)
      }
    }

    // Quaternion slerp from tumble to exact landing face
    if (meshRef.current?.quaternion?.slerpQuaternions) {
      meshRef.current.quaternion.slerpQuaternions(
        startQuat.current,
        targetQuat.current,
        e,
      )
    }

    if (t >= 1 && !done.current) {
      done.current = true
      onDone()
    }
  })

  return (
    <mesh ref={meshRef} material={material} geometry={geometry} position={position} scale={scale} castShadow>
      {decals.map((decal) => (
        <mesh
          key={decal.key}
          position={decal.position}
          quaternion={decal.quaternion}
        >
          <circleGeometry args={[decal.radius, 16]} />
          <meshStandardMaterial
            map={decal.texture}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            roughness={0.3}
          />
        </mesh>
      ))}
    </mesh>
  )
}

// ─── Scene: multiple dice ────────────────────────────────────────────────────

interface DieRoll {
  sides: DieSides | 6
  result: number
}

interface SceneProps {
  dice: DieRoll[]
  rolling: boolean
  onAllDone: () => void
}

function Scene({ dice, rolling, onAllDone }: SceneProps) {
  const doneCount = useRef(0)

  useEffect(() => {
    doneCount.current = 0
  }, [rolling, dice])

  const handleDone = () => {
    doneCount.current++
    if (doneCount.current >= dice.length) onAllDone()
  }

  // Dynamic scale and spacing: single die is noticeably bigger and bolder, multiple dice stay well spaced
  const dieScale = dice.length === 1 ? 1.55 : dice.length === 2 ? 1.4 : dice.length <= 4 ? 1.25 : 1.15
  const spacing = dice.length <= 2 ? 1.85 : 1.55
  const totalWidth = (dice.length - 1) * spacing
  const startX = -totalWidth / 2

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.0}
        castShadow
        shadow-mapSize={1024}
      />
      <directionalLight position={[-4, 5, -3]} intensity={0.7} />
      <pointLight position={[0, 4, 3]} intensity={0.5} />
      <ContactShadows position={[0, -0.72, 0]} opacity={0.38} scale={10} blur={1.8} />

      {dice.map((die, i) => {
        const pos: [number, number, number] = [startX + i * spacing, 0, 0]
        return die.sides === 6 ? (
          <D6
            key={i}
            index={i}
            result={die.result}
            rolling={rolling}
            onDone={handleDone}
            position={pos}
            scale={dieScale}
          />
        ) : (
          <PolyDie
            key={i}
            index={i}
            sides={die.sides as DieSides}
            result={die.result}
            rolling={rolling}
            onDone={handleDone}
            position={pos}
            scale={dieScale}
          />
        )
      })}
    </>
  )
}

// ─── Public component ────────────────────────────────────────────────────────

interface DiceRoller3DProps {
  dice: DieRoll[]
  rolling: boolean
  onAllDone: () => void
}

export default function AppDiceRoller3D({ dice, rolling, onAllDone }: DiceRoller3DProps) {
  const height = dice.length <= 2 ? 180 : 200

  return (
    <div
      style={{ width: '100%', height }}
      className="w-full relative flex items-center justify-center select-none"
    >
      <Canvas
        camera={{ position: [0, 2.2, 3.8], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Scene dice={dice} rolling={rolling} onAllDone={onAllDone} />
      </Canvas>
    </div>
  )
}
