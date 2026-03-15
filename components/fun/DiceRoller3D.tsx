'use client'
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// ─── Face texture generation ────────────────────────────────────────────────

function createPipTexture(value: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')!

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

  return new THREE.CanvasTexture(canvas)
}

function createNumberTexture(value: number, sides: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#f8fafc'
  ctx.beginPath()
  ctx.roundRect(4, 4, 120, 120, 14)
  ctx.fill()

  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#1e293b'
  ctx.font = `bold ${value >= 10 ? 44 : 54}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(value), 64, 64)

  return new THREE.CanvasTexture(canvas)
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

// ─── D6 mesh with pip textures ──────────────────────────────────────────────

interface D6Props {
  result: number
  rolling: boolean
  onDone: () => void
  position?: [number, number, number]
}

function D6({ result, rolling, onDone, position = [0, 0, 0] }: D6Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const startTime = useRef(-1)
  const startQuat = useRef(new THREE.Quaternion().random())
  const targetQuat = useRef(new THREE.Quaternion())
  const done = useRef(false)
  const DURATION = 1500

  const materials = useMemo(() => {
    // order: +X(4), -X(3), +Y(6), -Y(1), +Z(2), -Z(5)
    return [4, 3, 6, 1, 2, 5].map(v => {
      const tex = createPipTexture(v)
      return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3, metalness: 0.1 })
    })
  }, [])

  useEffect(() => {
    if (!rolling) return
    done.current = false
    startTime.current = -1
    startQuat.current = new THREE.Quaternion().random()
    targetQuat.current = prefersReducedMotion()
      ? getD6TargetQuat(result)
      : addTumble(getD6TargetQuat(result), 3)
    if (prefersReducedMotion() && meshRef.current) {
      meshRef.current.quaternion.copy(targetQuat.current)
      onDone()
    }
  }, [rolling, result, onDone])

  useFrame(({ clock }) => {
    if (!rolling || done.current || !meshRef.current) return
    const now = clock.getElapsedTime() * 1000
    if (startTime.current < 0) startTime.current = now
    const t = Math.min((now - startTime.current) / DURATION, 1)
    meshRef.current.quaternion.slerpQuaternions(startQuat.current, targetQuat.current, easeOutCubic(t))
    if (t >= 1 && !done.current) { done.current = true; onDone() }
  })

  return (
    <mesh ref={meshRef} material={materials} position={position} castShadow>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  )
}

// ─── Generic polyhedral die (number texture on top face only) ───────────────

type DieSides = 4 | 6 | 8 | 10 | 12 | 20 | 100

function getGeometry(sides: DieSides): THREE.BufferGeometry {
  switch (sides) {
    case 4:   return new THREE.TetrahedronGeometry(0.7)
    case 8:   return new THREE.OctahedronGeometry(0.7)
    case 10:  return new THREE.ConeGeometry(0.6, 1.2, 10)
    case 12:  return new THREE.DodecahedronGeometry(0.65)
    case 20:  return new THREE.IcosahedronGeometry(0.7)
    case 100: return new THREE.SphereGeometry(0.65, 16, 12) // approximate d100 as sphere
    default:  return new THREE.BoxGeometry(1, 1, 1)
  }
}

const DIE_COLORS: Record<number, string> = {
  4:  '#7c3aed',
  8:  '#0891b2',
  10: '#059669',
  12: '#dc2626',
  20: '#d97706',
}

interface PolyDieProps {
  sides: DieSides
  result: number
  rolling: boolean
  onDone: () => void
  position?: [number, number, number]
}

function PolyDie({ sides, result, rolling, onDone, position = [0, 0, 0] }: PolyDieProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const startTime = useRef(-1)
  // eslint-disable-next-line react-hooks/purity
  const startEuler = useRef(new THREE.Euler(Math.random() * Math.PI * 8, Math.random() * Math.PI * 8, 0))
  const done = useRef(false)
  const DURATION = 1500

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: DIE_COLORS[sides] ?? '#6b7280',
    roughness: 0.4,
    metalness: 0.3,
  }), [sides])

  const geometry = useMemo(() => getGeometry(sides), [sides])

  useEffect(() => {
    if (!rolling) return
    done.current = false
    startTime.current = -1
    startEuler.current = new THREE.Euler(
      Math.random() * Math.PI * 8,
      Math.random() * Math.PI * 8,
      Math.random() * Math.PI * 4,
    )
    if (prefersReducedMotion() && meshRef.current) {
      meshRef.current.rotation.set(0, 0, 0)
      onDone()
    }
  }, [rolling, result, onDone])

  useFrame(({ clock }) => {
    if (!rolling || done.current || !meshRef.current) return
    const now = clock.getElapsedTime() * 1000
    if (startTime.current < 0) startTime.current = now
    const t = Math.min((now - startTime.current) / DURATION, 1)
    const e = easeOutCubic(t)
    meshRef.current.rotation.x = startEuler.current.x * (1 - e)
    meshRef.current.rotation.y = startEuler.current.y * (1 - e)
    meshRef.current.rotation.z = startEuler.current.z * (1 - e)
    if (t >= 1 && !done.current) { done.current = true; onDone() }
  })

  return (
    <mesh ref={meshRef} material={material} geometry={geometry} position={position} castShadow />
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

  useEffect(() => { doneCount.current = 0 }, [rolling, dice])

  const handleDone = () => {
    doneCount.current++
    if (doneCount.current >= dice.length) onAllDone()
  }

  const spacing = 1.4
  const totalWidth = (dice.length - 1) * spacing
  const startX = -totalWidth / 2

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow shadow-mapSize={1024} />
      <directionalLight position={[-3, 4, -4]} intensity={0.5} />
      <pointLight position={[0, 6, 0]} intensity={0.6} />
      <ContactShadows position={[0, -0.9, 0]} opacity={0.35} scale={8} blur={1.5} />

      {dice.map((die, i) => {
        const pos: [number, number, number] = [startX + i * spacing, 0, 0]
        return die.sides === 6
          ? <D6 key={i} result={die.result} rolling={rolling} onDone={handleDone} position={pos} />
          : <PolyDie key={i} sides={die.sides as DieSides} result={die.result} rolling={rolling} onDone={handleDone} position={pos} />
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

export default function DiceRoller3D({ dice, rolling, onAllDone }: DiceRoller3DProps) {
  const height = dice.length <= 2 ? 180 : 200

  return (
    <div style={{ width: '100%', height }} className="rounded-xl overflow-hidden bg-slate-900">
      <Canvas
        camera={{ position: [0, 2.5, 4], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Scene dice={dice} rolling={rolling} onAllDone={onAllDone} />
      </Canvas>
    </div>
  )
}
