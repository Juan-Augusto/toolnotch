// 'use client'
// import { Canvas } from '@react-three/fiber'
// import { Physics, RigidBody } from '@react-three/rapier'

// function CharacterModel() {
//   return (
//     <mesh>
//       <capsuleGeometry args={[0.5, 1]} />
//       <meshStandardMaterial color="orange" />
//     </mesh>
//   )
// }

// function Floor() {
//   return (
//     <RigidBody type="fixed" colliders="cuboid">
//       <mesh position={[0, -0.5, 0]} receiveShadow>
//         <boxGeometry args={[50, 1, 50]} />
//         <meshStandardMaterial color="#333333" />
//       </mesh>
//     </RigidBody>
//   )
// }

// export default function GravityTest() {
//   return (
//     <div style={{ width: '100%', height: 400 }} className="rounded-xl overflow-hidden bg-slate-900">
//       <Canvas 
//         camera={{ position: [0, 10, 20], fov: 50 }}
//         gl={{ powerPreference: 'high-performance' }}
//       >
//         <ambientLight intensity={0.8} />
//         <directionalLight position={[10, 10, 10]} intensity={1} />
        
//         <Physics gravity={[0, -9.81, 0]}>
//           {/* Posicionado bem acima do chão (Y: 5), colliders="hull" e amortecimento básico */}
//           <RigidBody 
//             position={[0, 5, 0]} 
//             colliders="hull"
//             linearDamping={0.5}
//             angularDamping={0.5}
//           >
//             <CharacterModel />
//           </RigidBody>
//           <Floor />
//         </Physics>
//       </Canvas>
//     </div>
//   )
// }