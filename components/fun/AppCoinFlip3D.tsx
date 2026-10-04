'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
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
  const startX = useRef(0)
  const targetX = useRef(0)
  const done = useRef(false)
  const DURATION = 1100 // Snappy 1100ms duration

  useEffect(() => {
    if (!flipping) return

    done.current = false
    startTime.current = -1

    if (prefersReducedMotion()) {
      if (groupRef.current?.rotation) {
        groupRef.current.rotation.x = side === 'tails' ? Math.PI : 0
        groupRef.current.rotation.y = 0
        groupRef.current.rotation.z = 0
        groupRef.current.position.y = 0
      }
      onDone()
      return
    }

    const currentRotX = groupRef.current?.rotation?.x ?? 0
    startX.current = currentRotX

    // 8 full rapid spins for high-energy turnover
    const numSpins = 8
    const desiredMod = side === 'tails' ? Math.PI : 0
    const twoPi = Math.PI * 2
    let currentMod = currentRotX % twoPi
    if (currentMod < 0) currentMod += twoPi

    let delta = desiredMod - currentMod
    if (delta < 0) delta += twoPi

    targetX.current = currentRotX + numSpins * twoPi + delta
  }, [flipping, side, onDone])

  useFrame(({ clock }) => {
    if (!flipping || done.current || !groupRef.current?.rotation) return
    const now = clock.getElapsedTime() * 1000
    if (startTime.current < 0) startTime.current = now

    const elapsed = now - startTime.current
    const t = Math.min(elapsed / DURATION, 1)

    // Ballistic Flight (0 <= t <= 0.84), Settle Bounce (0.84 < t <= 1.0)
    const FLIGHT_RATIO = 0.84

    if (t <= FLIGHT_RATIO) {
      const flightT = t / FLIGHT_RATIO

      // Parabolic flight arc
      const MAX_HEIGHT = 2.6
      groupRef.current.position.y = 4 * MAX_HEIGHT * flightT * (1 - flightT)

      // Fast continuous spin around X
      const rotProgress = Math.pow(flightT, 0.95)
      groupRef.current.rotation.x =
        startX.current + (targetX.current - startX.current) * rotProgress

      // Natural 3D gyroscopic wobble during flight
      const wobble = Math.sin(flightT * Math.PI)
      groupRef.current.rotation.y = Math.sin(flightT * Math.PI * 4) * 0.22 * wobble
      groupRef.current.rotation.z = Math.cos(flightT * Math.PI * 3) * 0.18 * wobble
    } else {
      // Landing impact & micro settle
      const settleT = (t - FLIGHT_RATIO) / (1 - FLIGHT_RATIO)

      groupRef.current.rotation.x = targetX.current

      // Metallic ringing settle wobble
      const rattleDamp = Math.pow(1 - settleT, 2)
      groupRef.current.rotation.y = Math.sin(settleT * Math.PI * 6) * 0.08 * rattleDamp
      groupRef.current.rotation.z = Math.cos(settleT * Math.PI * 6) * 0.08 * rattleDamp

      // Micro bounce height
      const bounceHeight = 0.16 * Math.sin(settleT * Math.PI) * Math.pow(1 - settleT, 1.5)
      groupRef.current.position.y = Math.max(0, bounceHeight)
    }

    if (t >= 1 && !done.current) {
      done.current = true
      groupRef.current.rotation.x = side === 'tails' ? Math.PI : 0
      groupRef.current.rotation.y = 0
      groupRef.current.rotation.z = 0
      groupRef.current.position.y = 0
      onDone()
    }
  })

  const initialRotX = side === 'tails' ? Math.PI : 0

  return (
    <group ref={groupRef} rotation={[initialRotX, 0, 0]}>
      {/* Coin main body / milled edge */}
      <mesh castShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 64]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.92} />
      </mesh>

      {/* ── Heads Face (+Y) — Radiant Minted Gold ── */}
      {/* Base Gold Plate */}
      <mesh position={[0, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.16, 64]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.16} metalness={0.96} />
      </mesh>
      {/* Outer Relief Ring */}
      <mesh position={[0, 0.053, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.02, 64]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.18} metalness={0.94} />
      </mesh>
      {/* Inner Medallion Plateau */}
      <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 64]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.18} metalness={0.92} />
      </mesh>
      {/* Royal Star Crest */}
      <mesh position={[0, 0.057, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.26, 6]} />
        <meshStandardMaterial color="#fef08a" roughness={0.12} metalness={0.98} />
      </mesh>
      {/* Center Crown Accent */}
      <mesh position={[0, 0.058, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.09, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.99} />
      </mesh>

      {/* ── Tails Face (-Y) — Gleaming Minted Silver ── */}
      {/* Base Silver Plate */}
      <mesh position={[0, -0.051, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.16, 64]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.16} metalness={0.96} />
      </mesh>
      {/* Outer Relief Ring */}
      <mesh position={[0, -0.053, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.02, 64]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.18} metalness={0.94} />
      </mesh>
      {/* Inner Medallion Plateau */}
      <mesh position={[0, -0.055, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 64]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.18} metalness={0.92} />
      </mesh>
      {/* Imperial Shield Crest */}
      <mesh position={[0, -0.057, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.26, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.12} metalness={0.98} />
      </mesh>
      {/* Center Shield Accent */}
      <mesh position={[0, -0.058, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.09, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.99} />
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

export default function AppCoinFlip3D({ side, flipping, onDone }: CoinFlip3DProps) {
  return (
    <div style={{ width: '100%', height: '100%' }} className="relative select-none">
      <Canvas
        camera={{ position: [0, 2.2, 3.4], fov: 40 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight
          position={[4, 9, 5]}
          intensity={2.8}
          castShadow
          shadow-mapSize={1024}
        />
        <directionalLight position={[-4, 5, 2]} intensity={1.4} color="#ffffff" />
        <pointLight position={[0, 2, 4]} intensity={1.0} color="#ffffff" />

        <ContactShadows
          position={[0, -0.055, 0]}
          opacity={0.32}
          scale={4.8}
          blur={2.0}
          far={3.0}
          color="#000000"
        />

        <CoinMesh side={side} flipping={flipping} onDone={onDone} />
      </Canvas>
    </div>
  )
}
