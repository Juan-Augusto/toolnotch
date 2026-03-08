'use client'
import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }
function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ─── Coin mesh ───────────────────────────────────────────────────────────────

interface CoinMeshProps {
  side: 'heads' | 'tails'
  flipping: boolean
  onDone: () => void
}

function CoinMesh({ side, flipping, onDone }: CoinMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const startTime = useRef(-1)
  const startQuat = useRef(new THREE.Quaternion())
  const targetQuat = useRef(new THREE.Quaternion())
  const startY = useRef(0)
  const done = useRef(false)
  const DURATION = 900

  useEffect(() => {
    if (!flipping || !groupRef.current) return
    done.current = false
    startTime.current = -1

    if (prefersReducedMotion()) {
      if (groupRef.current) {
        groupRef.current.rotation.x = side === 'tails' ? Math.PI : 0
        groupRef.current.position.y = 0
      }
      onDone()
      return
    }

    // Start flat, random Z tumble
    startQuat.current = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, Math.random() * Math.PI * 2, 0)
    )
    // Target: heads = 0 X rotation, tails = π X rotation
    const extraSpins = (Math.floor(Math.random() * 2) + 3) * Math.PI * 2
    const faceAngle = side === 'tails' ? Math.PI : 0
    targetQuat.current = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(faceAngle + extraSpins, Math.random() * Math.PI, 0)
    )
    startY.current = 0
  }, [flipping, side, onDone])

  useFrame(({ clock }) => {
    if (!flipping || done.current || !groupRef.current) return
    const now = clock.getElapsedTime() * 1000
    if (startTime.current < 0) startTime.current = now

    const t = Math.min((now - startTime.current) / DURATION, 1)
    const e = easeOutCubic(t)

    // Slerp rotation
    groupRef.current.quaternion.slerpQuaternions(startQuat.current, targetQuat.current, e)

    // Arc: parabolic Y position peaks at t=0.5
    const arc = Math.sin(t * Math.PI)
    groupRef.current.position.y = arc * 1.8

    if (t >= 1 && !done.current) {
      done.current = true
      groupRef.current.position.y = 0
      onDone()
    }
  })

  return (
    <group ref={groupRef}>
      {/* Coin body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.08, 64]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Heads face (+Y) */}
      <mesh position={[0, 0.042, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.78, 64]} />
        <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Tails face (-Y) */}
      <mesh position={[0, -0.042, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.78, 64]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Heads label */}
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="#B8860B" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Tails label */}
      <mesh position={[0, -0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="#808080" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Rim edge */}
      <mesh>
        <cylinderGeometry args={[0.82, 0.82, 0.08, 64, 1, true]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.7} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

// ─── Public component ────────────────────────────────────────────────────────

interface CoinFlip3DProps {
  side: 'heads' | 'tails'
  flipping: boolean
  onDone: () => void
}

export default function CoinFlip3D({ side, flipping, onDone }: CoinFlip3DProps) {
  return (
    <div style={{ width: '100%', height: 220 }} className="rounded-xl overflow-hidden bg-slate-900">
      <Canvas camera={{ position: [0, 2.2, 3.5], fov: 42 }} shadows gl={{ antialias: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 8, 4]} intensity={1.6} castShadow shadow-mapSize={1024} />
        <directionalLight position={[-4, 4, -4]} intensity={0.6} />
        <pointLight position={[0, 5, 2]} intensity={0.8} color="#ffffff" />
        <pointLight position={[2, -2, 3]} intensity={0.4} color="#ffd700" />
        <ContactShadows position={[0, -0.7, 0]} opacity={0.4} scale={6} blur={2} />
        <CoinMesh side={side} flipping={flipping} onDone={onDone} />
      </Canvas>
    </div>
  )
}
